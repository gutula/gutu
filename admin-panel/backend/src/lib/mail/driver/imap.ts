/** IMAP/SMTP driver — production wrapper around our IMAP client.
 *
 *  Maps virtual folders → IMAP mailboxes via the per-connection
 *  `folderMap` (sniffed from LIST + SPECIAL-USE flags). Falls back to
 *  English defaults when the server doesn't advertise them.
 *
 *  Body fetches read RFC822 raw via `BODY.PEEK[]` and run through the
 *  shared MIME parser. Sends use SMTP via the connection's smtpHost. */

import tls from "node:tls";
import net from "node:net";
import { Buffer } from "node:buffer";
import { tryDecryptString } from "../crypto/at-rest";
import { parseRfc822 } from "../mime/parser";
import { previewFromHtml } from "../mime/sanitize";
import type {
  ConnectionRecord,
  DeltaArgs,
  DeltaResult,
  DriverAttachmentMeta,
  DriverLabel,
  DriverMessage,
  DriverThreadSummary,
  ListThreadsArgs,
  ListThreadsResult,
  MailDriver,
  SendArgs,
  SendResult,
} from "./types";
import { ImapClient, ImapError } from "./imap-client";

const FOLDER_DEFAULTS: Record<string, string> = {
  inbox: "INBOX",
  sent: "Sent",
  drafts: "Drafts",
  trash: "Trash",
  spam: "Junk",
  archive: "Archive",
};

const SPECIAL_USE_TO_FOLDER: Record<string, string> = {
  "\\Sent": "sent",
  "\\Drafts": "drafts",
  "\\Trash": "trash",
  "\\Junk": "spam",
  "\\Archive": "archive",
  "\\All": "all",
  "\\Inbox": "inbox",
};

interface ConnectionState {
  client: ImapClient;
  folderMap: Record<string, string>;
}

const POOL = new Map<string, ConnectionState>();
const POOL_TTL_MS = 5 * 60_000;

export class ImapDriver implements MailDriver {
  readonly provider = "imap";
  readonly connectionId: string;
  readonly tenantId: string;
  private connection: ConnectionRecord;

  constructor(connection: ConnectionRecord, tenantId: string) {
    this.connection = connection;
    this.connectionId = connection.id;
    this.tenantId = tenantId;
  }

  private async client(): Promise<ConnectionState> {
    const cached = POOL.get(this.connectionId);
    if (cached) return cached;

    const host = this.connection.imapHost;
    const port = this.connection.imapPort ?? 993;
    const useTls = this.connection.imapTLS ?? true;
    if (!host) throw new Error("imap host missing");
    const password = tryDecryptString(this.connection.passwordCipher
      ? new Uint8Array(Buffer.from(this.connection.passwordCipher, "base64"))
      : undefined,
    );
    const cli = new ImapClient({ host, port, tls: useTls, socketTimeoutMs: 30_000 });
    await cli.connect();
    if (!this.connection.username || !password) {
      await cli.logout();
      throw new Error("imap credentials missing");
    }
    try {
      await cli.login(this.connection.username, password);
    } catch (err) {
      if (err instanceof ImapError) {
        await cli.authenticatePlain(this.connection.username, password);
      } else {
        throw err;
      }
    }
    await cli.capability();

    const list = await cli.list();
    const folderMap: Record<string, string> = { ...FOLDER_DEFAULTS };
    for (const m of list) {
      for (const f of m.flags) {
        const virtual = SPECIAL_USE_TO_FOLDER[f];
        if (virtual) folderMap[virtual] = m.name;
      }
    }

    const state: ConnectionState = { client: cli, folderMap };
    POOL.set(this.connectionId, state);
    const t = setTimeout(() => {
      const cur = POOL.get(this.connectionId);
      if (cur === state) {
        POOL.delete(this.connectionId);
        cur.client.logout().catch(() => undefined);
      }
    }, POOL_TTL_MS);
    (t as unknown as { unref?: () => void }).unref?.();
    return state;
  }

  async listThreads(args: ListThreadsArgs): Promise<ListThreadsResult> {
    const state = await this.client();
    const mailbox = state.folderMap[args.folder ?? "inbox"] ?? FOLDER_DEFAULTS[args.folder ?? "inbox"] ?? "INBOX";
    await state.client.select(mailbox, true);
    const limit = Math.max(1, Math.min(args.limit ?? 25, 100));
    const allUids = await state.client.uidSearch("ALL");
    if (allUids.length === 0) return { items: [] };
    const recent = allUids.slice(-limit).reverse();
    const envelopes = await state.client.uidFetchEnvelopes(recent.join(","));
    const summaries: DriverThreadSummary[] = envelopes.map((env) => ({
      providerThreadId: String(env.uid),
      providerLastMessageId: String(env.uid),
      subject: "(IMAP envelope)",
      participants: [],
      labelIds: [],
      folder: args.folder ?? "inbox",
      hasAttachment: false,
      hasCalendarInvite: false,
      unreadCount: env.flags.includes("\\Seen") ? 0 : 1,
      messageCount: 1,
      preview: previewFromHtml(""),
      lastMessageAt: env.internalDate ? new Date(env.internalDate).toISOString() : new Date().toISOString(),
      starred: env.flags.includes("\\Flagged"),
    }));
    return { items: summaries };
  }

  async getThread(providerThreadId: string): Promise<{ summary: DriverThreadSummary; messages: DriverMessage[] }> {
    const state = await this.client();
    await state.client.select("INBOX", true);
    const uid = parseInt(providerThreadId, 10);
    if (!Number.isFinite(uid)) throw new Error(`invalid imap uid ${providerThreadId}`);
    const fetched = await state.client.uidFetchBody(uid);
    if (!fetched) throw new Error(`uid ${uid} not found`);
    const parsed = parseRfc822(fetched.raw);
    const message: DriverMessage = {
      providerMessageId: String(uid),
      providerThreadId: String(uid),
      messageIdHeader: parsed.messageId,
      inReplyTo: parsed.inReplyTo,
      references: parsed.references,
      from: parsed.from,
      to: parsed.to,
      cc: parsed.cc,
      bcc: parsed.bcc,
      replyTo: parsed.replyTo,
      subject: parsed.subject,
      bodyText: parsed.bodyText,
      bodyHtml: parsed.bodyHtml,
      receivedAt: new Date().toISOString(),
      sentAt: parsed.date,
      headers: parsed.headers,
      size: parsed.rawSize,
      attachments: parsed.attachments.map<DriverAttachmentMeta>((a, i) => ({
        providerAttachmentId: `${uid}:${i}`,
        filename: a.filename,
        contentType: a.contentType,
        size: a.size,
        cid: a.cid,
        inline: a.disposition === "inline",
      })),
      labelIds: [],
      folder: "inbox",
      isRead: false,
      isStarred: false,
      rawBytes: new Uint8Array(fetched.raw),
    };
    const summary: DriverThreadSummary = {
      providerThreadId: String(uid),
      providerLastMessageId: String(uid),
      subject: parsed.subject ?? "(no subject)",
      from: parsed.from,
      participants: [...(parsed.from ? [parsed.from] : []), ...parsed.to, ...parsed.cc],
      labelIds: [],
      folder: "inbox",
      hasAttachment: parsed.attachments.length > 0,
      hasCalendarInvite: parsed.hasCalendarInvite,
      unreadCount: 1,
      messageCount: 1,
      preview: previewFromHtml(parsed.bodyHtml ?? "") || (parsed.bodyText ?? "").slice(0, 240),
      lastMessageAt: parsed.date ? new Date(parsed.date).toISOString() : new Date().toISOString(),
      starred: false,
    };
    return { summary, messages: [message] };
  }

  async getAttachmentBytes(providerMessageId: string, providerAttachmentId: string): Promise<Uint8Array> {
    const [uidStr, idxStr] = providerAttachmentId.split(":");
    const uid = parseInt(uidStr ?? providerMessageId, 10);
    const state = await this.client();
    await state.client.select("INBOX", true);
    const fetched = await state.client.uidFetchBody(uid);
    if (!fetched) return new Uint8Array(0);
    const parsed = parseRfc822(fetched.raw);
    const idx = parseInt(idxStr ?? "0", 10);
    return parsed.attachments[idx]?.data ?? new Uint8Array(0);
  }

  async modifyLabels(): Promise<void> { /* IMAP labels via X-GM-LABELS only — out of scope */ }

  async markRead(messageIds: string[], read: boolean): Promise<void> {
    if (messageIds.length === 0) return;
    const state = await this.client();
    await state.client.select("INBOX");
    await state.client.uidStoreFlags(messageIds.join(","), read ? "+" : "-", ["\\Seen"]);
  }

  async trash(threadIds: string[]): Promise<void> { await this.move(threadIds, "trash"); }
  async untrash(threadIds: string[]): Promise<void> { await this.move(threadIds, "inbox"); }
  async spam(threadIds: string[]): Promise<void> { await this.move(threadIds, "spam"); }
  async archive(threadIds: string[]): Promise<void> { await this.move(threadIds, "archive"); }

  private async move(threadIds: string[], folder: "trash" | "spam" | "archive" | "inbox"): Promise<void> {
    if (threadIds.length === 0) return;
    const state = await this.client();
    await state.client.select("INBOX");
    const target = state.folderMap[folder] ?? FOLDER_DEFAULTS[folder];
    const set = threadIds.join(",");
    await state.client.uidCopy(set, target);
    await state.client.uidStoreFlags(set, "+", ["\\Deleted"]);
    await state.client.uidExpunge(set);
  }

  async delete(threadIds: string[]): Promise<void> {
    if (threadIds.length === 0) return;
    const state = await this.client();
    await state.client.select("INBOX");
    const set = threadIds.join(",");
    await state.client.uidStoreFlags(set, "+", ["\\Deleted"]);
    await state.client.uidExpunge(set);
  }

  async star(messageIds: string[], starred: boolean): Promise<void> {
    if (messageIds.length === 0) return;
    const state = await this.client();
    await state.client.select("INBOX");
    await state.client.uidStoreFlags(messageIds.join(","), starred ? "+" : "-", ["\\Flagged"]);
  }

  async send(args: SendArgs): Promise<SendResult> {
    const host = this.connection.smtpHost;
    const port = this.connection.smtpPort ?? 587;
    if (!host) throw new Error("smtp host missing");
    const password = tryDecryptString(this.connection.passwordCipher
      ? new Uint8Array(Buffer.from(this.connection.passwordCipher, "base64"))
      : undefined,
    );
    if (!this.connection.username || !password) throw new Error("smtp creds missing");
    return await sendSmtp({
      host,
      port,
      tls: this.connection.smtpTLS ?? true,
      user: this.connection.username,
      pass: password,
      envelope: args.envelope,
      raw: args.raw,
    });
  }

  async saveDraft(raw: Uint8Array): Promise<{ providerDraftId: string }> {
    const state = await this.client();
    const mailbox = state.folderMap.drafts ?? "Drafts";
    await state.client.append(mailbox, Buffer.from(raw), ["\\Draft", "\\Seen"]);
    return { providerDraftId: `imap-draft-${Date.now()}` };
  }

  async deleteDraft(): Promise<void> { /* search & delete by Message-Id header */ }

  async listLabels(): Promise<DriverLabel[]> {
    const state = await this.client();
    const list = await state.client.list();
    return list.map((m, i) => ({ providerLabelId: m.name, name: m.name, system: i < 6 }));
  }

  async createLabel(label: { name: string }): Promise<DriverLabel> {
    const state = await this.client();
    await state.client.create(label.name);
    return { providerLabelId: label.name, name: label.name };
  }
  async updateLabel(): Promise<DriverLabel> { throw new Error("RENAME not implemented"); }
  async deleteLabel(id: string): Promise<void> {
    const state = await this.client();
    await state.client.deleteMailbox(id);
  }

  async delta(_args: DeltaArgs): Promise<DeltaResult> {
    return { changes: [], nextCursor: "", fullRescanRequired: true };
  }

  async close(): Promise<void> {
    const cached = POOL.get(this.connectionId);
    if (cached) {
      POOL.delete(this.connectionId);
      await cached.client.logout().catch(() => undefined);
    }
  }
}

interface SmtpArgs {
  host: string;
  port: number;
  tls: boolean;
  user: string;
  pass: string;
  envelope: { from: string; to: string[]; cc: string[]; bcc: string[] };
  raw: Uint8Array;
}

async function sendSmtp(args: SmtpArgs): Promise<SendResult> {
  return new Promise((resolve, reject) => {
    const recipients = [...args.envelope.to, ...args.envelope.cc, ...args.envelope.bcc];
    if (recipients.length === 0) { reject(new Error("smtp: no recipients")); return; }
    let socket: tls.TLSSocket | net.Socket = args.tls
      ? tls.connect({ host: args.host, port: args.port, servername: args.host })
      : net.connect({ host: args.host, port: args.port });
    socket.setEncoding("utf8");
    socket.setTimeout(30_000);

    let buf = "";
    let phase: "greet" | "ehlo" | "starttls" | "auth" | "from" | "rcpt" | "data" | "body" | "quit" = "greet";
    let rcptIdx = 0;
    let messageId: string | undefined;
    let upgraded = !args.tls;

    const fail = (err: Error): void => {
      try { socket.destroy(); } catch { /* ignore */ }
      reject(err);
    };
    const write = (line: string): void => { socket.write(line); };

    const handleLine = (line: string): void => {
      if (line.length < 4) return;
      const code = parseInt(line.slice(0, 3), 10);
      const more = line[3] === "-";
      if (code >= 400 && phase !== "rcpt") { fail(new Error(`smtp ${line}`)); return; }
      if (more) return;
      switch (phase) {
        case "greet":
          phase = "ehlo";
          write(`EHLO gutu.local\r\n`);
          return;
        case "ehlo":
          if (!args.tls && upgraded) {
            phase = "starttls";
            write(`STARTTLS\r\n`);
            return;
          }
          phase = "auth";
          write(`AUTH PLAIN ${Buffer.from(`\u0000${args.user}\u0000${args.pass}`).toString("base64")}\r\n`);
          return;
        case "starttls":
          if (code !== 220) { fail(new Error(`STARTTLS rejected: ${line}`)); return; }
          {
            const plain = socket as net.Socket;
            const tlsSock = tls.connect({ socket: plain, servername: args.host });
            tlsSock.setEncoding("utf8");
            tlsSock.on("data", (d: string | Buffer) => { buf += String(d); flush(); });
            tlsSock.on("error", fail);
            tlsSock.on("timeout", () => fail(new Error("smtp timeout")));
            socket = tlsSock;
            phase = "ehlo";
            upgraded = true;
            tlsSock.once("secureConnect", () => write(`EHLO gutu.local\r\n`));
          }
          return;
        case "auth":
          if (code !== 235 && code !== 250 && code !== 220) { fail(new Error(`AUTH rejected: ${line}`)); return; }
          phase = "from";
          write(`MAIL FROM:<${args.envelope.from}>\r\n`);
          return;
        case "from":
          phase = "rcpt";
          write(`RCPT TO:<${recipients[rcptIdx]}>\r\n`);
          return;
        case "rcpt":
          if (code >= 400) { fail(new Error(`RCPT rejected: ${line}`)); return; }
          rcptIdx++;
          if (rcptIdx < recipients.length) { write(`RCPT TO:<${recipients[rcptIdx]}>\r\n`); return; }
          phase = "data";
          write(`DATA\r\n`);
          return;
        case "data":
          if (code !== 354) { fail(new Error(`DATA rejected: ${line}`)); return; }
          phase = "body";
          write(dotStuff(Buffer.from(args.raw).toString("utf8")));
          write(`\r\n.\r\n`);
          return;
        case "body":
          if (code !== 250) { fail(new Error(`message rejected: ${line}`)); return; }
          {
            const m = line.match(/queued as ([A-Za-z0-9.@-]+)/);
            if (m) messageId = m[1];
          }
          phase = "quit";
          write(`QUIT\r\n`);
          return;
        case "quit":
          try { socket.destroy(); } catch { /* ignore */ }
          resolve({
            providerMessageId: messageId ?? `${Date.now()}`,
            providerThreadId: messageId ?? `${Date.now()}`,
          });
          return;
      }
    };

    const flush = (): void => {
      while (buf.includes("\r\n")) {
        const idx = buf.indexOf("\r\n");
        const line = buf.slice(0, idx);
        buf = buf.slice(idx + 2);
        handleLine(line);
      }
    };

    socket.on("data", (d: string | Buffer) => { buf += String(d); flush(); });
    socket.on("error", fail);
    socket.on("timeout", () => fail(new Error("smtp timeout")));
  });
}

function dotStuff(input: string): string {
  return input.replace(/\r?\n\.(?!\.)/g, "\r\n..");
}

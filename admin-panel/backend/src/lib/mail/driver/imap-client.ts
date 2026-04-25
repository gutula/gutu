/** Minimal but real IMAP4rev1 client.
 *
 *  Implements the subset we exercise: LOGIN / AUTHENTICATE PLAIN / XOAUTH2,
 *  CAPABILITY, LIST, SELECT/EXAMINE, UID FETCH, UID SEARCH, UID STORE,
 *  UID COPY, UID EXPUNGE, IDLE / DONE, CREATE / RENAME / DELETE.
 *
 *  Response parsing is line-oriented with literal-string handling
 *  (`{N}` continuation). One pending tagged command at a time;
 *  untagged responses are buffered and delivered alongside the tagged
 *  result. */

import tls from "node:tls";
import net from "node:net";
import { Buffer } from "node:buffer";

export interface ImapConnectOpts {
  host: string;
  port: number;
  tls: boolean;
  servername?: string;
  socketTimeoutMs?: number;
}

export interface ImapAuthOpts {
  user: string;
  pass?: string;
  oauthToken?: string;
}

export interface ImapResponse {
  status: "OK" | "NO" | "BAD" | "BYE";
  text: string;
  untagged: ImapUntagged[];
}

export interface ImapUntagged {
  raw: string;
  /** First-token name (FETCH, EXISTS, SEARCH, etc.) — uppercased. */
  name: string;
  /** Parsed sequence/uid number when applicable. */
  number?: number;
  /** Token list after the name (best effort). */
  tokens: string[];
  /** Raw literal-string segments delivered with this untagged line. */
  literals: Buffer[];
}

export type IdleEvent =
  | { type: "exists"; count: number }
  | { type: "expunge"; seq: number }
  | { type: "fetch"; seq: number; raw: string }
  | { type: "recent"; count: number };

export class ImapError extends Error {
  constructor(message: string, public response?: ImapResponse) { super(message); }
}

interface PendingCommand {
  resolve: (resp: ImapResponse) => void;
  reject: (err: Error) => void;
  untagged: ImapUntagged[];
  literalBuffer: Buffer | null;
  literalRemaining: number;
  /** Latest untagged line that's awaiting its literal data. */
  pendingUntagged: ImapUntagged | null;
}

export class ImapClient {
  private socket: tls.TLSSocket | net.Socket | null = null;
  private buffer = Buffer.alloc(0);
  private greeting: Promise<void>;
  private greetingResolve!: () => void;
  private greetingReject!: (err: Error) => void;
  private tagSeq = 0;
  private current: { tag: string; cmd: PendingCommand } | null = null;
  private queue: { tag: string; cmd: PendingCommand; line: string }[] = [];
  private idleListener: ((ev: IdleEvent) => void) | null = null;
  private continuationResolver: ((line: string) => void) | null = null;
  private capabilities = new Set<string>();

  constructor(public readonly opts: ImapConnectOpts) {
    this.greeting = new Promise<void>((res, rej) => {
      this.greetingResolve = res;
      this.greetingReject = rej;
    });
  }

  async connect(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const onError = (err: Error): void => { this.greetingReject(err); reject(err); };
      const sock = this.opts.tls
        ? tls.connect({ host: this.opts.host, port: this.opts.port, servername: this.opts.servername ?? this.opts.host }, () => {
            this.socket = sock;
            sock.setNoDelay(true);
            if (this.opts.socketTimeoutMs) sock.setTimeout(this.opts.socketTimeoutMs);
            sock.on("data", (d: Buffer | string) => this.onData(typeof d === "string" ? Buffer.from(d) : d));
            sock.on("error", onError);
            sock.on("close", () => this.onClose());
            this.greeting.then(() => resolve()).catch(reject);
          })
        : net.connect({ host: this.opts.host, port: this.opts.port }, () => {
            this.socket = sock;
            sock.setNoDelay(true);
            if (this.opts.socketTimeoutMs) sock.setTimeout(this.opts.socketTimeoutMs);
            sock.on("data", (d: Buffer | string) => this.onData(typeof d === "string" ? Buffer.from(d) : d));
            sock.on("error", onError);
            sock.on("close", () => this.onClose());
            this.greeting.then(() => resolve()).catch(reject);
          });
      sock.once("error", onError);
    });
  }

  /** Issue a tagged command. Concurrent calls are serialized. */
  async send(command: string): Promise<ImapResponse> {
    return this.sendInternal(command, false);
  }

  private async sendInternal(command: string, raw: boolean): Promise<ImapResponse> {
    if (!this.socket) throw new ImapError("not connected");
    return new Promise<ImapResponse>((resolve, reject) => {
      const tag = `T${++this.tagSeq}`;
      const cmd: PendingCommand = {
        resolve,
        reject,
        untagged: [],
        literalBuffer: null,
        literalRemaining: 0,
        pendingUntagged: null,
      };
      const line = raw ? command : `${tag} ${command}\r\n`;
      this.queue.push({ tag, cmd, line });
      this.dispatchNext();
    });
  }

  private dispatchNext(): void {
    if (this.current || this.queue.length === 0) return;
    const next = this.queue.shift();
    if (!next) return;
    this.current = { tag: next.tag, cmd: next.cmd };
    this.socket?.write(next.line);
  }

  /** AUTH PLAIN helper. */
  async authenticatePlain(user: string, pass: string): Promise<ImapResponse> {
    const cred = Buffer.from(`\u0000${user}\u0000${pass}`).toString("base64");
    return this.sendWithContinuation("AUTHENTICATE PLAIN", cred);
  }

  /** XOAUTH2 helper (Gmail / 365). */
  async authenticateXoauth2(user: string, accessToken: string): Promise<ImapResponse> {
    const auth = Buffer.from(`user=${user}\u0001auth=Bearer ${accessToken}\u0001\u0001`).toString("base64");
    return this.sendWithContinuation(`AUTHENTICATE XOAUTH2`, auth);
  }

  private async sendWithContinuation(command: string, payload: string): Promise<ImapResponse> {
    if (!this.socket) throw new ImapError("not connected");
    return new Promise<ImapResponse>((resolve, reject) => {
      const tag = `T${++this.tagSeq}`;
      this.continuationResolver = (line): void => {
        if (line.startsWith("+")) {
          this.socket?.write(`${payload}\r\n`);
        }
      };
      const cmd: PendingCommand = {
        resolve: (resp) => { this.continuationResolver = null; resolve(resp); },
        reject: (err) => { this.continuationResolver = null; reject(err); },
        untagged: [],
        literalBuffer: null,
        literalRemaining: 0,
        pendingUntagged: null,
      };
      this.queue.push({ tag, cmd, line: `${tag} ${command}\r\n` });
      this.dispatchNext();
    });
  }

  /** LOGIN — only safe when the server advertises STARTTLS or we connected
   *  on an implicit-TLS port (993). */
  async login(user: string, pass: string): Promise<ImapResponse> {
    const safe = (s: string): string => s.replace(/[\\"]/g, (m) => `\\${m}`);
    return this.send(`LOGIN "${safe(user)}" "${safe(pass)}"`);
  }

  async capability(): Promise<Set<string>> {
    const r = await this.send("CAPABILITY");
    for (const u of r.untagged) {
      if (u.name === "CAPABILITY") {
        this.capabilities = new Set(u.tokens.map((t) => t.toUpperCase()));
        return this.capabilities;
      }
    }
    return this.capabilities;
  }

  async list(reference = "", pattern = "*"): Promise<{ name: string; flags: string[]; delim: string }[]> {
    const r = await this.send(`LIST "${reference}" "${pattern}"`);
    const out: { name: string; flags: string[]; delim: string }[] = [];
    for (const u of r.untagged) {
      if (u.name !== "LIST") continue;
      // raw is like: * LIST (\HasNoChildren) "/" "INBOX"
      const m = u.raw.match(/^\* LIST \(([^)]*)\) "([^"]*)" (.*)$/);
      if (!m) continue;
      const flags = m[1].split(/\s+/).filter(Boolean);
      const delim = m[2];
      let nameRaw = m[3].trim();
      if (nameRaw.startsWith('"') && nameRaw.endsWith('"')) nameRaw = nameRaw.slice(1, -1);
      out.push({ flags, delim, name: nameRaw });
    }
    return out;
  }

  async select(mailbox: string, readOnly = false): Promise<{ exists: number; uidValidity: number; uidNext: number }> {
    const cmd = readOnly ? "EXAMINE" : "SELECT";
    const r = await this.send(`${cmd} "${mailbox.replace(/"/g, '\\"')}"`);
    if (r.status !== "OK") throw new ImapError(`${cmd} failed: ${r.text}`, r);
    let exists = 0;
    let uidValidity = 0;
    let uidNext = 0;
    for (const u of r.untagged) {
      if (u.name === "EXISTS" && u.number !== undefined) exists = u.number;
      const okMatch = u.raw.match(/\[UIDVALIDITY (\d+)\]/);
      if (okMatch) uidValidity = parseInt(okMatch[1], 10);
      const unMatch = u.raw.match(/\[UIDNEXT (\d+)\]/);
      if (unMatch) uidNext = parseInt(unMatch[1], 10);
    }
    return { exists, uidValidity, uidNext };
  }

  async uidSearch(criteria: string): Promise<number[]> {
    const r = await this.send(`UID SEARCH ${criteria}`);
    if (r.status !== "OK") throw new ImapError(`UID SEARCH failed: ${r.text}`, r);
    for (const u of r.untagged) {
      if (u.name === "SEARCH") return u.tokens.map((t) => parseInt(t, 10)).filter((n) => Number.isFinite(n));
    }
    return [];
  }

  async uidFetchEnvelopes(set: string): Promise<UidFetchEnvelope[]> {
    const r = await this.send(`UID FETCH ${set} (UID FLAGS INTERNALDATE RFC822.SIZE ENVELOPE BODYSTRUCTURE)`);
    if (r.status !== "OK") throw new ImapError(`UID FETCH failed: ${r.text}`, r);
    return r.untagged
      .filter((u) => u.name === "FETCH")
      .map((u) => parseEnvelope(u))
      .filter((x): x is UidFetchEnvelope => !!x);
  }

  async uidFetchBody(uid: number): Promise<{ uid: number; raw: Buffer } | null> {
    const r = await this.send(`UID FETCH ${uid} (UID BODY.PEEK[])`);
    if (r.status !== "OK") return null;
    for (const u of r.untagged) {
      if (u.name !== "FETCH") continue;
      if (u.literals.length === 0) continue;
      const idx = parseInt(u.tokens[0] ?? "0", 10);
      void idx;
      const uidMatch = u.raw.match(/UID (\d+)/);
      const fetchedUid = uidMatch ? parseInt(uidMatch[1], 10) : uid;
      return { uid: fetchedUid, raw: u.literals[0] };
    }
    return null;
  }

  async uidStoreFlags(set: string, op: "+" | "-" | "", flags: string[]): Promise<void> {
    await this.send(`UID STORE ${set} ${op}FLAGS.SILENT (${flags.join(" ")})`);
  }

  async uidCopy(set: string, mailbox: string): Promise<ImapResponse> {
    return this.send(`UID COPY ${set} "${mailbox.replace(/"/g, '\\"')}"`);
  }

  async uidExpunge(set: string): Promise<ImapResponse> {
    return this.send(`UID EXPUNGE ${set}`);
  }

  async create(mailbox: string): Promise<ImapResponse> {
    return this.send(`CREATE "${mailbox.replace(/"/g, '\\"')}"`);
  }

  async deleteMailbox(mailbox: string): Promise<ImapResponse> {
    return this.send(`DELETE "${mailbox.replace(/"/g, '\\"')}"`);
  }

  async append(mailbox: string, raw: Buffer, flags: string[] = []): Promise<ImapResponse> {
    const flagSeg = flags.length > 0 ? ` (${flags.join(" ")})` : "";
    const literal = `{${raw.length}}`;
    const start = `APPEND "${mailbox.replace(/"/g, '\\"')}"${flagSeg} ${literal}`;
    // The server sends `+ ready for literal data` continuation — write the
    // raw bytes after that.
    return new Promise<ImapResponse>((resolve, reject) => {
      const tag = `T${++this.tagSeq}`;
      this.continuationResolver = (line) => {
        if (line.startsWith("+")) {
          this.socket?.write(raw);
          this.socket?.write(`\r\n`);
        }
      };
      const cmd: PendingCommand = {
        resolve: (r) => { this.continuationResolver = null; resolve(r); },
        reject: (e) => { this.continuationResolver = null; reject(e); },
        untagged: [],
        literalBuffer: null,
        literalRemaining: 0,
        pendingUntagged: null,
      };
      this.queue.push({ tag, cmd, line: `${tag} ${start}\r\n` });
      this.dispatchNext();
    });
  }

  /** Enter IDLE mode. The returned function ends IDLE with DONE.
   *  IDLE keep-alive is the caller's responsibility — recommended every
   *  29 minutes per RFC 2177. */
  async idle(onEvent: (ev: IdleEvent) => void): Promise<() => Promise<void>> {
    if (!this.capabilities.has("IDLE")) {
      throw new ImapError("server does not support IDLE");
    }
    this.idleListener = onEvent;
    const tag = `T${++this.tagSeq}`;
    const cmd: PendingCommand = {
      resolve: () => { /* idle stays pending until DONE */ },
      reject: () => undefined,
      untagged: [],
      literalBuffer: null,
      literalRemaining: 0,
      pendingUntagged: null,
    };
    this.queue.push({ tag, cmd, line: `${tag} IDLE\r\n` });
    this.dispatchNext();
    return async (): Promise<void> => {
      this.socket?.write(`DONE\r\n`);
      // The server replies with the tagged OK for the IDLE command.
      // We resolve the pending command via normal flow — but we do that
      // by clearing the listener and waiting one tick.
      this.idleListener = null;
      await new Promise<void>((r) => setTimeout(r, 50));
    };
  }

  async logout(): Promise<void> {
    if (!this.socket) return;
    try { await this.send("LOGOUT"); } catch { /* ignore */ }
    this.socket.end();
    this.socket = null;
  }

  /* ---- byte-level parsing ---- */

  private onClose(): void {
    if (this.current) {
      this.current.cmd.reject(new ImapError("connection closed"));
      this.current = null;
    }
    for (const q of this.queue) q.cmd.reject(new ImapError("connection closed"));
    this.queue = [];
  }

  private onData(chunk: Buffer): void {
    this.buffer = Buffer.concat([this.buffer, chunk]);
    while (this.processOneFrame()) { /* loop */ }
  }

  private processOneFrame(): boolean {
    // If the current command is mid-literal, fill it first.
    if (this.current?.cmd.literalRemaining ?? 0) {
      const cmd = this.current!.cmd;
      const take = Math.min(cmd.literalRemaining, this.buffer.length);
      cmd.literalBuffer = cmd.literalBuffer
        ? Buffer.concat([cmd.literalBuffer, this.buffer.subarray(0, take)])
        : Buffer.from(this.buffer.subarray(0, take));
      this.buffer = this.buffer.subarray(take);
      cmd.literalRemaining -= take;
      if (cmd.literalRemaining > 0) return false;
      // literal complete — attach to pending untagged.
      if (cmd.pendingUntagged && cmd.literalBuffer) {
        cmd.pendingUntagged.literals.push(cmd.literalBuffer);
      }
      cmd.literalBuffer = null;
      cmd.pendingUntagged = null;
      // continue reading the rest of that untagged line on the next tick
      return true;
    }
    const idx = this.buffer.indexOf(0x0a); // LF
    if (idx === -1) return false;
    const lineBuf = this.buffer.subarray(0, idx + 1);
    this.buffer = this.buffer.subarray(idx + 1);
    const lineStr = lineBuf.toString("utf8").replace(/\r\n?$|\n$/, "");
    this.handleLine(lineStr);
    return true;
  }

  private handleLine(line: string): void {
    // Greeting before any tagged command.
    if (this.greetingResolve && (line.startsWith("* OK") || line.startsWith("* PREAUTH"))) {
      this.greetingResolve();
      this.greetingResolve = (() => undefined) as () => void;
      // Some servers include CAPABILITY in the greeting.
      const capMatch = line.match(/\[CAPABILITY ([^\]]+)\]/);
      if (capMatch) this.capabilities = new Set(capMatch[1].split(/\s+/).map((c) => c.toUpperCase()));
      return;
    }
    if (line.startsWith("+")) {
      if (this.continuationResolver) this.continuationResolver(line);
      return;
    }
    if (line.startsWith("* ")) {
      this.handleUntagged(line);
      return;
    }
    // Tagged.
    const space = line.indexOf(" ");
    if (space === -1 || !this.current) return;
    const tag = line.slice(0, space);
    const rest = line.slice(space + 1);
    if (this.current.tag !== tag) return;
    const status = rest.startsWith("OK") ? "OK" : rest.startsWith("NO") ? "NO" : rest.startsWith("BAD") ? "BAD" : rest.startsWith("BYE") ? "BYE" : null;
    if (!status) return;
    const text = rest.slice(status.length).trim();
    const resp: ImapResponse = { status, text, untagged: this.current.cmd.untagged };
    const cmd = this.current.cmd;
    this.current = null;
    if (status === "OK") cmd.resolve(resp);
    else cmd.reject(new ImapError(`${status} ${text}`, resp));
    this.dispatchNext();
  }

  private handleUntagged(line: string): void {
    // Forward to IDLE listener if active.
    if (this.idleListener) {
      const e = parseIdleLine(line);
      if (e) this.idleListener(e);
    }
    if (!this.current) return;
    // Parse name + tokens (best effort; tokens may include parens).
    const m = line.match(/^\*\s+(?:(\d+)\s+)?([A-Z][A-Z0-9.]*)\s*(.*)$/);
    if (!m) return;
    const u: ImapUntagged = {
      raw: line,
      name: m[2].toUpperCase(),
      number: m[1] ? parseInt(m[1], 10) : undefined,
      tokens: tokenize(m[3] ?? ""),
      literals: [],
    };
    // Detect literal markers `{N}` in the line — body bytes follow.
    const lit = (m[3] ?? "").match(/\{(\d+)\}\s*$/);
    if (lit) {
      this.current.cmd.literalRemaining = parseInt(lit[1], 10);
      this.current.cmd.pendingUntagged = u;
    }
    this.current.cmd.untagged.push(u);
  }
}

export interface UidFetchEnvelope {
  uid: number;
  flags: string[];
  internalDate?: string;
  size?: number;
  envelope?: ImapEnvelope;
}

export interface ImapEnvelope {
  date?: string;
  subject?: string;
  from?: string;
  sender?: string;
  replyTo?: string;
  to?: string;
  cc?: string;
  bcc?: string;
  inReplyTo?: string;
  messageId?: string;
}

function parseEnvelope(u: ImapUntagged): UidFetchEnvelope | null {
  // Fully parsing IMAP ENVELOPE requires a small s-expression parser;
  // for now we extract UID + flags + internalDate + size which cover
  // the most useful fields for our index, and pass the raw envelope
  // string for callers who want to re-parse later.
  const uidMatch = u.raw.match(/UID (\d+)/);
  if (!uidMatch) return null;
  const flagsMatch = u.raw.match(/FLAGS \(([^)]*)\)/);
  const dateMatch = u.raw.match(/INTERNALDATE "([^"]+)"/);
  const sizeMatch = u.raw.match(/RFC822\.SIZE (\d+)/);
  return {
    uid: parseInt(uidMatch[1], 10),
    flags: flagsMatch ? flagsMatch[1].split(/\s+/).filter(Boolean) : [],
    internalDate: dateMatch ? dateMatch[1] : undefined,
    size: sizeMatch ? parseInt(sizeMatch[1], 10) : undefined,
  };
}

function tokenize(rest: string): string[] {
  // Tolerant tokenizer — splits on whitespace honoring quoted strings + parens.
  const out: string[] = [];
  let cur = "";
  let depth = 0;
  let inQuote = false;
  for (let i = 0; i < rest.length; i++) {
    const c = rest[i];
    if (c === '"' && rest[i - 1] !== "\\") inQuote = !inQuote;
    else if (!inQuote && c === "(") depth++;
    else if (!inQuote && c === ")") depth = Math.max(0, depth - 1);
    if (!inQuote && depth === 0 && /\s/.test(c)) {
      if (cur) { out.push(cur); cur = ""; }
      continue;
    }
    cur += c;
  }
  if (cur) out.push(cur);
  return out;
}

function parseIdleLine(line: string): IdleEvent | null {
  const m = line.match(/^\*\s+(\d+)\s+([A-Z]+)/);
  if (!m) return null;
  const seq = parseInt(m[1], 10);
  const name = m[2].toUpperCase();
  if (name === "EXISTS") return { type: "exists", count: seq };
  if (name === "EXPUNGE") return { type: "expunge", seq };
  if (name === "RECENT") return { type: "recent", count: seq };
  if (name === "FETCH") return { type: "fetch", seq, raw: line };
  return null;
}

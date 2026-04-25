import { describe, expect, test } from "bun:test";
import { parseRfc822 } from "../../src/lib/mail/mime/parser";
import { buildMessage, newMessageId } from "../../src/lib/mail/mime/builder";

const SAMPLE = [
  "From: Alice <a@x.test>",
  "To: Bob <b@y.test>",
  "Subject: =?utf-8?B?aGVsbG8=?=",
  "Date: Mon, 1 Jan 2024 12:34:56 +0000",
  "Message-ID: <abc@x.test>",
  "MIME-Version: 1.0",
  'Content-Type: multipart/alternative; boundary="bdry"',
  "",
  "--bdry",
  "Content-Type: text/plain; charset=utf-8",
  "",
  "hello plain",
  "--bdry",
  "Content-Type: text/html; charset=utf-8",
  "",
  "<p>hello html</p>",
  "--bdry--",
  "",
].join("\r\n");

describe("MIME parser", () => {
  test("parses headers + multipart/alternative bodies", () => {
    const p = parseRfc822(SAMPLE);
    expect(p.from?.email).toBe("a@x.test");
    expect(p.to[0].email).toBe("b@y.test");
    expect(p.subject).toBe("hello");
    expect(p.bodyText).toContain("hello plain");
    expect(p.bodyHtml).toContain("hello html");
    expect(p.messageId).toBe("abc@x.test");
  });
});

describe("MIME builder", () => {
  test("builds a deliverable RFC 5322 message", () => {
    const msg = buildMessage({
      from: { email: "a@x.test", name: "A" },
      to: [{ email: "b@y.test" }],
      subject: "hi",
      text: "plain body",
      html: "<p>html body</p>",
      messageId: newMessageId("x.test"),
    });
    const raw = Buffer.from(msg.raw).toString("utf8");
    expect(raw).toContain("From: A <a@x.test>");
    expect(raw).toContain("To: b@y.test");
    expect(raw).toContain("Subject: hi");
    expect(raw).toContain("MIME-Version: 1.0");
    expect(raw).toContain("multipart/alternative");
    expect(msg.envelope.to).toEqual(["b@y.test"]);
  });

  test("encodes non-ASCII subjects", () => {
    const msg = buildMessage({
      from: { email: "a@x.test" },
      to: [{ email: "b@y.test" }],
      subject: "café",
      text: "x",
      messageId: "id-1@x.test",
    });
    const raw = Buffer.from(msg.raw).toString("utf8");
    expect(raw).toContain("=?utf-8?B?");
  });

  test("round-trips through parser", () => {
    const built = buildMessage({
      from: { email: "a@x.test" },
      to: [{ email: "b@y.test" }],
      subject: "round-trip",
      text: "alpha",
      messageId: "rt@x.test",
    });
    const parsed = parseRfc822(built.raw);
    expect(parsed.from?.email).toBe("a@x.test");
    expect(parsed.subject).toBe("round-trip");
    expect(parsed.bodyText).toContain("alpha");
  });
});

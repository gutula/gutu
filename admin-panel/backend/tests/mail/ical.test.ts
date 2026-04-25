import { describe, expect, test } from "bun:test";
import { parseIcal, buildReply } from "../../src/lib/mail/ical";

const ICS = [
  "BEGIN:VCALENDAR",
  "VERSION:2.0",
  "METHOD:REQUEST",
  "BEGIN:VEVENT",
  "UID:abc-123",
  "SEQUENCE:1",
  "SUMMARY:Quarterly review",
  "DTSTART:20260301T140000Z",
  "DTEND:20260301T150000Z",
  "ORGANIZER;CN=Alice:mailto:alice@x.test",
  "ATTENDEE;CN=Bob;PARTSTAT=NEEDS-ACTION;RSVP=TRUE:mailto:bob@y.test",
  "END:VEVENT",
  "END:VCALENDAR",
  "",
].join("\r\n");

describe("ical", () => {
  test("parses VEVENT", () => {
    const ev = parseIcal(ICS);
    expect(ev?.uid).toBe("abc-123");
    expect(ev?.method).toBe("REQUEST");
    expect(ev?.organizer?.email).toBe("alice@x.test");
    expect(ev?.attendees[0].email).toBe("bob@y.test");
  });

  test("buildReply produces METHOD:REPLY ICS for an attendee", () => {
    const ev = parseIcal(ICS)!;
    const out = buildReply(ev, { email: "bob@y.test", cn: "Bob" }, "ACCEPTED");
    expect(out).toContain("METHOD:REPLY");
    expect(out).toContain("PARTSTAT=ACCEPTED");
    expect(out).toContain("UID:abc-123");
  });

  test("returns null for malformed input", () => {
    expect(parseIcal("garbage")).toBeNull();
  });
});

import { describe, expect, test } from "bun:test";
import { classifyTracker } from "../../src/lib/mail/tracker-detection";

describe("classifyTracker", () => {
  test("blocks known tracker host", () => {
    const r = classifyTracker("https://track.mailchimp.com/abc/open.gif");
    expect(r.blocked).toBe(true);
  });

  test("blocks subdomain pattern (track.*)", () => {
    expect(classifyTracker("https://track.foo.test/open").blocked).toBe(true);
  });

  test("blocks pixel keyword in path", () => {
    expect(classifyTracker("https://example.test/wp/wf/open?x=1").blocked).toBe(true);
  });

  test("blocks 1x1 hint", () => {
    expect(classifyTracker("https://example.test/img.png", { width: 1, height: 1 }).blocked).toBe(true);
  });

  test("allows benign image", () => {
    expect(classifyTracker("https://cdn.example.test/photo.jpg").blocked).toBe(false);
  });
});

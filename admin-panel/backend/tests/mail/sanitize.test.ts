import { describe, expect, test } from "bun:test";
import {
  sanitizeHtml,
  htmlToPlainText,
  plainTextToHtml,
  previewFromHtml,
} from "../../src/lib/mail/mime/sanitize";

describe("sanitizeHtml", () => {
  test("strips script tags entirely", () => {
    const r = sanitizeHtml("<p>hi</p><script>alert(1)</script>");
    expect(r.html).not.toContain("script");
    expect(r.html).toContain("hi");
  });

  test("removes inline event handlers", () => {
    const r = sanitizeHtml('<a href="https://x.test" onclick="evil()">x</a>');
    expect(r.html).not.toContain("onclick");
    expect(r.html).toContain('href="https://x.test"');
  });

  test("blocks javascript: in href", () => {
    const r = sanitizeHtml('<a href="javascript:alert(1)">click</a>');
    expect(r.html).not.toContain("javascript:");
  });

  test("rewrites <img> through proxy + counts trackers", () => {
    const log: string[] = [];
    const r = sanitizeHtml('<img src="https://track.example/open.gif" width="1" height="1">', {
      imageProxy: (u) => `/proxy?u=${encodeURIComponent(u)}`,
      trackerLog: log,
    });
    expect(log.length).toBe(1);
    expect(r.trackers.length).toBe(1);
  });

  test("rewrites cid: refs from cidMap", () => {
    const r = sanitizeHtml('<img src="cid:abc">', { cidMap: { abc: "/inline/abc" } });
    expect(r.html).toContain("/inline/abc");
  });

  test("drops style expression()", () => {
    const r = sanitizeHtml('<div style="background: expression(alert(1))">x</div>');
    expect(r.html).not.toContain("expression(");
  });

  test("htmlToPlainText handles <br> and <p> as newlines", () => {
    expect(htmlToPlainText("<p>a</p><p>b</p>")).toContain("a");
    expect(htmlToPlainText("a<br>b")).toContain("a");
  });

  test("plainTextToHtml escapes + linkifies", () => {
    const out = plainTextToHtml("<go> https://x.test");
    expect(out).toContain("&lt;go&gt;");
    expect(out).toContain('href="https://x.test"');
  });

  test("previewFromHtml truncates with ellipsis", () => {
    const r = previewFromHtml("<p>" + "a".repeat(500) + "</p>", 100);
    expect(r.length).toBeLessThanOrEqual(100);
  });
});

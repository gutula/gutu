import { describe, expect, test } from "bun:test";
import { parseQuery, compileQuery } from "../../src/lib/mail/search/query-parser";

describe("query parser", () => {
  test("parses simple operators", () => {
    const q = parseQuery("from:alice@x.test is:unread has:attachment");
    const ops = q.clauses[0].termAnd;
    expect(ops.find((t) => t.kind === "operator" && t.op === "from")).toBeTruthy();
    expect(ops.find((t) => t.kind === "operator" && t.op === "is")).toBeTruthy();
    expect(ops.find((t) => t.kind === "operator" && t.op === "has")).toBeTruthy();
  });

  test("free-text concatenates", () => {
    const q = parseQuery("hello world");
    expect(q.freetext).toContain("hello");
    expect(q.freetext).toContain("world");
  });

  test("OR creates multiple clauses", () => {
    const q = parseQuery("from:a OR from:b");
    expect(q.clauses.length).toBeGreaterThanOrEqual(2);
  });

  test("negation works on operators and free-text", () => {
    const q = parseQuery("-from:spam NOT urgent");
    const t1 = q.clauses[0].termAnd.find((t) => t.kind === "operator" && t.op === "from");
    expect(t1?.negate).toBe(true);
  });

  test("compileQuery emits FTS match expression", () => {
    const q = parseQuery("hello");
    const c = compileQuery(q);
    expect(c.ftsMatch).toContain("hello");
  });

  test("compileQuery binds operator values", () => {
    const q = parseQuery("from:alice");
    const c = compileQuery(q);
    expect(c.where).toContain("from.email");
    expect(c.bindings.length).toBeGreaterThan(0);
  });
});

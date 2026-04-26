import { describe, test, expect } from "bun:test";
import {
  comboMatches,
  isEditableTarget,
  type KeyEventLike,
} from "../hooks/_keyMatcher";

const blank: KeyEventLike = {
  key: "",
  metaKey: false,
  ctrlKey: false,
  shiftKey: false,
  altKey: false,
};

const k = (overrides: Partial<KeyEventLike>): KeyEventLike => ({ ...blank, ...overrides });

describe("comboMatches", () => {
  test("matches a single key", () => {
    expect(comboMatches("r", k({ key: "r" }))).toBe(true);
    expect(comboMatches("r", k({ key: "R" }))).toBe(true);
    expect(comboMatches("r", k({ key: "x" }))).toBe(false);
  });

  test("requires modifier on cmd combos", () => {
    expect(comboMatches("cmd+s", k({ key: "s", metaKey: true }), { mac: true })).toBe(true);
    expect(comboMatches("cmd+s", k({ key: "s" }), { mac: true })).toBe(false);
  });

  test("on non-mac, cmd maps to ctrl", () => {
    expect(comboMatches("cmd+s", k({ key: "s", ctrlKey: true }), { mac: false })).toBe(true);
    expect(comboMatches("cmd+s", k({ key: "s", metaKey: true }), { mac: false })).toBe(false);
  });

  test("requires shift when specified", () => {
    expect(comboMatches("shift+enter", k({ key: "Enter", shiftKey: true }))).toBe(true);
    expect(comboMatches("shift+enter", k({ key: "Enter" }))).toBe(false);
  });

  test("rejects extra modifiers", () => {
    expect(comboMatches("r", k({ key: "r", metaKey: true }), { mac: true })).toBe(false);
  });

  test("normalises arrow keys", () => {
    expect(comboMatches("up", k({ key: "ArrowUp" }))).toBe(true);
    expect(comboMatches("down", k({ key: "ArrowDown" }))).toBe(true);
    expect(comboMatches("left", k({ key: "ArrowLeft" }))).toBe(true);
    expect(comboMatches("right", k({ key: "ArrowRight" }))).toBe(true);
  });

  test("normalises Escape", () => {
    expect(comboMatches("esc", k({ key: "Escape" }))).toBe(true);
    expect(comboMatches("escape", k({ key: "Escape" }))).toBe(true);
  });

  test("? matches Shift-/", () => {
    expect(comboMatches("?", k({ key: "?" }))).toBe(true);
    expect(comboMatches("?", k({ key: "/", shiftKey: true }))).toBe(true);
  });
});

describe("isEditableTarget", () => {
  test("flags input/textarea/select", () => {
    expect(isEditableTarget({ tagName: "INPUT" })).toBe(true);
    expect(isEditableTarget({ tagName: "TEXTAREA" })).toBe(true);
    expect(isEditableTarget({ tagName: "SELECT" })).toBe(true);
  });

  test("flags contenteditable", () => {
    expect(isEditableTarget({ tagName: "DIV", isContentEditable: true })).toBe(true);
  });

  test("does not flag normal elements", () => {
    expect(isEditableTarget({ tagName: "DIV" })).toBe(false);
    expect(isEditableTarget(null)).toBe(false);
    expect(isEditableTarget(undefined)).toBe(false);
  });
});

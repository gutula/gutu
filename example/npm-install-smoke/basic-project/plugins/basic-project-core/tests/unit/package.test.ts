import { describe, expect, it } from "bun:test";

import manifest from "../../package";

describe("starter plugin manifest", () => {
  it("keeps a stable package id", () => {
    expect(manifest.id).toBe("basic-project-core");
  });
});

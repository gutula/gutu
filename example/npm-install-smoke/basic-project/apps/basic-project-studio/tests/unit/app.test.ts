import { describe, expect, it } from "bun:test";

import { appId, starterPluginId } from "../../src";

describe("starter app", () => {
  it("keeps stable ids", () => {
    expect(appId).toBe("basic-project-studio");
    expect(starterPluginId).toBe("basic-project-core");
  });
});

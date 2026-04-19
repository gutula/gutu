import { definePackage } from "@platform/kernel";

export default definePackage({
  id: "basic-project-core",
  kind: "app",
  version: "0.1.0",
  displayName: "Basic Project Core",
  description: "Starter business plugin for the Basic Project Core project workspace.",
  dependsOn: ["auth-core", "org-tenant-core", "role-policy-core", "audit-core"],
  providesCapabilities: ["basic-project-core.manage"],
  requestedCapabilities: ["ui.register.admin", "api.rest.mount", "data.write.basic-project-core"],
  ownsData: ["basic-project-core.records"],
  extendsData: [],
  slotClaims: [],
  trustTier: "first-party",
  reviewTier: "R1",
  isolationProfile: "same-process-trusted",
  compatibility: {
    framework: "^0.1.0",
    runtime: "bun>=1.3.12",
    db: ["postgres", "sqlite"]
  }
});

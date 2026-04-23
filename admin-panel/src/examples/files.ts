import { buildDomainPlugin } from "./_factory/buildDomainPlugin";
import { SECTIONS } from "./_factory/sections";
import { daysAgo, pick } from "./_factory/seeds";

export const filesPlugin = buildDomainPlugin({
  id: "files",
  label: "Files",
  icon: "FolderOpen",
  section: SECTIONS.workspace,
  order: 3,
  resources: [
    {
      id: "file",
      singular: "File",
      plural: "Files",
      icon: "File",
      path: "/files",
      fields: [
        { name: "name", kind: "text", required: true, sortable: true },
        { name: "mimeType", label: "Type", kind: "text" },
        { name: "sizeBytes", label: "Size", kind: "number", align: "right", sortable: true },
        { name: "owner", kind: "text", sortable: true },
        { name: "uploadedAt", kind: "datetime", sortable: true },
      ],
      seedCount: 22,
      seed: (i) => ({
        name: pick(["contract.pdf", "photo.jpg", "data.csv", "presentation.pptx", "logo.svg"], i),
        mimeType: pick(["application/pdf", "image/jpeg", "text/csv", "application/vnd.ms-powerpoint", "image/svg+xml"], i),
        sizeBytes: 1024 * (100 + ((i * 131) % 9000)),
        owner: pick(["sam@gutu.dev", "alex@gutu.dev"], i),
        uploadedAt: daysAgo(i),
      }),
    },
  ],
});

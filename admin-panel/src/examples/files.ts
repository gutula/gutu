import { buildDomainPlugin } from "./_factory/buildDomainPlugin";
import { SECTIONS } from "./_factory/sections";
import { daysAgo, pick } from "./_factory/seeds";
import { buildCompactControlRoom } from "./_factory/compactDashboard";

const controlRoomView = buildCompactControlRoom({
  viewId: "files.control-room.view",
  resource: "files.file",
  title: "Files Control Room",
  description: "Storage, uploads, shares.",
  kpis: [
    { label: "Files", resource: "files.file" },
    { label: "Total size (bytes)", resource: "files.file", fn: "sum", field: "sizeBytes" },
    { label: "Uploaded (7d)", resource: "files.file", range: "last-7" },
  ],
  charts: [
    { label: "Files by type", resource: "files.file", chart: "donut", groupBy: "mimeType" },
    { label: "Uploads (30d)", resource: "files.file", chart: "area", period: "day", lastDays: 30 },
  ],
  shortcuts: [
    { label: "Upload", icon: "Upload", href: "/files/new" },
    { label: "Buckets", icon: "HardDrive", href: "/files/buckets" },
  ],
});

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
      defaultSort: { field: "uploadedAt", dir: "desc" },
      fields: [
        { name: "name", kind: "text", required: true, sortable: true },
        { name: "mimeType", label: "Type", kind: "text" },
        { name: "sizeBytes", label: "Size", kind: "number", align: "right", sortable: true },
        { name: "owner", kind: "text", sortable: true },
        { name: "bucket", kind: "text" },
        { name: "path", kind: "text" },
        { name: "public", kind: "boolean" },
        { name: "uploadedAt", kind: "datetime", sortable: true },
      ],
      seedCount: 30,
      seed: (i) => ({
        name: pick(["contract.pdf", "photo.jpg", "data.csv", "presentation.pptx", "logo.svg", "report.xlsx"], i),
        mimeType: pick(["application/pdf", "image/jpeg", "text/csv", "application/vnd.ms-powerpoint", "image/svg+xml"], i),
        sizeBytes: 1024 * (100 + ((i * 131) % 9000)),
        owner: pick(["sam@gutu.dev", "alex@gutu.dev"], i),
        bucket: pick(["uploads", "exports", "attachments"], i),
        path: `/uploads/${i}.${pick(["pdf", "jpg", "csv", "pptx", "svg"], i)}`,
        public: i % 5 === 0,
        uploadedAt: daysAgo(i),
      }),
    },
    {
      id: "bucket",
      singular: "Bucket",
      plural: "Buckets",
      icon: "HardDrive",
      path: "/files/buckets",
      fields: [
        { name: "name", kind: "text", required: true, sortable: true },
        { name: "region", kind: "text" },
        { name: "filesCount", kind: "number", align: "right" },
        { name: "totalBytes", kind: "number", align: "right" },
      ],
      seedCount: 4,
      seed: (i) => ({
        name: pick(["uploads", "exports", "attachments", "archives"], i),
        region: pick(["us-east-1", "eu-west-1", "ap-northeast-1"], i),
        filesCount: 100 + i * 50,
        totalBytes: 1_000_000_000 + i * 500_000_000,
      }),
    },
  ],
  extraNav: [
    { id: "files.control-room.nav", label: "Control Room", icon: "LayoutDashboard", path: "/files/control-room", view: "files.control-room.view", order: 0 },
  ],
  extraViews: [controlRoomView],
  commands: [
    { id: "files.go.control-room", label: "Files: Control Room", icon: "LayoutDashboard", run: () => { window.location.hash = "/files/control-room"; } },
    { id: "files.upload", label: "Upload file", icon: "Upload", run: () => { window.location.hash = "/files/new"; } },
  ],
});

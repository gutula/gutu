import { buildDomainPlugin } from "./_factory/buildDomainPlugin";
import { SECTIONS } from "./_factory/sections";
import { CITIES, personEmail, personName, pick } from "./_factory/seeds";

export const userDirectoryPlugin = buildDomainPlugin({
  id: "user-directory",
  label: "User Directory",
  icon: "Contact",
  section: SECTIONS.people,
  order: 4,
  resources: [
    {
      id: "person",
      singular: "Person",
      plural: "Directory",
      icon: "Contact",
      path: "/directory",
      fields: [
        { name: "name", kind: "text", required: true, sortable: true },
        { name: "email", kind: "email", required: true },
        { name: "title", kind: "text" },
        { name: "department", kind: "text", sortable: true },
        { name: "city", kind: "text" },
      ],
      seedCount: 20,
      seed: (i) => ({
        name: personName(i),
        email: personEmail(i, "gutu.dev"),
        title: pick(["Engineer", "Designer", "Manager", "Ops Lead"], i),
        department: pick(["Engineering", "Operations", "Sales", "Support"], i),
        city: pick(CITIES, i),
      }),
    },
  ],
});

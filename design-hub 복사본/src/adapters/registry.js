export const providers = [
  {
    id: "canva",
    name: "Canva",
    mode: "oauth-rest-api",
    status: "available-with-developer-app",
    capabilities: ["oauth", "create-design", "list-designs", "export-design", "autofill-when-enabled"],
    note: "OAuth scopes and API access must be approved in Canva Developer Portal."
  },
  {
    id: "adobe-express",
    name: "Adobe Express",
    mode: "embed-sdk-and-express-api",
    status: "available-with-adobe-project",
    capabilities: ["embedded-editor", "task-modules", "programmatic-generation-subject-to-entitlement"],
    note: "Requires Adobe developer registration, credentials, and applicable product entitlement."
  },
  {
    id: "figma",
    name: "Figma",
    mode: "oauth-rest-api",
    status: "available-with-oauth-app",
    capabilities: ["oauth", "read-file-metadata", "read-file-content-subject-to-scope", "export-rendered-assets-subject-to-endpoint"],
    note: "Figma REST API is not a general-purpose full editor embed; permissions and plan restrictions apply."
  },
  {
    id: "miricanvas",
    name: "미리캔버스",
    mode: "partner-or-approved-connector",
    status: "partner-access-required",
    capabilities: ["manual-handoff", "partner-api-when-approved"],
    note: "Publicly documented general-purpose third-party platform API was not confirmed. Its AI connector supports workflows in supported assistants, but does not establish a public API for arbitrary SaaS integration."
  },
  {
    id: "mangoboard",
    name: "망고보드",
    mode: "partner-api-or-export-handoff",
    status: "partner-access-required",
    capabilities: ["manual-handoff", "partner-api-when-approved"],
    note: "Public general-purpose developer API was not confirmed. Do not scrape, automate private endpoints, or reuse templates without a license."
  }
];

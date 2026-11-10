export function adobeConfigured() {
  return Boolean(process.env.ADOBE_CLIENT_ID && process.env.ADOBE_CLIENT_SECRET);
}

// Adobe Express is integrated through its official Embed SDK in the browser.
// This adapter deliberately does not invent undocumented REST endpoints.
export function adobeEmbedConfig() {
  return {
    configured: adobeConfigured(),
    integration: "Adobe Express Embed SDK",
    note: "Register the production origin and follow the current Adobe Embed SDK quickstart."
  };
}

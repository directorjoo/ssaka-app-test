import express from "express";
import dotenv from "dotenv";
import crypto from "node:crypto";
import { providers } from "./adapters/registry.js";
import { canvaConfigured, canvaListDesigns, canvaCreateDesign } from "./adapters/canva.js";
import { figmaConfigured, figmaGetFile } from "./adapters/figma.js";
import { adobeEmbedConfig } from "./adapters/adobe.js";

dotenv.config();
const app = express();
app.use(express.json({ limit: "8mb" }));
app.use(express.static("public"));

const sessions = new Map(); // Development only. Replace with encrypted persistent session storage.
const oauthStates = new Map();

app.get("/api/providers", (_req, res) => {
  res.json(providers.map(p => ({
    ...p,
    configured:
      p.id === "canva" ? canvaConfigured() :
      p.id === "figma" ? figmaConfigured() :
      p.id === "adobe-express" ? adobeEmbedConfig().configured : false
  })));
});

app.get("/api/health", (_req, res) => res.json({ ok: true, service: "ssaba-design-hub" }));

app.get("/oauth/canva/start", (_req, res) => {
  if (!canvaConfigured()) return res.status(400).send("Canva credentials are not configured.");
  const state = crypto.randomBytes(24).toString("hex");
  const verifier = crypto.randomBytes(32).toString("base64url");
  const challenge = crypto.createHash("sha256").update(verifier).digest("base64url");
  oauthStates.set(state, { verifier, provider: "canva", created: Date.now() });
  const url = new URL("https://www.canva.com/api/oauth/authorize");
  url.search = new URLSearchParams({
    response_type: "code",
    client_id: process.env.CANVA_CLIENT_ID,
    redirect_uri: process.env.CANVA_REDIRECT_URI,
    scope: "design:meta:read design:content:write",
    code_challenge_method: "s256",
    code_challenge: challenge,
    state
  }).toString();
  res.redirect(url.toString());
});

app.get("/oauth/canva/callback", async (req, res) => {
  const { code, state } = req.query;
  const saved = oauthStates.get(state);
  if (!saved || saved.provider !== "canva" || Date.now() - saved.created > 10 * 60 * 1000) {
    return res.status(400).send("Invalid or expired OAuth state.");
  }
  oauthStates.delete(state);
  try {
    const basic = Buffer.from(`${process.env.CANVA_CLIENT_ID}:${process.env.CANVA_CLIENT_SECRET}`).toString("base64");
    const tokenResponse = await fetch("https://api.canva.com/rest/v1/oauth/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${basic}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code: String(code || ""),
        redirect_uri: process.env.CANVA_REDIRECT_URI,
        code_verifier: saved.verifier
      })
    });
    const token = await tokenResponse.json();
    if (!tokenResponse.ok) throw new Error(token.error_description || token.error || "Canva token exchange failed");
    const id = crypto.randomUUID();
    sessions.set(id, { provider: "canva", accessToken: token.access_token, refreshToken: token.refresh_token, expiresAt: Date.now() + token.expires_in * 1000 });
    res.send(`Canva connected for this development session. Session ID: ${id}. Store tokens securely before production.`);
  } catch (e) {
    res.status(502).send(`Canva OAuth failed: ${e.message}`);
  }
});

app.get("/api/canva/designs", async (req, res) => {
  const session = sessions.get(req.header("x-ssaba-session"));
  if (!session || session.provider !== "canva") return res.status(401).json({ error: "Canva session required" });
  try { res.json(await canvaListDesigns(session.accessToken)); }
  catch (e) { res.status(502).json({ error: e.message }); }
});

app.post("/api/canva/designs", async (req, res) => {
  const session = sessions.get(req.header("x-ssaba-session"));
  if (!session || session.provider !== "canva") return res.status(401).json({ error: "Canva session required" });
  const { title = "SSABA Design", width = 1080, height = 1080 } = req.body || {};
  if (!Number.isInteger(width) || !Number.isInteger(height) || width < 40 || height < 40 || width > 8000 || height > 8000 || width * height > 25000000) {
    return res.status(400).json({ error: "Invalid Canva canvas dimensions" });
  }
  try { res.json(await canvaCreateDesign(session.accessToken, { title, width, height })); }
  catch (e) { res.status(502).json({ error: e.message }); }
});

// Figma file metadata route is enabled once OAuth token storage/callback is configured.
// Never accept arbitrary tokens from browser query strings.
app.get("/api/figma/file/:fileKey", async (_req, res) => {
  if (!figmaConfigured()) return res.status(503).json({ error: "Figma OAuth credentials not configured" });
  res.status(501).json({ error: "Figma OAuth callback/token vault must be completed for this deployment before file access is enabled." });
});

const port = Number(process.env.PORT || 4310);
app.listen(port, () => console.log(`SSABA Design Hub listening on ${port}`));

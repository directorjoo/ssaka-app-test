const API = "https://api.canva.com/rest/v1";

export function canvaConfigured() {
  return Boolean(process.env.CANVA_CLIENT_ID && process.env.CANVA_CLIENT_SECRET && process.env.CANVA_REDIRECT_URI);
}

export async function canvaListDesigns(accessToken) {
  const response = await fetch(`${API}/designs`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body?.message || `Canva API error ${response.status}`);
  return body;
}

export async function canvaCreateDesign(accessToken, { title, width, height }) {
  const response = await fetch(`${API}/designs`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      type: "type_and_asset",
      design_type: { type: "custom", width, height },
      title
    })
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body?.message || `Canva API error ${response.status}`);
  return body;
}

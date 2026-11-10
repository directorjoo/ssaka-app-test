export function figmaConfigured() {
  return Boolean(process.env.FIGMA_CLIENT_ID && process.env.FIGMA_CLIENT_SECRET && process.env.FIGMA_REDIRECT_URI);
}

export async function figmaGetFile(accessToken, fileKey) {
  const response = await fetch(`https://api.figma.com/v1/files/${encodeURIComponent(fileKey)}`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body?.err || `Figma API error ${response.status}`);
  return body;
}

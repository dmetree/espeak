import type { NextApiRequest, NextApiResponse } from "next";
import { AccessToken } from "livekit-server-sdk";

type Body = { room?: string; identity?: string };

/**
 * Mints a LiveKit access token on the server only.
 * Do not import `livekit-server-sdk` in client components — it pulls `node:crypto` and breaks the browser bundle.
 *
 * Prefer server-only env vars (no NEXT_PUBLIC_ prefix) for API key/secret in production.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { room, identity } = (req.body || {}) as Body;
  if (!room || typeof room !== "string" || !identity?.trim()) {
    return res.status(400).json({ error: "room and identity are required" });
  }

  const apiKey =
    process.env.LIVEKIT_API_KEY ??
    process.env.LK_API_KEY ??
    process.env.NEXT_PUBLIC_LK_API_KEY;
  const apiSecret =
    process.env.LIVEKIT_API_SECRET ??
    process.env.LK_API_SECRET ??
    process.env.NEXT_PUBLIC_LK_API_SECRET;

  if (!apiKey || !apiSecret) {
    return res.status(500).json({ error: "LiveKit credentials not configured" });
  }

  try {
    const at = new AccessToken(apiKey, apiSecret, {
      identity: identity.trim(),
    });
    at.addGrant({
      room,
      roomJoin: true,
      canPublish: true,
      canSubscribe: true,
    });
    const token = await at.toJwt();
    return res.status(200).json({ token });
  } catch (e) {
    console.error("livekit token error", e);
    return res.status(500).json({ error: "Failed to generate token" });
  }
}

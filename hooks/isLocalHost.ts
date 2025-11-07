export const isLocalhost = typeof window !== "undefined" && window.location.hostname === "localhost";
export const turnstileSiteKey = isLocalhost
  ? process.env.NEXT_PUBLIC_CF_SITE_KEY_LOCAL
  : process.env.NEXT_PUBLIC_CF_SITE_KEY;

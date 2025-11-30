/** @type {import('next').NextConfig} */

const defaultCsp =
  "default-src 'self' data: images.jpgstoreapis.com storage.googleapis.com www.snek.com media.cnftlab.party ipfs.io; " +
  "script-src 'self' www.googletagmanager.com 'unsafe-eval' 'wasm-unsafe-eval'; " +
  "style-src 'self' 'unsafe-inline'; " +
  "connect-src *.fluidtokens.com relay.walletconnect.com api.cnft.tools localhost:* raw.githubusercontent.com api.coingecko.com;";

const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "cross-origin-opener-policy", value: "same-origin" },
  { key: "cross-origin-resource-policy", value: "cross-origin" },
  { key: "X-XSS-Protection", value: "1; mode=block" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Content-Security-Policy", value: defaultCsp },
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  },
];

const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  eslint: { ignoreDuringBuilds: true },

  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "ipfs.io" },
      { protocol: "https", hostname: "storage.googleapis.com" },
      { protocol: "https", hostname: "media.cnftlab.party" },
      { protocol: "https", hostname: "i.ibb.co" },
    ],
  },

  webpack(config) {
    config.experiments = {
      asyncWebAssembly: true,
      layers: true,
      topLevelAwait: true,
    };
    return config;
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

module.exports = nextConfig;

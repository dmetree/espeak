/** @type {import('next').NextConfig} */
const path = require("path");

const defaultCsp = `default-src 'self' data: images.jpgstoreapis.com storage.googleapis.com www.snek.com media.cnftlab.party ipfs.io; script-src 'self' www.googletagmanager.com 'unsafe-eval'; style-src 'self' 'unsafe-inline' ; connect-src *.fluidtokens.com relay.walletconnect.com api.cnft.tools localhost:* raw.githubusercontent.com api.coingecko.com`;

const securityHeaders = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "cross-origin-opener-policy",
    value: "same-origin",
  },
  {
    key: "cross-origin-resource-policy",
    value: "cross-origin",
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Content-Security-Policy",
    value: defaultCsp,
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  },
];

const MS_PER_SECOND = 1000;
const SECONDS_PER_DAY = 86400;

const nextConfig = {
  reactStrictMode: true, // keeping this from the second config
  trailingSlash: true,
  onDemandEntries: {
    maxInactiveAge: SECONDS_PER_DAY * MS_PER_SECOND,
    pagesBufferLength: 100,
  },
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true, // keeping this from the first config
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ipfs.io",
        port: "",
      },
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "media.cnftlab.party",
        port: "",
      },
      {
        protocol: "https",
        hostname: "i.ibb.co",
        port: "",
      },
    ],
    i18n: {
      locales: ["en", "ru", "en"], // Define the supported locales
      defaultLocale: "en", // Set the default locale
    },
  },
  webpack(config, { buildId, dev, isServer }) {
    const wasmExtensionRegExp = /\.wasm$/;

    config.experiments = {
      asyncWebAssembly: true,
      layers: true,
      topLevelAwait: true,
    };

    if (!dev && isServer) {
      config.output.webassemblyModuleFilename = "chunks/[id].wasm";
      config.plugins.push(new WasmChunksFixPlugin());
    }

    config.resolve.extensions.push(".wasm");
    config.module.rules.forEach((rule) => {
      (rule.oneOf || []).forEach((oneOf) => {
        if (oneOf.loader && oneOf.loader.indexOf("file-loader") >= 0) {
          oneOf.exclude.push(wasmExtensionRegExp);
        }
      });
    });

    config.module.rules.push({
      test: wasmExtensionRegExp,
      include: path.resolve(__dirname, "src"),
      use: [{ loader: require.resolve("wasm-loader"), options: {} }],
    });

    return config;
  },
};

module.exports = nextConfig;

// Added the WasmChunksFixPlugin class
class WasmChunksFixPlugin {
  apply(compiler) {
    compiler.hooks.thisCompilation.tap("WasmChunksFixPlugin", (compilation) => {
      compilation.hooks.processAssets.tap(
        { name: "WasmChunksFixPlugin" },
        (assets) =>
          Object.entries(assets).forEach(([pathname, source]) => {
            if (!pathname.match(/\.wasm$/)) return;
            compilation.deleteAsset(pathname);

            const name = pathname.split("/")[1];
            const info = compilation.assetsInfo.get(pathname);
            compilation.emitAsset(name, source, info);
          })
      );
    });
  }
}

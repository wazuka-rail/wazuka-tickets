import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/wazuka-tickets",
  assetPrefix: "/wazuka-tickets/",
  distDir: "out/wazuka-tickets",
  output: "export",
  reactCompiler: true,
  reactStrictMode: true,
  trailingSlash: true,
  logging: {
    fetches: {
      fullUrl: true,
      hmrRefreshes: true,
    },
  },
  images: {
    unoptimized: true,
  },
  turbopack: {
    rules: {
      "*.svg": {
        loaders: [
          {
            loader: "@svgr/webpack",
            options: {
              titleProp: true,
              titleId: "filePath",
            },
          },
        ],
        as: "*.js",
      },
    },
  },
  experimental: {
    turbopackFileSystemCacheForBuild: false,
    turbopackFileSystemCacheForDev: false,
  },
};

export default nextConfig;

import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  output: "export",

  trailingSlash: true,

  turbopack: {
    root: path.resolve(__dirname),
  },

  devIndicators: false,

  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "apitourism.fikriti.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        pathname: "/**",
      },
    ],
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  reactStrictMode: false,
};

export default nextConfig;
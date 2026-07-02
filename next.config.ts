import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  sassOptions: {
    loadPaths: ['./src'],
    resolveUrlLoader: false,
  },
};

export default nextConfig;
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Configure static file serving
  async rewrites() {
    return [
      {
        source: '/data/:path*',
        destination: '/api/audio/serve/:path*',
      },
    ];
  },
};

export default nextConfig;

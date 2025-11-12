import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // Allow production builds to succeed even if there are ESLint errors
    ignoreDuringBuilds: true,
  },
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

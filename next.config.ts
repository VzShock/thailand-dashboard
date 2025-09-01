import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Use stable turbopack config instead of experimental.turbo
  turbopack: {
    // Configuration for Turbopack (stable)
  },
  // Updated devIndicators config with correct property names
  devIndicators: {
    position: 'top-left', // Updated property name from buildActivityPosition
  },
  // Additional config to suppress development UI
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

export default nextConfig;

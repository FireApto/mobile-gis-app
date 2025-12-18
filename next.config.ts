import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable Turbopack explicitly
  turbopack: {},
  
  // Remove webpack config since we're using Turbopack
  // Turbopack handles these automatically
};

export default nextConfig;
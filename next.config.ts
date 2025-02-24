import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "plus.unsplash.com",
      "images.unsplash.com",
      "api.dicebear.com",
      "robohash.org",
      "res.cloudinary.com",
    ],
  },
  eslint: {
    ignoreDuringBuilds: true, // Disables ESLint checks during the build
  },
  typescript: {
    ignoreBuildErrors: true, // Disable TypeScript checks during build
  },
  /* config options here */
};

export default nextConfig;

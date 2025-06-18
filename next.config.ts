import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
        {
        protocol: "https",
        hostname: "plus.unsplash.com",
        pathname: "/**",
      },
        {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
   
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

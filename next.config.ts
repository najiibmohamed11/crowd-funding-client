import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images:{
    domains:['plus.unsplash.com', 'images.unsplash.com' ,'api.dicebear.com' ,'robohash.org']
  },  
  eslint: {
    ignoreDuringBuilds: true, // Disables ESLint checks during the build
  },
  /* config options here */
};

export default nextConfig;

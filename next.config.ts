import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'media-cdn.tripadvisor.com',
      },
      {
        protocol: 'https',
        hostname: 'img.antarafoto.com',
      },
      {
        protocol: 'https',
        hostname: 'www.jagoanhosting.com',
      }, 
    ],
  },
};

export default nextConfig;

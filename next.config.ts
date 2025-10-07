import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['api.joincroose.com'],
    formats: ['image/webp', 'image/avif'],
  },
};

export default nextConfig;

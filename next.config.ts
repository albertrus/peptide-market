import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.reddit.com" },
      { protocol: "https", hostname: "i.redd.it" },
    ],
  },
};

export default nextConfig;

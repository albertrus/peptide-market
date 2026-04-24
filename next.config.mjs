/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.reddit.com" },
      { protocol: "https", hostname: "i.redd.it" },
    ],
  },
};

export default nextConfig;

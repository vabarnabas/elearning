/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { hostname: "cdn.jsdelivr.net" },
      { hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;

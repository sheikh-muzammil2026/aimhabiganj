/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
        pathname: "**",
      },
    ],
  },
  reactCompiler: true,
  experimental: {
    turbopackMemoryLimit: 2048,
  },
};

export default nextConfig;

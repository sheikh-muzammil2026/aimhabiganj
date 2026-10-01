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
    turbopack: false,
  },
  swcMinify: true,
};

export default nextConfig;

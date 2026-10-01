/** @type {import('next').NextConfig} */
const nextConfig = {
  /* Remote Images Config */
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
  output: "standalone",
};

export default nextConfig;

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

  output: "standalone",
};

export default nextConfig;

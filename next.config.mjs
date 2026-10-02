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
  async rewrites() {
    return [
      {
        source: "/shaldaMJ.ttf",
        destination: "/ShaldaMJ.ttf",
      },
    ];
  },
};

export default nextConfig;

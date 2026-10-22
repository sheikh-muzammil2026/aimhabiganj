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
  serverExternalPackages: ["@react-pdf/renderer"],
  async rewrites() {
    return [
      {
        source: "/shaldaMJ.ttf",
        destination: "/ShaldaMJ.ttf",
      },
    ];
  },
  experimental: {
    cpus: 1, // এটি সরাসরি Next.js কে ১টি কোর ব্যবহারে বাধ্য করবে
    workerThreads: false, // মাল্টি-থ্রেডিং বন্ধ রাখবে যাতে EAGAIN এরর না আসে
  },
};

export default nextConfig;

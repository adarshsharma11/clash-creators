import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/clash/b_today_1",
        destination: "/clash/daily",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    const backend = (
      process.env.NEXT_PUBLIC_API_URL ??
      process.env.NEXT_BASE_API_URL ??
      "http://localhost:6001"
    ).replace(/\/+$/, "");
    return [
      {
        source: "/backend/:path*",
        destination: `${backend}/:path*`,
      },
    ];
  },
};

export default nextConfig;

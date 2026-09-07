import type { NextConfig } from "next";

function backendOrigin(): string {
  const backend = (
    process.env.NEXT_PUBLIC_API_URL ??
    process.env.NEXT_BASE_API_URL ??
    ""
  )
    .trim()
    .replace(/^["']|["']$/g, "")
    .replace(/\/+$/, "");

  if (!backend) {
    throw new Error("Set NEXT_BASE_API_URL to the backend origin.");
  }

  return backend;
}

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  env: {
    NEXT_BASE_API_URL: backendOrigin(),
  },
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
    return [
      {
        source: "/backend/:path*",
        destination: `${backendOrigin()}/:path*`,
      },
    ];
  },
};

export default nextConfig;

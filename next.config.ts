import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "lavagini.vercel.app",
          },
        ],
        destination: "https://lavagini.tn/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

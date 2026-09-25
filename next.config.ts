import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.nadiaclementi.it",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "nadiaclementi.it",
        pathname: "/wp-content/uploads/**",
      },
    ],
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
        pathname: "/photos/**", 
        port: "",
        search: ""
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**", 
        port: "",
        search: ""
      },
    ],
  },
};

export default nextConfig;

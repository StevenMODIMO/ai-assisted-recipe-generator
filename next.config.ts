import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "3ihrcobwrhqsel8a.public.blob.vercel-storage.com",
        pathname: "/cdn.recipe.users/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.themealdb.com",
        pathname: "/images/**",
      },
    ],
  },
};

export default nextConfig;

//https://3ihrcobwrhqsel8a.public.blob.vercel-storage.com/cdn.recipe.users/xb.png
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mvxsbyqdvtnqtcalhnrp.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
    unoptimized: true, // Tambahkan ini untuk bypass optimization
  },
  /* config options here */
};

export default nextConfig;
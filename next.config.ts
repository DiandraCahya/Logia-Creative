import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  experimental: {
    optimizePackageImports: ["lucide-react", "clsx", "tailwind-merge", "next-themes"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [30, 60, 75, 85, 90],
    minimumCacheTTL: 604800, // 7 days
    // Ukuran device: jaga agar mobile tidak mengambil file 2560px
    deviceSizes: [320, 480, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
    localPatterns: [
      { pathname: "/**" },
    ],
  },
  outputFileTracingIncludes: {
    "/**": ["content/**/*"],
  },
};

export default nextConfig;

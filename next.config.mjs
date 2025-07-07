/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Enable React Strict Mode explicitly
  eslint: {
    ignoreDuringBuilds: true, // Ignore ESLint errors during production builds
  },
  images: {
   
   

    remotePatterns: [
      {
        protocol: "https",
        hostname: "advayu-brands-assets.s3.ap-south-1.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "s3.amazonaws.com",
        pathname: "/**",
      },
    ],
  },
  headers: async () => {
    return [
      {
        source: "/:path*", // Apply to all paths
        headers: [
          {
            key: "Cookie",
            value: "forward", // Forward cookies explicitly to the middleware
          },
        ],
      },
    ];
  },
  webpack(config, { dev, isServer }) {
    if (dev && !isServer) {
      config.watchOptions = {
        poll: 1000, // Check for changes every second
        aggregateTimeout: 300, // Delay before rebuilding
      };
    }
    return config;
  },
};

export default nextConfig;

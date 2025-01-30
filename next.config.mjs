/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // enable React Strict Mode explicitly
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
    
      {
        protocol: 'https',
        hostname: 's3.amazonaws.com', // Add this hostname
        pathname: '/**',
      },
    ],
  },
  webpack(config, { dev, isServer }) {
    // Enable hot-reloading in development mode
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
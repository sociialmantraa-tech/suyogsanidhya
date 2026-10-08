import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: __dirname,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.VITE_API_BASE_URL || 'http://localhost/astrologer/api/:path*',
      },
    ];
  },
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      // Disable Webpack persistent disk cache in dev mode to eliminate __webpack_modules__[moduleId] errors
      config.cache = false;
    }
    return config;
  },
};

export default nextConfig;

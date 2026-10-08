import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true,
  },
  outputFileTracingRoot: __dirname,
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      // Disable Webpack persistent disk cache in dev mode to eliminate __webpack_modules__[moduleId] errors
      config.cache = false;
    }
    return config;
  },
};

export default nextConfig;

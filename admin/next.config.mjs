/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.VITE_API_URL || 'http://localhost/astrologer/api/:path*',
      },
    ];
  },
};

export default nextConfig;

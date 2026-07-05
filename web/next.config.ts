import type { NextConfig } from 'next';

const apiHost = process.env.NEXT_PUBLIC_API_URL
  ? new URL(process.env.NEXT_PUBLIC_API_URL.replace('/api', '')).hostname
  : 'localhost';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost', port: '4000', pathname: '/uploads/**' },
      { protocol: 'https', hostname: apiHost, pathname: '/uploads/**' },
      { protocol: 'http', hostname: apiHost, pathname: '/uploads/**' },
    ],
  },
};

export default nextConfig;

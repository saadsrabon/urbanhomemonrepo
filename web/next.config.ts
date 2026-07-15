import type { NextConfig } from 'next';
import path from 'path';

function getApiHostname(): string {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.trim() ?? '';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() ?? '';

  // Relative API path (/api) — uploads are served on the same domain via nginx.
  if (!apiUrl || apiUrl.startsWith('/')) {
    if (siteUrl) {
      try {
        return new URL(siteUrl).hostname;
      } catch {
        return 'localhost';
      }
    }
    return 'localhost';
  }

  try {
    const base = apiUrl.replace(/\/api\/?$/, '') || apiUrl;
    return new URL(base).hostname;
  } catch {
    return 'localhost';
  }
}

const apiHost = getApiHostname() || 'localhost';

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname, '..'),
  poweredByHeader: false,
  compress: true,
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion', '@tanstack/react-query', 'date-fns'],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost', port: '4000', pathname: '/uploads/**' },
      { protocol: 'https', hostname: apiHost, pathname: '/uploads/**' },
      { protocol: 'http', hostname: apiHost, pathname: '/uploads/**' },
    ],
  },
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|jpeg|png|webp|avif|gif|ico|woff|woff2)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
    ],
  },

  async redirects() {
    return [
      {
        source: '/review',
        destination: 'https://search.google.com/local/writereview?placeid=PLACEHOLDER',
        permanent: false,
      },
      {
        source: '/admin',
        destination: process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || 'http://localhost:3333',
        permanent: false,
      },
      {
        source: '/studio',
        destination: process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || 'http://localhost:3333',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;

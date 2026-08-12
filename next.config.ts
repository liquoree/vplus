import type {
  NextConfig,
} from 'next';

const backendUrl =
  process.env.BACKEND_URL ??
  (
    process.env.NODE_ENV ===
    'production'
      ? 'http://api:8000'
      : 'http://127.0.0.1:8000'
  );

const nextConfig: NextConfig = {
  output: 'standalone',

  sassOptions: {
    loadPaths: ['./src'],
    resolveUrlLoader: false,
  },

  async rewrites() {
    return [
      {
        source:
          '/api/v1/:path*',
        destination:
          `${backendUrl}/api/v1/:path*`,
      },
      {
        source:
          '/media/:path*',
        destination:
          `${backendUrl}/media/:path*`,
      },
    ];
  },
};

export default nextConfig;
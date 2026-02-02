/** @type {import('next').NextConfig} */
import { join } from 'path';

const nextConfig = {
  sassOptions: {
    includePaths: [join(process.cwd(), 'src', 'styles')],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: 'https://whatlunch.vercel.app',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,POST,PUT,DELETE,OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type,Authorization',
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'openweathermap.org',
        port: '',
        pathname: '/img/wn/**',
      },

      {
        protocol: 'https',
        hostname: 'whatlunch-bucket.s3.ap-northeast-2.amazonaws.com',
        port: '',
        pathname: '/**',
      },
    ],

    domains: [
      'lh3.googleusercontent.com',
      // 필요시 다른 외부 이미지 도메인도 추가
    ],
  },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
import { join } from 'path';

const nextConfig = {
  sassOptions: {
    includePaths: [join(process.cwd(), 'src', 'styles')],
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

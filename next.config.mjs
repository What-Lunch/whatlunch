/** @type {import('next').NextConfig} */
import { join } from 'path';

const nextConfig = {
  sassOptions: {
    includePaths: [join(process.cwd(), 'src', 'styles')],
  },
  // CORS 헤더 설정 부분은 삭제 Proxy 사용 시 불필요/충돌 위험

  async rewrites() {
    return [
      {
        // 1. 프론트엔드에서 '/api/proxy/auth/login' 으로 요청하면
        source: '/api/proxy/:path*',
        // 2. 실제로는 'https://backend-piik.onrender.com/auth/login' 으로 전송됨
        destination: 'https://backend-piik.onrender.com/:path*',
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
    domains: ['lh3.googleusercontent.com'],
  },
};

export default nextConfig;

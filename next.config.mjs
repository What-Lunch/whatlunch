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
    ],
  },
};

export default nextConfig;

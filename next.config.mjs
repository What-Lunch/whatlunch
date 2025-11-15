/** @type {import('next').NextConfig} */
import { join } from 'path';
const nextConfig = {
  sassOptions: {
    includePaths: [join(process.cwd(), 'src', 'styles')],
  },
};

export default nextConfig;

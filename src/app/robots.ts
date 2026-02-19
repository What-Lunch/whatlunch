import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/mypage', '/rooms'],
      },
    ],
    sitemap: 'https://whatlunch.vercel.app/sitemap.xml',
  };
}

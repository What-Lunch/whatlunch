import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://whatlunch.vercel.app',
      lastModified: new Date(),
    },
    {
      url: 'https://whatlunch.vercel.app/solo',
      lastModified: new Date(),
    },
  ];
}

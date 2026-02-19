import { MetadataRoute } from 'next';

const lastModified = new Date('2026-02-19');

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://whatlunch.vercel.app',
      lastModified,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: 'https://whatlunch.vercel.app/점메추-룰렛',
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: 'https://whatlunch.vercel.app/오늘-뭐먹지',
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: 'https://whatlunch.vercel.app/점심-메뉴-추천',
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: 'https://whatlunch.vercel.app/혼밥-메뉴-추천',
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];
}

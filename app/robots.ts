import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/*?card=',
    },
    sitemap: 'https://centmeta.it/sitemap.xml',
  };
}
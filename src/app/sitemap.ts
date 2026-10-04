import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://abu-shahm.vercel.app';

  const staticPages = [
    { ar: '', en: 'en' },
    { ar: 'عقارات', en: 'en/properties' },
    { ar: 'اعرض-عقارك', en: 'en/list-your-property' },
    { ar: 'اطلب-عقار', en: 'en/property-request' },
    { ar: 'عن-المكتب', en: 'en/about' },
    { ar: 'تواصل', en: 'en/contact' },
    { ar: 'احياء', en: 'en/neighborhoods' },
    { ar: 'سياسة-الخصوصية', en: 'en/privacy' },
  ];

  const entries: MetadataRoute.Sitemap = [];

  for (const page of staticPages) {
    entries.push({
      url: `\$\{baseUrl\}/\$\{encodeURI(page.ar)\}`,
      lastModified: new Date(),
      changeFrequency: page.ar === '' ? 'daily' : 'weekly',
      priority: page.ar === '' ? 1.0 : 0.8,
      alternates: {
        languages: {
          ar: `\$\{baseUrl\}/\$\{encodeURI(page.ar)\}`,
          en: `${baseUrl}/${page.en}`,
        },
      },
    });
  }

  // TODO: Add dynamic listing and neighborhood pages from Sanity
  // const listings = await client.fetch(listingSlugsQuery);
  // for (const listing of listings) { ... }

  return entries;
}

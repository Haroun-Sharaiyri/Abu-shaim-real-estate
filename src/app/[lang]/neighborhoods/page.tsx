import type { Metadata } from 'next';
import Link from 'next/link';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { routes, type Locale } from '@/lib/i18n/config';
import { getSanityNeighborhoods, urlFor } from '@/lib/sanity';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale = (lang === 'en' ? 'en' : 'ar') as Locale;
  const dict = await getDictionary(locale);

  return {
    title: dict.meta.neighborhoodsTitle,
    description: dict.home.neighborhoods.description,
    alternates: {
      languages: {
        ar: encodeURI('/احياء'),
        en: '/en/neighborhoods',
      },
    },
  };
}

export default async function NeighborhoodsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = (lang === 'en' ? 'en' : 'ar') as Locale;
  const dict = await getDictionary(locale);
  const localRoutes = routes[locale];

  const neighborhoodImages: Record<string, string> = {
    eastern: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80',
    southern: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
    university: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80',
    barha: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80',
    eidoun: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80',
    hisn: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=80',
    sarih: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80',
    hawwara: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80',
  };

  const sanityNeighborhoods = await getSanityNeighborhoods();

  // ONLY show neighborhoods created and published in Sanity Studio
  const displayNeighborhoods = sanityNeighborhoods.map((n) => ({
    value: n.slug?.current || n._id,
    ar: n.name_ar,
    en: n.name_en || n.name_ar,
    img: n.coverImage ? urlFor(n.coverImage) : (neighborhoodImages[n.slug?.current] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80'),
  }));

  return (
    <main>
      {/* Hero */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=2000&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/85 to-navy/70" />
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <h1 className="font-display text-3xl md:text-5xl font-extrabold !text-white mb-4 drop-shadow-lg">
            {dict.home.neighborhoods.title}
          </h1>
          <p className="!text-white/95 max-w-xl mx-auto text-base md:text-lg drop-shadow-sm font-medium">
            {dict.home.neighborhoods.description}
          </p>
          <div className="flex items-center justify-center gap-3 mt-6">
            <span className="cyan-rule cyan-rule-dark w-12" />
            <span className="diamond-sm" style={{ backgroundColor: '#3CCDE8' }} />
            <span className="cyan-rule cyan-rule-dark w-12" />
          </div>
        </div>
      </section>

      {/* Neighborhoods Grid */}
      <section className="py-16 px-6 bg-ground">
        <div className="max-w-6xl mx-auto">
          {displayNeighborhoods.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayNeighborhoods.map((neighborhood) => (
                <Link
                  key={neighborhood.value}
                  href={`/${locale === 'ar' ? '' : 'en/'}${localRoutes.neighborhoods || (locale === 'ar' ? 'احياء' : 'neighborhoods')}/${neighborhood.value}`}
                  className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 aspect-[4/3] flex flex-col justify-end p-5 border border-gray-100"
                >
                  <img
                    src={neighborhood.img}
                    alt={locale === 'ar' ? neighborhood.ar : neighborhood.en}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/95 via-navy/60 to-transparent group-hover:from-navy/95 transition-colors" />
                  <div className="relative z-10 text-center">
                    <h2 className="font-display text-xl font-bold !text-white mb-1 drop-shadow-md">
                      {locale === 'ar' ? neighborhood.ar : neighborhood.en}
                    </h2>
                    <p className="!text-cyan-dark text-xs font-body font-semibold inline-block group-hover:underline drop-shadow-sm">
                      {locale === 'ar' ? 'عرض العقارات المتوفرة' : 'View available properties'}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 text-center rounded-2xl border border-gray-100 max-w-lg mx-auto shadow-sm">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <p className="text-navy font-display text-lg font-bold mb-2">
                {locale === 'ar' ? 'لا توجد أحياء مضافة حالياً' : 'No neighborhoods added yet'}
              </p>
              <p className="text-muted text-sm">
                {locale === 'ar' ? 'يمكنك إضافة الأحياء ونشرها عبر لوحة تحكم Sanity Studio.' : 'You can add and publish neighborhoods via Sanity Studio.'}
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

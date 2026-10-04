import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { routes, type Locale } from '@/lib/i18n/config';
import { getSanityNeighborhoodBySlug, getMergedListings, urlFor } from '@/lib/sanity';
import ListingCard from '@/components/listings/ListingCard';

interface Props {
  params: Promise<{ lang: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  const locale = (lang === 'en' ? 'en' : 'ar') as Locale;
  const neighborhood = await getSanityNeighborhoodBySlug(slug);

  if (!neighborhood) {
    return { title: 'Not Found' };
  }

  const name = locale === 'ar' ? neighborhood.name_ar : (neighborhood.name_en || neighborhood.name_ar);
  const desc = locale === 'ar' ? (neighborhood.description_ar || '') : (neighborhood.description_en || neighborhood.description_ar || '');

  return {
    title: `${name} | ${locale === 'ar' ? 'أبو شهم للعقارات' : 'Abu Shahm Real Estate'}`,
    description: desc.slice(0, 160),
    alternates: {
      languages: {
        ar: `/احياء/${slug}`,
        en: `/en/neighborhoods/${slug}`,
      },
    },
  };
}

export default async function NeighborhoodDetailPage({ params }: Props) {
  const { lang, slug } = await params;
  const locale = (lang === 'en' ? 'en' : 'ar') as Locale;
  const dict = await getDictionary(locale);
  const localRoutes = routes[locale];

  const neighborhood = await getSanityNeighborhoodBySlug(slug);

  if (!neighborhood) {
    notFound();
  }

  const name = locale === 'ar' ? neighborhood.name_ar : (neighborhood.name_en || neighborhood.name_ar);
  const desc = locale === 'ar' 
    ? neighborhood.description_ar 
    : (neighborhood.description_en || neighborhood.description_ar);

  const allListings = await getMergedListings();
  const neighborhoodListings = allListings.filter(
    (l) => l.neighborhood?.slug?.current === slug || l.neighborhood?.name_ar === neighborhood.name_ar
  );

  const bgImg = neighborhood.coverImage
    ? urlFor(neighborhood.coverImage)
    : 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=2000&q=80';

  return (
    <main className="min-h-screen bg-ground pb-16">
      {/* Hero */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
          style={{ backgroundImage: `url('${bgImg}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/85 to-navy/70" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          {/* Breadcrumb */}
          <nav className="inline-flex items-center gap-2 text-xs md:text-sm text-white/70 mb-4">
            <Link href={locale === 'ar' ? '/' : '/en'} className="hover:text-white transition-colors">
              {dict.nav.home}
            </Link>
            <span>/</span>
            <Link 
              href={`/${locale === 'ar' ? '' : 'en/'}${localRoutes.neighborhoods || (locale === 'ar' ? 'احياء' : 'neighborhoods')}`}
              className="hover:text-white transition-colors"
            >
              {dict.nav.neighborhoods}
            </Link>
            <span>/</span>
            <span className="text-cyan-dark font-medium">{name}</span>
          </nav>

          <h1 className="font-display text-3xl md:text-5xl font-extrabold !text-white mb-4 drop-shadow-lg">
            {name}
          </h1>
          {desc && (
            <p className="!text-white/95 max-w-2xl mx-auto text-base md:text-lg drop-shadow-sm font-medium leading-relaxed">
              {desc}
            </p>
          )}
          <div className="flex items-center justify-center gap-3 mt-6">
            <span className="cyan-rule cyan-rule-dark w-12" />
            <span className="diamond-sm" style={{ backgroundColor: '#3CCDE8' }} />
            <span className="cyan-rule cyan-rule-dark w-12" />
          </div>
        </div>
      </section>

      {/* Available Properties in Neighborhood */}
      <section className="py-12 px-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
          <div>
            <h2 className="font-display text-2xl font-bold text-navy">
              {locale === 'ar' ? `العقارات المتوفرة في ${name}` : `Properties in ${name}`}
            </h2>
            <p className="text-sm text-muted mt-1">
              {locale === 'ar' 
                ? `${neighborhoodListings.length} عقار متوفر`
                : `${neighborhoodListings.length} properties available`}
            </p>
          </div>

          <Link
            href={`/${locale === 'ar' ? '' : 'en/'}${localRoutes.listings || (locale === 'ar' ? 'عقارات' : 'properties')}`}
            className="text-sm font-semibold text-blue hover:text-navy transition-colors inline-flex items-center gap-1"
          >
            <span>{locale === 'ar' ? 'عرض جميع العقارات' : 'View All Properties'}</span>
            <svg className="w-4 h-4 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {neighborhoodListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {neighborhoodListings.map((listing) => (
              <ListingCard
                key={listing.referenceCode}
                listing={listing}
                lang={locale}
                dictionary={dict}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 text-center rounded-2xl border border-gray-100 max-w-lg mx-auto shadow-sm">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <h3 className="text-xl font-bold text-navy mb-2">
              {locale === 'ar' ? 'لا توجد عقارات معروضة في هذا الحي حالياً' : 'No properties in this neighborhood currently'}
            </h3>
            <p className="text-muted text-sm mb-6">
              {locale === 'ar' 
                ? 'هل تملك عقاراً هنا وترغب بعرضه؟ أو تبحث عن عقار محدد؟'
                : 'Do you own a property here or are you looking for one?'}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href={`/${locale === 'ar' ? '' : 'en/'}${localRoutes['list-your-property'] || (locale === 'ar' ? 'اعرض-عقارك' : 'list-your-property')}`}
                className="w-full sm:w-auto px-6 py-2.5 bg-cyan-dark hover:bg-cyan-light text-navy font-bold rounded-lg transition-colors text-sm shadow-sm"
              >
                {dict.nav.listProperty}
              </Link>
              <Link
                href={`/${locale === 'ar' ? '' : 'en/'}${localRoutes['property-request'] || (locale === 'ar' ? 'اطلب-عقار' : 'property-request')}`}
                className="w-full sm:w-auto px-6 py-2.5 bg-navy hover:bg-blue text-white font-semibold rounded-lg transition-colors text-sm shadow-sm"
              >
                {dict.nav.requestProperty}
              </Link>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

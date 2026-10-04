import React, { Suspense } from 'react';
import { getDictionary } from '@/lib/i18n/dictionaries';
import type { Locale } from '@/lib/i18n/config';
import FilterableListings from '@/components/listings/FilterableListings';
import { getMergedListings } from '@/lib/sanity';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const locale = (lang === 'en' ? 'en' : 'ar') as Locale;
  const dict = await getDictionary(locale);

  return {
    title: dict.meta?.listingsTitle || (locale === 'ar' ? 'العقارات' : 'Properties'),
    alternates: {
      languages: {
        'ar': '/عقارات',
        'en': '/en/properties',
      },
    },
  };
}

export default async function ListingsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = (lang === 'en' ? 'en' : 'ar') as Locale;
  const dict = await getDictionary(locale);
  
  const listings = await getMergedListings();

  return (
    <div className="bg-ground min-h-screen">
      <Suspense fallback={<div className="container mx-auto py-12 text-center text-muted">Loading...</div>}>
        <FilterableListings lang={locale} dictionary={dict} initialListings={listings} />
      </Suspense>
    </div>
  );
}

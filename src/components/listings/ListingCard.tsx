import React from 'react';
import Link from 'next/link';
import { formatPrice, formatArea } from '@/lib/utils';
import { SampleListing } from '@/lib/sample-listings';

interface ListingCardProps {
  listing: SampleListing;
  lang: 'ar' | 'en';
  dictionary: any;
}

export default function ListingCard({ listing, lang, dictionary }: ListingCardProps) {
  const isAr = lang === 'ar';
  const prefix = isAr ? '' : '/en';
  const href = `${prefix}/${isAr ? 'عقارات' : 'properties'}/${listing.slug?.current}`;

  const title = isAr ? listing.title_ar : listing.title_en;
  const neighborhood = isAr ? listing.neighborhood.name_ar : listing.neighborhood.name_en;

  const statusColors = {
    available: 'bg-green-500 text-white',
    under_offer: 'bg-amber-500 text-white',
    sold: 'bg-red-500 text-white',
    rented: 'bg-gray-500 text-white',
  };

  const purposeColors = {
    sale: 'bg-navy text-white',
    rent: 'bg-cyan-light text-navy',
  };

  const statusText = dictionary.listings?.status?.[listing.status] || listing.status;
  const purposeText = dictionary.listings?.purpose?.[listing.purpose] || listing.purpose;

  return (
    <Link href={href} className="block group">
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col h-full border border-gray-100">
        <div className="relative aspect-[4/3] bg-gradient-to-br from-navy to-cyan-dark overflow-hidden">
          {listing.coverImage ? (
            <img
              src={listing.coverImage}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center opacity-30">
              <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity pointer-events-none" />

          {/* Badges */}
          <div className="absolute top-3 start-3 flex flex-col gap-2">
            <span className={`px-2 py-1 text-xs font-bold rounded-md ${purposeColors[listing.purpose]}`}>
              {purposeText}
            </span>
            <span className={`px-2 py-1 text-xs font-bold rounded-md ${statusColors[listing.status]}`}>
              {statusText}
            </span>
          </div>
        </div>

        <div className="p-4 flex flex-col flex-grow">
          <div className="mb-2">
            {listing.priceOnRequest ? (
              <span className="text-xl font-bold text-navy">{dictionary.listings?.priceOnRequest || 'Price on Request'}</span>
            ) : (
              <span className="text-xl font-bold text-navy ltr-num flex items-baseline gap-1">
                {formatPrice(listing.price)}
                {listing.rentPeriod && <span className="text-sm font-normal text-muted">/ {dictionary.listings?.[listing.rentPeriod] || listing.rentPeriod}</span>}
              </span>
            )}
          </div>

          <h3 className="font-display font-bold text-lg text-navy mb-1 line-clamp-2 group-hover:text-blue transition-colors">
            {title}
          </h3>

          <p className="text-sm text-muted mb-4 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {neighborhood}
          </p>

          <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between text-sm text-navy">
            <div className="flex gap-4">
              {listing.bedrooms !== undefined && (
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-cyan-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span className="ltr-num">{listing.bedrooms}</span>
                </span>
              )}
              {listing.bathrooms !== undefined && (
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-cyan-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  <span className="ltr-num">{listing.bathrooms}</span>
                </span>
              )}
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4 text-cyan-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
                <span className="ltr-num flex items-center gap-1">
                  {formatArea(listing.size_m2)} <span className="text-xs">m²</span>
                </span>
              </span>
            </div>
            
            <span className="text-xs text-muted">
              {listing.referenceCode}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

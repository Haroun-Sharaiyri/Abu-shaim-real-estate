import React from 'react';
import { getDictionary } from '@/lib/i18n/dictionaries';
import type { Locale } from '@/lib/i18n/config';
import { getMergedListings } from '@/lib/sanity';
import { notFound } from 'next/navigation';
import { formatPrice, formatArea } from '@/lib/utils';
import { Metadata } from 'next';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: Promise<{ lang: string, slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params;
  const locale = (lang === 'en' ? 'en' : 'ar') as Locale;
  const listings = await getMergedListings();
  const listing = listings.find(l => l.slug.current === slug);

  if (!listing) return { title: 'Not Found' };

  const title = locale === 'ar' ? listing.title_ar : listing.title_en;
  const description = locale === 'ar' ? listing.description_ar : listing.description_en;

  return {
    title: `${title} | Abu Shahm Real Estate`,
    description: description.substring(0, 160),
    alternates: {
      languages: {
        'ar': `/عقارات/${slug}`,
        'en': `/en/properties/${slug}`,
      },
    },
  };
}

export default async function ListingDetailPage({ params }: { params: Promise<{ lang: string, slug: string }> }) {
  const { lang, slug } = await params;
  const locale = (lang === 'en' ? 'en' : 'ar') as Locale;
  const dict = await getDictionary(locale);
  const isAr = locale === 'ar';
  
  const listings = await getMergedListings();
  const listing = listings.find(l => l.slug.current === slug);

  if (!listing) {
    notFound();
  }

  const title = isAr ? listing.title_ar : listing.title_en;
  const description = isAr ? listing.description_ar : listing.description_en;
  const neighborhood = isAr ? listing.neighborhood.name_ar : listing.neighborhood.name_en;

  const waMessage = `مرحباً، أستفسر عن العقار رقم ${listing.referenceCode} – ${title}`;
  const waUrl = `https://wa.me/971589234011?text=${encodeURIComponent(waMessage)}`;
  const shareUrl = `https://wa.me/?text=${encodeURIComponent(`${title} - ${listing.referenceCode}\nhttps://abushahm.com/${isAr ? '' : 'en/'}${isAr ? 'عقارات' : 'properties'}/${slug}`)}`;

  const similarListings = listings.filter(l => l.type === listing.type && l.referenceCode !== listing.referenceCode).slice(0, 3);

  // Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: title,
    description: description,
    url: `https://abushahm.com/${isAr ? '' : 'en/'}${isAr ? 'عقارات' : 'properties'}/${slug}`,
    offers: {
      '@type': 'Offer',
      price: listing.price,
      priceCurrency: 'JOD',
      availability: listing.status === 'available' ? 'https://schema.org/InStock' : 'https://schema.org/SoldOut'
    }
  };

  return (
    <div className="bg-ground min-h-screen pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Property Showcase & Gallery */}
      <div className="w-full max-w-7xl mx-auto px-4 pt-6 mb-8">
        <div className="w-full aspect-[16/9] md:aspect-[21/9] bg-navy rounded-2xl relative overflow-hidden shadow-xl">
          {listing.coverImage ? (
            <img
              src={listing.coverImage}
              alt={isAr ? listing.title_ar : listing.title_en}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-r from-navy to-cyan-dark text-white/50">
              <svg className="w-16 h-16 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{isAr ? 'لا توجد صورة' : 'No image available'}</span>
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-transparent to-black/30 pointer-events-none" />

          {/* Badges */}
          <div className="absolute top-4 start-4 flex gap-2 z-10">
             <span className="px-3 py-1.5 bg-navy text-white text-sm font-bold rounded-lg shadow-md">
               {listing.purpose === 'sale' ? dict.listing?.forSale : dict.listing?.forRent}
             </span>
             <span className={`px-3 py-1.5 text-white text-sm font-bold rounded-lg shadow-md ${listing.status === 'available' ? 'bg-green-600' : 'bg-amber-600'}`}>
               {listing.status}
             </span>
          </div>
        </div>

        {/* Gallery Thumbnails */}
        {listing.gallery && listing.gallery.length > 1 && (
          <div className="grid grid-cols-3 md:grid-cols-4 gap-3 mt-4">
            {listing.gallery.map((imgUrl, idx) => (
              <div key={idx} className="aspect-[4/3] rounded-xl overflow-hidden shadow-sm border border-gray-200">
                <img
                  src={imgUrl}
                  alt={`${isAr ? listing.title_ar : listing.title_en} - ${idx + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Main Content */}
          <div className="w-full lg:w-2/3 space-y-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="mb-2">
                <span className="inline-block px-2 py-1 bg-gray-100 text-muted text-xs font-medium rounded-md mb-3">
                  {dict.listing?.referenceCode || 'Ref'}: {listing.referenceCode}
                </span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-display font-bold text-navy mb-4 leading-tight">
                {title}
              </h1>
              
              <p className="text-muted flex items-center gap-2 mb-6 text-lg">
                <svg className="w-5 h-5 text-cyan-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {neighborhood}
              </p>

              <div className="text-3xl font-bold text-navy mb-8">
                {listing.priceOnRequest ? (
                  <span>{dict.listing?.priceOnRequest || 'Price on Request'}</span>
                ) : (
                  <span className="ltr-num flex items-baseline gap-2">
                    {formatPrice(listing.price)} 
                    {listing.rentPeriod && <span className="text-xl font-normal text-muted">/ {dict.listing?.[listing.rentPeriod] || listing.rentPeriod}</span>}
                  </span>
                )}
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                {listing.bedrooms !== undefined && (
                  <div className="bg-gray-50 rounded-xl p-4 flex flex-col items-center justify-center text-center gap-2 border border-gray-100">
                    <svg className="w-6 h-6 text-cyan-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span className="text-xl font-bold text-navy ltr-num">{listing.bedrooms}</span>
                    <span className="text-xs text-muted">{dict.listing?.bedrooms || 'Bedrooms'}</span>
                  </div>
                )}
                {listing.bathrooms !== undefined && (
                  <div className="bg-gray-50 rounded-xl p-4 flex flex-col items-center justify-center text-center gap-2 border border-gray-100">
                    <svg className="w-6 h-6 text-cyan-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    <span className="text-xl font-bold text-navy ltr-num">{listing.bathrooms}</span>
                    <span className="text-xs text-muted">{dict.listing?.bathrooms || 'Bathrooms'}</span>
                  </div>
                )}
                <div className="bg-gray-50 rounded-xl p-4 flex flex-col items-center justify-center text-center gap-2 border border-gray-100">
                  <svg className="w-6 h-6 text-cyan-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                  <span className="text-xl font-bold text-navy ltr-num">
                    {formatArea(listing.size_m2)}
                  </span>
                  <span className="text-xs text-muted">{dict.listing?.area || 'Area (m²)'}</span>
                </div>
                {listing.floor !== undefined && (
                  <div className="bg-gray-50 rounded-xl p-4 flex flex-col items-center justify-center text-center gap-2 border border-gray-100">
                    <svg className="w-6 h-6 text-cyan-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span className="text-xl font-bold text-navy ltr-num">{listing.floor}</span>
                    <span className="text-xs text-muted">{dict.listing?.floor || 'Floor'}</span>
                  </div>
                )}
              </div>

              {/* Cyan Divider with Diamond Motif */}
              <div className="flex items-center justify-center py-6">
                <div className="h-px bg-cyan-light/50 flex-grow"></div>
                <div className="w-3 h-3 bg-cyan-dark transform rotate-45 mx-4"></div>
                <div className="h-px bg-cyan-light/50 flex-grow"></div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-2xl font-display font-bold text-navy mb-4">{dict.listing?.description || 'Description'}</h2>
                <div className="prose prose-lg text-gray-700 max-w-none leading-relaxed">
                  <p>{description}</p>
                </div>
              </div>

              {/* Features */}
              {listing.features && listing.features.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-display font-bold text-navy mb-4">{dict.listing?.features || 'Features & Amenities'}</h2>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {listing.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-gray-700">
                        <div className="w-2 h-2 bg-cyan-dark transform rotate-45 mt-2 flex-shrink-0"></div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Map Placeholder */}
              <div>
                <h2 className="text-2xl font-display font-bold text-navy mb-4">{dict.listing?.location || 'Location'}</h2>
                <div className="w-full aspect-[16/9] md:aspect-[21/9] bg-gray-100 rounded-xl flex items-center justify-center border border-gray-200">
                   <div className="text-muted flex flex-col items-center">
                     <svg className="w-10 h-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                     </svg>
                     <span>Map Area ({listing.location.lat}, {listing.location.lng})</span>
                   </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-1/3">
            <div className="sticky top-24 space-y-6">
              
              {/* Contact Card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="text-center mb-6">
                  {listing.priceOnRequest ? (
                    <div className="text-2xl font-bold text-navy">{dict.listing?.priceOnRequest || 'Price on Request'}</div>
                  ) : (
                    <div className="text-3xl font-bold text-navy ltr-num">
                      {formatPrice(listing.price)} 
                      {listing.rentPeriod && <span className="text-lg font-normal text-muted">/ {dict.listing?.[listing.rentPeriod] || listing.rentPeriod}</span>}
                    </div>
                  )}
                  <p className="text-muted text-sm mt-1">{dict.listing?.referenceCode || 'Ref'}: {listing.referenceCode}</p>
                </div>

                <div className="space-y-3">
                  <a 
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-xl font-bold transition-colors min-h-[44px]"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    {dict.listing?.whatsapp || 'WhatsApp Us'}
                  </a>
                  
                  <a 
                    href="tel:+971589234011"
                    className="flex items-center justify-center gap-2 w-full bg-navy hover:bg-blue text-white py-3 px-4 rounded-xl font-bold transition-colors min-h-[44px]"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="ltr-num">+971 58 923 4011</span>
                  </a>

                  <a 
                    href={shareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-gray-100 hover:bg-gray-200 text-navy py-3 px-4 rounded-xl font-medium transition-colors mt-4 min-h-[44px]"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    {dict.listing?.share || 'Share Property'}
                  </a>
                </div>
              </div>

              {/* Agent/Office Info */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="w-16 h-16 bg-cyan-light rounded-full flex items-center justify-center flex-shrink-0 text-navy">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-navy text-lg">Abu Shahm Real Estate</h3>
                  <p className="text-muted text-sm">أبو شهم للعقارات</p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Similar Listings */}
        {similarListings.length > 0 && (
          <div className="mt-16 pt-12 border-t border-gray-200">
            <h2 className="text-3xl font-display font-bold text-navy mb-8 text-center">{dict.listing?.similar || 'Similar Properties'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similarListings.map(sl => (
                <Link key={sl.referenceCode} href={`/${lang === 'ar' ? '' : 'en/'}${isAr ? 'عقارات' : 'properties'}/${sl.slug.current}`} className="block group">
                  <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col h-full border border-gray-100">
                    <div className="aspect-[4/3] bg-gradient-to-br from-navy to-cyan-dark relative">
                       {/* Placeholder */}
                       <div className="absolute inset-0 flex items-center justify-center opacity-30">
                         <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                         </svg>
                       </div>
                    </div>
                    <div className="p-4 flex-grow flex flex-col">
                      <div className="text-lg font-bold text-navy mb-1 ltr-num">{formatPrice(sl.price)}</div>
                      <h3 className="font-display font-medium text-navy line-clamp-1 group-hover:text-blue transition-colors">
                        {isAr ? sl.title_ar : sl.title_en}
                      </h3>
                      <p className="text-sm text-muted mt-auto pt-2">{isAr ? sl.neighborhood.name_ar : sl.neighborhood.name_en}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

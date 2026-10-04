'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SampleListing } from '@/lib/sample-listings';
import ListingCard from './ListingCard';
import Link from 'next/link';

interface FilterableListingsProps {
  lang: 'ar' | 'en';
  dictionary: any;
  initialListings: SampleListing[];
}

export default function FilterableListings({ lang, dictionary, initialListings }: FilterableListingsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [listings, setListings] = useState(initialListings);

  const currentPurpose = searchParams.get('purpose') || 'all';
  const currentType = searchParams.get('type') || 'all';
  const currentNeighborhood = searchParams.get('neighborhood') || 'all';
  const currentMinPrice = searchParams.get('minPrice') || '';
  const currentMaxPrice = searchParams.get('maxPrice') || '';
  const currentBeds = searchParams.get('beds') || 'all';
  const currentSort = searchParams.get('sort') || 'newest';

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'all' || value === '') {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    let filtered = [...initialListings];

    if (currentPurpose !== 'all') {
      filtered = filtered.filter(l => l.purpose === currentPurpose);
    }
    if (currentType !== 'all') {
      filtered = filtered.filter(l => l.type === currentType);
    }
    if (currentNeighborhood !== 'all') {
      filtered = filtered.filter(l => l.neighborhood.slug.current === currentNeighborhood);
    }
    if (currentMinPrice) {
      filtered = filtered.filter(l => l.price >= Number(currentMinPrice));
    }
    if (currentMaxPrice) {
      filtered = filtered.filter(l => l.price <= Number(currentMaxPrice));
    }
    if (currentBeds !== 'all') {
      const beds = Number(currentBeds);
      filtered = filtered.filter(l => l.bedrooms !== undefined && l.bedrooms >= beds);
    }

    filtered.sort((a, b) => {
      switch (currentSort) {
        case 'price_asc': return a.price - b.price;
        case 'price_desc': return b.price - a.price;
        case 'size_asc': return a.size_m2 - b.size_m2;
        case 'size_desc': return b.size_m2 - a.size_m2;
        case 'newest':
        default:
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      }
    });

    setListings(filtered);
  }, [searchParams, initialListings, currentPurpose, currentType, currentNeighborhood, currentMinPrice, currentMaxPrice, currentBeds, currentSort]);

  const clearFilters = () => {
    router.push('?', { scroll: false });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-1/4 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-display font-bold text-lg text-navy">{dictionary.listings?.filters || 'Filters'}</h2>
              <button onClick={clearFilters} className="text-sm text-cyan-dark hover:text-navy underline">
                {dictionary.listings?.clearFilters || 'Clear All'}
              </button>
            </div>

            <div className="space-y-6">
              {/* Purpose */}
              <div>
                <label className="block text-sm font-medium text-navy mb-2">{dictionary.listings?.purposeLabel || 'Purpose'}</label>
                <div className="flex gap-2">
                  {['all', 'sale', 'rent'].map(p => (
                    <button
                      key={p}
                      onClick={() => updateFilters('purpose', p)}
                      className={`flex-1 py-2 px-3 text-sm rounded-md transition-colors ${currentPurpose === p ? 'bg-navy text-white' : 'bg-gray-100 text-navy hover:bg-gray-200'}`}
                    >
                      {dictionary.listings?.purpose?.[p] || p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-navy mb-2">{dictionary.listings?.typeLabel || 'Property Type'}</label>
                <select
                  value={currentType}
                  onChange={(e) => updateFilters('type', e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-md py-2 px-3 text-sm focus:ring-2 focus:ring-cyan-light outline-none"
                >
                  <option value="all">{dictionary.listings?.allTypes || 'All Types'}</option>
                  <option value="apartment">{dictionary.listings?.types?.apartment || 'Apartment'}</option>
                  <option value="villa">{dictionary.listings?.types?.villa || 'Villa'}</option>
                  <option value="land">{dictionary.listings?.types?.land || 'Land'}</option>
                  <option value="commercial">{dictionary.listings?.types?.commercial || 'Commercial'}</option>
                  <option value="office">{dictionary.listings?.types?.office || 'Office'}</option>
                  <option value="shop">{dictionary.listings?.types?.shop || 'Shop'}</option>
                </select>
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-navy mb-2">{dictionary.listings?.priceLabel || 'Price Range'}</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder={dictionary.listings?.min || 'Min'}
                    value={currentMinPrice}
                    onChange={(e) => updateFilters('minPrice', e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-md py-2 px-3 text-sm ltr-num outline-none focus:ring-2 focus:ring-cyan-light"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    placeholder={dictionary.listings?.max || 'Max'}
                    value={currentMaxPrice}
                    onChange={(e) => updateFilters('maxPrice', e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-md py-2 px-3 text-sm ltr-num outline-none focus:ring-2 focus:ring-cyan-light"
                  />
                </div>
              </div>

              {/* Bedrooms */}
              <div>
                <label className="block text-sm font-medium text-navy mb-2">{dictionary.listings?.bedsLabel || 'Bedrooms'}</label>
                <div className="flex flex-wrap gap-2">
                  {['all', '1', '2', '3', '4', '5'].map(b => (
                    <button
                      key={b}
                      onClick={() => updateFilters('beds', b)}
                      className={`min-w-[40px] py-1 px-3 text-sm rounded-md transition-colors ${currentBeds === b ? 'bg-navy text-white' : 'bg-gray-100 text-navy hover:bg-gray-200'} ${b !== 'all' ? 'ltr-num' : ''}`}
                    >
                      {b === 'all' ? (dictionary.listings?.any || 'Any') : b === '5' ? '5+' : b}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="w-full lg:w-3/4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h1 className="text-2xl font-display font-bold text-navy">
              {dictionary.listings?.resultsCount?.replace('{count}', listings.length.toString()) || `${listings.length} Results Found`}
            </h1>

            <div className="flex items-center gap-2">
              <label className="text-sm text-navy">{dictionary.listings?.sortBy || 'Sort by:'}</label>
              <select
                value={currentSort}
                onChange={(e) => updateFilters('sort', e.target.value)}
                className="bg-white border border-gray-200 rounded-md py-1.5 px-3 text-sm focus:ring-2 focus:ring-cyan-light outline-none"
              >
                <option value="newest">{dictionary.listings?.sort?.newest || 'Newest'}</option>
                <option value="price_asc">{dictionary.listings?.sort?.priceAsc || 'Price (Low to High)'}</option>
                <option value="price_desc">{dictionary.listings?.sort?.priceDesc || 'Price (High to Low)'}</option>
                <option value="size_desc">{dictionary.listings?.sort?.sizeDesc || 'Size (Largest first)'}</option>
              </select>
            </div>
          </div>

          {listings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map(listing => (
                <ListingCard key={listing.referenceCode} listing={listing} lang={lang} dictionary={dictionary} />
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 text-center rounded-xl border border-gray-100 flex flex-col items-center justify-center">
              <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <h3 className="text-xl font-bold text-navy mb-2">{dictionary.listings?.noResults || 'No Properties Found'}</h3>
              <p className="text-muted mb-6">{dictionary.listings?.tryAdjustingFilters || 'Try adjusting your filters or search criteria.'}</p>
              <Link href={`/${lang === 'ar' ? '' : 'en'}`} className="bg-cyan-dark hover:bg-navy text-white px-6 py-2 rounded-md transition-colors font-medium">
                {dictionary.listings?.requestProperty || 'Request a Property'}
              </Link>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

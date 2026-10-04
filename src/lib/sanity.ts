import { createClient } from 'next-sanity';
import createImageUrlBuilder from '@sanity/image-url';
import type { SampleListing } from '@/lib/sample-listings';

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '6b2mwhej';
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
export const apiVersion = '2024-01-01';

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Ensure newly published content in Studio appears immediately
});

const builder = createImageUrlBuilder({ projectId, dataset });

export function urlFor(source: any) {
  if (!source) return '';
  if (typeof source === 'string') return source;
  try {
    return builder.image(source).auto('format').fit('max').url();
  } catch {
    return '';
  }
}

export interface SanityNeighborhood {
  _id: string;
  name_ar: string;
  name_en?: string;
  slug: { current: string };
  description_ar?: string;
  description_en?: string;
  coverImage?: any;
}

export interface SanityListing {
  _id: string;
  referenceCode: string;
  title_ar: string;
  title_en?: string;
  slug: { current: string };
  status: 'available' | 'under_offer' | 'sold' | 'rented';
  purpose: 'sale' | 'rent';
  type: string;
  neighborhood?: SanityNeighborhood;
  price?: number;
  priceOnRequest?: boolean;
  rentPeriod?: 'monthly' | 'yearly';
  size_m2?: number;
  bedrooms?: number;
  bathrooms?: number;
  floor?: number;
  featured?: boolean;
  coverImage?: any;
  gallery?: any[];
  description_ar?: any;
  description_en?: any;
  publishedAt?: string;
}

// Queries
export async function getSanityNeighborhoods(): Promise<SanityNeighborhood[]> {
  try {
    const query = `*[_type == "neighborhood"] | order(name_ar asc) {
      _id,
      name_ar,
      name_en,
      slug,
      description_ar,
      description_en,
      coverImage
    }`;
    const result = await client.fetch<SanityNeighborhood[]>(query);
    return result || [];
  } catch (error) {
    console.error('Error fetching neighborhoods from Sanity:', error);
    return [];
  }
}

export async function getSanityNeighborhoodBySlug(slug: string): Promise<SanityNeighborhood | null> {
  try {
    const query = `*[_type == "neighborhood" && (slug.current == $slug || _id == $slug)][0] {
      _id,
      name_ar,
      name_en,
      slug,
      description_ar,
      description_en,
      coverImage
    }`;
    const result = await client.fetch<SanityNeighborhood | null>(query, { slug });
    return result;
  } catch (error) {
    console.error('Error fetching neighborhood by slug from Sanity:', error);
    return null;
  }
}

export async function getSanityListings(): Promise<SanityListing[]> {
  try {
    const query = `*[_type == "listing"] | order(publishedAt desc) {
      _id,
      referenceCode,
      title_ar,
      title_en,
      slug,
      status,
      purpose,
      type,
      price,
      priceOnRequest,
      rentPeriod,
      size_m2,
      bedrooms,
      bathrooms,
      floor,
      featured,
      coverImage,
      gallery,
      description_ar,
      description_en,
      publishedAt,
      neighborhood->{
        _id,
        name_ar,
        name_en,
        slug
      }
    }`;
    const result = await client.fetch<SanityListing[]>(query);
    return result || [];
  } catch (error) {
    console.error('Error fetching listings from Sanity:', error);
    return [];
  }
}

export async function getSanityListingBySlug(slug: string): Promise<SanityListing | null> {
  try {
    const query = `*[_type == "listing" && slug.current == $slug][0] {
      _id,
      referenceCode,
      title_ar,
      title_en,
      slug,
      status,
      purpose,
      type,
      price,
      priceOnRequest,
      rentPeriod,
      size_m2,
      bedrooms,
      bathrooms,
      floor,
      featured,
      coverImage,
      gallery,
      description_ar,
      description_en,
      publishedAt,
      neighborhood->{
        _id,
        name_ar,
        name_en,
        slug
      }
    }`;
    const result = await client.fetch<SanityListing | null>(query, { slug });
    return result;
  } catch (error) {
    console.error('Error fetching listing by slug from Sanity:', error);
    return null;
  }
}

export function blocksToText(blocks: any): string {
  if (!blocks) return '';
  if (typeof blocks === 'string') return blocks;
  if (Array.isArray(blocks)) {
    return blocks
      .map((block) => {
        if (block._type !== 'block' || !block.children) {
          return '';
        }
        return block.children.map((child: any) => child.text).join('');
      })
      .join('\n\n');
  }
  return '';
}

export async function getMergedListings(): Promise<SampleListing[]> {
  const sanityListings = await getSanityListings();

  return sanityListings.map((l) => ({
    referenceCode: l.referenceCode || `AS-${l._id.slice(0, 4)}`,
    title_ar: l.title_ar,
    title_en: l.title_en || l.title_ar,
    slug: l.slug || { current: l._id },
    status: l.status || 'available',
    purpose: l.purpose || 'sale',
    type: (l.type as any) || 'apartment',
    neighborhood: {
      name_ar: l.neighborhood?.name_ar || 'إربد',
      name_en: l.neighborhood?.name_en || 'Irbid',
      slug: l.neighborhood?.slug || { current: 'irbid' },
    },
    price: l.price || 0,
    priceOnRequest: !!l.priceOnRequest,
    rentPeriod: l.rentPeriod,
    size_m2: l.size_m2 || 0,
    bedrooms: l.bedrooms,
    bathrooms: l.bathrooms,
    floor: l.floor,
    furnished: false,
    features: [],
    description_ar: blocksToText(l.description_ar),
    description_en: blocksToText(l.description_en),
    coverImage: l.coverImage ? urlFor(l.coverImage) : null,
    gallery: Array.isArray(l.gallery) ? l.gallery.map(urlFor).filter(Boolean) : [],
    location: { lat: 32.5568, lng: 35.8469 },
    approximateLocation: true,
    featured: !!l.featured,
    sample: false,
    publishedAt: l.publishedAt || new Date().toISOString(),
  }));
}

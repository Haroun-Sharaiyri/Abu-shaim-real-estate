// import { client } from '@/sanity/lib/client'

export interface GoogleReview {
  authorName: string
  rating: number
  relativePublishTimeDescription: string
  text: string
  profilePhotoUrl?: string
  publishTime: string
}

export interface GoogleReviewsData {
  rating: number
  totalReviews: number
  reviews: GoogleReview[]
}

/**
 * Fetch Google Reviews using Places API (New)
 * Cached and revalidated every 24 hours
 */
export async function getGoogleReviews(): Promise<GoogleReviewsData | null> {
  try {
    // Get Place ID from Sanity settings
    /*
    const settings = await client.fetch<{ googlePlaceId?: string }>(
      `*[_type == "siteSettings"][0]{ googlePlaceId }`
    )
    const placeId = settings?.googlePlaceId
    */
    const placeId = undefined;
    const apiKey = process.env.GOOGLE_PLACES_API_KEY
    
    if (!placeId || !apiKey) {
      return null
    }

    const response = await fetch(
      `https://places.googleapis.com/v1/places/${placeId}?fields=rating,userRatingCount,reviews&key=${apiKey}`,
      {
        headers: {
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask': 'rating,userRatingCount,reviews',
        },
        next: { revalidate: 86400 }, // 24 hours
      }
    )

    if (!response.ok) {
      console.error('Google Places API error:', response.status)
      return null
    }

    const data = await response.json()
    
    if (!data.rating || !data.reviews || data.reviews.length < 3) {
      return null
    }

    return {
      rating: data.rating,
      totalReviews: data.userRatingCount || 0,
      reviews: data.reviews.slice(0, 5).map((review: any) => ({
        authorName: review.authorAttribution?.displayName || 'مستخدم Google',
        rating: review.rating,
        relativePublishTimeDescription: review.relativePublishTimeDescription || '',
        text: review.text?.text || '',
        profilePhotoUrl: review.authorAttribution?.photoUri,
        publishTime: review.publishTime || '',
      })),
    }
  } catch (error) {
    console.error('Failed to fetch Google reviews:', error)
    return null
  }
}

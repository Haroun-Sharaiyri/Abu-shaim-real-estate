import { redirect } from 'next/navigation';

export default function ReviewPage() {
  // Redirect to Google review URL
  // The Place ID should come from Sanity siteSettings,
  // but we use a direct redirect here for simplicity
  const placeId = process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID || 'PLACEHOLDER';
  redirect(`https://search.google.com/local/writereview?placeid=${placeId}`);
}

import { type ClassValue, clsx } from 'clsx'

// Simple cn utility without tailwind-merge (not needed with Tailwind v4)
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

/**
 * Format price in JOD with Arabic/English formatting
 */
export function formatPrice(price: number, locale: 'ar' | 'en' = 'ar'): string {
  const formatted = new Intl.NumberFormat(locale === 'ar' ? 'ar-JO' : 'en-JO', {
    maximumFractionDigits: 0,
  }).format(price)
  
  return locale === 'ar' ? `${formatted} د.أ` : `${formatted} JOD`
}

/**
 * Format area in m² or dunum
 */
export function formatArea(value: number, unit: 'sqm' | 'dunum' = 'sqm', locale: 'ar' | 'en' = 'ar'): string {
  const formatted = new Intl.NumberFormat(locale === 'ar' ? 'ar-JO' : 'en-JO', {
    maximumFractionDigits: 0,
  }).format(value)
  
  if (unit === 'dunum') {
    return locale === 'ar' ? `${formatted} دونم` : `${formatted} dunum`
  }
  return `${formatted} m²`
}

/**
 * Validate phone number (Jordan, UAE, and international)
 */
export function validatePhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-()]/g, '')
  // Jordan: 07XXXXXXXX or +9627XXXXXXXX
  // UAE: 05XXXXXXXX or +9715XXXXXXXX  
  // International: +XXXXXXXXXXXX (8-15 digits)
  const patterns = [
    /^07[789]\d{7}$/,           // Jordan mobile
    /^\+9627[789]\d{7}$/,       // Jordan mobile international
    /^05[0-9]\d{7}$/,           // UAE mobile
    /^\+9715[0-9]\d{7}$/,       // UAE mobile international
    /^\+\d{8,15}$/,             // Other international
  ]
  return patterns.some((p) => p.test(cleaned))
}

/**
 * Generate WhatsApp URL with prefilled message
 */
export function getWhatsAppUrl(
  phone: string,
  message?: string
): string {
  const base = `https://wa.me/${phone}`
  if (message) {
    return `${base}?text=${encodeURIComponent(message)}`
  }
  return base
}

/**
 * Generate WhatsApp message for listing inquiry
 */
export function getListingWhatsAppMessage(
  referenceCode: string,
  title: string
): string {
  return `مرحباً، أستفسر عن العقار رقم ${referenceCode} – ${title}`
}

/**
 * Get WhatsApp share URL for a listing
 */
export function getWhatsAppShareUrl(url: string, title: string): string {
  const message = `${title}\n${url}`
  return `https://wa.me/?text=${encodeURIComponent(message)}`
}

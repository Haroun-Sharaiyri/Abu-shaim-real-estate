import { Alexandria, Readex_Pro } from 'next/font/google';

export const alexandria = Alexandria({
  subsets: ['arabic', 'latin'],
  weight: ['700', '800'],
  variable: '--font-display',
  display: 'swap',
  fallback: ['sans-serif'],
});

export const readexPro = Readex_Pro({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
  fallback: ['sans-serif'],
});

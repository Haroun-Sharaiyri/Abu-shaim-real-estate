import type { Metadata } from 'next';
import { alexandria, readexPro } from '@/lib/fonts';
import { localeDirection, routes } from '@/lib/i18n/config';
import type { Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';
import TopBar from '@/components/layout/TopBar';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MobileActionBar from '@/components/layout/MobileActionBar';
import WhatsAppButton from '@/components/shared/WhatsAppButton';
import CookieConsent from '@/components/shared/CookieConsent';
import '@/app/globals.css';

export async function generateStaticParams() {
  return [{ lang: 'ar' }, { lang: 'en' }];
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://abu-shahm.vercel.app'),
  icons: {
    icon: [
      { url: '/icon.png', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/apple-icon.png', type: 'image/png' },
    ],
  },
};

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = (lang === 'en' ? 'en' : 'ar') as Locale;
  const dir = localeDirection[locale];
  const dict = await getDictionary(locale);
  const localRoutes = routes[locale];

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${alexandria.variable} ${readexPro.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-ground text-navy font-body" suppressHydrationWarning>
        <TopBar
          lang={locale}
          hours={dict.topBar.hours}
          languageLabel={dict.common.language}
        />
        <Navbar
          lang={locale}
          dictionary={dict.nav}
          routes={localRoutes}
        />

        <div className="flex-1">
          {children}
        </div>

        <Footer lang={locale} dictionary={dict} />

        <MobileActionBar
          callLabel={dict.mobileBar.call}
          whatsappLabel={dict.mobileBar.whatsapp}
          phoneTel="+971589234011"
          whatsappNumber="971589234011"
        />

        <WhatsAppButton whatsappNumber="971589234011" />

        <CookieConsent dictionary={dict.cookie} />

        {/* Mobile action bar spacer */}
        <div className="h-14 md:hidden" aria-hidden="true" />
      </body>
    </html>
  );
}

import Link from 'next/link';
import { LogoFull } from '@/components/shared/Logo';

interface FooterProps {
  lang: string;
  dictionary: any;
}

export default function Footer({ lang, dictionary }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-navy text-white font-body">
      <div className="container mx-auto px-4 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1 */}
          <div className="flex flex-col gap-4">
            <LogoFull variant="light" lang={lang} className="h-10" />
            <p className="text-sm text-white/85 leading-relaxed">
              {dictionary.footerDescription || 'Abu Shahm Real Estate - Your trusted partner in property.'}
            </p>
          </div>

          {/* Col 2 */}
          <div className="flex flex-col gap-4">
            <h3 className="font-display font-bold text-cyan-dark text-lg">{dictionary.quickLinks || 'Quick Links'}</h3>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li><Link href={`/${lang}`} className="text-white/80 hover:text-cyan-dark transition-colors inline-flex min-h-[24px] items-center">{dictionary.nav?.home || 'Home'}</Link></li>
              <li><Link href={`/${lang}/properties`} className="text-white/80 hover:text-cyan-dark transition-colors inline-flex min-h-[24px] items-center">{dictionary.nav?.properties || 'Properties'}</Link></li>
              <li><Link href={`/${lang}/neighborhoods`} className="text-white/80 hover:text-cyan-dark transition-colors inline-flex min-h-[24px] items-center">{dictionary.nav?.neighborhoods || 'Neighborhoods'}</Link></li>
              <li><Link href={`/${lang}/about`} className="text-white/80 hover:text-cyan-dark transition-colors inline-flex min-h-[24px] items-center">{dictionary.nav?.about || 'About'}</Link></li>
              <li><Link href={`/${lang}/contact`} className="text-white/80 hover:text-cyan-dark transition-colors inline-flex min-h-[24px] items-center">{dictionary.nav?.contact || 'Contact'}</Link></li>
              <li><Link href={`/${lang}/privacy`} className="text-white/80 hover:text-cyan-dark transition-colors inline-flex min-h-[24px] items-center">{dictionary.nav?.privacy || 'Privacy Policy'}</Link></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="flex flex-col gap-4">
            <h3 className="font-display font-bold text-cyan-dark text-lg">{dictionary.contactUs || 'Contact Us'}</h3>
            <ul className="flex flex-col gap-3 text-sm">
              <li>
                <a href="tel:+971589234011" className="flex items-center gap-2 text-white/85 hover:text-cyan-dark transition-colors min-h-[24px]">
                  <span className="ltr-num" dir="ltr">058 923 4011</span>
                </a>
              </li>
              <li>
                <a href="https://wa.me/971589234011" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white/85 hover:text-cyan-dark transition-colors min-h-[24px]">
                  WhatsApp
                </a>
              </li>
              <li>
                <a href="mailto:info@abushahm.com" className="flex items-center gap-2 text-white/85 hover:text-cyan-dark transition-colors min-h-[24px]">
                  info@abushahm.com
                </a>
              </li>
              <li className="text-white/80 min-h-[24px] flex items-center">
                {dictionary.officeHours || 'Mon - Sat: 9:00 AM - 6:00 PM'}
              </li>
            </ul>
          </div>

          {/* Col 4 */}
          <div className="flex flex-col gap-4">
            <h3 className="font-display font-bold text-cyan-dark text-lg">{dictionary.listProperty || 'List Your Property'}</h3>
            <p className="text-sm text-white/85 leading-relaxed">
              {dictionary.listPropertyText || 'Ready to sell or rent your property? Contact us today.'}
            </p>
            <Link 
              href={`/${lang}/contact`} 
              className="inline-flex items-center justify-center min-h-[44px] px-6 mt-2 bg-cyan-dark text-navy font-display font-bold rounded hover:bg-cyan-light transition-colors self-start shadow-sm"
            >
              {dictionary.nav?.listProperty || 'List Your Property'}
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-white/15 text-center text-sm text-white/70 flex flex-col items-center justify-center gap-2">
          {/* Subtle diamond link to Admin Portal */}
          <a
            href={process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || 'http://localhost:3333'}
            target="_blank"
            rel="noopener noreferrer"
            title={lang === 'ar' ? 'لوحة التحكم (Admin Portal)' : 'Admin Portal'}
            className="w-2.5 h-2.5 rotate-45 bg-cyan-dark/40 hover:bg-cyan-light hover:scale-125 transition-all mb-1 cursor-pointer block"
            aria-label="Admin Portal"
          />
          <div className="flex items-center justify-center gap-2">
            <p>© {currentYear} {lang === 'ar' ? 'أبو شهم للعقارات' : 'Abu Shahm Real Estate'}</p>
            {/* Barely visible lock icon */}
            <a
              href={process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || 'http://localhost:3333'}
              target="_blank"
              rel="noopener noreferrer"
              title={lang === 'ar' ? 'لوحة التحكم (Admin Portal)' : 'Admin Portal'}
              className="text-white/40 hover:text-cyan-light transition-colors opacity-20 hover:opacity-100 inline-flex items-center p-1"
              aria-label="Admin Portal"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

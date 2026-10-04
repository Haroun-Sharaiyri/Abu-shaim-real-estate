import { getDictionary } from '@/lib/i18n/dictionaries';
import { type Locale } from '@/lib/i18n/config';
import { Metadata } from 'next';
import ContactForm from '@/components/forms/ContactForm';

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const locale = (lang === 'en' ? 'en' : 'ar') as Locale;
  const dict = await getDictionary(locale);

  return {
    title: dict.meta?.contactTitle || 'Contact Us - Abu Shahm',
    alternates: {
      languages: {
        'ar': '/ar/تواصل',
        'en': '/en/contact',
      },
    },
  };
}

export default async function ContactPage({ params }: Props) {
  const { lang } = await params;
  const locale = (lang === 'en' ? 'en' : 'ar') as Locale;
  const dict = await getDictionary(locale);

  return (
    <main className="min-h-screen bg-ground pb-16">
      <section className="relative py-20 px-4 mb-8 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/85 to-navy/70" />
        <div className="relative z-10 container mx-auto max-w-6xl text-center">
          <h1 className="font-display text-3xl md:text-5xl font-bold !text-white mb-4 drop-shadow-lg">
            {locale === 'ar' ? 'تواصل معنا' : 'Contact Us'}
          </h1>
          <div className="flex justify-center items-center gap-4 text-cyan-dark">
            <div className="h-0.5 w-16 bg-cyan-dark"></div>
            <div className="w-3 h-3 rotate-45 bg-cyan-dark"></div>
            <div className="h-0.5 w-16 bg-cyan-dark"></div>
          </div>
        </div>
      </section>

      <section className="container mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Left: Contact Info */}
          <div className="flex flex-col gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-cyan-dark">
              <h3 className="font-display text-xl font-bold text-navy mb-4">
                {locale === 'ar' ? 'معلومات الاتصال' : 'Contact Information'}
              </h3>
              <ul className="space-y-4 font-body text-muted">
                <li className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-cyan-light/20 flex items-center justify-center text-cyan-dark font-bold">
                    📞
                  </span>
                  <div>
                    <p className="text-sm">{locale === 'ar' ? 'الهاتف' : 'Phone'}</p>
                    <a href="tel:+971589234011" dir="ltr" className="ltr-num text-navy font-bold hover:text-cyan-dark transition-colors min-h-[44px] flex items-center">
                      +971 58 923 4011
                    </a>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold">
                    💬
                  </span>
                  <div>
                    <p className="text-sm">{locale === 'ar' ? 'واتساب' : 'WhatsApp'}</p>
                    <a href="https://wa.me/971589234011" target="_blank" rel="noopener noreferrer" dir="ltr" className="ltr-num text-navy font-bold hover:text-green-600 transition-colors min-h-[44px] flex items-center">
                      +971 58 923 4011
                    </a>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-blue/10 flex items-center justify-center text-blue font-bold">
                    ✉️
                  </span>
                  <div>
                    <p className="text-sm">{locale === 'ar' ? 'البريد الإلكتروني' : 'Email'}</p>
                    <a href="mailto:info@abushahm.com" className="text-navy font-bold hover:text-blue transition-colors min-h-[44px] flex items-center">
                      info@abushahm.com
                    </a>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold">
                    🕒
                  </span>
                  <div>
                    <p className="text-sm">{locale === 'ar' ? 'ساعات العمل' : 'Working Hours'}</p>
                    <p className="text-navy font-bold">
                      {locale === 'ar' ? 'السبت - الخميس: 9 صباحاً - 6 مساءً' : 'Sat - Thu: 9 AM - 6 PM'}
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Right: Contact Form */}
          <ContactForm locale={locale} />
        </div>

        {/* Map */}
        <div className="bg-white p-2 rounded-xl shadow-md h-96">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d107384.44473872223!2d35.78912956108153!3d32.55248589975765!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151c76916dac0453%3A0x5416e113d81f7d82!2sIrbid%2C%20Jordan!5e0!3m2!1sen!2sae!4v1700000000000!5m2!1sen!2sae"
            width="100%"
            height="100%"
            style={{ border: 0, borderRadius: '0.5rem' }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Google Maps - Irbid"
          ></iframe>
        </div>
      </section>
    </main>
  );
}

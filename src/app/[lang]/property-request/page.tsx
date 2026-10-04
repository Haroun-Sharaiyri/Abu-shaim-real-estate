import { getDictionary } from '@/lib/i18n/dictionaries';
import { type Locale } from '@/lib/i18n/config';
import { Metadata } from 'next';
import PropertyRequestForm from '@/components/forms/PropertyRequestForm';
import { getSanityNeighborhoods } from '@/lib/sanity';
import { NEIGHBORHOODS } from '@/lib/constants';

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const locale = (lang === 'en' ? 'en' : 'ar') as Locale;
  const dict = await getDictionary(locale);

  return {
    title: dict.meta?.requestPropertyTitle || 'Request a Property - Abu Shahm',
    alternates: {
      languages: {
        'ar': '/ar/اطلب-عقار',
        'en': '/en/property-request',
      },
    },
  };
}

export default async function RequestPropertyPage({ params }: Props) {
  const { lang } = await params;
  const locale = (lang === 'en' ? 'en' : 'ar') as Locale;
  const dict = await getDictionary(locale);

  const sanityNeighborhoods = await getSanityNeighborhoods();
  const neighborhoodOptions = sanityNeighborhoods.length > 0
    ? sanityNeighborhoods.map((n) => ({
        value: n.slug?.current || n._id,
        ar: n.name_ar,
        en: n.name_en || n.name_ar,
      }))
    : NEIGHBORHOODS.map((n) => ({
        value: n.value,
        ar: n.ar,
        en: n.en,
      }));

  return (
    <main className="min-h-screen bg-ground pb-16">
      <section className="relative py-20 px-4 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/85 to-navy/70" />
        <div className="relative z-10 container mx-auto max-w-3xl text-center">
          <h1 className="font-display text-3xl md:text-5xl font-bold !text-white mb-4 drop-shadow-lg">
            {locale === 'ar' ? 'اطلب عقارك' : 'Request a Property'}
          </h1>
          <p className="!text-white/95 text-lg mb-6 drop-shadow-sm font-medium">
            {locale === 'ar' ? 'أخبرنا بمواصفات العقار الذي تبحث عنه وسنقوم بإيجاده لك.' : 'Tell us what kind of property you are looking for and we will find it for you.'}
          </p>
          <div className="flex justify-center items-center gap-4 text-cyan-dark">
            <div className="h-0.5 w-16 bg-cyan-dark"></div>
            <div className="w-3 h-3 rotate-45 bg-cyan-dark"></div>
            <div className="h-0.5 w-16 bg-cyan-dark"></div>
          </div>
        </div>
      </section>

      <section className="container mx-auto max-w-3xl px-4 -mt-8 relative z-10 mb-8">
        <PropertyRequestForm locale={locale} neighborhoods={neighborhoodOptions} />
      </section>

      <section className="container mx-auto max-w-3xl px-4 text-center">
        <p className="text-muted mb-4 font-body">
          {locale === 'ar' ? 'أو تواصل معنا عبر واتساب لاستجابة أسرع' : 'Or contact us via WhatsApp for a faster response'}
        </p>
        <a 
          href="https://wa.me/971589234011" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold py-3 px-8 rounded-lg hover:bg-green-600 transition-colors min-h-[44px]"
        >
          <span dir="ltr" className="ltr-num">+971 58 923 4011</span>
          <span>WhatsApp</span>
        </a>
      </section>
    </main>
  );
}

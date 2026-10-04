import { getDictionary } from '@/lib/i18n/dictionaries';
import { type Locale } from '@/lib/i18n/config';
import { Metadata } from 'next';
import Link from 'next/link';

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const locale = (lang === 'en' ? 'en' : 'ar') as Locale;
  const dict = await getDictionary(locale);

  return {
    title: dict.meta?.aboutTitle || 'About Us - Abu Shahm Real Estate',
    alternates: {
      languages: {
        'ar': '/ar/عن-المكتب',
        'en': '/en/about',
      },
    },
  };
}

export default async function AboutPage({ params }: Props) {
  const { lang } = await params;
  const locale = (lang === 'en' ? 'en' : 'ar') as Locale;
  const dict = await getDictionary(locale);

  return (
    <main className="min-h-screen bg-ground pb-16">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/85 to-navy/70" />
        <div className="relative z-10 container mx-auto max-w-4xl text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold !text-white mb-6 drop-shadow-lg">
            {dict.about?.title || 'عن المكتب'}
          </h1>
          <div className="flex justify-center items-center gap-4 text-cyan-dark">
            <div className="h-0.5 w-16 bg-cyan-dark"></div>
            <div className="w-3 h-3 rotate-45 bg-cyan-dark"></div>
            <div className="h-0.5 w-16 bg-cyan-dark"></div>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="container mx-auto max-w-4xl px-4 -mt-8 relative z-10">
        <div className="bg-white rounded-xl p-8 md:p-12 shadow-lg mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-3 h-3 rotate-45 bg-navy flex-shrink-0"></div>
            <h2 className="font-display text-2xl font-bold text-navy">
              {dict.about?.approach?.title || 'نهجنا'}
            </h2>
          </div>
          <p className="font-body text-muted leading-relaxed text-lg">
            {locale === 'ar' 
              ? 'نحن نتبع نهجاً يركز على العميل في كل ما نقوم به. نؤمن بأن كل عميل لديه احتياجات فريدة، ولذلك نقدم حلولاً مخصصة تلبي تلك الاحتياجات بدقة واحترافية.'
              : 'We take a client-centric approach in everything we do. We believe every client has unique needs, and therefore we provide tailored solutions to meet those needs with precision and professionalism.'}
          </p>
        </div>

        <div className="bg-white rounded-xl p-8 md:p-12 shadow-lg mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-3 h-3 rotate-45 bg-cyan-dark flex-shrink-0"></div>
            <h2 className="font-display text-2xl font-bold text-navy">
              {dict.about?.localKnowledge?.title || 'المعرفة المحلية'}
            </h2>
          </div>
          <p className="font-body text-muted leading-relaxed text-lg">
            {locale === 'ar'
              ? 'بفضل خبرتنا العميقة في سوق إربد، نقدم لعملائنا رؤى استراتيجية مبنية على معرفة دقيقة بالمنطقة، مما يضمن اتخاذ قرارات عقارية مدروسة وناجحة.'
              : 'With our deep expertise in the Irbid market, we provide our clients with strategic insights based on accurate knowledge of the area, ensuring well-informed and successful real estate decisions.'}
          </p>
        </div>

        <div className="bg-white rounded-xl p-8 md:p-12 shadow-lg mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-3 h-3 rotate-45 bg-blue flex-shrink-0"></div>
            <h2 className="font-display text-2xl font-bold text-navy">
              {dict.about?.transparency?.title || 'الشفافية'}
            </h2>
          </div>
          <p className="font-body text-muted leading-relaxed text-lg">
            {locale === 'ar'
              ? 'الشفافية هي أساس عملنا. نحن نلتزم بتقديم معلومات دقيقة وواضحة لعملائنا في كل خطوة، مما يبني ثقة طويلة الأمد.'
              : 'Transparency is the foundation of our work. We are committed to providing accurate and clear information to our clients at every step, building long-term trust.'}
          </p>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link 
            href={`/${locale}/${locale === 'ar' ? 'تواصل' : 'contact'}`}
            className="inline-flex items-center justify-center bg-navy text-white font-bold py-3 px-8 rounded-lg hover:bg-cyan-dark transition-colors min-h-[44px]"
          >
            {locale === 'ar' ? 'تواصل معنا' : 'Contact Us'}
          </Link>
        </div>
      </section>
    </main>
  );
}

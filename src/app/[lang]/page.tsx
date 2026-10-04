import type { Metadata } from 'next';
import Link from 'next/link';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { routes, type Locale } from '@/lib/i18n/config';
import { getMergedListings, getSanityNeighborhoods, urlFor } from '@/lib/sanity';
import ListingCard from '@/components/listings/ListingCard';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale = (lang === 'en' ? 'en' : 'ar') as Locale;
  const dict = await getDictionary(locale);

  return {
    title: dict.meta.homeTitle,
    description: dict.meta.siteDescription,
    alternates: {
      canonical: locale === 'ar' ? '/' : '/en',
      languages: {
        ar: '/',
        en: '/en',
      },
    },
    openGraph: {
      title: dict.meta.homeTitle,
      description: dict.meta.siteDescription,
      locale: locale === 'ar' ? 'ar_JO' : 'en_US',
      type: 'website',
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = (lang === 'en' ? 'en' : 'ar') as Locale;
  const dict = await getDictionary(locale);
  const localRoutes = routes[locale];
  const listings = await getMergedListings();
  const featured = listings.filter((l) => l.featured);
  const featuredListings = (featured.length > 0 ? featured : listings).slice(0, 3);
  const sanityNeighborhoods = await getSanityNeighborhoods();

  return (
    <main>
      {/* Hero Section with Landscape Architecture View */}
      <section className="relative min-h-[78vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 transition-transform duration-1000"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2070&q=85')`,
          }}
        />
        {/* High-contrast brand overlay: Navy gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/80 to-navy/60" />
        <div className="absolute inset-0 bg-navy/20 backdrop-blur-[0.5px]" />
        
        {/* Geometric accent */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#3CCDE8_1px,transparent_1px)] [background-size:24px_24px]" />

        <div className="relative z-10 text-center px-6 py-24 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-white text-sm font-semibold mb-6 border border-white/20 shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-dark shadow-[0_0_8px_#3CCDE8] animate-pulse" />
            <span className="text-cyan-dark font-medium">{locale === 'ar' ? 'مكتب عقاري معتمد في إربد' : 'Trusted Real Estate in Irbid'}</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold !text-white leading-tight mb-4 drop-shadow-lg">
            {dict.hero.headline}
          </h1>
          <p className="text-lg md:text-xl !text-white/95 font-body mb-8 max-w-2xl mx-auto drop-shadow-sm font-medium">
            {dict.hero.subheadline}
          </p>

          {/* Search Bar */}
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 md:p-6 shadow-2xl max-w-3xl mx-auto border border-white/20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <select
                className="col-span-1 border border-gray-200 rounded-lg px-3 py-3 text-sm bg-ground text-navy font-body focus:outline-none focus:ring-2 focus:ring-cyan-light"
                aria-label={dict.search.purpose}
              >
                <option value="">{dict.search.purpose}</option>
                <option value="sale">{dict.search.sale}</option>
                <option value="rent">{dict.search.rent}</option>
              </select>
              <select
                className="col-span-1 border border-gray-200 rounded-lg px-3 py-3 text-sm bg-ground text-navy font-body focus:outline-none focus:ring-2 focus:ring-cyan-light"
                aria-label={dict.search.type}
              >
                <option value="">{dict.search.type}</option>
                <option value="apartment">{dict.search.apartment}</option>
                <option value="villa">{dict.search.villa}</option>
                <option value="land">{dict.search.land}</option>
                <option value="commercial">{dict.search.commercial}</option>
                <option value="office">{dict.search.office}</option>
                <option value="shop">{dict.search.shop}</option>
              </select>
              <select
                className="col-span-1 border border-gray-200 rounded-lg px-3 py-3 text-sm bg-ground text-navy font-body focus:outline-none focus:ring-2 focus:ring-cyan-light"
                aria-label={dict.search.neighborhood}
              >
                <option value="">{dict.search.allNeighborhoods}</option>
                {sanityNeighborhoods.map((n) => (
                  <option key={n._id} value={n.slug?.current || n._id}>
                    {locale === 'ar' ? n.name_ar : (n.name_en || n.name_ar)}
                  </option>
                ))}
              </select>
              <Link
                href={`/${locale === 'ar' ? '' : 'en/'}${localRoutes.listings || (locale === 'ar' ? 'عقارات' : 'properties')}`}
                className="col-span-1 md:col-span-1 flex items-center justify-center bg-cyan-light hover:bg-cyan-dark text-white font-body font-semibold rounded-lg px-4 py-3 text-sm transition-colors min-h-[44px] shadow-sm hover:shadow"
              >
                {dict.search.searchButton}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties Section - Only shown when Sanity has listings */}
      {featuredListings.length > 0 && (
        <section className="py-16 md:py-20 px-6 bg-ground">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <div className="inline-flex items-center gap-2 text-cyan-light font-display font-semibold text-sm mb-2">
                  <span className="diamond-sm" style={{ backgroundColor: '#14B4D2' }} />
                  <span>{locale === 'ar' ? 'فرص عقارية مختارة' : 'Handpicked Opportunities'}</span>
                </div>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-navy">
                  {locale === 'ar' ? 'عقارات مميزة في إربد' : 'Featured Properties in Irbid'}
                </h2>
              </div>
              <Link
                href={`/${locale === 'ar' ? '' : 'en/'}${localRoutes.listings || (locale === 'ar' ? 'عقارات' : 'properties')}`}
                className="inline-flex items-center gap-2 font-display font-semibold text-blue hover:text-navy transition-colors group text-sm md:text-base self-start md:self-auto"
              >
                <span>{locale === 'ar' ? 'عرض جميع العقارات' : 'View All Properties'}</span>
                <svg className="w-4 h-4 rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredListings.map((listing) => (
                <ListingCard
                  key={listing.referenceCode}
                  listing={listing}
                  lang={locale}
                  dictionary={dict}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Services Section */}
      <section className="py-16 md:py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-navy mb-3">
              {dict.home.services.title}
            </h2>
            <div className="flex items-center justify-center gap-3 mt-2">
              <span className="cyan-rule w-12" />
              <span className="diamond" />
              <span className="cyan-rule w-12" />
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              dict.home.services.sale,
              dict.home.services.rent,
              dict.home.services.land,
            ].map((service, i) => (
              <div
                key={i}
                className="bg-ground rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="diamond" />
                  <h3 className="font-display text-xl font-bold text-navy">
                    {service.title}
                  </h3>
                </div>
                <p className="text-muted leading-relaxed text-sm">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How We Work Section */}
      <section className="py-16 md:py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-navy mb-3">
              {dict.home.howWeWork.title}
            </h2>
            <div className="flex items-center justify-center gap-3 mt-2">
              <span className="cyan-rule w-12" />
              <span className="diamond" />
              <span className="cyan-rule w-12" />
            </div>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              dict.home.howWeWork.step1,
              dict.home.howWeWork.step2,
              dict.home.howWeWork.step3,
              dict.home.howWeWork.step4,
            ].map((step, i) => (
              <div key={i} className="text-center group">
                <div className="w-14 h-14 rounded-full bg-navy flex items-center justify-center mx-auto mb-4 group-hover:bg-blue transition-colors">
                  <span className="text-white font-display font-bold text-lg">
                    {i + 1}
                  </span>
                </div>
                <h3 className="font-display text-lg font-bold text-navy mb-2">
                  {step.title}
                </h3>
                <p className="text-muted text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seller CTA Section with Photo Background */}
      <section className="relative py-20 md:py-24 px-6 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/90 to-navy/80" />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold !text-white mb-4 drop-shadow-md">
            {dict.home.sellerCta.title}
          </h2>
          <p className="!text-white/90 text-lg mb-8 max-w-xl mx-auto leading-relaxed">
            {dict.home.sellerCta.description}
          </p>
          <Link
            href={`/${locale === 'ar' ? '' : 'en/'}${localRoutes['list-your-property'] || (locale === 'ar' ? 'اعرض-عقارك' : 'list-your-property')}`}
            className="inline-flex items-center gap-2 bg-cyan-light hover:bg-cyan-dark text-white font-body font-semibold rounded-lg px-8 py-4 text-lg transition-colors min-h-[44px] shadow-lg hover:shadow-xl"
          >
            {dict.home.sellerCta.button}
            <svg className="w-5 h-5 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-16 md:py-20 px-6 bg-ground">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-navy mb-3">
            {dict.home.reviews.title}
          </h2>
          <div className="flex items-center justify-center gap-3 mt-2 mb-8">
            <span className="cyan-rule w-12" />
            <span className="diamond" />
            <span className="cyan-rule w-12" />
          </div>
          <div className="bg-white rounded-2xl p-8 md:p-10 shadow-sm border border-gray-100 max-w-lg mx-auto">
            <div className="flex justify-center items-center gap-1 text-amber-400 mb-4">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
            </div>
            <p className="text-navy font-display font-medium text-lg mb-6">{dict.home.reviews.leaveReview}</p>
            <a
              href="/review"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-navy hover:bg-blue text-white font-body font-semibold rounded-lg px-6 py-3 transition-colors min-h-[44px] shadow-sm hover:shadow"
            >
              <svg className="w-5 h-5 text-amber-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              {dict.home.reviews.leaveReview}
            </a>
          </div>
        </div>
      </section>

      {/* Neighborhoods Section with Visual Imagery */}
      <section className="py-16 md:py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-navy mb-3">
              {dict.home.neighborhoods.title}
            </h2>
            <p className="text-muted max-w-xl mx-auto text-base">
              {dict.home.neighborhoods.description}
            </p>
            <div className="flex items-center justify-center gap-3 mt-3">
              <span className="cyan-rule w-12" />
              <span className="diamond" />
              <span className="cyan-rule w-12" />
            </div>
          </div>
          
          {sanityNeighborhoods.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {sanityNeighborhoods.map((n) => (
                <Link
                  key={n._id}
                  href={`/${locale === 'ar' ? '' : 'en/'}${localRoutes.neighborhoods || (locale === 'ar' ? 'احياء' : 'neighborhoods')}/${n.slug?.current || n._id}`}
                  className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 aspect-[4/3] flex flex-col justify-end p-4 border border-gray-100"
                >
                  <img
                    src={n.coverImage ? urlFor(n.coverImage) : 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80'}
                    alt={locale === 'ar' ? n.name_ar : (n.name_en || n.name_ar)}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/40 to-transparent group-hover:from-navy/95 transition-colors" />
                  <div className="relative z-10 text-center">
                    <h3 className="font-display text-base md:text-lg font-bold !text-white mb-0.5 drop-shadow-md">
                      {locale === 'ar' ? n.name_ar : (n.name_en || n.name_ar)}
                    </h3>
                    <span className="text-xs !text-cyan-dark font-body font-semibold inline-block group-hover:underline drop-shadow-sm">
                      {locale === 'ar' ? 'استكشف الحي' : 'Explore Area'}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-ground p-8 text-center rounded-2xl border border-gray-100 max-w-lg mx-auto">
              <p className="text-navy font-display text-base font-bold mb-1">
                {locale === 'ar' ? 'لا توجد أحياء مضافة حالياً' : 'No neighborhoods added yet'}
              </p>
              <p className="text-muted text-xs">
                {locale === 'ar' ? 'أضف الأحياء في لوحة تحكم Sanity Studio لتظهر هنا فوراً.' : 'Add neighborhoods in Sanity Studio to see them here.'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Contact Strip */}
      <section className="py-12 px-6 bg-navy">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-start">
          <div>
            <h2 className="font-display text-2xl font-bold !text-white mb-1 drop-shadow-sm">
              {dict.contact.title}
            </h2>
            <p className="!text-white/80 text-sm">{dict.contact.address}</p>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="tel:+971589234011"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white rounded-lg px-6 py-3 transition-colors min-h-[44px]"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="ltr-num">058 923 4011</span>
            </a>
            <a
              href="https://wa.me/971589234011"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-lg px-6 py-3 transition-colors min-h-[44px]"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              {dict.mobileBar.whatsapp}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

import { getDictionary } from '@/lib/i18n/dictionaries';
import { type Locale } from '@/lib/i18n/config';
import { Metadata } from 'next';

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const locale = (lang === 'en' ? 'en' : 'ar') as Locale;
  // Fallback title in case no dict entry
  return {
    title: locale === 'ar' ? 'سياسة الخصوصية - عقارات أبو شهم' : 'Privacy Policy - Abu Shahm Real Estate',
    alternates: {
      languages: {
        'ar': '/ar/سياسة-الخصوصية',
        'en': '/en/privacy',
      },
    },
  };
}

export default async function PrivacyPage({ params }: Props) {
  const { lang } = await params;
  const locale = (lang === 'en' ? 'en' : 'ar') as Locale;

  return (
    <main className="min-h-screen bg-ground pb-16">
      <section className="bg-navy text-white py-12 px-4 mb-8">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="font-display text-3xl md:text-5xl font-bold !text-white mb-4 drop-shadow-md">
            {locale === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}
          </h1>
          <div className="flex justify-center items-center gap-4 text-cyan-dark">
            <div className="h-0.5 w-16 bg-cyan-dark"></div>
            <div className="w-3 h-3 rotate-45 bg-cyan-dark"></div>
            <div className="h-0.5 w-16 bg-cyan-dark"></div>
          </div>
        </div>
      </section>

      <section className="container mx-auto max-w-4xl px-4">
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 font-body text-muted space-y-6 leading-relaxed">
          {locale === 'ar' ? (
            <>
              <p>
                تحترم شركة أبو شهم للعقارات خصوصيتك وتلتزم بحماية بياناتك الشخصية. توضح سياسة الخصوصية هذه كيفية جمعنا لمعلوماتك الشخصية واستخدامها وحمايتها عند زيارتك لموقعنا الإلكتروني أو استخدامك لخدماتنا.
              </p>
              
              <h2 className="font-display text-2xl font-bold text-navy mt-8 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rotate-45 bg-cyan-dark inline-block"></span>
                البيانات التي نجمعها
              </h2>
              <p>
                نقوم بجمع المعلومات الشخصية التي تقدمها لنا طواعية عند ملء نماذج التواصل، أو طلب عرض عقار، أو طلب البحث عن عقار. قد تشمل هذه المعلومات:
              </p>
              <ul className="list-disc list-inside ps-4 space-y-2">
                <li>الاسم الكامل</li>
                <li>رقم الهاتف</li>
                <li>البريد الإلكتروني</li>
                <li>معلومات العقار والتفضيلات</li>
              </ul>

              <h2 className="font-display text-2xl font-bold text-navy mt-8 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rotate-45 bg-cyan-dark inline-block"></span>
                كيفية استخدام بياناتك
              </h2>
              <p>
                نستخدم المعلومات التي نجمعها للأغراض التالية:
              </p>
              <ul className="list-disc list-inside ps-4 space-y-2">
                <li>الرد على استفساراتك وتقديم الخدمات المطلوبة</li>
                <li>تسهيل عمليات بيع، وشراء، وتأجير العقارات</li>
                <li>تحسين جودة خدماتنا وتجربة المستخدم على الموقع</li>
                <li>التواصل معك بخصوص العروض العقارية التي قد تهمك (إذا وافقت على ذلك)</li>
              </ul>

              <h2 className="font-display text-2xl font-bold text-navy mt-8 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rotate-45 bg-cyan-dark inline-block"></span>
                ملفات تعريف الارتباط (الكوكيز)
              </h2>
              <p>
                نستخدم ملفات تعريف الارتباط لتحسين تجربتك على موقعنا، وتحليل حركة الزيارات. يمكنك تعطيل ملفات تعريف الارتباط من خلال إعدادات المتصفح الخاص بك، ولكن قد يؤثر ذلك على بعض وظائف الموقع.
              </p>

              <h2 className="font-display text-2xl font-bold text-navy mt-8 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rotate-45 bg-cyan-dark inline-block"></span>
                مشاركة البيانات وحمايتها
              </h2>
              <p>
                نحن لا نبيع أو نؤجر معلوماتك الشخصية لأطراف ثالثة. نتخذ الإجراءات الأمنية المناسبة لحماية بياناتك من الوصول غير المصرح به أو التعديل أو الإفصاح أو الإتلاف.
              </p>

              <h2 className="font-display text-2xl font-bold text-navy mt-8 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rotate-45 bg-cyan-dark inline-block"></span>
                تواصل معنا
              </h2>
              <p>
                إذا كان لديك أي أسئلة حول سياسة الخصوصية هذه، يرجى التواصل معنا عبر البريد الإلكتروني <a href="mailto:info@abushahm.com" className="text-cyan-dark font-bold hover:underline">info@abushahm.com</a> أو عبر الهاتف.
              </p>
            </>
          ) : (
            <>
              <p>
                Abu Shahm Real Estate respects your privacy and is committed to protecting your personal data. This privacy policy explains how we collect, use, and protect your personal information when you visit our website or use our services.
              </p>

              <h2 className="font-display text-2xl font-bold text-navy mt-8 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rotate-45 bg-cyan-dark inline-block"></span>
                Data We Collect
              </h2>
              <p>
                We collect personal information that you voluntarily provide to us when filling out contact forms, property listing requests, or property search requests. This information may include:
              </p>
              <ul className="list-disc list-inside ps-4 space-y-2">
                <li>Full Name</li>
                <li>Phone Number</li>
                <li>Email Address</li>
                <li>Property information and preferences</li>
              </ul>

              <h2 className="font-display text-2xl font-bold text-navy mt-8 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rotate-45 bg-cyan-dark inline-block"></span>
                How We Use Your Data
              </h2>
              <p>
                We use the information we collect for the following purposes:
              </p>
              <ul className="list-disc list-inside ps-4 space-y-2">
                <li>Responding to your inquiries and providing requested services</li>
                <li>Facilitating the buying, selling, and renting of properties</li>
                <li>Improving the quality of our services and user experience on the site</li>
                <li>Contacting you regarding real estate offers that may interest you (if you opt-in)</li>
              </ul>

              <h2 className="font-display text-2xl font-bold text-navy mt-8 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rotate-45 bg-cyan-dark inline-block"></span>
                Cookies
              </h2>
              <p>
                We use cookies to enhance your experience on our website and analyze traffic. You can disable cookies through your browser settings, but this may affect some functionality of the site.
              </p>

              <h2 className="font-display text-2xl font-bold text-navy mt-8 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rotate-45 bg-cyan-dark inline-block"></span>
                Data Sharing and Protection
              </h2>
              <p>
                We do not sell or rent your personal information to third parties. We take appropriate security measures to protect your data from unauthorized access, alteration, disclosure, or destruction.
              </p>

              <h2 className="font-display text-2xl font-bold text-navy mt-8 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rotate-45 bg-cyan-dark inline-block"></span>
                Contact Us
              </h2>
              <p>
                If you have any questions about this privacy policy, please contact us at <a href="mailto:info@abushahm.com" className="text-cyan-dark font-bold hover:underline">info@abushahm.com</a> or via phone.
              </p>
            </>
          )}
        </div>
      </section>
    </main>
  );
}

'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-ground flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl p-8 md:p-16 max-w-2xl w-full text-center border-t-4 border-navy">
        {/* Diamond Accent */}
        <div className="flex justify-center items-center gap-4 text-cyan-dark mb-8">
          <div className="h-px w-16 bg-cyan-dark"></div>
          <div className="w-4 h-4 rotate-45 bg-navy"></div>
          <div className="h-px w-16 bg-cyan-dark"></div>
        </div>

        <h1 className="font-display text-6xl md:text-8xl font-bold text-navy mb-4">404</h1>
        
        <h2 className="font-display text-2xl md:text-3xl font-bold text-navy mb-6">
          الصفحة غير موجودة / Page Not Found
        </h2>

        <p className="font-body text-muted text-lg mb-8">
          عذراً، لم نتمكن من العثور على الصفحة التي تبحث عنها. 
          <br className="hidden md:block" />
          Sorry, we couldn't find the page you're looking for.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <Link 
            href="/ar/عقارات" 
            className="w-full sm:w-auto bg-navy text-white font-bold py-3 px-8 rounded-lg hover:bg-cyan-dark transition-colors min-h-[44px] flex items-center justify-center"
          >
            تصفح العقارات / Browse Properties
          </Link>
          <Link 
            href="/" 
            className="w-full sm:w-auto bg-ground text-navy border border-navy font-bold py-3 px-8 rounded-lg hover:bg-navy hover:text-white transition-colors min-h-[44px] flex items-center justify-center"
          >
            الرئيسية / Go Home
          </Link>
        </div>

        <div className="pt-8 border-t border-gray-100">
          <p className="text-muted mb-4 font-body text-sm">
            بحاجة للمساعدة؟ / Need help?
          </p>
          <a 
            href="https://wa.me/971589234011" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 text-[#25D366] hover:text-green-700 font-bold transition-colors min-h-[44px]"
          >
            <span dir="ltr" className="ltr-num">+971 58 923 4011</span>
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </main>
  );
}

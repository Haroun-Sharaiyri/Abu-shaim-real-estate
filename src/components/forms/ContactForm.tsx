'use client';

import { useState } from 'react';
import { type Locale } from '@/lib/i18n/config';
import { CONTACT } from '@/lib/constants';

interface ContactFormProps {
  locale: Locale;
}

export default function ContactForm({ locale }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  });
  const [submittedUrl, setSubmittedUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const isAr = locale === 'ar';
    const lines = [
      isAr ? '👋 *رسالة جديدة من موقع أبو شهم للعقارات*' : '👋 *New Message from Abu Shahm Real Estate Website*',
      '',
      isAr ? `👤 *الاسم:* ${formData.name}` : `👤 *Name:* ${formData.name}`,
      isAr ? `📱 *الهاتف:* ${formData.phone}` : `📱 *Phone:* ${formData.phone}`,
    ];

    if (formData.email.trim()) {
      lines.push(isAr ? `✉️ *البريد الإلكتروني:* ${formData.email}` : `✉️ *Email:* ${formData.email}`);
    }

    lines.push(
      '',
      isAr ? '💬 *نص الرسالة:*' : '💬 *Message:*',
      formData.message
    );

    const messageText = lines.join('\n');
    const waUrl = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(messageText)}`;

    // Send copy to API in background (non-blocking)
    try {
      fetch('/api/form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formType: 'contact',
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          message: formData.message,
        }),
      }).catch((err) => console.error('Background form log error:', err));
    } catch (err) {
      // Ignore background errors
    }

    setSubmittedUrl(waUrl);
    setIsSubmitting(false);

    // Open WhatsApp in new tab / app
    if (typeof window !== 'undefined') {
      window.open(waUrl, '_blank');
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-navy">
      <h3 className="font-display text-xl font-bold text-navy mb-6">
        {locale === 'ar' ? 'أرسل لنا رسالة' : 'Send us a message'}
      </h3>

      {submittedUrl ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center space-y-4">
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-2xl">
            💬
          </div>
          <h4 className="text-lg font-bold text-navy">
            {locale === 'ar' ? 'تم تجهيز رسالتك!' : 'Your message is ready!'}
          </h4>
          <p className="text-muted text-sm">
            {locale === 'ar'
              ? 'تم فتح تطبيق واتساب لإرسال رسالتك مباشرة إلى هاتفنا.'
              : 'WhatsApp has been opened to send your message directly to our phone.'}
          </p>
          <a
            href={submittedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold py-3 px-6 rounded-lg hover:bg-green-600 transition-colors shadow-sm"
          >
            <span>💬</span>
            <span>{locale === 'ar' ? 'انقر هنا إذا لم يفتح واتساب' : 'Click here if WhatsApp did not open'}</span>
          </a>
          <div>
            <button
              type="button"
              onClick={() => {
                setSubmittedUrl(null);
                setFormData({ name: '', phone: '', email: '', message: '' });
              }}
              className="text-sm text-cyan-dark hover:underline mt-2 inline-block"
            >
              {locale === 'ar' ? 'إرسال رسالة أخرى' : 'Send another message'}
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-navy mb-1">
              {locale === 'ar' ? 'الاسم الكامل' : 'Full Name'} *
            </label>
            <input
              type="text"
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-dark focus:border-cyan-dark outline-none min-h-[44px]"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-navy mb-1">
              {locale === 'ar' ? 'رقم الهاتف' : 'Phone Number'} *
            </label>
            <input
              type="tel"
              id="phone"
              required
              dir="ltr"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-dark focus:border-cyan-dark outline-none min-h-[44px] text-start"
              placeholder="+971 5X XXX XXXX / +962 7X XXX XXXX"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-navy mb-1">
              {locale === 'ar' ? 'البريد الإلكتروني (اختياري)' : 'Email (Optional)'}
            </label>
            <input
              type="email"
              id="email"
              dir="ltr"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-dark focus:border-cyan-dark outline-none min-h-[44px] text-start"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-navy mb-1">
              {locale === 'ar' ? 'الرسالة' : 'Message'} *
            </label>
            <textarea
              id="message"
              required
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-dark focus:border-cyan-dark outline-none resize-none"
            ></textarea>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold py-3 px-4 rounded-md hover:bg-green-600 transition-colors min-h-[44px] shadow-sm disabled:opacity-70"
          >
            <span>💬</span>
            <span>
              {isSubmitting
                ? (locale === 'ar' ? 'جارٍ التحضير...' : 'Preparing...')
                : (locale === 'ar' ? 'إرسال عبر واتساب' : 'Send via WhatsApp')}
            </span>
          </button>
        </form>
      )}
    </div>
  );
}

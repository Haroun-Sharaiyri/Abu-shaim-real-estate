'use client';

import { useState } from 'react';
import { type Locale } from '@/lib/i18n/config';
import { CONTACT } from '@/lib/constants';

interface NeighborhoodOption {
  value: string;
  ar: string;
  en: string;
}

interface PropertyRequestFormProps {
  locale: Locale;
  neighborhoods: NeighborhoodOption[];
}

export default function PropertyRequestForm({ locale, neighborhoods }: PropertyRequestFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    purpose: 'buy',
    propertyType: '',
    neighborhood: '',
    rooms: '',
    budget: '',
    timeline: 'immediately',
    notes: '',
  });

  const [submittedUrl, setSubmittedUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAr = locale === 'ar';

  const propertyTypeLabels: Record<string, { ar: string; en: string }> = {
    apartment: { ar: 'شقة', en: 'Apartment' },
    villa: { ar: 'فيلا', en: 'Villa' },
    land: { ar: 'أرض', en: 'Land' },
    commercial: { ar: 'تجاري', en: 'Commercial' },
  };

  const purposeLabels: Record<string, { ar: string; en: string }> = {
    buy: { ar: 'شراء', en: 'Buy' },
    rent: { ar: 'استئجار', en: 'Rent' },
  };

  const timelineLabels: Record<string, { ar: string; en: string }> = {
    immediately: { ar: 'فوراً', en: 'Immediately' },
    within_month: { ar: 'خلال شهر', en: 'Within a month' },
    within_3_months: { ar: 'خلال 3 أشهر', en: 'Within 3 months' },
    no_rush: { ar: 'لست في عجلة', en: 'No rush' },
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const typeText = propertyTypeLabels[formData.propertyType]
      ? (isAr ? propertyTypeLabels[formData.propertyType].ar : propertyTypeLabels[formData.propertyType].en)
      : formData.propertyType;

    const purposeText = purposeLabels[formData.purpose]
      ? (isAr ? purposeLabels[formData.purpose].ar : purposeLabels[formData.purpose].en)
      : formData.purpose;

    const timelineText = timelineLabels[formData.timeline]
      ? (isAr ? timelineLabels[formData.timeline].ar : timelineLabels[formData.timeline].en)
      : formData.timeline;

    const lines = [
      isAr ? '🔍 *طلب عقار جديد - موقع أبو شهم*' : '🔍 *New Property Search Request - Abu Shahm*',
      '',
      isAr ? `👤 *الاسم:* ${formData.name}` : `👤 *Name:* ${formData.name}`,
      isAr ? `📱 *الهاتف:* ${formData.phone}` : `📱 *Phone:* ${formData.phone}`,
      isAr ? `🎯 *الغاية:* ${purposeText}` : `🎯 *Purpose:* ${purposeText}`,
      isAr ? `🏢 *نوع العقار المطلوب:* ${typeText}` : `🏢 *Required Property Type:* ${typeText}`,
    ];

    if (formData.neighborhood.trim()) {
      lines.push(
        isAr ? `📍 *المنطقة المفضلة:* ${formData.neighborhood}` : `📍 *Preferred Neighborhood:* ${formData.neighborhood}`
      );
    }

    if (formData.rooms.trim()) {
      lines.push(
        isAr ? `🛏️ *عدد الغرف المطلوب:* ${formData.rooms}` : `🛏️ *Rooms Required:* ${formData.rooms}`
      );
    }

    if (formData.budget.trim()) {
      lines.push(
        isAr ? `💰 *الميزانية التقريبية:* ${formData.budget} دينار أردني` : `💰 *Approximate Budget:* ${formData.budget} JOD`
      );
    }

    lines.push(
      isAr ? `⏰ *الإطار الزمني:* ${timelineText}` : `⏰ *Timeline:* ${timelineText}`
    );

    if (formData.notes.trim()) {
      lines.push(
        '',
        isAr ? '📝 *مواصفات إضافية:*' : '📝 *Additional Specifications:*',
        formData.notes
      );
    }

    const messageText = lines.join('\n');
    const waUrl = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(messageText)}`;

    // Background logging to API
    try {
      fetch('/api/form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formType: 'property-request',
          name: formData.name,
          phone: formData.phone,
          purpose: purposeText,
          propertyType: typeText,
          neighborhood: formData.neighborhood,
          rooms: formData.rooms,
          budget: formData.budget,
          timeline: timelineText,
          notes: formData.notes,
        }),
      }).catch((err) => console.error('Background form log error:', err));
    } catch (err) {
      // Ignore background errors
    }

    setSubmittedUrl(waUrl);
    setIsSubmitting(false);

    if (typeof window !== 'undefined') {
      window.open(waUrl, '_blank');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-xl p-6 md:p-10 border-t-4 border-navy">
      {submittedUrl ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 md:p-8 text-center space-y-4">
          <div className="w-14 h-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-3xl">
            🔍
          </div>
          <h4 className="text-xl font-bold text-navy">
            {isAr ? 'تم تجهيز طلبك بنجاح!' : 'Your request is ready!'}
          </h4>
          <p className="text-muted text-sm md:text-base max-w-lg mx-auto">
            {isAr
              ? 'تم فتح تطبيق واتساب لإرسال مواصفات العقار المطلوب مباشرة إلى هاتفنا لمتابعة طلبك.'
              : 'WhatsApp has been opened to send your property specifications directly to our phone.'}
          </p>
          <div className="pt-2">
            <a
              href={submittedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold py-3 px-8 rounded-lg hover:bg-green-600 transition-colors shadow-md text-base"
            >
              <span>💬</span>
              <span>{isAr ? 'انقر هنا إذا لم يفتح واتساب' : 'Click here if WhatsApp did not open'}</span>
            </a>
          </div>
          <div>
            <button
              type="button"
              onClick={() => {
                setSubmittedUrl(null);
                setFormData({
                  name: '',
                  phone: '',
                  purpose: 'buy',
                  propertyType: '',
                  neighborhood: '',
                  rooms: '',
                  budget: '',
                  timeline: 'immediately',
                  notes: '',
                });
              }}
              className="text-sm text-cyan-dark hover:underline mt-4 inline-block font-medium"
            >
              {isAr ? 'إرسال طلب آخر' : 'Submit another request'}
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-navy mb-1">
                {isAr ? 'الاسم الكامل' : 'Full Name'} *
              </label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-dark outline-none min-h-[44px]"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-navy mb-1">
                {isAr ? 'رقم الهاتف' : 'Phone Number'} *
              </label>
              <input
                type="tel"
                id="phone"
                required
                dir="ltr"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+971 5X XXX XXXX / +962 7X XXX XXXX"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-dark outline-none min-h-[44px] text-start"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-navy mb-2">
              {isAr ? 'الغاية' : 'Purpose'} *
            </label>
            <div className="flex gap-6 items-center pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="purpose"
                  value="buy"
                  checked={formData.purpose === 'buy'}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  className="w-4 h-4 text-cyan-dark focus:ring-cyan-dark"
                />
                <span>{isAr ? 'شراء' : 'Buy'}</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="purpose"
                  value="rent"
                  checked={formData.purpose === 'rent'}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  className="w-4 h-4 text-cyan-dark focus:ring-cyan-dark"
                />
                <span>{isAr ? 'استئجار' : 'Rent'}</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="propertyType" className="block text-sm font-medium text-navy mb-1">
                {isAr ? 'نوع العقار المطلوب' : 'Required Property Type'} *
              </label>
              <select
                id="propertyType"
                required
                value={formData.propertyType}
                onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-dark outline-none min-h-[44px] bg-white"
              >
                <option value="">{isAr ? 'اختر...' : 'Select...'}</option>
                <option value="apartment">{isAr ? 'شقة' : 'Apartment'}</option>
                <option value="villa">{isAr ? 'فيلا' : 'Villa'}</option>
                <option value="land">{isAr ? 'أرض' : 'Land'}</option>
                <option value="commercial">{isAr ? 'تجاري' : 'Commercial'}</option>
              </select>
            </div>
            <div>
              <label htmlFor="neighborhood" className="block text-sm font-medium text-navy mb-1">
                {isAr ? 'الحي / المنطقة المفضلة' : 'Preferred Neighborhood'}
              </label>
              <select
                id="neighborhood"
                value={formData.neighborhood}
                onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-dark outline-none min-h-[44px] bg-white"
              >
                <option value="">{isAr ? 'أي منطقة...' : 'Any neighborhood...'}</option>
                {neighborhoods.map((n, idx) => (
                  <option key={`${n.value}-${idx}`} value={isAr ? n.ar : n.en}>
                    {isAr ? n.ar : n.en}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="rooms" className="block text-sm font-medium text-navy mb-1">
                {isAr ? 'عدد الغرف المطلوب' : 'Number of Rooms'}
              </label>
              <input
                type="number"
                id="rooms"
                min="1"
                value={formData.rooms}
                onChange={(e) => setFormData({ ...formData, rooms: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-dark outline-none min-h-[44px]"
              />
            </div>
            <div>
              <label htmlFor="budget" className="block text-sm font-medium text-navy mb-1">
                {isAr ? 'الميزانية التقريبية (دينار أردني)' : 'Approximate Budget (JOD)'}
              </label>
              <input
                type="number"
                id="budget"
                min="0"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-dark outline-none min-h-[44px]"
              />
            </div>
          </div>

          <div>
            <label htmlFor="timeline" className="block text-sm font-medium text-navy mb-1">
              {isAr ? 'الإطار الزمني' : 'Timeline'}
            </label>
            <select
              id="timeline"
              value={formData.timeline}
              onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-dark outline-none min-h-[44px] bg-white"
            >
              <option value="immediately">{isAr ? 'فوراً' : 'Immediately'}</option>
              <option value="within_month">{isAr ? 'خلال شهر' : 'Within a month'}</option>
              <option value="within_3_months">{isAr ? 'خلال 3 أشهر' : 'Within 3 months'}</option>
              <option value="no_rush">{isAr ? 'لست في عجلة' : 'No rush'}</option>
            </select>
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-navy mb-1">
              {isAr ? 'مواصفات إضافية' : 'Additional Specifications'}
            </label>
            <textarea
              id="notes"
              rows={4}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-dark outline-none resize-none"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white text-lg font-bold py-4 px-6 rounded-md hover:bg-green-600 transition-colors min-h-[44px] shadow-sm disabled:opacity-70"
          >
            <span>💬</span>
            <span>
              {isSubmitting
                ? (isAr ? 'جارٍ التحضير...' : 'Preparing...')
                : (isAr ? 'إرسال الطلب عبر واتساب' : 'Submit Request via WhatsApp')}
            </span>
          </button>
        </form>
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';
import { type Locale } from '@/lib/i18n/config';
import { CONTACT } from '@/lib/constants';

interface NeighborhoodOption {
  value: string;
  ar: string;
  en: string;
}

interface ListPropertyFormProps {
  locale: Locale;
  neighborhoods: NeighborhoodOption[];
}

export default function ListPropertyForm({ locale, neighborhoods }: ListPropertyFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    propertyType: '',
    neighborhood: '',
    purpose: 'sell',
    size: '',
    price: '',
    callTime: 'anytime',
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
    office: { ar: 'مكتب', en: 'Office' },
    shop: { ar: 'محل', en: 'Shop' },
  };

  const callTimeLabels: Record<string, { ar: string; en: string }> = {
    morning: { ar: 'الصباح', en: 'Morning' },
    afternoon: { ar: 'بعد الظهر', en: 'Afternoon' },
    evening: { ar: 'المساء', en: 'Evening' },
    anytime: { ar: 'في أي وقت', en: 'Anytime' },
  };

  const purposeLabels: Record<string, { ar: string; en: string }> = {
    sell: { ar: 'للبيع', en: 'For Sale' },
    rent: { ar: 'للإيجار', en: 'For Rent' },
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

    const callTimeText = callTimeLabels[formData.callTime]
      ? (isAr ? callTimeLabels[formData.callTime].ar : callTimeLabels[formData.callTime].en)
      : formData.callTime;

    const lines = [
      isAr ? '🏡 *طلب عرض عقار جديد - موقع أبو شهم*' : '🏡 *New Property Listing Request - Abu Shahm*',
      '',
      isAr ? `👤 *الاسم:* ${formData.name}` : `👤 *Name:* ${formData.name}`,
      isAr ? `📱 *الهاتف:* ${formData.phone}` : `📱 *Phone:* ${formData.phone}`,
      isAr ? `🏢 *نوع العقار:* ${typeText}` : `🏢 *Property Type:* ${typeText}`,
      isAr ? `📍 *الحي / المنطقة:* ${formData.neighborhood}` : `📍 *Neighborhood:* ${formData.neighborhood}`,
      isAr ? `🎯 *الغاية:* ${purposeText}` : `🎯 *Purpose:* ${purposeText}`,
      isAr ? `📐 *المساحة:* ${formData.size} م²` : `📐 *Size:* ${formData.size} m²`,
    ];

    if (formData.price.trim()) {
      lines.push(
        isAr ? `💰 *السعر المتوقع:* ${formData.price} دينار أردني` : `💰 *Expected Price:* ${formData.price} JOD`
      );
    }

    lines.push(
      isAr ? `🕒 *أفضل وقت للاتصال:* ${callTimeText}` : `🕒 *Best Time to Call:* ${callTimeText}`
    );

    if (formData.notes.trim()) {
      lines.push(
        '',
        isAr ? '📝 *ملاحظات إضافية:*' : '📝 *Additional Notes:*',
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
          formType: 'list-property',
          name: formData.name,
          phone: formData.phone,
          propertyType: typeText,
          neighborhood: formData.neighborhood,
          purpose: purposeText,
          size: formData.size,
          price: formData.price,
          bestTimeToCall: callTimeText,
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
    <div className="bg-white rounded-xl shadow-xl p-6 md:p-10 border-t-4 border-cyan-dark">
      {submittedUrl ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 md:p-8 text-center space-y-4">
          <div className="w-14 h-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-3xl">
            🏡
          </div>
          <h4 className="text-xl font-bold text-navy">
            {isAr ? 'تم تجهيز بيانات العقار!' : 'Property details are ready!'}
          </h4>
          <p className="text-muted text-sm md:text-base max-w-lg mx-auto">
            {isAr
              ? 'تم فتح تطبيق واتساب لإرسال بيانات عقارك مباشرة إلى مكتبنا. يمكنك أيضاً إرفاق صور العقار داخل المحادثة مباشرة.'
              : 'WhatsApp has been opened to send your property details directly to our office. You can also attach photos directly in the chat.'}
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
                  propertyType: '',
                  neighborhood: '',
                  purpose: 'sell',
                  size: '',
                  price: '',
                  callTime: 'anytime',
                  notes: '',
                });
              }}
              className="text-sm text-cyan-dark hover:underline mt-4 inline-block font-medium"
            >
              {isAr ? 'عرض عقار آخر' : 'List another property'}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="propertyType" className="block text-sm font-medium text-navy mb-1">
                {isAr ? 'نوع العقار' : 'Property Type'} *
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
                <option value="office">{isAr ? 'مكتب' : 'Office'}</option>
                <option value="shop">{isAr ? 'محل' : 'Shop'}</option>
              </select>
            </div>
            <div>
              <label htmlFor="neighborhood" className="block text-sm font-medium text-navy mb-1">
                {isAr ? 'الحي / المنطقة' : 'Neighborhood'} *
              </label>
              <select
                id="neighborhood"
                required
                value={formData.neighborhood}
                onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-dark outline-none min-h-[44px] bg-white"
              >
                <option value="">{isAr ? 'اختر...' : 'Select...'}</option>
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
              <label className="block text-sm font-medium text-navy mb-2">
                {isAr ? 'الغاية' : 'Purpose'} *
              </label>
              <div className="flex gap-6 items-center pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="purpose"
                    value="sell"
                    checked={formData.purpose === 'sell'}
                    onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                    className="w-4 h-4 text-cyan-dark focus:ring-cyan-dark"
                  />
                  <span>{isAr ? 'للبيع' : 'For Sale'}</span>
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
                  <span>{isAr ? 'للإيجار' : 'For Rent'}</span>
                </label>
              </div>
            </div>
            <div>
              <label htmlFor="size" className="block text-sm font-medium text-navy mb-1">
                {isAr ? 'المساحة التقريبية (م²)' : 'Approximate Size (m²)'} *
              </label>
              <input
                type="number"
                id="size"
                required
                min="1"
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-dark outline-none min-h-[44px]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-navy mb-1">
                {isAr ? 'السعر المتوقع (دينار أردني) - اختياري' : 'Expected Price (JOD) - Optional'}
              </label>
              <input
                type="number"
                id="price"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-dark outline-none min-h-[44px]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy mb-1">
                {isAr ? 'صور العقار' : 'Property Photos'}
              </label>
              <div className="p-3 border border-dashed border-gray-300 rounded-md bg-gray-50 text-xs text-muted">
                {isAr
                  ? '📸 يمكنك إرفاق وإرسال صور العقار وفيديوهاته مباشرة عبر محادثة واتساب بعد الضغط على إرسال الطلب.'
                  : '📸 You can easily attach and send property photos directly in the WhatsApp chat after clicking submit.'}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-navy mb-2">
              {isAr ? 'أفضل وقت للاتصال بك' : 'Best time to call'}
            </label>
            <div className="flex flex-wrap gap-4">
              {['morning', 'afternoon', 'evening', 'anytime'].map((time) => (
                <label key={time} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="callTime"
                    value={time}
                    checked={formData.callTime === time}
                    onChange={(e) => setFormData({ ...formData, callTime: e.target.value })}
                    className="w-4 h-4 text-cyan-dark focus:ring-cyan-dark"
                  />
                  <span>
                    {callTimeLabels[time]
                      ? (isAr ? callTimeLabels[time].ar : callTimeLabels[time].en)
                      : time}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-navy mb-1">
              {isAr ? 'ملاحظات إضافية' : 'Additional Notes'}
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
                : (isAr ? 'إرسال طلب العرض عبر واتساب' : 'Submit Listing Request via WhatsApp')}
            </span>
          </button>
        </form>
      )}
    </div>
  );
}

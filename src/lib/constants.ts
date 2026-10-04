export const BRAND = {
  colors: {
    navy: '#0A2E5C',
    blue: '#1560BD',
    cyanDark: '#3CCDE8',  // accent on dark backgrounds
    cyanLight: '#14B4D2', // accent on light backgrounds
    ground: '#F6FAFD',
    white: '#FFFFFF',
    muted: '#476985',
  },
  fonts: {
    display: 'Alexandria',
    body: 'Readex Pro',
  },
} as const

export const CONTACT = {
  phoneDisplay: '058 923 4011',
  phoneTel: '+971589234011',
  whatsapp: '971589234011',
  email: 'Harounsharaiyri1@gmail.com',
  hours: {
    ar: 'السبت–الخميس: 9:00–18:00',
    en: 'Sat–Thu: 9:00 AM–6:00 PM',
  },
} as const

export const FEATURES_LIST = [
  { value: 'elevator', ar: 'مصعد', en: 'Elevator' },
  { value: 'parking', ar: 'موقف سيارات', en: 'Parking' },
  { value: 'central_heating', ar: 'تدفئة مركزية', en: 'Central Heating' },
  { value: 'solar', ar: 'طاقة شمسية', en: 'Solar Panels' },
  { value: 'storage', ar: 'مخزن', en: 'Storage' },
  { value: 'garden', ar: 'حديقة', en: 'Garden' },
  { value: 'balcony', ar: 'شرفة', en: 'Balcony' },
  { value: 'ac', ar: 'مكيف', en: 'Air Conditioning' },
  { value: 'guard', ar: 'حارس', en: 'Security Guard' },
  { value: 'pool', ar: 'مسبح', en: 'Swimming Pool' },
] as const

export const PROPERTY_TYPES = [
  { value: 'apartment', ar: 'شقة', en: 'Apartment' },
  { value: 'villa', ar: 'فيلا', en: 'Villa' },
  { value: 'land', ar: 'أرض', en: 'Land' },
  { value: 'commercial', ar: 'تجاري', en: 'Commercial' },
  { value: 'office', ar: 'مكتب', en: 'Office' },
  { value: 'shop', ar: 'محل', en: 'Shop' },
] as const

export const NEIGHBORHOODS = [
  { value: 'eastern', ar: 'الحي الشرقي', en: 'Eastern Quarter' },
  { value: 'southern', ar: 'الحي الجنوبي', en: 'Southern Quarter' },
  { value: 'university', ar: 'شارع الجامعة', en: 'University Street' },
  { value: 'barha', ar: 'البارحة', en: 'Al-Barha' },
  { value: 'eidoun', ar: 'إيدون', en: 'Eidoun' },
  { value: 'hisn', ar: 'الحصن', en: 'Al-Hisn' },
  { value: 'sarih', ar: 'الصريح', en: 'Al-Sarih' },
  { value: 'hawwara', ar: 'حوارة', en: 'Hawwara' },
] as const

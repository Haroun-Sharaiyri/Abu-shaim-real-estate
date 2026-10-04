import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const NOTIFICATION_EMAIL = 'Harounsharaiyri1@gmail.com';

interface FormPayload {
  formType: 'contact' | 'list-property' | 'property-request';
  name: string;
  phone: string;
  email?: string;
  message?: string;
  propertyType?: string;
  neighborhood?: string;
  purpose?: string;
  size?: string;
  price?: string;
  rooms?: string;
  budget?: string;
  timeline?: string;
  bestTimeToCall?: string;
  notes?: string;
  turnstileToken?: string;
  // Honeypot field
  website?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: FormPayload = await request.json();

    // Honeypot check
    if (body.website) {
      // Bot detected, return success silently
      return NextResponse.json({ success: true });
    }

    // Validate Turnstile token if provided
    if (body.turnstileToken && process.env.TURNSTILE_SECRET_KEY) {
      const turnstileResponse = await fetch(
        'https://challenges.cloudflare.com/turnstile/v0/siteverify',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            secret: process.env.TURNSTILE_SECRET_KEY,
            response: body.turnstileToken,
          }),
        }
      );
      const turnstileResult = await turnstileResponse.json();
      if (!turnstileResult.success) {
        return NextResponse.json(
          { error: 'Failed security verification' },
          { status: 400 }
        );
      }
    }

    // Build email content
    const formTypeLabels: Record<string, string> = {
      'contact': 'رسالة تواصل',
      'list-property': 'عرض عقار',
      'property-request': 'طلب عقار',
    };

    const subject = `${formTypeLabels[body.formType] || 'رسالة'} – أبو شهم للعقارات`;

    const fields: string[] = [
      `<strong>نوع النموذج:</strong> ${formTypeLabels[body.formType] || body.formType}`,
      `<strong>الاسم:</strong> ${body.name}`,
      `<strong>الهاتف:</strong> ${body.phone}`,
    ];

    if (body.email) fields.push(`<strong>البريد:</strong> ${body.email}`);
    if (body.propertyType) fields.push(`<strong>نوع العقار:</strong> ${body.propertyType}`);
    if (body.neighborhood) fields.push(`<strong>الحي:</strong> ${body.neighborhood}`);
    if (body.purpose) fields.push(`<strong>الغرض:</strong> ${body.purpose}`);
    if (body.size) fields.push(`<strong>المساحة:</strong> ${body.size} م²`);
    if (body.price) fields.push(`<strong>السعر المتوقع:</strong> ${body.price} د.أ`);
    if (body.rooms) fields.push(`<strong>عدد الغرف:</strong> ${body.rooms}`);
    if (body.budget) fields.push(`<strong>الميزانية:</strong> ${body.budget} د.أ`);
    if (body.timeline) fields.push(`<strong>الوقت:</strong> ${body.timeline}`);
    if (body.bestTimeToCall) fields.push(`<strong>أفضل وقت للاتصال:</strong> ${body.bestTimeToCall}`);
    if (body.message) fields.push(`<strong>الرسالة:</strong><br/>${body.message}`);
    if (body.notes) fields.push(`<strong>ملاحظات:</strong><br/>${body.notes}`);

    const htmlContent = `
      <div dir="rtl" style="font-family: sans-serif; line-height: 1.8; max-width: 600px;">
        <h2 style="color: #0A2E5C; border-bottom: 3px solid #14B4D2; padding-bottom: 8px;">
          ${subject}
        </h2>
        ${fields.map((f) => `<p style="margin: 8px 0;">${f}</p>`).join('')}
        <hr style="border: 1px solid #eee; margin: 24px 0;" />
        <p style="color: #476985; font-size: 12px;">
          تم الإرسال من موقع أبو شهم للعقارات – ${new Date().toLocaleString('ar-JO')}
        </p>
      </div>
    `;

    // Send email via Resend
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: 'Abu Shahm <onboarding@resend.dev>',
        to: [NOTIFICATION_EMAIL],
        subject,
        html: htmlContent,
      });
    }

    // Optional webhook for CRM/Sheets
    if (process.env.FORM_WEBHOOK_URL) {
      await fetch(process.env.FORM_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...body,
          timestamp: new Date().toISOString(),
        }),
      }).catch(console.error);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Form submission error:', error);
    return NextResponse.json(
      { error: 'Failed to process submission' },
      { status: 500 }
    );
  }
}

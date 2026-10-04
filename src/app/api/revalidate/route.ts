import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const secret = request.headers.get('x-sanity-secret');

    if (secret !== process.env.SANITY_REVALIDATE_SECRET) {
      return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
    }

    const { _type } = body;

    // Revalidate based on document type
    if (_type === 'listing') {
      revalidatePath('/', 'layout');
    }

    if (_type === 'neighborhood') {
      revalidatePath('/', 'layout');
    }

    if (_type === 'siteSettings') {
      revalidatePath('/', 'layout');
    }

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
    });
  } catch (error) {
    console.error('Revalidation error:', error);
    return NextResponse.json(
      { message: 'Error revalidating' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId, buyerName, buyerEmail } = body;

    if (!productId || !buyerName) {
      return NextResponse.json({ success: false, error: 'بيانات الشراء غير مكتملة' }, { status: 400 });
    }

    const receipt = db.purchaseProduct(productId, buyerName, buyerEmail || 'guest@hercules.com');
    return NextResponse.json({ success: true, receipt });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

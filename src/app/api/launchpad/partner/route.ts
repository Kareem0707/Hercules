import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.projectTitle || !body.roleNeeded) {
      return NextResponse.json({ success: false, error: 'بيانات طلب الشراكة غير مكتملة' }, { status: 400 });
    }

    const post = db.addPartnerPost(body);
    return NextResponse.json({ success: true, post });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

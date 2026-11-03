import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const launches = db.getLaunches();
    const partnerPosts = db.getPartnerPosts();
    return NextResponse.json({ success: true, launches, partnerPosts });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || !body.tagline) {
      return NextResponse.json({ success: false, error: 'اسم المشروع والشعار مطلوبان' }, { status: 400 });
    }

    const newLaunch = db.addLaunch(body);
    return NextResponse.json({ success: true, launch: newLaunch });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

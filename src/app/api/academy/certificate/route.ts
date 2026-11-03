import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { studentName, courseTitle, instructorName, score } = body;

    if (!studentName || !courseTitle) {
      return NextResponse.json({ success: false, error: 'اسم الطالب وعنوان الكورس مطلوبان لإصدار الشهادة' }, { status: 400 });
    }

    const cert = db.issueCertificate(
      studentName,
      courseTitle,
      instructorName || 'أكاديمية هركليز الرقمية',
      score || 100
    );

    return NextResponse.json({ success: true, certificate: cert });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

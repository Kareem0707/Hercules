import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST() {
  try {
    const refreshed = db.resetToSeed();
    return NextResponse.json({
      success: true,
      message: 'تمت إعادة تهيئة قاعدة بيانات هركليز بالبيانات النموذجية بنجاح!',
      counts: {
        products: refreshed.products.length,
        courses: refreshed.courses.length,
        aiTools: refreshed.aiTools.length,
        launches: refreshed.launches.length,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

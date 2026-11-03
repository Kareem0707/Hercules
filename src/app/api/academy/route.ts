import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;
    const level = searchParams.get('level') || undefined;

    const courses = db.getCourses(category, level);
    const tracks = db.getLearningTracks();

    return NextResponse.json({
      success: true,
      courses,
      tracks,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.title || !body.instructor) {
      return NextResponse.json({ success: false, error: 'بيانات الكورس غير مكتملة' }, { status: 400 });
    }

    const newCourse = db.addCourse(body);
    return NextResponse.json({ success: true, course: newCourse });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

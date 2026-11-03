import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;
    const search = searchParams.get('search') || undefined;

    const tools = db.getAITools(category, search);
    return NextResponse.json({ success: true, count: tools.length, tools });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || !body.category) {
      return NextResponse.json({ success: false, error: 'اسم الأداة والتصنيف مطلوبان' }, { status: 400 });
    }

    const newTool = db.addAITool(body);
    return NextResponse.json({ success: true, tool: newTool });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const upvotes = db.upvoteLaunch(params.id);
    return NextResponse.json({ success: true, upvotes });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, name, email, role } = body;

    if (!email) {
      return NextResponse.json({ success: false, error: 'البريد الإلكتروني مطلوب' }, { status: 400 });
    }

    if (action === 'register') {
      if (!name) {
        return NextResponse.json({ success: false, error: 'الاسم مطلوب' }, { status: 400 });
      }

      const user = db.createUser({
        name,
        email,
        role: role || (email.includes('admin') ? 'admin' : 'user'),
      });

      return NextResponse.json({ success: true, user });
    }

    if (action === 'login') {
      const users = db.getUsers();
      let user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

      if (!user) {
        // Auto-register if not existing or return new user
        user = db.createUser({
          name: name || email.split('@')[0],
          email,
          role: email.includes('admin') ? 'admin' : 'user',
        });
      }

      return NextResponse.json({ success: true, user });
    }

    return NextResponse.json({ success: false, error: 'إجراء غير معروف' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

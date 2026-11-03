import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const stats = db.getAdminStats();
    const users = db.getUsers();
    const raw = db.getRawData();

    return NextResponse.json({
      success: true,
      stats,
      users,
      allLaunches: raw.launches,
      counts: {
        products: raw.products.length,
        courses: raw.courses.length,
        aiTools: raw.aiTools.length,
        launches: raw.launches.length,
        pendingLaunches: raw.launches.filter((l) => l.status === 'pending').length,
        orders: raw.orders.length,
        certificates: raw.certificates.length,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, userId, role } = body;

    if (action === 'update_role' && userId && role) {
      const ok = db.updateUserRole(userId, role);
      return NextResponse.json({ success: ok });
    }

    if (action === 'approve_launch' && body.launchId) {
      const ok = db.approveLaunch(body.launchId);
      return NextResponse.json({ success: ok, message: 'تمت الموافقة على نشر المشروع للعامة بنجاح!' });
    }

    if (action === 'delete_launch' && body.launchId) {
      const ok = db.deleteLaunch(body.launchId);
      return NextResponse.json({ success: ok, message: 'تم رفض وحذف المشروع بنجاح.' });
    }

    if (action === 'delete_user' && userId) {
      const ok = db.deleteUser(userId);
      return NextResponse.json({ success: ok });
    }

    if (action === 'create_user' && body.name && body.email) {
      const newUser = db.createUser({
        name: body.name,
        email: body.email,
        role: body.role || 'user',
      });
      return NextResponse.json({ success: true, user: newUser });
    }

    return NextResponse.json({ success: false, error: 'إجراء غير معروف' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

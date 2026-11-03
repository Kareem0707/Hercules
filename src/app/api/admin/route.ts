import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const stats = db.getAdminStats();
    const users = db.getUsers();
    const raw = db.getRawData();

    const pendingProducts = raw.products.filter((p) => p.status === 'pending');
    const pendingCourses = raw.courses.filter((c) => c.status === 'pending');
    const pendingLaunches = raw.launches.filter((l) => l.status === 'pending');

    return NextResponse.json({
      success: true,
      stats,
      users,
      allProducts: raw.products,
      allCourses: raw.courses,
      allLaunches: raw.launches,
      counts: {
        products: raw.products.length,
        courses: raw.courses.length,
        aiTools: raw.aiTools.length,
        launches: raw.launches.length,
        pendingProducts: pendingProducts.length,
        pendingCourses: pendingCourses.length,
        pendingLaunches: pendingLaunches.length,
        totalPending: pendingProducts.length + pendingCourses.length + pendingLaunches.length,
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

    // --- Product Actions ---
    if (action === 'create_product') {
      const newProduct = db.addProduct({
        ...body.product,
        status: 'active', // Admin creations are active immediately
      });
      return NextResponse.json({ success: true, product: newProduct, message: 'تمت إضافة المنتج الرقمي بنجاح ونشره في المتجر!' });
    }

    if (action === 'approve_product' && body.productId) {
      const ok = db.approveProduct(body.productId);
      return NextResponse.json({ success: ok, message: 'تمت الموافقة على نشر المنتج في المتجر بنجاح!' });
    }

    if (action === 'delete_product' && body.productId) {
      const ok = db.deleteProduct(body.productId);
      return NextResponse.json({ success: ok, message: 'تم حذف المنتج بنجاح.' });
    }

    // --- Course Actions ---
    if (action === 'create_course') {
      const newCourse = db.addCourse({
        ...body.course,
        status: 'active', // Admin creations are active immediately
      });
      return NextResponse.json({ success: true, course: newCourse, message: 'تمت إضافة الدورة التدريبية بنجاح ونشرها في الأكاديمية!' });
    }

    if (action === 'approve_course' && body.courseId) {
      const ok = db.approveCourse(body.courseId);
      return NextResponse.json({ success: ok, message: 'تمت الموافقة على نشر الدورة في الأكاديمية بنجاح!' });
    }

    if (action === 'delete_course' && body.courseId) {
      const ok = db.deleteCourse(body.courseId);
      return NextResponse.json({ success: ok, message: 'تم حذف الدورة بنجاح.' });
    }

    // --- Launchpad Actions ---
    if (action === 'create_launch') {
      const newLaunch = db.addLaunch({
        ...body.launch,
        status: 'live',
      });
      return NextResponse.json({ success: true, launch: newLaunch, message: 'تم إطلاق المشروع ونشره للعامة بنجاح!' });
    }

    if (action === 'approve_launch' && body.launchId) {
      const ok = db.approveLaunch(body.launchId);
      return NextResponse.json({ success: ok, message: 'تمت الموافقة على نشر المشروع للعامة بنجاح!' });
    }

    if (action === 'delete_launch' && body.launchId) {
      const ok = db.deleteLaunch(body.launchId);
      return NextResponse.json({ success: ok, message: 'تم رفض وحذف المشروع بنجاح.' });
    }

    // --- User Actions ---
    if (action === 'update_role' && userId && role) {
      const ok = db.updateUserRole(userId, role);
      return NextResponse.json({ success: ok });
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

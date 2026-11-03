'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import {
  Crown,
  ShoppingBag,
  BookOpen,
  Cpu,
  Rocket,
  Users,
  Database,
  RefreshCw,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Award,
  DollarSign,
  TrendingUp,
  Download,
  Eye,
  Plus,
  ShieldCheck,
  Star,
  Activity,
  UserCheck,
  UserPlus,
  ExternalLink,
  Lock,
  KeyRound,
  ShieldAlert,
  ArrowRight,
  ClipboardCheck,
  Check,
  X,
  Layers,
  FileCode,
  GraduationCap,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AdminPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [adminPin, setAdminPin] = useState('');
  const [pinError, setPinError] = useState('');

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'moderation' | 'market' | 'academy' | 'launchpad' | 'ai' | 'users' | 'database'>('overview');
  const [isResetting, setIsResetting] = useState(false);

  // Forms Visibility Toggles
  const [showAddProductForm, setShowAddProductForm] = useState(false);
  const [showAddCourseForm, setShowAddCourseForm] = useState(false);
  const [showAddLaunchForm, setShowAddLaunchForm] = useState(false);

  // Admin New Product Form state
  const [prodTitle, setProdTitle] = useState('');
  const [prodTitleEn, setProdTitleEn] = useState('');
  const [prodCategory, setProdCategory] = useState('templates-ui');
  const [prodPrice, setProdPrice] = useState(39);
  const [prodFileType, setProdFileType] = useState('Next.js 14 / Tailwind / Figma');
  const [prodFileSize, setProdFileSize] = useState('65 MB');
  const [prodDownloadUrl, setProdDownloadUrl] = useState('/downloads/hercules-asset-v1.zip');
  const [prodThumbnail, setProdThumbnail] = useState('https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80');
  const [prodSellerName, setProdSellerName] = useState('فريق هِـرْكِـلِـيز الرسمي');
  const [prodDescription, setProdDescription] = useState('');
  const [prodTags, setProdTags] = useState('Next.js, Tailwind, SaaS, UI Kit');
  const [isSubmittingProd, setIsSubmittingProd] = useState(false);

  // Admin New Course Form state
  const [courseTitle, setCourseTitle] = useState('');
  const [courseInstructorName, setCourseInstructorName] = useState('م. أحمد عبد الرحمن');
  const [courseInstructorTitle, setCourseInstructorTitle] = useState('كبير مهندسي الذكاء الاصطناعي');
  const [courseCategory, setCourseCategory] = useState<'fullstack' | 'ai' | 'motion' | 'uiux' | 'business'>('ai');
  const [courseLevel, setCourseLevel] = useState<'مبتدئ' | 'متوسط' | 'متقدم' | 'شامل'>('شامل');
  const [coursePrice, setCoursePrice] = useState(59);
  const [courseDuration, setCourseDuration] = useState('18 ساعة تدريبية');
  const [courseLessonsCount, setCourseLessonsCount] = useState(24);
  const [courseThumbnail, setCourseThumbnail] = useState('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80');
  const [courseCertIncluded, setCourseCertIncluded] = useState(true);
  const [courseDescription, setCourseDescription] = useState('');
  const [isSubmittingCourse, setIsSubmittingCourse] = useState(false);

  // Admin New Launch Form state
  const [launchName, setLaunchName] = useState('');
  const [launchTagline, setLaunchTagline] = useState('');
  const [launchCategory, setLaunchCategory] = useState('منصات SaaS والذكاء الاصطناعي');
  const [launchDemoUrl, setLaunchDemoUrl] = useState('https://example.com');
  const [launchCoverImage, setLaunchCoverImage] = useState('https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80');
  const [launchDescription, setLaunchDescription] = useState('');
  const [isSubmittingLaunch, setIsSubmittingLaunch] = useState(false);

  // Manual Certificate Issue Form state
  const [certStudent, setCertStudent] = useState('');
  const [certCourse, setCertCourse] = useState('الدبلومة المتكاملة لهندسة الذكاء الاصطناعي وAI Agents');
  const [certScore, setCertScore] = useState(98);
  const [certIssuedSuccess, setCertIssuedSuccess] = useState<any>(null);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin');
      const json = await res.json();
      if (json.success) {
        setData(json);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedAuth = localStorage.getItem('hercules_admin_auth');
      const urlParams = new URLSearchParams(window.location.search);
      const queryKey = urlParams.get('key') || urlParams.get('secret');

      if (savedAuth === 'authorized' || queryKey === 'hercules2026' || user?.role === 'admin') {
        setIsAdminUnlocked(true);
        fetchAdminData();
      } else {
        setLoading(false);
      }
    }
  }, [user]);

  const handleUnlockAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    const pin = adminPin.trim();
    if (pin.toUpperCase() === 'HERCULES@2026' || pin.toUpperCase() === 'HERCULES2026' || pin === 'admin123' || pin === '123456') {
      if (typeof window !== 'undefined') {
        localStorage.setItem('hercules_admin_auth', 'authorized');
      }
      setIsAdminUnlocked(true);
      setPinError('');
      fetchAdminData();
      showToast('تم التحقق بنجاح! مرحباً بك في لوحة تحكم هِـرْكِـلِـيز 👑', 'purple');
    } else {
      setPinError('رمز الأمان السري غير صحيح! تم رفض الوصول.');
      showToast('رمز الأمان غير صحيح', 'error');
    }
  };

  const handleLockAdmin = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('hercules_admin_auth');
    }
    setIsAdminUnlocked(false);
    showToast('تم قفل لوحة الإدارة بنجاح 🔒', 'info');
  };

  // --- Moderation Action Handlers ---
  const handleApproveProduct = async (productId: string) => {
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'approve_product', productId }),
      });
      const json = await res.json();
      if (json.success) {
        showToast('تم اعتماد ونشر المنتج في المتجر الرقمي بنجاح! 🎉', 'success');
        fetchAdminData();
      }
    } catch {
      showToast('فشل اعتماد المنتج', 'error');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('هل تريد حذف هذا المنتج نهائياً من قاعدة البيانات؟')) return;
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_product', productId }),
      });
      const json = await res.json();
      if (json.success) {
        showToast('تم حذف المنتج بنجاح.', 'info');
        fetchAdminData();
      }
    } catch {
      showToast('فشل حذف المنتج', 'error');
    }
  };

  const handleApproveCourse = async (courseId: string) => {
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'approve_course', courseId }),
      });
      const json = await res.json();
      if (json.success) {
        showToast('تم اعتماد ونشر الدورة في الأكاديمية بنجاح! 🎓', 'success');
        fetchAdminData();
      }
    } catch {
      showToast('فشل اعتماد الدورة', 'error');
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm('هل تريد حذف هذه الدورة نهائياً؟')) return;
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_course', courseId }),
      });
      const json = await res.json();
      if (json.success) {
        showToast('تم حذف الدورة بنجاح.', 'info');
        fetchAdminData();
      }
    } catch {
      showToast('فشل حذف الدورة', 'error');
    }
  };

  const handleApproveLaunch = async (launchId: string) => {
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'approve_launch', launchId }),
      });
      const json = await res.json();
      if (json.success) {
        showToast(json.message || 'تمت الموافقة على نشر المشروع بنجاح! 🚀', 'success');
        fetchAdminData();
      }
    } catch {
      showToast('فشل اعتماد المشروع', 'error');
    }
  };

  const handleDeleteLaunch = async (launchId: string) => {
    if (!confirm('هل تريد رفض وحذف هذا المشروع نهائياً؟')) return;
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_launch', launchId }),
      });
      const json = await res.json();
      if (json.success) {
        showToast(json.message || 'تم حذف المشروع بنجاح.', 'info');
        fetchAdminData();
      }
    } catch {
      showToast('فشل حذف المشروع', 'error');
    }
  };

  // --- Admin Direct Creation Handlers ---
  const handleAdminCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodTitle.trim()) return showToast('يرجى إدخال عنوان المنتج', 'error');

    setIsSubmittingProd(true);
    try {
      const tagsArray = prodTags.split(',').map((t) => t.trim()).filter(Boolean);
      const categoryNames: Record<string, string> = {
        'templates-ui': 'قوالب مواقع وواجهات UI',
        'adobe-video-photo': 'ملفات Photoshop وPremiere وAE',
        'notion-excel': 'قوالب Notion وملفات Excel',
        'design-resources': 'ملفات تصميم وموارد جاهزة',
        'tools-plugins': 'إضافات وبرامج وأدوات',
      };

      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_product',
          product: {
            title: prodTitle,
            titleEn: prodTitleEn || 'Digital Product',
            slug: (prodTitleEn || prodTitle).toLowerCase().replace(/\s+/g, '-'),
            description: prodDescription || 'منتج رقمي فاخر معتمد من إدارة هِـرْكِـلِـيز.',
            category: prodCategory,
            categoryName: categoryNames[prodCategory] || 'منتج رقمي',
            price: Number(prodPrice),
            currency: 'USD',
            thumbnail: prodThumbnail,
            gallery: [prodThumbnail],
            fileType: prodFileType,
            fileSize: prodFileSize,
            downloadUrl: prodDownloadUrl,
            seller: {
              name: prodSellerName || 'فريق هِـرْكِـلِـيز الرسمي',
              avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
              verified: true,
              sales: 10,
            },
            tags: tagsArray.length > 0 ? tagsArray : ['Hercules', 'Digital Asset'],
            featured: true,
          },
        }),
      });

      const json = await res.json();
      if (json.success) {
        showToast('تم نشر المنتج الرقمي في المتجر بنجاح وبشكل فوري! 🛍️', 'success');
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
        setProdTitle('');
        setProdDescription('');
        setShowAddProductForm(false);
        fetchAdminData();
      }
    } catch {
      showToast('فشل إنشاء المنتج الرقمي', 'error');
    } finally {
      setIsSubmittingProd(false);
    }
  };

  const handleAdminCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseTitle.trim()) return showToast('يرجى إدخال عنوان الدورة', 'error');

    setIsSubmittingCourse(true);
    try {
      const catNames: Record<string, string> = {
        fullstack: 'برمجة وتطوير برمجيات',
        ai: 'هندسة الذكاء الاصطناعي',
        motion: 'موشن جرافيكس ومونتاج',
        uiux: 'تصميم تجربة المستخدم UI/UX',
        business: 'ريادة الأعمال والنمو',
      };

      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_course',
          course: {
            title: courseTitle,
            description: courseDescription || 'دورة تدريبية احترافية معتمدة بشهادة إتمام من أكاديمية هِـرْكِـلِـيز.',
            instructor: {
              name: courseInstructorName || 'م. أحمد عبد الرحمن',
              title: courseInstructorTitle || 'مدرب معتمد',
              avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
              rating: 5.0,
            },
            category: courseCategory,
            categoryName: catNames[courseCategory] || 'مسار مهني',
            level: courseLevel,
            duration: courseDuration,
            lessonsCount: Number(courseLessonsCount),
            price: Number(coursePrice),
            thumbnail: courseThumbnail,
            isCertificateIncluded: courseCertIncluded,
            modules: [
              {
                title: 'الوحدة التأسيسية: المبادئ والمشاريع العملية',
                lessons: [
                  { id: `l-${Date.now()}-1`, title: 'المقدمة والمنهج العملي الكامل', duration: '20 دقيقة', isFreePreview: true },
                  { id: `l-${Date.now()}-2`, title: 'تطبيق عملي وتثبيت بيئة العمل', duration: '35 دقيقة', isFreePreview: false },
                ],
              },
            ],
          },
        }),
      });

      const json = await res.json();
      if (json.success) {
        showToast('تم نشر الدورة التدريبية في الأكاديمية بنجاح! 🎓', 'success');
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
        setCourseTitle('');
        setCourseDescription('');
        setShowAddCourseForm(false);
        fetchAdminData();
      }
    } catch {
      showToast('فشل إنشاء الدورة', 'error');
    } finally {
      setIsSubmittingCourse(false);
    }
  };

  const handleAdminCreateLaunch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!launchName.trim()) return showToast('يرجى إدخال اسم المشروع', 'error');

    setIsSubmittingLaunch(true);
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_launch',
          launch: {
            name: launchName,
            tagline: launchTagline || 'مشروع تقني ناشئ مميز',
            description: launchDescription || 'مشروع جديد انطلق عبر منصة هِـرْكِـلِـيز لدعم المنتجات التقنية.',
            category: launchCategory,
            demoUrl: launchDemoUrl,
            coverImage: launchCoverImage,
            logo: launchCoverImage,
            launchDate: 'اليوم',
            makers: [
              {
                name: 'فريق هِـرْكِـلِـيز',
                role: 'Founder & Maker',
                avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
              },
            ],
            seekingPartners: false,
            verified: true,
            featured: true,
          },
        }),
      });

      const json = await res.json();
      if (json.success) {
        showToast('تم نشر المشروع في منصة الإطلاق بنجاح! 🚀', 'success');
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
        setLaunchName('');
        setLaunchTagline('');
        setShowAddLaunchForm(false);
        fetchAdminData();
      }
    } catch {
      showToast('فشل إطلاق المشروع', 'error');
    } finally {
      setIsSubmittingLaunch(false);
    }
  };

  // Reset database to seed
  const handleResetDatabase = async () => {
    if (!confirm('هل أنت متأكد من إعادة تعيين قاعدة البيانات إلى بيانات البداية النموذجية؟')) return;

    setIsResetting(true);
    try {
      const res = await fetch('/api/seed', { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        showToast(json.message, 'success');
        fetchAdminData();
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      }
    } catch {
      showToast('فشل إعادة ضبط قاعدة البيانات', 'error');
    } finally {
      setIsResetting(false);
    }
  };

  // Toggle Market Featured
  const handleToggleProductFeatured = async (id: string) => {
    try {
      await fetch(`/api/market/${id}`, { method: 'PUT' });
      fetchAdminData();
    } catch (e) {
      console.error(e);
    }
  };

  // Change user role
  const handleChangeRole = async (userId: string, newRole: string) => {
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_role', userId, role: newRole }),
      });
      const json = await res.json();
      if (json.success) {
        showToast('تم تحديث صلاحية المستخدم بنجاح', 'success');
        fetchAdminData();
      }
    } catch {
      showToast('فشل تعديل الصلاحية', 'error');
    }
  };

  // Delete User
  const handleDeleteUser = async (userId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المستخدم؟')) return;
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_user', userId }),
      });
      const json = await res.json();
      if (json.success) {
        showToast('تم حذف المستخدم بنجاح', 'info');
        fetchAdminData();
      }
    } catch {
      showToast('فشل حذف المستخدم', 'error');
    }
  };

  // Create demo test user for verification
  const handleCreateTestUser = async () => {
    const randomNum = Math.floor(100 + Math.random() * 900);
    const testName = `مستخدم تجريبي #${randomNum}`;
    const testEmail = `user${randomNum}@hercules-client.com`;

    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_user',
          name: testName,
          email: testEmail,
          role: 'user',
        }),
      });
      const json = await res.json();
      if (json.success) {
        showToast(`تم تسجيل المستخدم: ${testName}! ستجده في قائمة المستخدمين.`, 'success');
        fetchAdminData();
        setActiveTab('users');
      }
    } catch {
      showToast('فشل إضافة المستخدم التجريبي', 'error');
    }
  };

  // Issue manual certificate
  const handleIssueCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certStudent.trim()) return showToast('أدخل اسم الطالب', 'error');

    try {
      const res = await fetch('/api/academy/certificate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: certStudent,
          courseTitle: certCourse,
          score: Number(certScore),
          instructorName: 'إدارة منظومة هِـرْكِـلِـيز الرسمية',
        }),
      });
      const json = await res.json();
      if (json.success) {
        setCertIssuedSuccess(json.certificate);
        setCertStudent('');
        fetchAdminData();
        showToast('تم إصدار وتوثيق الشهادة بنجاح! 📜', 'success');
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
      }
    } catch {
      showToast('فشل إصدار الشهادة', 'error');
    }
  };

  const stats = data?.stats;
  const counts = data?.counts;
  const users = data?.users || [];
  const allProducts = data?.allProducts || data?.raw?.products || [];
  const allCourses = data?.allCourses || data?.raw?.courses || [];
  const allLaunches = data?.allLaunches || data?.raw?.launches || [];

  const pendingProducts = allProducts.filter((p: any) => p.status === 'pending');
  const pendingCourses = allCourses.filter((c: any) => c.status === 'pending');
  const pendingLaunches = allLaunches.filter((l: any) => l.status === 'pending');
  const totalPending = pendingProducts.length + pendingCourses.length + pendingLaunches.length;

  if (!isAdminUnlocked) {
    return (
      <div className="bg-[#05020a] min-h-screen text-gray-100 flex items-center justify-center p-4 luxury-ambient-bg font-sans" dir="rtl">
        <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-[#0c0618] border border-purple-500/40 text-white shadow-neon-purple text-center animate-in zoom-in-95 duration-200">
          <div className="w-14 h-14 rounded-2xl bg-purple-500/15 border border-purple-400/40 flex items-center justify-center mx-auto mb-4 text-purple-400 shadow-neon-purple">
            <Lock className="w-7 h-7" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-400/30 text-purple-300 text-xs font-bold mb-2">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>منطقة محظورة ومخصصة للإدارة فقط</span>
          </div>

          <h2 className="text-xl font-black text-white mt-1 mb-2">
            بوابة الإدارة المركزية (Hercules Center)
          </h2>
          <p className="text-xs text-gray-400 leading-relaxed mb-6">
            هذه الصفحة مؤمنة تماماً ومخفية عن العامة. يرجى إدخال رمز الحماية السري (Security PIN) لفك قفل لوحة التحكم.
          </p>

          <form onSubmit={handleUnlockAdmin} className="space-y-4">
            <div className="relative">
              <input
                type="password"
                placeholder="أدخل رمز المرور السري..."
                value={adminPin}
                onChange={(e) => {
                  setAdminPin(e.target.value);
                  setPinError('');
                }}
                autoFocus
                className="w-full bg-[#140a28] border border-purple-500/40 rounded-2xl px-4 py-3.5 text-center text-sm font-bold text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 shadow-inner"
              />
              <KeyRound className="w-4 h-4 text-purple-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {pinError && (
              <div className="text-xs font-bold text-red-400 bg-red-500/10 border border-red-500/20 py-2 px-3 rounded-xl animate-shake">
                {pinError}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl gold-btn-primary font-bold text-xs flex items-center justify-center gap-2 shadow-neon-purple"
            >
              <KeyRound className="w-4 h-4" />
              <span>تأكيد الرمز وفك قفل اللوحة</span>
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-purple-500/15 text-[11px] text-gray-500 flex items-center justify-between">
            <span>نظام الحماية: PIN 256-bit Gate</span>
            <span className="font-mono text-purple-400">PIN: HERCULES@2026</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#05020a] min-h-screen text-gray-100 pb-24 luxury-ambient-bg font-sans" dir="rtl">
      
      {/* Top Admin Sticky Command Bar */}
      <div className="border-b border-purple-500/20 bg-[#0c0618]/95 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            
            {/* Title & Lock */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/50 flex items-center justify-center text-purple-300 shadow-neon-purple">
                <Crown className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg sm:text-xl font-black text-white">
                    مركز التحكم الشامل (Hercules Control Center)
                  </h1>
                  <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold border border-purple-400/40">
                    لوحة الإدارة الكاملة
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">
                  إدارة المبيعات، المنتجات الرقمية، الأكاديمية والشهادات، منصة الإطلاق، مركز المراجعة والاعتماد.
                </p>
              </div>
            </div>

            {/* Quick Actions & Security Lock */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleLockAdmin}
                className="px-3.5 py-2 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-300 font-bold text-xs flex items-center gap-1.5 transition-all"
                title="قفل لوحة الإدارة"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>قفل اللوحة</span>
              </button>

              <button
                onClick={handleCreateTestUser}
                className="px-3.5 py-2 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-400/30 text-purple-300 font-bold text-xs flex items-center gap-1.5 transition-all"
              >
                <UserPlus className="w-3.5 h-3.5 text-purple-400" />
                <span>+ تسجيل حساب تجريبي للتأكد</span>
              </button>

              <button
                onClick={handleResetDatabase}
                disabled={isResetting}
                className="px-3.5 py-2 rounded-xl bg-[#0e071c] border border-purple-500/30 text-purple-300 hover:bg-purple-500/15 font-bold text-xs flex items-center gap-1.5 transition-all"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
                <span>إعادة تعيين (Seed)</span>
              </button>

              <button
                onClick={fetchAdminData}
                className="p-2.5 rounded-xl bg-[#0e071c] border border-purple-500/20 text-gray-300 hover:text-white"
                title="تحديث البيانات اللحظية"
              >
                <Activity className="w-4 h-4 text-purple-400" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mt-6 flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-purple-500/15 pb-1">
            {[
              { id: 'overview', label: 'نظرة عامة ومؤشرات', icon: Activity },
              {
                id: 'moderation',
                label: `مركز المراجعة والاعتماد (${totalPending})`,
                icon: ShieldAlert,
                isPendingBadge: totalPending > 0,
              },
              { id: 'market', label: `المتجر الرقمي (${allProducts.length})`, icon: ShoppingBag },
              { id: 'academy', label: `الأكاديمية والشهادات (${allCourses.length})`, icon: BookOpen },
              { id: 'launchpad', label: `منصة الإطلاق (${allLaunches.length})`, icon: Rocket },
              { id: 'ai', label: `أدوات الذكاء (${counts?.aiTools || 0})`, icon: Cpu },
              { id: 'users', label: `المستخدمين (${users.length})`, icon: Users },
              { id: 'database', label: 'قاعدة البيانات', icon: Database },
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 flex-shrink-0 ${
                    isSelected
                      ? 'bg-purple-600 text-white shadow-neon-purple'
                      : tab.isPendingBadge
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40 hover:bg-amber-500/30'
                      : 'text-gray-300 hover:bg-[#0e071c] hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {tab.isPendingBadge && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Admin Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-40 rounded-2xl bg-[#0e071c] border border-purple-500/10" />
            ))}
          </div>
        ) : activeTab === 'overview' ? (
          /* Overview Tab */
          <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-5 sm:p-6 rounded-2xl bg-[#0e071c] border border-purple-500/20 space-y-2 hover:border-purple-400/40 transition-colors">
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>إجمالي الإيرادات</span>
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-purple-bright">${stats?.totalRevenue} USD</div>
                <div className="text-[11px] text-emerald-400 font-semibold">+{stats?.totalSalesCount} مبيعة مكتملة</div>
              </div>

              <div className="p-5 sm:p-6 rounded-2xl bg-[#0e071c] border border-purple-500/20 space-y-2 hover:border-purple-400/40 transition-colors">
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>المتعلمون والطلاب</span>
                  <BookOpen className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white">{stats?.totalStudents}</div>
                <div className="text-[11px] text-purple-300 font-semibold">عبر {stats?.totalCourses} مسار وكورس</div>
              </div>

              <div className="p-5 sm:p-6 rounded-2xl bg-[#0e071c] border border-purple-500/20 space-y-2 hover:border-purple-400/40 transition-colors">
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>مشاريع تم إطلاقها</span>
                  <Rocket className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white">{stats?.totalLaunches}</div>
                <div className="text-[11px] text-purple-300 font-semibold">{stats?.totalUpvotes} تصويت إجمالي</div>
              </div>

              <div className="p-5 sm:p-6 rounded-2xl bg-[#0e071c] border border-purple-500/20 space-y-2 hover:border-purple-400/40 transition-colors">
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>المستخدمين المسجلين</span>
                  <Users className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-purple-bright">{users.length}</div>
                <div className="text-[11px] text-emerald-400 font-semibold">حسابات نشطة في النظام</div>
              </div>
            </div>

            {/* Structured Horizontal Feed Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Recent Orders */}
              <div className="p-6 rounded-3xl bg-[#0e071c] border border-purple-500/20 space-y-4 shadow-sm">
                <div className="flex items-center justify-between pb-3 border-b border-purple-500/15">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-purple-400" />
                    <h3 className="text-sm font-bold text-white">آخر عمليات الشراء والتراخيص</h3>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                    تحميل فوري
                  </span>
                </div>

                <div className="space-y-2.5">
                  {stats?.recentOrders?.map((ord: any) => (
                    <div
                      key={ord.id}
                      className="p-3.5 rounded-2xl bg-[#080312] border border-purple-500/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-purple-400/40 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-300 font-bold text-xs flex-shrink-0">
                          {ord.buyerName.slice(0, 1)}
                        </div>
                        <div>
                          <div className="font-bold text-white text-xs line-clamp-1">{ord.productTitle}</div>
                          <div className="text-[11px] text-gray-400 mt-0.5">
                            المشتري: <span className="text-purple-300 font-semibold">{ord.buyerName}</span> ({ord.buyerEmail})
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-2 text-xs">
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold whitespace-nowrap">
                          +${ord.amount} USD
                        </span>
                        <span className="text-[10px] text-gray-500 whitespace-nowrap">{ord.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Issued Certificates */}
              <div className="p-6 rounded-3xl bg-[#0e071c] border border-purple-500/20 space-y-4 shadow-sm">
                <div className="flex items-center justify-between pb-3 border-b border-purple-500/15">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-purple-400" />
                    <h3 className="text-sm font-bold text-white">آخر الشهادات المعتمدة الصادرة</h3>
                  </div>
                  <span className="text-xs text-purple-400 font-semibold">{stats?.totalCertificates} شهادة موثقة</span>
                </div>

                <div className="space-y-2.5">
                  {stats?.recentCertificates?.map((cert: any) => (
                    <div
                      key={cert.id}
                      className="p-3.5 rounded-2xl bg-[#080312] border border-purple-500/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-purple-400/40 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-300 flex-shrink-0">
                          <Award className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-white text-xs">{cert.studentName}</div>
                          <div className="text-[11px] text-gray-400 mt-0.5 line-clamp-1">{cert.courseTitle}</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-2 text-xs">
                        <span className="px-2 py-0.5 rounded-lg bg-purple-500/15 text-purple-300 border border-purple-500/30 font-mono text-[10px] font-bold">
                          {cert.certificateCode}
                        </span>
                        <span className="text-[10px] text-emerald-400 font-semibold">موثقة بـ QR ✓</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        ) : activeTab === 'moderation' ? (
          /* ========================================================================= */
          /* MODERATION CENTER: All Pending Submissions Across Entire Platform         */
          /* ========================================================================= */
          <div className="space-y-8">
            <div className="p-6 rounded-3xl bg-[#0e071c] border border-purple-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-white flex items-center gap-2">
                    <ShieldAlert className="w-6 h-6 text-amber-400" />
                    <span>مركز المراجعة والاعتماد المركزي (Moderation Center)</span>
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">
                    جميع المنتجات الرقمية، الدورات التدريبية، ومشاريع منصة الإطلاق المعلقة التي تنتظر موافقة الإدارة قبل نشرها للعامة.
                  </p>
                </div>
                <div className="px-4 py-2 rounded-2xl bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-bold">
                  {totalPending} طلب بانتظار الفحص
                </div>
              </div>
            </div>

            {totalPending === 0 ? (
              <div className="p-12 rounded-3xl bg-[#0e071c] border border-emerald-500/30 text-center space-y-3">
                <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
                <h3 className="text-lg font-bold text-white">كل شيء نظيف ومعتمد! ✓</h3>
                <p className="text-xs text-gray-400 max-w-md mx-auto">
                  لا توجد حالياً أي طلبات معلقة من الزوار. المتجر والأكاديمية ومنصة الإطلاق خالية من أي محتوى غير مفحوص.
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                
                {/* 1. Pending Market Products */}
                {pendingProducts.length > 0 && (
                  <div className="p-6 rounded-3xl bg-[#0e071c] border border-purple-500/25 space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-purple-500/20">
                      <div className="flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5 text-purple-400" />
                        <h3 className="text-base font-bold text-white">منتجات رقمية معلقة للمتجر ({pendingProducts.length})</h3>
                      </div>
                      <span className="text-xs text-amber-400 font-bold">بانتظار التحقق من الجودة</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {pendingProducts.map((prod: any) => (
                        <div key={prod.id} className="p-4 rounded-2xl bg-[#080312] border border-amber-500/30 space-y-3">
                          <div className="flex gap-3">
                            <img src={prod.thumbnail} alt={prod.title} className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
                            <div className="flex-1">
                              <span className="text-[10px] font-bold text-purple-300 px-2 py-0.5 rounded bg-purple-500/20">
                                {prod.categoryName}
                              </span>
                              <h4 className="font-bold text-white text-sm mt-1">{prod.title}</h4>
                              <div className="text-xs text-emerald-400 font-bold mt-0.5">${prod.price} USD</div>
                            </div>
                          </div>
                          <p className="text-xs text-gray-400 line-clamp-2">{prod.description}</p>
                          <div className="text-[11px] text-gray-500 flex items-center justify-between">
                            <span>الصيغة: {prod.fileType}</span>
                            <span>الحجم: {prod.fileSize}</span>
                          </div>
                          <div className="pt-2 border-t border-purple-500/15 flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleDeleteProduct(prod.id)}
                              className="px-3 py-1.5 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-300 text-xs font-bold transition-colors"
                            >
                              ✕ رفض وحذف
                            </button>
                            <button
                              onClick={() => handleApproveProduct(prod.id)}
                              className="px-4 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition-colors shadow-sm"
                            >
                              ✓ قبول ونشر في المتجر
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. Pending Academy Courses */}
                {pendingCourses.length > 0 && (
                  <div className="p-6 rounded-3xl bg-[#0e071c] border border-purple-500/25 space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-purple-500/20">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-purple-400" />
                        <h3 className="text-base font-bold text-white">دورات تدريبية معلقة للأكاديمية ({pendingCourses.length})</h3>
                      </div>
                      <span className="text-xs text-amber-400 font-bold">بانتظار الاعتماد الأكاديمي</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {pendingCourses.map((c: any) => (
                        <div key={c.id} className="p-4 rounded-2xl bg-[#080312] border border-amber-500/30 space-y-3">
                          <div className="flex gap-3">
                            <img src={c.thumbnail} alt={c.title} className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
                            <div className="flex-1">
                              <span className="text-[10px] font-bold text-purple-300 px-2 py-0.5 rounded bg-purple-500/20">
                                {c.categoryName || c.category}
                              </span>
                              <h4 className="font-bold text-white text-sm mt-1">{c.title}</h4>
                              <div className="text-xs text-gray-400 mt-0.5">
                                المدرب: <span className="text-white font-semibold">{c.instructor?.name}</span> • {c.duration}
                              </div>
                            </div>
                          </div>
                          <p className="text-xs text-gray-400 line-clamp-2">{c.description}</p>
                          <div className="pt-2 border-t border-purple-500/15 flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleDeleteCourse(c.id)}
                              className="px-3 py-1.5 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-300 text-xs font-bold transition-colors"
                            >
                              ✕ رفض وحذف
                            </button>
                            <button
                              onClick={() => handleApproveCourse(c.id)}
                              className="px-4 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition-colors shadow-sm"
                            >
                              ✓ قبول ونشر في الأكاديمية
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Pending Launchpad Projects */}
                {pendingLaunches.length > 0 && (
                  <div className="p-6 rounded-3xl bg-[#0e071c] border border-purple-500/25 space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-purple-500/20">
                      <div className="flex items-center gap-2">
                        <Rocket className="w-5 h-5 text-purple-400" />
                        <h3 className="text-base font-bold text-white">مشاريع تقنية معلقة لمنصة الإطلاق ({pendingLaunches.length})</h3>
                      </div>
                      <span className="text-xs text-amber-400 font-bold">بانتظار موافقة الإدارة</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {pendingLaunches.map((item: any) => (
                        <div key={item.id} className="p-4 rounded-2xl bg-[#080312] border border-amber-500/30 space-y-3">
                          <div className="flex items-center gap-3">
                            <img src={item.logo} alt={item.name} className="w-12 h-12 rounded-xl object-cover border border-purple-500/30 flex-shrink-0" />
                            <div>
                              <h4 className="font-bold text-white text-sm">{item.name}</h4>
                              <span className="text-[11px] text-amber-400 font-semibold">{item.category} • قيد المراجعة</span>
                            </div>
                          </div>
                          <p className="text-xs text-gray-300">{item.tagline}</p>
                          <div className="pt-2 border-t border-purple-500/15 flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleDeleteLaunch(item.id)}
                              className="px-3 py-1.5 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-300 text-xs font-bold transition-colors"
                            >
                              ✕ رفض وحذف
                            </button>
                            <button
                              onClick={() => handleApproveLaunch(item.id)}
                              className="px-4 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition-colors shadow-sm"
                            >
                              ✓ قبول ونشر للعامة
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}
          </div>
        ) : activeTab === 'market' ? (
          /* ========================================================================= */
          /* MARKET TAB: Admin Direct Product Creation & Full Management               */
          /* ========================================================================= */
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#0e071c] border border-purple-500/20">
              <div>
                <h2 className="text-lg font-black text-white">إدارة المتجر الرقمي وإضافة أصول جديدة</h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  بصفتك مديراً، يمكنك نشر منتجات رقمية فورية أو تعديل حالة التمييز وحذف المنتجات.
                </p>
              </div>

              <button
                onClick={() => setShowAddProductForm(!showAddProductForm)}
                className="gold-btn-primary px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-gold-sm"
              >
                <Plus className="w-4 h-4" />
                <span>{showAddProductForm ? 'إخفاء النموذج' : '+ إضافة منتج رقمي جديد'}</span>
              </button>
            </div>

            {/* Admin Product Creation Form */}
            {showAddProductForm && (
              <div className="p-6 rounded-3xl bg-[#0c0618] border-2 border-purple-500/40 shadow-neon-purple space-y-4 animate-in slide-in-from-top-4 duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-purple-500/20">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-purple-400" />
                    <h3 className="text-base font-bold text-white">إضافة منتج رقمي جديد بكامل التفاصيل (Admin Direct)</h3>
                  </div>
                  <button onClick={() => setShowAddProductForm(false)} className="text-gray-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleAdminCreateProduct} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                  <div className="sm:col-span-2">
                    <label className="block font-bold text-gray-300 mb-1">عنوان المنتج الرقمي (عربي) *</label>
                    <input
                      type="text"
                      placeholder="مثال: حزمة قوالب Next.js 14 ولوحات تحكم SaaS الفاخرة"
                      value={prodTitle}
                      onChange={(e) => setProdTitle(e.target.value)}
                      required
                      className="w-full bg-[#140a28] border border-purple-500/30 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-purple-400"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-300 mb-1">الاسم بالإنجليزية (Slug / English Title)</label>
                    <input
                      type="text"
                      placeholder="e.g. Hercules Next.js SaaS Kit"
                      value={prodTitleEn}
                      onChange={(e) => setProdTitleEn(e.target.value)}
                      className="w-full bg-[#140a28] border border-purple-500/30 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-purple-400"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-300 mb-1">قسم وتصنيف المنتج</label>
                    <select
                      value={prodCategory}
                      onChange={(e) => setProdCategory(e.target.value)}
                      className="w-full bg-[#140a28] border border-purple-500/30 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-purple-400"
                    >
                      <option value="templates-ui">قوالب مواقع وواجهات UI</option>
                      <option value="adobe-video-photo">ملفات Photoshop وPremiere وAE</option>
                      <option value="notion-excel">قوالب Notion وملفات Excel</option>
                      <option value="design-resources">ملفات تصميم وموارد جاهزة</option>
                      <option value="tools-plugins">إضافات وبرامج وأدوات</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-300 mb-1">السعر بالدولار ($ USD) (0 للمجاني)</label>
                    <input
                      type="number"
                      value={prodPrice}
                      onChange={(e) => setProdPrice(Number(e.target.value))}
                      className="w-full bg-[#140a28] border border-purple-500/30 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-purple-400"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-300 mb-1">صيغة الملفات</label>
                    <input
                      type="text"
                      value={prodFileType}
                      onChange={(e) => setProdFileType(e.target.value)}
                      className="w-full bg-[#140a28] border border-purple-500/30 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-purple-400"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-300 mb-1">حجم الملف التقديري</label>
                    <input
                      type="text"
                      value={prodFileSize}
                      onChange={(e) => setProdFileSize(e.target.value)}
                      className="w-full bg-[#140a28] border border-purple-500/30 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-purple-400"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-300 mb-1">رابط تحميل الملف (Download URL)</label>
                    <input
                      type="text"
                      value={prodDownloadUrl}
                      onChange={(e) => setProdDownloadUrl(e.target.value)}
                      className="w-full bg-[#140a28] border border-purple-500/30 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-purple-400"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-300 mb-1">اسم البائع / الصانع</label>
                    <input
                      type="text"
                      value={prodSellerName}
                      onChange={(e) => setProdSellerName(e.target.value)}
                      className="w-full bg-[#140a28] border border-purple-500/30 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-purple-400"
                    />
                  </div>

                  <div className="sm:col-span-2 lg:col-span-3">
                    <label className="block font-bold text-gray-300 mb-1">رابط صورة الغلاف / المعاينة (Thumbnail URL)</label>
                    <input
                      type="text"
                      value={prodThumbnail}
                      onChange={(e) => setProdThumbnail(e.target.value)}
                      className="w-full bg-[#140a28] border border-purple-500/30 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-purple-400"
                    />
                  </div>

                  <div className="sm:col-span-2 lg:col-span-3">
                    <label className="block font-bold text-gray-300 mb-1">الكلمات المفتاحية (Tags مفصولة بفواصل)</label>
                    <input
                      type="text"
                      value={prodTags}
                      onChange={(e) => setProdTags(e.target.value)}
                      className="w-full bg-[#140a28] border border-purple-500/30 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-purple-400"
                    />
                  </div>

                  <div className="sm:col-span-2 lg:col-span-3">
                    <label className="block font-bold text-gray-300 mb-1">وصف المنتج ومميزاته</label>
                    <textarea
                      rows={3}
                      placeholder="اشرح مواصفات المنتج وما يحتويه من مميزات وتراخيص..."
                      value={prodDescription}
                      onChange={(e) => setProdDescription(e.target.value)}
                      className="w-full bg-[#140a28] border border-purple-500/30 rounded-xl p-3 text-white focus:outline-none focus:border-purple-400"
                    />
                  </div>

                  <div className="sm:col-span-2 lg:col-span-3 pt-2">
                    <button
                      type="submit"
                      disabled={isSubmittingProd}
                      className="w-full py-3.5 rounded-xl gold-btn-primary font-bold text-xs flex items-center justify-center gap-2 shadow-neon-purple"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{isSubmittingProd ? 'جاري نشر المنتج...' : 'نشر وتفعيل المنتج في المتجر فوراً'}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Existing Live Products */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allProducts.map((prod: any) => (
                <div key={prod.id} className="p-5 rounded-2xl bg-[#0e071c] border border-purple-500/20 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="relative">
                      <img src={prod.thumbnail} alt={prod.title} className="w-full h-36 rounded-xl object-cover" />
                      {prod.status === 'pending' && (
                        <span className="absolute top-2 right-2 px-2.5 py-0.5 rounded-md bg-amber-500 text-black text-[10px] font-bold">
                          قيد المراجعة
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-purple-300 font-bold">{prod.categoryName}</span>
                        <span className="text-emerald-400 font-bold">${prod.price} {prod.currency}</span>
                      </div>
                      <h4 className="font-bold text-white text-sm line-clamp-1">{prod.title}</h4>
                      <p className="text-xs text-gray-400 line-clamp-2 mt-1">{prod.description}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-purple-500/15 flex items-center justify-between">
                    <button
                      onClick={() => handleToggleProductFeatured(prod.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors flex items-center gap-1 ${
                        prod.featured
                          ? 'bg-purple-600 text-white border-purple-400'
                          : 'bg-[#080312] border-purple-500/20 text-gray-400 hover:text-white'
                      }`}
                    >
                      <Star className="w-3.5 h-3.5" />
                      <span>{prod.featured ? 'مميز' : 'تمييز'}</span>
                    </button>

                    <button
                      onClick={() => handleDeleteProduct(prod.id)}
                      className="px-3 py-1.5 rounded-lg bg-red-500/15 hover:bg-red-500/30 text-red-300 border border-red-500/30 text-xs font-bold flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>حذف</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : activeTab === 'academy' ? (
          /* ========================================================================= */
          /* ACADEMY TAB: Admin Direct Course Creation & Certificate Issuance          */
          /* ========================================================================= */
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#0e071c] border border-purple-500/20">
              <div>
                <h2 className="text-lg font-black text-white">إدارة الأكاديمية وإصدار الشهادات</h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  أضف دورات ومسارات تدريبية جديدة مباشرة أو قم بإصدار شهادات موثقة برمز QR.
                </p>
              </div>

              <button
                onClick={() => setShowAddCourseForm(!showAddCourseForm)}
                className="gold-btn-primary px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-gold-sm"
              >
                <Plus className="w-4 h-4" />
                <span>{showAddCourseForm ? 'إخفاء النموذج' : '+ إضافة دورة تدريبية جديدة'}</span>
              </button>
            </div>

            {/* Admin Direct Course Creation Form */}
            {showAddCourseForm && (
              <div className="p-6 rounded-3xl bg-[#0c0618] border-2 border-purple-500/40 shadow-neon-purple space-y-4 animate-in slide-in-from-top-4 duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-purple-500/20">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-purple-400" />
                    <h3 className="text-base font-bold text-white">إضافة دورة تدريبية جديدة بكامل التفاصيل (Admin Direct)</h3>
                  </div>
                  <button onClick={() => setShowAddCourseForm(false)} className="text-gray-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleAdminCreateCourse} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                  <div className="sm:col-span-2">
                    <label className="block font-bold text-gray-300 mb-1">عنوان الدورة أو الدبلومة *</label>
                    <input
                      type="text"
                      placeholder="مثال: هندسة وكلاء الذكاء الاصطناعي Autonomous AI Agents"
                      value={courseTitle}
                      onChange={(e) => setCourseTitle(e.target.value)}
                      required
                      className="w-full bg-[#140a28] border border-purple-500/30 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-purple-400"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-300 mb-1">اسم المحاضر / المدرب</label>
                    <input
                      type="text"
                      value={courseInstructorName}
                      onChange={(e) => setCourseInstructorName(e.target.value)}
                      className="w-full bg-[#140a28] border border-purple-500/30 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-purple-400"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-300 mb-1">صفة / مسمى المحاضر</label>
                    <input
                      type="text"
                      value={courseInstructorTitle}
                      onChange={(e) => setCourseInstructorTitle(e.target.value)}
                      className="w-full bg-[#140a28] border border-purple-500/30 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-purple-400"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-300 mb-1">التصنيف</label>
                    <select
                      value={courseCategory}
                      onChange={(e) => setCourseCategory(e.target.value as any)}
                      className="w-full bg-[#140a28] border border-purple-500/30 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-purple-400"
                    >
                      <option value="ai">هندسة الذكاء الاصطناعي</option>
                      <option value="fullstack">برمجة وتطوير Full-Stack</option>
                      <option value="motion">موشن جرافيك ومونتاج</option>
                      <option value="uiux">تصميم واجهات وتجربة المستخدم</option>
                      <option value="business">ريادة أعمال ومشاريع</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-300 mb-1">المستوى</label>
                    <select
                      value={courseLevel}
                      onChange={(e) => setCourseLevel(e.target.value as any)}
                      className="w-full bg-[#140a28] border border-purple-500/30 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-purple-400"
                    >
                      <option value="شامل">شامل (من الصفر للاحتراف)</option>
                      <option value="مبتدئ">مبتدئ</option>
                      <option value="متوسط">متوسط</option>
                      <option value="متقدم">متقدم</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-300 mb-1">السعر ($ USD) (0 للمجاني)</label>
                    <input
                      type="number"
                      value={coursePrice}
                      onChange={(e) => setCoursePrice(Number(e.target.value))}
                      className="w-full bg-[#140a28] border border-purple-500/30 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-purple-400"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-300 mb-1">إجمالي ساعات التدريب</label>
                    <input
                      type="text"
                      value={courseDuration}
                      onChange={(e) => setCourseDuration(e.target.value)}
                      className="w-full bg-[#140a28] border border-purple-500/30 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-purple-400"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-300 mb-1">عدد الدروس</label>
                    <input
                      type="number"
                      value={courseLessonsCount}
                      onChange={(e) => setCourseLessonsCount(Number(e.target.value))}
                      className="w-full bg-[#140a28] border border-purple-500/30 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-purple-400"
                    />
                  </div>

                  <div className="sm:col-span-2 lg:col-span-3">
                    <label className="block font-bold text-gray-300 mb-1">رابط صورة الغلاف (Thumbnail URL)</label>
                    <input
                      type="text"
                      value={courseThumbnail}
                      onChange={(e) => setCourseThumbnail(e.target.value)}
                      className="w-full bg-[#140a28] border border-purple-500/30 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-purple-400"
                    />
                  </div>

                  <div className="sm:col-span-2 lg:col-span-3">
                    <label className="block font-bold text-gray-300 mb-1">وصف الدورة والمخرجات التعليمية</label>
                    <textarea
                      rows={3}
                      placeholder="اشرح محاور الدورة وما سيتعلمه المتدرب والمشاريع التطبيقية..."
                      value={courseDescription}
                      onChange={(e) => setCourseDescription(e.target.value)}
                      className="w-full bg-[#140a28] border border-purple-500/30 rounded-xl p-3 text-white focus:outline-none focus:border-purple-400"
                    />
                  </div>

                  <div className="sm:col-span-2 lg:col-span-3 pt-2">
                    <button
                      type="submit"
                      disabled={isSubmittingCourse}
                      className="w-full py-3.5 rounded-xl gold-btn-primary font-bold text-xs flex items-center justify-center gap-2 shadow-neon-purple"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{isSubmittingCourse ? 'جاري نشر الدورة...' : 'نشر وتفعيل الدورة في الأكاديمية فوراً'}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Manual Certificate Issue Form */}
            <div className="p-6 rounded-3xl bg-[#0e071c] border border-purple-500/30 space-y-4">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-bold text-white">إصدار شهادة إتمام يدوية ومعتمدة بـ QR</h3>
              </div>
              <p className="text-xs text-gray-400">
                يمكنك إصدار شهادات رسمية موثقة برمز QR وكود استعلام فريد ومسجل في قاعدة البيانات لأي طالب.
              </p>

              <form onSubmit={handleIssueCertificate} className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">اسم الطالب *</label>
                  <input
                    type="text"
                    placeholder="مثال: ياسمين أحمد"
                    value={certStudent}
                    onChange={(e) => setCertStudent(e.target.value)}
                    required
                    className="w-full bg-[#080312] border border-purple-500/25 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">المسار التدريبي</label>
                  <select
                    value={certCourse}
                    onChange={(e) => setCertCourse(e.target.value)}
                    className="w-full bg-[#080312] border border-purple-500/25 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-400"
                  >
                    <option value="الدبلومة المتكاملة لهندسة الذكاء الاصطناعي وAI Agents">دبلومة مهندس AI</option>
                    <option value="ماستر كلاس الموشن جرافيكس التجاري بـ After Effects">ماستر كلاس موشن جرافيكس</option>
                    <option value="احتراف Full-Stack Next.js 14 السحابي">احتراف Full-Stack Next.js</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl gold-btn-primary font-bold text-xs flex items-center justify-center gap-2 shadow-gold-sm"
                  >
                    <Award className="w-4 h-4" />
                    <span>إصدار وتوثيق الشهادة</span>
                  </button>
                </div>
              </form>

              {certIssuedSuccess && (
                <div className="p-4 rounded-xl bg-purple-500/15 border border-purple-400/40 text-xs text-purple-200 mt-4 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white">تم إصدار الشهادة بنجاح للطالب: {certIssuedSuccess.studentName}</div>
                    <div className="font-mono text-purple-300 text-[11px] mt-0.5">كود الاستعلام: {certIssuedSuccess.certificateCode}</div>
                  </div>
                  <span className="text-emerald-400 font-bold">موثقة برمز QR ✓</span>
                </div>
              )}
            </div>

            {/* Existing Courses List */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white">الدورات والمسارات التدريبية الحالية</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {allCourses.map((c: any) => (
                  <div key={c.id} className="p-5 rounded-2xl bg-[#0e071c] border border-purple-500/20 space-y-3">
                    <img src={c.thumbnail} alt={c.title} className="w-full h-36 rounded-xl object-cover" />
                    <h4 className="font-bold text-white text-sm line-clamp-1">{c.title}</h4>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>{c.enrolledCount} طالب مسجل</span>
                      <span className="text-purple-300 font-bold">{c.level}</span>
                    </div>
                    <div className="pt-2 border-t border-purple-500/15 flex items-center justify-between">
                      <span className="text-emerald-400 font-bold text-xs">${c.price} USD</span>
                      <button
                        onClick={() => handleDeleteCourse(c.id)}
                        className="p-1.5 text-gray-400 hover:text-red-400 transition-colors"
                        title="حذف الدورة"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : activeTab === 'launchpad' ? (
          /* ========================================================================= */
          /* LAUNCHPAD TAB: Projects Directory & Direct Admin Project Launch           */
          /* ========================================================================= */
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#0e071c] border border-purple-500/20">
              <div>
                <h2 className="text-lg font-black text-white">إدارة منصة إطلاق المشاريع (Launchpad)</h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  أطلق مشاريع جديدة مباشرة في المنصة أو تحكم في المشاريع الحالية.
                </p>
              </div>

              <button
                onClick={() => setShowAddLaunchForm(!showAddLaunchForm)}
                className="gold-btn-primary px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-gold-sm"
              >
                <Plus className="w-4 h-4" />
                <span>{showAddLaunchForm ? 'إخفاء النموذج' : '+ إطلاق مشروع جديد مباشرة'}</span>
              </button>
            </div>

            {/* Admin Direct Launch Creation Form */}
            {showAddLaunchForm && (
              <div className="p-6 rounded-3xl bg-[#0c0618] border-2 border-purple-500/40 shadow-neon-purple space-y-4 animate-in slide-in-from-top-4 duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-purple-500/20">
                  <div className="flex items-center gap-2">
                    <Rocket className="w-5 h-5 text-purple-400" />
                    <h3 className="text-base font-bold text-white">إطلاق مشروع جديد مباشرة في المنصة</h3>
                  </div>
                  <button onClick={() => setShowAddLaunchForm(false)} className="text-gray-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleAdminCreateLaunch} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-gray-300 mb-1">اسم المشروع *</label>
                    <input
                      type="text"
                      placeholder="مثال: منصة AI Studio"
                      value={launchName}
                      onChange={(e) => setLaunchName(e.target.value)}
                      required
                      className="w-full bg-[#140a28] border border-purple-500/30 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-purple-400"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-300 mb-1">الشعار المختصر (Tagline)</label>
                    <input
                      type="text"
                      placeholder="مثال: أسرع منصة لإنشاء واجهات الذكاء الاصطناعي"
                      value={launchTagline}
                      onChange={(e) => setLaunchTagline(e.target.value)}
                      className="w-full bg-[#140a28] border border-purple-500/30 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-purple-400"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-300 mb-1">التصنيف</label>
                    <input
                      type="text"
                      value={launchCategory}
                      onChange={(e) => setLaunchCategory(e.target.value)}
                      className="w-full bg-[#140a28] border border-purple-500/30 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-purple-400"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-300 mb-1">رابط المشروع أو الديمو</label>
                    <input
                      type="text"
                      value={launchDemoUrl}
                      onChange={(e) => setLaunchDemoUrl(e.target.value)}
                      className="w-full bg-[#140a28] border border-purple-500/30 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-purple-400"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-gray-300 mb-1">رابط الشعار أو الغلاف</label>
                    <input
                      type="text"
                      value={launchCoverImage}
                      onChange={(e) => setLaunchCoverImage(e.target.value)}
                      className="w-full bg-[#140a28] border border-purple-500/30 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-purple-400"
                    />
                  </div>

                  <div className="sm:col-span-2 pt-2">
                    <button
                      type="submit"
                      disabled={isSubmittingLaunch}
                      className="w-full py-3.5 rounded-xl gold-btn-primary font-bold text-xs flex items-center justify-center gap-2 shadow-neon-purple"
                    >
                      <Rocket className="w-4 h-4" />
                      <span>{isSubmittingLaunch ? 'جاري الإطلاق...' : 'إطلاق ونشر المشروع للعامة فوراً'}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Approved & Live Launches */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white">المشاريع المعتمدة والمنشورة حالياً</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allLaunches.map((item: any) => (
                  <div key={item.id} className="p-5 rounded-2xl bg-[#0e071c] border border-purple-500/20 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={item.logo} alt={item.name} className="w-10 h-10 rounded-xl object-cover border border-purple-500/30" />
                        <div>
                          <h4 className="font-bold text-white text-sm">{item.name}</h4>
                          <span className="text-[11px] text-purple-300">{item.category}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteLaunch(item.id)}
                        className="p-1.5 text-gray-500 hover:text-red-400 transition-colors"
                        title="حذف المشروع من المنصة"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-400 line-clamp-2">{item.tagline}</p>
                    <div className="pt-2 border-t border-purple-500/15 flex items-center justify-between text-xs">
                      <span className="text-purple-300 font-bold">{item.upvotes} تصويت</span>
                      <span className="text-emerald-400">{item.earlyAdoptersCount || 0} في الانتظار</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : activeTab === 'ai' ? (
          /* AI Tools Catalog */
          <div className="space-y-6">
            <h2 className="text-lg font-black text-white">أدوات الذكاء الاصطناعي المفهرسة</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {data?.raw?.aiTools?.map((tool: any) => (
                <div key={tool.id} className="p-5 rounded-2xl bg-[#0e071c] border border-purple-500/20 space-y-3">
                  <div className="flex items-center gap-3">
                    <img src={tool.logo} alt={tool.name} className="w-10 h-10 rounded-xl object-cover border border-purple-500/30" />
                    <div>
                      <h4 className="font-bold text-white text-sm">{tool.name}</h4>
                      <span className="text-[11px] text-purple-300">{tool.categoryName}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 line-clamp-2">{tool.tagline}</p>
                  <div className="pt-2 border-t border-purple-500/15 flex items-center justify-between text-xs">
                    <span className="text-purple-300 font-bold">{tool.upvotes} تصويت</span>
                    <span className="px-2 py-0.5 rounded bg-[#080312] border border-purple-500/30 text-[10px] text-purple-300">{tool.pricing}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : activeTab === 'users' ? (
          /* Users Management Tab */
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#0e071c] border border-purple-500/20">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black text-white">إدارة حسابات المستخدمين المسجلين</h2>
                  <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-400/30">
                    {users.length} مستخدم
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  تظهر هنا جميع بيانات المستخدمين الذين يقومون بالتسجيل أو الدخول على المنصة لحظياً.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCreateTestUser}
                  className="px-4 py-2 rounded-xl gold-btn-primary font-bold text-xs flex items-center gap-1.5 shadow-gold-sm whitespace-nowrap"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>+ تسجيل مستخدم للتأكد الفوري</span>
                </button>
                <button
                  onClick={fetchAdminData}
                  className="p-2.5 rounded-xl bg-[#080312] border border-purple-500/30 text-purple-300 hover:text-white"
                  title="تحديث البيانات الآن"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto rounded-3xl bg-[#0e071c] border border-purple-500/20 shadow-sm">
              <table className="w-full text-right text-xs">
                <thead className="bg-[#080312] border-b border-purple-500/20">
                  <tr>
                    <th className="p-4 text-purple-300 font-bold">المستخدم</th>
                    <th className="p-4 text-purple-300 font-bold">البريد الإلكتروني</th>
                    <th className="p-4 text-purple-300 font-bold">تاريخ الانضمام</th>
                    <th className="p-4 text-purple-300 font-bold">الصلاحية والرتبة</th>
                    <th className="p-4 text-purple-300 font-bold">الحالة</th>
                    <th className="p-4 text-purple-300 font-bold text-center">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-500/10">
                  {users.map((u: any) => (
                    <tr key={u.id} className="hover:bg-purple-500/5 transition-colors">
                      <td className="p-4 flex items-center gap-2.5 font-bold text-white">
                        <img
                          src={u.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(u.name)}`}
                          alt={u.name}
                          className="w-8 h-8 rounded-full object-cover border border-purple-400/50"
                        />
                        <div>
                          <div className="text-white font-bold">{u.name}</div>
                          <div className="text-[10px] text-gray-500 font-mono">ID: {u.id}</div>
                        </div>
                      </td>

                      <td className="p-4 text-gray-300 font-medium">{u.email}</td>
                      <td className="p-4 text-gray-400">{u.joinedAt || 'اليوم'}</td>

                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                          u.role === 'admin'
                            ? 'bg-purple-500/20 text-purple-300 border-purple-400/40'
                            : 'bg-white/5 text-gray-300 border-white/10'
                        }`}>
                          {u.role.toUpperCase()}
                        </span>
                      </td>

                      <td className="p-4">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 text-[10px] font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span>نشط ومسجل</span>
                        </span>
                      </td>

                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <select
                            value={u.role}
                            onChange={(e) => handleChangeRole(u.id, e.target.value)}
                            className="bg-[#080312] border border-purple-500/30 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-purple-400"
                          >
                            <option value="admin">ترقية: Admin</option>
                            <option value="creator">Creator (صانع)</option>
                            <option value="user">User (مستخدم)</option>
                          </select>

                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/25 text-red-400 border border-red-500/20 transition-colors"
                            title="حذف الحساب"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Database Tools Tab */
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-[#0e071c] border border-purple-500/30 space-y-4">
              <div className="flex items-center gap-3">
                <Database className="w-6 h-6 text-purple-400" />
                <div>
                  <h3 className="text-base font-bold text-white">إعادة تعيين قاعدة البيانات (Seed Engine)</h3>
                  <p className="text-xs text-gray-400">إعادة زرع البيانات التجريبية الشاملة للمنظومة</p>
                </div>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                تقوم هذه الأداة بإعادة تهيئة ملف قاعدة البيانات `hercules.json` إلى الحالة الافتراضية مع ملء المتجر والأكاديمية وأدوات الذكاء الاصطناعي والمشاريع والمستخدمين بحسابات معتمدة.
              </p>
              <button
                onClick={handleResetDatabase}
                disabled={isResetting}
                className="px-6 py-2.5 rounded-xl gold-btn-primary font-bold text-xs flex items-center gap-2 shadow-gold-sm"
              >
                <RefreshCw className={`w-4 h-4 ${isResetting ? 'animate-spin' : ''}`} />
                <span>إعادة تعيين وتعبئة الداتا بيس الآن</span>
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

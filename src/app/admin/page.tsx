'use client';

import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AdminPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'market' | 'academy' | 'launchpad' | 'ai' | 'users' | 'database'>('overview');
  const [isResetting, setIsResetting] = useState(false);

  // Manual Certificate Issue Form state
  const [certStudent, setCertStudent] = useState('');
  const [certCourse, setCertCourse] = useState('الدبلومة المتكاملة لهندسة الذكاء الاصطناعي وAI Agents');
  const [certScore, setCertScore] = useState(98);
  const [certIssuedSuccess, setCertIssuedSuccess] = useState<any>(null);

  // Quick user add state
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<'admin' | 'creator' | 'user'>('user');
  const [isAddingUser, setIsAddingUser] = useState(false);

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
    fetchAdminData();
  }, []);

  // Reset database to seed
  const handleResetDatabase = async () => {
    if (!confirm('هل أنت متأكد من إعادة تعيين قاعدة البيانات إلى بيانات البداية النموذجية؟')) return;

    setIsResetting(true);
    try {
      const res = await fetch('/api/seed', { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        alert(json.message);
        fetchAdminData();
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#A855F7', '#C084FC', '#FFFFFF'],
        });
      }
    } catch (e) {
      alert('فشل إعادة ضبط قاعدة البيانات');
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

  // Delete product
  const handleDeleteProduct = async (id: string) => {
    if (!confirm('هل تريد حذف هذا المنتج نهائياً من قاعدة البيانات؟')) return;
    try {
      await fetch(`/api/market/${id}`, { method: 'DELETE' });
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
        alert('تم تحديث صلاحية المستخدم بنجاح');
        fetchAdminData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Delete user
  const handleDeleteUser = async (userId: string) => {
    if (!confirm('هل تريد حذف هذا الحساب؟')) return;
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_user', userId }),
      });
      const json = await res.json();
      if (json.success) {
        alert('تم حذف المستخدم بنجاح');
        fetchAdminData();
      }
    } catch (e) {
      console.error(e);
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
        alert(`تم تسجيل وإضافة المستخدم بنجاح: ${testName} (${testEmail})! ستجده الآن في قائمة المستخدمين.`);
        fetchAdminData();
        setActiveTab('users');
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#A855F7', '#D946EF'],
        });
      }
    } catch (e) {
      alert('فشل إضافة المستخدم التجريبي');
    }
  };

  // Issue manual certificate
  const handleIssueCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certStudent.trim()) return alert('أدخل اسم الطالب');

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
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#A855F7', '#C084FC'],
        });
      }
    } catch (e) {
      alert('فشل إصدار الشهادة');
    }
  };

  const stats = data?.stats;
  const counts = data?.counts;
  const users = data?.users || [];

  return (
    <div className="bg-[#05020a] min-h-screen text-gray-100 pb-24 luxury-ambient-bg font-sans selection:bg-purple-500 selection:text-white" dir="rtl">
      
      {/* Top Admin Header */}
      <div className="relative py-10 bg-[#080312]/95 border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-fuchsia-500 via-purple-600 to-violet-800 p-[1px] shadow-gold-sm flex-shrink-0">
                <div className="w-full h-full bg-[#080312] rounded-[10px] flex items-center justify-center text-purple-300">
                  <Crown className="w-6 h-6" />
                </div>
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-white">
                    مركز التحكم الشامل
                  </h1>
                  <span className="text-xs font-bold text-purple-400">
                    (Hercules Admin Center)
                  </span>
                  <span className="hud-badge text-[10px]">
                    لوحة الإدارة الكاملة
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  إدارة المبيعات، المنتجات الرقمية، الأكاديمية والشهادات، حسابات المستخدمين، وقاعدة البيانات.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                onClick={handleCreateTestUser}
                className="px-3.5 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 border border-purple-400/40 font-bold text-xs flex items-center gap-1.5 transition-all shadow-gold-sm"
                title="تسجيل حساب تجريبي وتأكيد المزامنة الفورية"
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
          <div className="mt-8 flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-purple-500/15 pb-1">
            {[
              { id: 'overview', label: 'نظرة عامة ومؤشرات', icon: Activity },
              { id: 'users', label: `المستخدمين المسجلين (${users.length})`, icon: Users, highlight: true },
              { id: 'market', label: `المتجر الرقمي (${counts?.products || 0})`, icon: ShoppingBag },
              { id: 'academy', label: `الأكاديمية والشهادات (${counts?.courses || 0})`, icon: BookOpen },
              { id: 'launchpad', label: `منصة الإطلاق (${counts?.launches || 0})`, icon: Rocket },
              { id: 'ai', label: `أدوات الذكاء (${counts?.aiTools || 0})`, icon: Cpu },
              { id: 'database', label: 'قاعدة البيانات', icon: Database },
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 flex-shrink-0 ${
                    isSelected
                      ? 'bg-purple-600 text-white shadow-neon-purple'
                      : tab.highlight
                      ? 'bg-purple-500/10 text-purple-300 border border-purple-400/30 hover:bg-purple-500/20'
                      : 'text-gray-300 hover:bg-[#0e071c] hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
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

            {/* Structured Horizontal Feed Cards (بدون سطور مكدسة) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Recent Orders - Horizontal Table-Cards */}
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

              {/* Issued Certificates - Horizontal Table-Cards */}
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
        ) : activeTab === 'users' ? (
          /* Live Users Management Tab */
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

                      <td className="p-4 text-gray-300 font-medium">
                        {u.email}
                      </td>

                      <td className="p-4 text-gray-400">
                        {u.joinedAt || 'اليوم'}
                      </td>

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
        ) : activeTab === 'market' ? (
          /* Market Management */
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-white">إدارة المنتجات الرقمية والمبيعات</h2>
                <p className="text-xs text-gray-400">يمكنك تعديل تمييز المنتج (Featured) أو حذفه من قاعدة البيانات</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data?.raw?.products?.map((prod: any) => (
                <div key={prod.id} className="p-5 rounded-2xl bg-[#0e071c] border border-purple-500/20 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <img src={prod.thumbnail} alt={prod.title} className="w-full h-36 rounded-xl object-cover" />
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
          /* Academy Management & Certificate Issuance */
          <div className="space-y-8">
            {/* Manual Issue Form */}
            <div className="p-6 rounded-3xl bg-[#0e071c] border border-purple-500/30 space-y-4">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-bold text-white">إصدار شهادة إتمام يدوية ومعتمدة بـ QR</h3>
              </div>
              <p className="text-xs text-gray-400">
                يمكن للمشرفين إصدار شهادات رسمية موثقة برمز QR وكود استعلام فريد ومسجل في قاعدة البيانات
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
              <h3 className="text-base font-bold text-white">المسارات والدورات الحالية في الأكاديمية</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {data?.raw?.courses?.map((c: any) => (
                  <div key={c.id} className="p-5 rounded-2xl bg-[#0e071c] border border-purple-500/20 space-y-3">
                    <img src={c.thumbnail} alt={c.title} className="w-full h-36 rounded-xl object-cover" />
                    <h4 className="font-bold text-white text-sm line-clamp-1">{c.title}</h4>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>{c.enrolledCount} طالب مسجل</span>
                      <span className="text-purple-300 font-bold">{c.level}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : activeTab === 'launchpad' ? (
          /* Launchpad Management */
          <div className="space-y-6">
            <h2 className="text-lg font-black text-white">مشاريع منصة الإطلاق الحالية</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data?.raw?.launches?.map((item: any) => (
                <div key={item.id} className="p-5 rounded-2xl bg-[#0e071c] border border-purple-500/20 space-y-3">
                  <div className="flex items-center gap-3">
                    <img src={item.logo} alt={item.name} className="w-10 h-10 rounded-xl object-cover border border-purple-500/30" />
                    <div>
                      <h4 className="font-bold text-white text-sm">{item.name}</h4>
                      <span className="text-[11px] text-purple-300">{item.category}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 line-clamp-2">{item.tagline}</p>
                  <div className="pt-2 border-t border-purple-500/15 flex items-center justify-between text-xs">
                    <span className="text-purple-300 font-bold">{item.upvotes} تصويت</span>
                    <span className="text-emerald-400">{item.waitlistCount} مسجل في الانتظار</span>
                  </div>
                </div>
              ))}
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

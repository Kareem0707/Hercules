'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { X, User, Mail, Lock, Sparkles, CheckCircle2 } from 'lucide-react';

export function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, authTab, setAuthTab, login, register } = useAuth();
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (authTab === 'login') {
        const ok = await login(email, password);
        if (ok) {
          setSuccessMsg('تم تسجيل الدخول بنجاح! مرحباً بك.');
          showToast('أهلاً بك مجدداً في هِـرْكِـلِـيز! 👑', 'purple');
          setTimeout(() => {
            closeAuthModal();
          }, 600);
        } else {
          setError('فشل تسجيل الدخول. يرجى التأكد من البريد الإلكتروني.');
          showToast('فشل تسجيل الدخول. يرجى التأكد من بياناتك.', 'error');
        }
      } else {
        if (!name.trim()) {
          setError('يرجى كتابة الاسم الكامل.');
          setLoading(false);
          return;
        }
        const ok = await register(name, email, password);
        if (ok) {
          setSuccessMsg('تم إنشاء حسابك بنجاح! تم تسجيل بياناتك في النظام.');
          showToast(`تم إنشاء حسابك بنجاح! أهلاً بك يا ${name} 🌟`, 'success');
          setTimeout(() => {
            closeAuthModal();
          }, 600);
        } else {
          setError('حدث خطأ أثناء إنشاء الحساب.');
          showToast('حدث خطأ أثناء إنشاء الحساب.', 'error');
        }
      }
    } catch (err: any) {
      setError(err.message || 'حدث خطأ غير متوقع');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-md rounded-3xl bg-[#0e071c] border border-purple-500/40 text-white shadow-neon-purple p-6 sm:p-8 animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-5 left-5 text-gray-400 hover:text-white p-1.5 rounded-xl hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-fuchsia-500 via-purple-600 to-violet-800 p-[1px] shadow-gold-sm mx-auto mb-3 flex items-center justify-center">
            <div className="w-full h-full bg-[#080312] rounded-[15px] flex items-center justify-center text-purple-300">
              <Sparkles className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-xl font-black text-white">
            {authTab === 'login' ? 'تسجيل الدخول إلى هِـرْكِـلِـيز' : 'إنشاء حساب جديد في هِـرْكِـلِـيز'}
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            المنظومة الرقمية الشاملة للأصول، التعليم، الذكاء، والمشاريع
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-[#080312] rounded-2xl border border-purple-500/25 mb-6 text-xs font-bold">
          <button
            onClick={() => {
              setAuthTab('login');
              setError('');
            }}
            className={`py-2 rounded-xl transition-all ${
              authTab === 'login'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            تسجيل الدخول
          </button>
          <button
            onClick={() => {
              setAuthTab('register');
              setError('');
            }}
            className={`py-2 rounded-xl transition-all ${
              authTab === 'register'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            إنشاء حساب جديد
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs text-center font-medium">
            {error}
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-green-500/15 border border-green-500/30 text-green-300 text-xs text-center font-medium flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-green-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {authTab === 'register' && (
            <div>
              <label className="block text-gray-300 font-semibold mb-1">الاسم الكامل *</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="مثال: كريم المنصور"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-[#080312] border border-purple-500/25 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 text-xs"
                />
                <User className="w-4 h-4 text-purple-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-gray-300 font-semibold mb-1">البريد الإلكتروني *</label>
            <div className="relative">
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#080312] border border-purple-500/25 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 text-xs"
              />
              <Mail className="w-4 h-4 text-purple-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-gray-300 font-semibold mb-1">كلمة المرور</label>
            <div className="relative">
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#080312] border border-purple-500/25 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 text-xs"
              />
              <Lock className="w-4 h-4 text-purple-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl gold-btn-primary font-bold text-xs flex items-center justify-center gap-2 shadow-gold-sm mt-2"
          >
            <span>{loading ? 'جاري المعالجة...' : authTab === 'login' ? 'دخول فوري' : 'تأكيد إنشاء الحساب'}</span>
          </button>
        </form>

        {/* Quick Demo Credentials */}
        <div className="mt-6 pt-4 border-t border-purple-500/20 text-center">
          <p className="text-[11px] text-gray-400 mb-2">أو جرّب الدخول السريع بحساب تجريبي:</p>
          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => {
                setEmail('admin@hercules.com');
                setName('مدير النظام الرئيسي');
              }}
              className="px-2.5 py-1 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold"
            >
              حساب أدمن تجريبي
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail('user@client.com');
                setName('مستخدم جديد');
              }}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 text-[10px] font-bold"
            >
              مستخدم جديد
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

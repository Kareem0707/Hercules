'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import {
  ShoppingBag,
  Layers,
  GraduationCap,
  Cpu,
  Rocket,
  Sliders,
  Menu,
  X,
  Zap,
  User as UserIcon,
  LogOut,
  ChevronDown,
  ShieldCheck,
} from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const { totalItems, setIsCartOpen } = useCart();
  const { user, logout, openAuthModal } = useAuth();
  const { showToast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  interface NavLinkItem {
    href: string;
    label: string;
    icon: any;
    isSpecial?: boolean;
  }

  const navLinks: NavLinkItem[] = [
    { href: '/', label: 'الرئيسية', icon: Zap },
    { href: '/market', label: 'المتجر الرقمي', icon: Layers },
    { href: '/academy', label: 'الأكاديمية', icon: GraduationCap },
    { href: '/ai', label: 'أدوات AI', icon: Cpu },
    { href: '/launchpad', label: 'منصة الإطلاق', icon: Rocket },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-purple-500/20 bg-[#05020a]/90 backdrop-blur-xl h-16 flex items-center transition-all">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-4 flex-nowrap">
          
          {/* Logo Branding */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-fuchsia-500 via-purple-600 to-violet-800 p-[1px] shadow-gold-sm group-hover:shadow-gold-md transition-all">
              <div className="w-full h-full bg-[#0c0618] rounded-[7px] flex items-center justify-center">
                <svg className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
            </div>
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              <span className="font-black text-lg sm:text-xl tracking-wider text-purple-bright">
                HERCULES
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-500/15 text-purple-300 border border-purple-500/30">
                هِـرْكِـلِـيز
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden xl:flex items-center gap-1 bg-white/[0.03] border border-white/[0.08] rounded-full px-2 py-1 shadow-inner backdrop-blur-md">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    isActive
                      ? 'text-purple-200 bg-purple-500/20 border border-purple-400/40 shadow-gold-sm font-bold'
                      : link.isSpecial
                      ? 'text-purple-400 hover:text-purple-200 hover:bg-purple-500/10'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-purple-400' : 'text-gray-400'}`} />
                  <span>{link.label}</span>
                  {link.isSpecial && (
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Compact Desktop for intermediate screens */}
          <nav className="hidden lg:flex xl:hidden items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap ${
                    isActive ? 'text-purple-300 bg-purple-500/15 font-bold' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Actions: Auth, Cart, Launchpad on the Left (in RTL) */}
          <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0 whitespace-nowrap">
            
            {/* User Account / Auth Button */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-[#0e071c] border border-purple-500/30 hover:border-purple-400 text-xs font-semibold text-white transition-all shadow-gold-sm"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-6 h-6 rounded-full object-cover border border-purple-400/50"
                  />
                  <span className="hidden sm:inline max-w-[100px] truncate">{user.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-purple-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-48 rounded-2xl bg-[#0e071c] border border-purple-500/30 shadow-neon-purple p-2 z-50 text-xs space-y-1 animate-in zoom-in-95 duration-150">
                    <div className="p-2 border-b border-purple-500/20 text-right">
                      <div className="font-bold text-white truncate">{user.name}</div>
                      <div className="text-[10px] text-gray-400 truncate">{user.email}</div>
                      <div className="inline-block mt-1 px-1.5 py-0.5 rounded bg-purple-500/15 text-purple-300 text-[9px] font-bold">
                        {user.role.toUpperCase()}
                      </div>
                    </div>
                    {user.role === 'admin' && (
                      <Link
                        href="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="w-full flex items-center gap-2 p-2 rounded-xl text-purple-300 hover:bg-purple-500/20 hover:text-white transition-colors font-bold"
                      >
                        <Sliders className="w-3.5 h-3.5 text-purple-400" />
                        <span>لوحة الإدارة السرية (Admin)</span>
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                        showToast('تم تسجيل الخروج بنجاح 👋', 'info');
                      }}
                      className="w-full flex items-center gap-2 p-2 rounded-xl text-red-400 hover:bg-red-500/15 transition-colors text-right"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>تسجيل الخروج</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => openAuthModal('login')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-400/30 text-purple-300 text-xs font-bold transition-all shadow-gold-sm"
              >
                <UserIcon className="w-3.5 h-3.5 text-purple-400" />
                <span className="hidden sm:inline">تسجيل الدخول</span>
              </button>
            )}

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-xl bg-[#0e071c] border border-purple-500/30 text-purple-300 hover:border-purple-400 hover:bg-[#140b28] transition-all flex items-center justify-center shadow-gold-sm"
              title="سلة المشتريات"
            >
              <ShoppingBag className="w-4 h-4" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-purple-500 text-white text-[10px] font-black flex items-center justify-center shadow-gold-sm">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Quick Action Button */}
            <Link
              href="/launchpad"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl gold-btn-primary text-xs font-bold whitespace-nowrap shadow-gold-sm"
            >
              <Rocket className="w-3.5 h-3.5" />
              <span>إطلاق مشروع</span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-[#0e071c] border border-white/10 text-gray-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed top-16 inset-x-0 bg-[#05020a]/98 border-b border-purple-500/25 px-5 pt-4 pb-6 space-y-2.5 backdrop-blur-2xl shadow-2xl animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-2 gap-2 pb-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 p-3 rounded-xl text-xs font-semibold ${
                    isActive
                      ? 'bg-purple-500/20 text-purple-200 border border-purple-500/40'
                      : 'bg-[#0e071c] text-gray-300 border border-white/10 hover:border-purple-500/30'
                  }`}
                >
                  <Icon className="w-4 h-4 text-purple-400" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>
          
          {!user && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openAuthModal('login');
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-400/40 text-xs font-bold"
            >
              <UserIcon className="w-4 h-4 text-purple-400" />
              <span>تسجيل الدخول / إنشاء حساب</span>
            </button>
          )}

          <Link
            href="/launchpad"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl gold-btn-primary text-xs font-bold"
          >
            <Rocket className="w-4 h-4" />
            <span>إطلاق مشروع جديد على هِـرْكِـلِـيز</span>
          </Link>
        </div>
      )}
    </header>
  );
}

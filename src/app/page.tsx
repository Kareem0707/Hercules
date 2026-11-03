'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Layers,
  GraduationCap,
  Cpu,
  Rocket,
  ArrowUpRight,
  ChevronLeft,
  Sparkles,
  Sliders,
  Crown,
  CheckCircle2,
} from 'lucide-react';

export default function HomePage() {
  const [activeHoverNode, setActiveHoverNode] = useState<string | null>(null);

  const pillars = [
    {
      id: 'market',
      titleEn: 'HERCULES MARKET',
      titleAr: 'المتجر الرقمي',
      badge: 'أصول رقمية وتراخيص فورية',
      description: 'سوق متطور للأصول الرقمية: قوالب Next.js وواجهات UI، ملفات Photoshop وPremiere، قوالب Notion وإكسيل وأصول 3D مع تحميل فوري وتراخيص تجارية.',
      stat: '+5,400 أصل رقمي',
      subStat: 'تحميل فوري وتراخيص تجارية',
      href: '/market',
      icon: Layers,
      positionClasses: 'lg:absolute lg:top-2 lg:left-1/2 lg:-translate-x-1/2',
      accentBorder: 'hover:border-purple-400 hover:shadow-neon-purple',
      highlights: [
        'قوالب Next.js وواجهات UI Kits جاهزة',
        'ملفات مونتاج Premiere وAfter Effects',
        'قوالب تنظيم وإدارة Notion وإكسيل',
        'تراخيص استخدام تجارية مع كل تحميل',
      ],
    },
    {
      id: 'academy',
      titleEn: 'HERCULES ACADEMY',
      titleAr: 'الأكاديمية والشهادات',
      badge: 'تعليم مهني معتمد',
      description: 'مسارات ودبلومات تخصصية في الذكاء الاصطناعي والموشن جرافيكس والبرمجة مع كويزات تفاعلية وشهادات إتمام موثقة برمز QR وكود استعلام رسمي.',
      stat: 'مسارات معتمدة بـ QR',
      subStat: 'اختبارات تطبيقية وتوثيق رقمي',
      href: '/academy',
      icon: GraduationCap,
      positionClasses: 'lg:absolute lg:top-1/2 lg:right-2 sm:lg:right-6 lg:-translate-y-1/2',
      accentBorder: 'hover:border-purple-400 hover:shadow-neon-purple',
      highlights: [
        'مسار مهندس الذكاء الاصطناعي وAI Agents',
        'دبلومة الموشن جرافيكس والمونتاج التجاري',
        'شهادات إتمام موثقة برمز استعلام QR',
        'مشاريع تطبيقية واختبارات قياس مهارة',
      ],
    },
    {
      id: 'ai',
      titleEn: 'HERCULES AI HUB',
      titleAr: 'مركز أدوات الذكاء الاصطناعي',
      badge: 'مقارنة واستوديو تجريبي',
      description: 'دليل ومصفوفة مقارنة لأكثر من 40 أداة ذكاء اصطناعي، مع استوديو تجريبي مباشر يعمل بكريديتس الزائر دون استهلاك أي تكلفة من المنصة.',
      stat: '+40 أداة AI مفهرسة',
      subStat: 'مقارنة فنية واستوديو Sandbox',
      href: '/ai',
      icon: Cpu,
      positionClasses: 'lg:absolute lg:bottom-2 lg:left-1/2 lg:-translate-x-1/2',
      accentBorder: 'hover:border-purple-400 hover:shadow-neon-purple',
      highlights: [
        'دليل شامل ومحدث لأحدث أدوات الذكاء الاصطناعي',
        'مصفوفة مقارنة تفصيلية بين الميزات والأسعار',
        'استوديو AI Sandbox يعمل بكريديتس الزائر المجانية',
        'تقييمات مجتمعية وتصويت لأفضل الأدوات',
      ],
    },
    {
      id: 'launchpad',
      titleEn: 'HERCULES LAUNCHPAD',
      titleAr: 'منصة إطلاق المشاريع',
      badge: 'منصة الرواد والمؤسسين',
      description: 'المنصة الأولى لإطلاق المنتجات التقنية العربية والعالمية: اعرض مشروعك، اجمع أول 1,000 مستخدم، نافس على منتج اليوم، واعثر على شركاء مؤسسين ومستثمرين.',
      stat: 'منافسة #1 منتج اليوم',
      subStat: 'قوائم انتظار وبحث عن شركاء',
      href: '/launchpad',
      icon: Rocket,
      positionClasses: 'lg:absolute lg:top-1/2 lg:left-2 sm:lg:left-6 lg:-translate-y-1/2',
      accentBorder: 'hover:border-purple-400 hover:shadow-neon-purple',
      highlights: [
        'إطلاق المواقع والتطبيقات والمنتجات الرقمية',
        'جمع أوائل المستخدمين وبناء قوائم الانتظار',
        'المنافسة اليومية والأسبوعية على لقب أفضل منتج',
        'سوق المؤسسين والشركاء التقنيين بالحصص',
      ],
    },
  ];

  return (
    <div className="bg-[#05020a] text-gray-100 min-h-screen relative overflow-hidden flex flex-col justify-between font-sans selection:bg-purple-500 selection:text-white">
      
      {/* Ambient Neon Purple Glowing Fissures (Obsidian Glowing Cube Theme) */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-purple-600/10 blur-[170px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-fuchsia-600/10 blur-[180px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 left-10 w-[400px] h-[400px] bg-violet-700/10 blur-[160px] rounded-full pointer-events-none" />

      {/* ========================================================================= */}
      {/* 1. THE CIRCULAR HERO: Compact Center Core with 4 Orbiting Pillars         */}
      {/* ========================================================================= */}
      <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-14 lg:pt-12 lg:pb-20 flex-1 flex flex-col items-center justify-center">
        
        {/* Orbital System Container (Center + 4 Surrounding Departments) */}
        <div className="relative w-full max-w-6xl lg:h-[720px] xl:h-[760px] flex items-center justify-center my-auto">
          
          {/* Subtle Concentric Glowing Rings (Visible on Desktop) */}
          <div className="hidden lg:block absolute inset-0 pointer-events-none">
            {/* Outer Ring */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[660px] h-[660px] rounded-full border border-purple-500/20 border-dashed animate-spin-slow" />
            
            {/* Middle Ring */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[490px] h-[490px] rounded-full border border-purple-400/15" />
            
            {/* Inner Ring with Neon Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full border border-purple-500/30 shadow-neon-purple" />
          </div>

          {/* ======================================================== */}
          {/* THE CENTER CORE: Compact, Centered, No Overlaps          */}
          {/* ======================================================== */}
          <div className="relative z-20 w-full max-w-[280px] sm:max-w-[310px] mx-auto text-center p-5 rounded-3xl bg-[#0c0618]/95 border border-purple-500/40 backdrop-blur-2xl shadow-neon-purple my-6 lg:my-0 transition-transform duration-300 hover:scale-[1.02]">
            
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/15 border border-purple-400/30 text-purple-300 text-[11px] font-semibold mb-2 shadow-sm">
              <Sparkles className="w-3 h-3 text-purple-400" />
              <span>منظومة هِـرْكِـلِـيز الرقمية</span>
            </div>

            {/* Central English Brand Name */}
            <h1 className="text-3xl sm:text-4xl font-black tracking-widest text-purple-bright drop-shadow-[0_0_20px_rgba(192,132,252,0.4)]">
              HERCULES
            </h1>

            {/* Arabic Identity Tag */}
            <div className="text-xs font-bold text-purple-400 tracking-wider mt-0.5 mb-3">
              هِـرْكِـلِـيز
            </div>

            {/* Compact About Snippet */}
            <div className="p-3 rounded-2xl bg-black/50 border border-purple-500/20 text-[11px] text-gray-300 leading-relaxed mb-4 text-center">
              <p className="font-semibold text-white mb-1">
                منظومة شاملة توحّد 4 ركائز للمبدعين ورواد الأعمال:
              </p>
              <p className="text-gray-400 text-[10px] leading-normal">
                الأصول الرقمية، الأكاديمية والشهادات، أدوات الذكاء الاصطناعي، ومنصة إطلاق المشاريع.
              </p>
            </div>

            {/* Central Quick Actions */}
            <div className="flex items-center justify-center gap-2">
              <a
                href="#ecosystem-overview"
                className="px-4 py-2 rounded-xl gold-btn-primary text-xs font-bold transition-all shadow-gold-sm flex items-center gap-1"
              >
                <span>استكشاف الأقسام</span>
                <ChevronLeft className="w-3 h-3" />
              </a>

              <Link
                href="/admin"
                className="px-3.5 py-2 rounded-xl bg-white/[0.04] border border-purple-500/30 hover:border-purple-400 text-gray-300 hover:text-purple-200 text-xs font-bold transition-all flex items-center gap-1"
              >
                <Sliders className="w-3 h-3 text-purple-400" />
                <span>لوحة التحكم</span>
              </Link>
            </div>
          </div>

          {/* ======================================================== */}
          {/* THE 4 SURROUNDING SECTIONS (Top, Right, Bottom, Left)    */}
          {/* ======================================================== */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:block gap-4 lg:gap-0 mt-6 lg:mt-0">
            {pillars.map((pillar) => {
              const Icon = pillar.icon;
              const isHovered = activeHoverNode === pillar.id;

              return (
                <div
                  key={pillar.id}
                  onMouseEnter={() => setActiveHoverNode(pillar.id)}
                  onMouseLeave={() => setActiveHoverNode(null)}
                  className={`w-full lg:w-64 xl:w-72 ${pillar.positionClasses} z-30 transition-all duration-300`}
                >
                  <Link
                    href={pillar.href}
                    className={`block p-4 sm:p-5 rounded-2xl bg-[#0e071c]/90 border border-purple-500/25 backdrop-blur-xl transition-all duration-300 group ${pillar.accentBorder} shadow-lg relative overflow-hidden hover:-translate-y-1`}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-fuchsia-500 via-purple-600 to-violet-800 p-[1px] shadow-gold-sm flex-shrink-0">
                          <div className="w-full h-full bg-[#080312] rounded-[10px] flex items-center justify-center text-purple-300 group-hover:scale-110 transition-transform">
                            <Icon className="w-4 h-4" />
                          </div>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-purple-400 block tracking-wide">
                            {pillar.titleEn}
                          </span>
                          <span className="text-xs sm:text-sm font-black text-white group-hover:text-purple-200 transition-colors">
                            {pillar.titleAr}
                          </span>
                        </div>
                      </div>

                      <span className="w-6 h-6 rounded-lg bg-white/5 border border-purple-500/20 flex items-center justify-center text-gray-400 group-hover:text-purple-300 group-hover:border-purple-400 transition-colors">
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                    </div>

                    {/* Badge */}
                    <div className="inline-block px-2 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-[10px] font-bold mb-2">
                      {pillar.badge}
                    </div>

                    {/* Short Description */}
                    <p className="text-[11px] text-gray-300 leading-relaxed line-clamp-2 mb-3">
                      {pillar.description}
                    </p>

                    {/* Bottom Stat & Link */}
                    <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs text-purple-400 group-hover:text-purple-300 transition-colors">
                      <span className="font-bold text-[11px]">{pillar.stat}</span>
                      <span className="text-[10px] text-gray-400 group-hover:text-white flex items-center gap-1 font-semibold">
                        <span>دخول القسم</span>
                        <ChevronLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. ECOSYSTEM DIRECTORY: Detailed Cards for All 4 Pillars                  */}
      {/* ========================================================================= */}
      <section id="ecosystem-overview" className="relative z-30 bg-[#080312]/90 border-t border-purple-500/20 pt-16 pb-20 px-4 sm:px-6 lg:px-8 scroll-mt-16">
        <div className="max-w-7xl mx-auto">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-400/30 text-purple-300 text-xs mb-3 shadow-gold-sm">
              <Crown className="w-3.5 h-3.5 text-purple-400" />
              <span>أقسام وركائز منظومة هِـرْكِـلِـيز</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-purple-bright tracking-tight mb-3">
              استكشف خدمات المنظومة المتكاملة
            </h2>

            <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-2xl mx-auto">
              بنية تحتية موحدة تربط بين سوق المنتجات الرقمية، الأكاديمية المهنية المعتمدة، مركز تجربة ومقارنة أدوات الذكاء الاصطناعي، ومنصة إطلاق المشاريع التقنية.
            </p>
          </div>

          {/* 4 Pillars Grid Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((pillar) => {
              const Icon = pillar.icon;

              return (
                <div
                  key={pillar.id}
                  className="rounded-2xl bg-[#0e071c]/85 border border-purple-500/20 p-6 flex flex-col justify-between transition-all duration-300 backdrop-blur-xl group hover:border-purple-400 hover:shadow-neon-purple hover:-translate-y-1"
                >
                  <div>
                    {/* Top Icon & Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-fuchsia-500 via-purple-600 to-violet-800 p-[1px] shadow-gold-sm flex-shrink-0">
                        <div className="w-full h-full bg-[#080312] rounded-[11px] flex items-center justify-center text-purple-300 group-hover:scale-110 transition-transform">
                          <Icon className="w-6 h-6" />
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-500/20 text-purple-300 border border-purple-400/30">
                        {pillar.badge}
                      </span>
                    </div>

                    <div className="text-xs font-bold text-purple-400 mb-1">
                      {pillar.titleEn}
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-200 transition-colors">
                      {pillar.titleAr}
                    </h3>

                    <p className="text-xs text-gray-300 leading-relaxed mb-5">
                      {pillar.description}
                    </p>

                    {/* Highlights List */}
                    <div className="space-y-2 mb-6">
                      {pillar.highlights.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-gray-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 flex-shrink-0 mt-0.5" />
                          <span className="leading-snug">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Stats & CTA Button */}
                  <div className="pt-4 border-t border-white/[0.08]">
                    <div className="flex items-center justify-between text-xs mb-3">
                      <span className="text-purple-300 font-bold">{pillar.stat}</span>
                      <span className="text-[11px] text-gray-400">{pillar.subStat}</span>
                    </div>

                    <Link
                      href={pillar.href}
                      className="w-full py-2.5 rounded-xl bg-purple-500/20 hover:bg-purple-600 text-purple-200 hover:text-white border border-purple-400/40 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-gold-sm"
                    >
                      <span>دخول واستكشاف القسم</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Central Admin Dashboard Banner */}
          <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#150a28] via-[#0e071c] to-[#080312] border border-purple-500/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
            <div className="flex items-center gap-4 text-right">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300 flex-shrink-0 shadow-neon-purple">
                <Sliders className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-purple-400 tracking-wider">
                    إدارة شاملة وقاعدة بيانات لحظية
                  </span>
                </div>
                <h4 className="text-xl font-bold text-white">
                  لوحة التحكم المركزية وإدارة المنصة (Admin Dashboard)
                </h4>
                <p className="text-xs text-gray-300 mt-1 max-w-xl">
                  تحكم كامل في جميع الأقسام: إضافة وإدارة المنتجات، اعتماد الكورسات وإصدار الشهادات الموثقة يدوياً، مراجعة المشاريع، مع إمكانية إعادة زرع البيانات الأولية.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0 w-full md:w-auto">
              <Link
                href="/admin"
                className="w-full md:w-auto px-6 py-3 rounded-xl gold-btn-primary font-bold text-xs flex items-center justify-center gap-2 shadow-gold-sm"
              >
                <Sliders className="w-4 h-4" />
                <span>دخول لوحة التحكم الكاملة</span>
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. BOTTOM LIVE PLATFORM SUMMARY BAR                                       */}
      {/* ========================================================================= */}
      <section className="border-t border-white/[0.08] bg-[#080312]/95 py-4 px-4 sm:px-6 lg:px-8 relative z-30">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
          <div className="flex items-center gap-4 flex-wrap justify-center text-xs">
            <span className="text-purple-400 font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              إحصائيات المنظومة المباشرة:
            </span>
            <span className="text-purple-300">+5,400 أصل رقمي</span>
            <span className="text-gray-600">|</span>
            <span className="text-purple-300">+12,500 طالب ومتعلم</span>
            <span className="text-gray-600">|</span>
            <span className="text-purple-300">+40 أداة ذكاء اصطناعي</span>
            <span className="text-gray-600">|</span>
            <span className="text-purple-300">#1 منصة إطلاق المشاريع</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="text-purple-300 hover:text-white font-bold flex items-center gap-1 text-xs transition-colors"
            >
              <span>لوحة التحكم وإعادة تعيين البيانات</span>
              <ChevronLeft className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

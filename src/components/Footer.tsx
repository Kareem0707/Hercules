import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-gold-500/20 bg-[#05020a] text-gray-400 text-xs relative overflow-hidden" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold-300 via-gold-500 to-gold-700 p-[1px] shadow-gold-sm">
                <div className="w-full h-full bg-[#0c0618] rounded-[7px] flex items-center justify-center">
                  <svg className="w-4 h-4 text-gold-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                  </svg>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xl tracking-wider text-gold-bright">
                  HERCULES
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gold-500/15 text-gold-300 border border-gold-500/30">
                  هِـرْكِـلِـيز
                </span>
              </div>
            </div>

            <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
              المنظومة الرقمية الشاملة التي توحّد متجر الأصول الرقمية، الأكاديمية والشهادات المهنية المعتمدة، مركز أدوات الذكاء الاصطناعي، ومنصة إطلاق المشاريع التقنية.
            </p>

            <div className="flex items-center gap-2 pt-1 text-[11px] text-gold-400">
              <span className="w-2 h-2 rounded-full bg-gold-400" />
              <span>منظومة متكاملة لرواد الأعمال والمصممين والمطورين</span>
            </div>
          </div>

          {/* Pillar 1 & 2 */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gold-300 tracking-wider">
              المتجر والأكاديمية
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>
                <Link href="/market" className="hover:text-gold-300 transition-colors">
                  قوالب مواقع وواجهات UI
                </Link>
              </li>
              <li>
                <Link href="/market?category=adobe-video-photo" className="hover:text-gold-300 transition-colors">
                  ملفات أدوبي ومونتاج Premiere
                </Link>
              </li>
              <li>
                <Link href="/market?category=notion-excel" className="hover:text-gold-300 transition-colors">
                  قوالب Notion وإكسيل
                </Link>
              </li>
              <li>
                <Link href="/academy" className="hover:text-gold-300 transition-colors">
                  مسارات مهنية معتمدة
                </Link>
              </li>
              <li>
                <Link href="/academy" className="hover:text-gold-300 transition-colors">
                  شهادات إتمام موثقة برمز QR
                </Link>
              </li>
            </ul>
          </div>

          {/* Pillar 3 & 4 */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gold-300 tracking-wider">
              الذكاء الاصطناعي والمشاريع
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>
                <Link href="/ai" className="hover:text-gold-300 transition-colors">
                  دليل ومصفوفة أدوات AI
                </Link>
              </li>
              <li>
                <Link href="/ai#playground" className="hover:text-gold-300 transition-colors">
                  استوديو AI Sandbox المباشر
                </Link>
              </li>
              <li>
                <Link href="/launchpad" className="hover:text-gold-300 transition-colors">
                  أفضل منتجات اليوم
                </Link>
              </li>
              <li>
                <Link href="/launchpad" className="hover:text-gold-300 transition-colors">
                  سوق الشركاء والمؤسسين التقنيين
                </Link>
              </li>
            </ul>
          </div>

          {/* Admin & System */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gold-300 tracking-wider">
              لوحة التحكم والدعم
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>
                <Link href="/admin" className="text-gold-400 hover:text-gold-200 transition-colors font-semibold flex items-center gap-1">
                  <span>لوحة التحكم الكاملة (Admin)</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-gold-300 transition-colors">
                  إدارة قاعدة البيانات وإعادة الزرع
                </Link>
              </li>
              <li>
                <Link href="/market" className="hover:text-gold-300 transition-colors">
                  بوابة رفع وبيع المنتجات
                </Link>
              </li>
              <li>
                <Link href="/academy" className="hover:text-gold-300 transition-colors">
                  بوابة المدربين والخبراء
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© 2026 منظومة هِـرْكِـلِـيز (HERCULES). جميع الحقوق محفوظة.</p>
          <div className="flex items-center gap-4 text-xs text-gold-400/80">
            <span>المنظومة الرقمية الفاخرة للأصول، التعليم، الذكاء، والمشاريع</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { Check, Sparkles, Zap, ShieldCheck, X, Globe } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useToast } from '@/context/ToastContext';

interface CreditsPricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (credits: number, planName: string) => void;
}

type CurrencyCode = 'USD' | 'EGP' | 'SAR' | 'AED' | 'KWD' | 'EUR';

interface CurrencyInfo {
  code: CurrencyCode;
  symbol: string;
  name: string;
  flag: string;
  rate: number; // relative to 1 USD
  format: (amountUSD: number) => string;
}

const CURRENCIES: Record<CurrencyCode, CurrencyInfo> = {
  EGP: {
    code: 'EGP',
    symbol: 'ج.م',
    name: 'الجنيه المصري',
    flag: '🇪🇬',
    rate: 50,
    format: (usd) => `${Math.round(usd * 50)} ج.م`,
  },
  SAR: {
    code: 'SAR',
    symbol: 'ر.س',
    name: 'الريال السعودي',
    flag: '🇸🇦',
    rate: 3.75,
    format: (usd) => `${(usd * 3.75).toFixed(1)} ر.س`,
  },
  AED: {
    code: 'AED',
    symbol: 'د.إ',
    name: 'الدرهم الإماراتي',
    flag: '🇦🇪',
    rate: 3.67,
    format: (usd) => `${(usd * 3.67).toFixed(1)} د.إ`,
  },
  KWD: {
    code: 'KWD',
    symbol: 'د.ك',
    name: 'الدينار الكويتي',
    flag: '🇰🇼',
    rate: 0.31,
    format: (usd) => `${(usd * 0.31).toFixed(2)} د.ك`,
  },
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'الدولار الأمريكي',
    flag: '🇺🇸',
    rate: 1,
    format: (usd) => `$${usd.toFixed(2)}`,
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'اليورو الأوروبي',
    flag: '🇪🇺',
    rate: 0.92,
    format: (usd) => `€${(usd * 0.92).toFixed(2)}`,
  },
};

export function CreditsPricingModal({ isOpen, onClose, onSuccess }: CreditsPricingModalProps) {
  const { showToast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<'starter' | 'pro' | 'elite'>('pro');
  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const [isProcessing, setIsProcessing] = useState(false);

  // Auto-detect visitor's country / timezone currency on mount
  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      if (tz.includes('Cairo') || tz.includes('Egypt') || tz.includes('Africa/Cairo')) {
        setCurrency('EGP');
      } else if (tz.includes('Riyadh') || tz.includes('Saudi')) {
        setCurrency('SAR');
      } else if (tz.includes('Dubai') || tz.includes('Abu_Dhabi')) {
        setCurrency('AED');
      } else if (tz.includes('Kuwait')) {
        setCurrency('KWD');
      } else if (tz.includes('Europe') || tz.includes('Berlin') || tz.includes('Paris') || tz.includes('London')) {
        setCurrency('EUR');
      } else {
        setCurrency('USD');
      }
    } catch {
      setCurrency('USD');
    }
  }, []);

  if (!isOpen) return null;

  const currentCurrency = CURRENCIES[currency];

  const plans = [
    {
      id: 'starter' as const,
      name: 'باقة البداية (Starter)',
      priceUSD: 4.99,
      period: 'شهرياً',
      credits: 100,
      badge: 'للتجربة والتعلم',
      features: [
        '100 عملية توليد ومعالجة ذكاء اصطناعي',
        'استوديو الأكواد والبرمجة بالكامل',
        'المساعد الذكي لكتابة المحتوى والشات',
        'دعم كامل للغة العربية والإنجليزية',
        'صلاحية شهر كامل من تاريخ الشراء',
      ],
      popular: false,
    },
    {
      id: 'pro' as const,
      name: 'باقة المحترفين (Pro Creator)',
      priceUSD: 9.99,
      period: 'شهرياً',
      credits: 500,
      badge: 'الأكثر طلباً ⭐',
      features: [
        '500 عملية ذكاء اصطناعي فائقة الدقة',
        'استوديو توليد الصور 8K والفيديو السينمائي',
        'استوديو التعليق الصوتي البشري الفاخر',
        'أولوية معالجة في أوقات الذروة السحابية',
        'تراخيص تجارية كاملة لكافة المخرجات',
      ],
      popular: true,
    },
    {
      id: 'elite' as const,
      name: 'باقة النخبة (Elite VIP)',
      priceUSD: 39.99,
      period: 'شهرياً',
      credits: 9999,
      badge: 'غير محدود 🔥',
      features: [
        'استخدام غير محدود (Unlimited Credits)',
        'وصول شامل لجميع استوديوهات الـ 40+ أداة',
        'خوادم معالجة مخصصة فائقة السرعة Ultra-Fast',
        'حقوق ملكية وتراخيص تجارية مطلقة',
        'مدير حساب ودعم فني خاص VIP طوال الأسبوع',
      ],
      popular: false,
    },
  ];

  const handleSubscribe = (planId: 'starter' | 'pro' | 'elite') => {
    const plan = plans.find((p) => p.id === planId)!;
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);

      // Save credits & plan locally
      if (typeof window !== 'undefined') {
        localStorage.setItem('hercules_ai_credits', String(plan.credits));
        localStorage.setItem('hercules_ai_plan', plan.name);
        localStorage.setItem('hercules_ai_currency', currency);
      }

      onSuccess(plan.credits, plan.name);

      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#A855F7', '#C084FC', '#D946EF', '#FFFFFF'],
      });

      const formattedPrice = currentCurrency.format(plan.priceUSD);
      showToast(`تهانينا! تم تفعيل ${plan.name} بسعر ${formattedPrice} وإضافة ${plan.credits === 9999 ? 'رصيد غير محدود' : plan.credits + ' كريديت'} بنجاح! 🎉`, 'purple');
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/90 backdrop-blur-xl flex items-center justify-center p-4" dir="rtl">
      <div className="relative w-full max-w-4xl rounded-3xl bg-[#0c0618] border border-purple-500/40 text-white shadow-neon-purple p-6 sm:p-8 animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 left-5 text-gray-400 hover:text-white p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center max-w-xl mx-auto mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-400/30 text-purple-300 text-xs font-bold mb-3 shadow-gold-sm">
            <Zap className="w-3.5 h-3.5 text-purple-400" />
            <span>باقات اشتراك واستخدام أدوات هِـرْكِـلِـيز AI</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            اختر باقتك وفعّل الاستوديو التفاعلي
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-2 leading-relaxed">
            استمتعت بتجربتك الأولى المجانية. اختر الباقة المناسبة لمشاريعك للوصول غير المحدود وتوليد المحتوى بالذكاء الاصطناعي بالعملة المحلية لبلدك.
          </p>

          {/* Currency Selector Bar */}
          <div className="mt-5 p-2 rounded-2xl bg-[#140a28]/80 border border-purple-500/25 flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs text-purple-300 font-bold px-2">
              <Globe className="w-3.5 h-3.5 text-purple-400" />
              <span>عملة التسعير:</span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => {
                const cur = CURRENCIES[code];
                const isActive = currency === code;
                return (
                  <button
                    key={code}
                    type="button"
                    onClick={() => setCurrency(code)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                      isActive
                        ? 'bg-purple-600 text-white shadow-neon-purple scale-105'
                        : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-white/5'
                    }`}
                  >
                    <span>{cur.flag}</span>
                    <span>{cur.code}</span>
                    <span className="text-[10px] opacity-80">({cur.symbol})</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* The 3 Subscription Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {plans.map((plan) => {
            const isSelected = selectedPlan === plan.id;
            const formattedPrice = currentCurrency.format(plan.priceUSD);

            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`relative rounded-3xl p-5 sm:p-6 transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#140b28] border-2 border-purple-400 shadow-neon-purple scale-[1.02]'
                    : 'bg-[#080312] border border-purple-500/20 hover:border-purple-500/40'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-600 text-[10px] font-black text-white shadow-neon-purple tracking-wide">
                    {plan.badge}
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-purple-300">
                      {plan.name}
                    </span>
                    {!plan.popular && (
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-gray-400 border border-white/10">
                        {plan.badge}
                      </span>
                    )}
                  </div>

                  {/* Localized Price Display */}
                  <div className="my-3">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                        {formattedPrice}
                      </span>
                      <span className="text-xs text-gray-400">/ {plan.period}</span>
                    </div>
                    {currency !== 'USD' && (
                      <div className="text-[11px] text-gray-500 mt-0.5">
                        يعادل (${plan.priceUSD.toFixed(2)} USD)
                      </div>
                    )}
                  </div>

                  <div className="text-xs font-bold text-purple-400 mb-4 pb-3 border-b border-purple-500/15">
                    ⚡ {plan.credits === 9999 ? 'كريديتس غير محدودة' : `${plan.credits} كريديت معالجة`}
                  </div>

                  <ul className="space-y-2.5 text-xs text-gray-300 mb-6">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                        <span className="line-clamp-1">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSubscribe(plan.id);
                  }}
                  disabled={isProcessing}
                  className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                    isSelected
                      ? 'gold-btn-primary shadow-neon-purple'
                      : 'bg-purple-500/20 text-purple-200 border border-purple-400/30 hover:bg-purple-600 hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isProcessing ? 'جاري تفعيل الاشتراك...' : `تفعيل الاشتراك (${formattedPrice})`}</span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Security & Guarantee Footer */}
        <div className="mt-6 pt-5 border-t border-purple-500/15 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            <span>تسعير فوري بالعملة المحلية مع ضمان استرجاع كامل 14 يوماً وإلغاء في أي وقت.</span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            إغلاق ومتابعة التصفح
          </button>
        </div>

      </div>
    </div>
  );
}

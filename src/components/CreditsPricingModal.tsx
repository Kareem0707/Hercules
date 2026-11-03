'use client';

import React, { useState } from 'react';
import { Check, Sparkles, Zap, Crown, ShieldCheck, X, ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useToast } from '@/context/ToastContext';

interface CreditsPricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (credits: number, planName: string) => void;
}

export function CreditsPricingModal({ isOpen, onClose, onSuccess }: CreditsPricingModalProps) {
  const { showToast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<'starter' | 'pro' | 'elite'>('pro');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const plans = [
    {
      id: 'starter' as const,
      name: 'باقة البداية (Starter)',
      price: 19,
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
      price: 49,
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
      price: 99,
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
      }

      onSuccess(plan.credits, plan.name);

      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#A855F7', '#C084FC', '#D946EF', '#FFFFFF'],
      });

      showToast(`تهانينا! تم تفعيل ${plan.name} وإضافة ${plan.credits === 9999 ? 'رصيد غير محدود' : plan.credits + ' كريديت'} بنجاح! 🎉`, 'purple');
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
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-400/30 text-purple-300 text-xs font-bold mb-3 shadow-gold-sm">
            <Zap className="w-3.5 h-3.5 text-purple-400" />
            <span>باقات اشتراك واستخدام أدوات هِـرْكِـلِـيز AI</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            اختر باقتك وفعّل الاستوديو التفاعلي
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-2 leading-relaxed">
            لقد استمتعت بتجربتك الأولى المجانية. اشترك الآن في الباقة المناسبة لمشاريعك للوصول غير المحدود واستخدام جميع أدوات الذكاء الاصطناعي داخل الموقع.
          </p>
        </div>

        {/* The 3 Subscription Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {plans.map((plan) => {
            const isSelected = selectedPlan === plan.id;
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

                  <div className="flex items-baseline gap-1 my-3">
                    <span className="text-3xl sm:text-4xl font-black text-white">
                      ${plan.price}
                    </span>
                    <span className="text-xs text-gray-400">/ {plan.period}</span>
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
                  <span>{isProcessing ? 'جاري تفعيل الاشتراك...' : 'اشتراك وتفعيل الرصيد'}</span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Security & Guarantee Footer */}
        <div className="mt-6 pt-5 border-t border-purple-500/15 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            <span>ضمان استرجاع كامل 14 يوماً مع إمكانية الترقية أو الإلغاء في أي وقت.</span>
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

'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { X, Trash2, ShoppingBag, CheckCircle, ArrowRight, ShieldCheck, Download, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export function CartDrawer() {
  const { cart, removeFromCart, clearCart, isCartOpen, setIsCartOpen, totalPrice, totalItems } = useCart();
  const { user } = useAuth();
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [buyerName, setBuyerName] = useState(user?.name || 'أحمد العبدالله');
  const [buyerEmail, setBuyerEmail] = useState(user?.email || 'ahmed@domain.com');
  const [isProcessing, setIsProcessing] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState<any | null>(null);

  useEffect(() => {
    if (user) {
      setBuyerName(user.name);
      setBuyerEmail(user.email);
    }
  }, [user]);

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (coupon.trim().toUpperCase() === 'HERCULES2026' || coupon.trim().toUpperCase() === 'HERCULES20') {
      setDiscount(0.2); // 20% discount
    } else {
      alert('كود الخصم غير صالح. جرب: HERCULES2026');
    }
  };

  const finalAmount = Math.max(0, Math.round(totalPrice * (1 - discount)));

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setIsProcessing(true);

    try {
      const primaryItem = cart[0].product;
      const res = await fetch('/api/market/buy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: primaryItem.id,
          buyerName: buyerName || (user?.name ?? 'عميل هِـرْكِـلِـيز المعتمد'),
          buyerEmail: buyerEmail || (user?.email ?? 'client@hercules.com'),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setPurchaseSuccess({
          orderId: data.receipt.orderId,
          downloadToken: data.receipt.downloadToken,
          downloadUrl: data.receipt.downloadUrl,
          itemsCount: cart.length,
          totalPaid: finalAmount,
        });

        // Trigger celebratory neon violet confetti
        confetti({
          particleCount: 120,
          spread: 75,
          origin: { y: 0.6 },
          colors: ['#A855F7', '#C084FC', '#D946EF', '#FFFFFF'],
        });

        clearCart();
      } else {
        alert(data.error || 'حدث خطأ أثناء إتمام الشراء');
      }
    } catch (err) {
      alert('تعذر إتمام العملية، يرجى المحاولة لاحقاً');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" dir="rtl">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 left-0 max-w-full flex pl-0 md:pl-10">
        <div className="w-screen max-w-md bg-[#080312] border-r border-purple-500/30 text-gray-100 flex flex-col shadow-neon-purple">
          {/* Header */}
          <div className="p-5 border-b border-purple-500/20 flex items-center justify-between bg-[#0e071c]/70">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-300">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-lg text-white">سلة المشتريات</h3>
                <p className="text-xs text-gray-400">{totalItems} أصل رقمي محدد</p>
              </div>
            </div>
            <button
              onClick={() => {
                setIsCartOpen(false);
                setPurchaseSuccess(null);
              }}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-[#140b28] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {purchaseSuccess ? (
              <div className="text-center py-8 space-y-5 animate-in fade-in duration-300">
                <div className="w-16 h-16 mx-auto rounded-full bg-purple-500/20 border-2 border-purple-400 flex items-center justify-center text-purple-300 shadow-neon-purple">
                  <CheckCircle className="w-9 h-9" />
                </div>
                <div>
                  <h4 className="text-xl font-black text-white">تمت العملية بنجاح!</h4>
                  <p className="text-sm text-purple-300/90 mt-1">تهانينا، تم تأكيد طلبك وإتاحة التحميل الفوري</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#0e071c] border border-purple-500/25 text-right space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-400">رقم الطلب:</span>
                    <span className="font-mono text-purple-300 font-bold">{purchaseSuccess.orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">رمز ترخيص التحميل:</span>
                    <span className="font-mono text-white text-[11px]">{purchaseSuccess.downloadToken}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">المبلغ المدفوع:</span>
                    <span className="font-bold text-emerald-400">${purchaseSuccess.totalPaid} USD</span>
                  </div>
                </div>

                <a
                  href={purchaseSuccess.downloadUrl}
                  download
                  onClick={() => alert(`بدأ تنزيل الملف مع رمز الترخيص: ${purchaseSuccess.downloadToken}`)}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl gold-btn-primary font-bold text-xs shadow-neon-purple"
                >
                  <Download className="w-4 h-4" />
                  <span>تحميل الملفات والموارد الرقمية الآن</span>
                </a>

                <button
                  onClick={() => setPurchaseSuccess(null)}
                  className="text-xs text-gray-400 hover:text-purple-300 transition-colors"
                >
                  متابعة التسوق في المتجر
                </button>
              </div>
            ) : cart.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-16 h-16 mx-auto rounded-full bg-[#0e071c] border border-purple-500/20 flex items-center justify-center text-purple-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-gray-200">سلتك فارغة حالياً</h4>
                <p className="text-xs text-gray-400 max-w-xs mx-auto leading-relaxed">
                  تصفح قوالب المواقع، ملفات التصميم والمونتاج، وأدوات الذكاء الاصطناعي وأضف ما يعجبك.
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {cart.map(({ product }) => (
                    <div
                      key={product.id}
                      className="p-3.5 rounded-2xl bg-[#0e071c] border border-purple-500/20 flex gap-3 items-center hover:border-purple-400/40 transition-colors"
                    >
                      <img
                        src={product.thumbnail}
                        alt={product.title}
                        className="w-16 h-16 rounded-xl object-cover border border-purple-500/30"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-white line-clamp-1">{product.title}</h4>
                        <p className="text-[11px] text-purple-400/90 mt-0.5">{product.categoryName}</p>
                        <div className="text-xs font-black text-purple-300 mt-1">
                          {product.price === 0 ? 'مجاني' : `$${product.price} USD`}
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                        title="إزالة من السلة"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Coupon input */}
                <form onSubmit={handleApplyCoupon} className="pt-2">
                  <label className="text-xs text-gray-400 mb-1 block">كود خصم حصري (جرب: HERCULES2026)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="أدخل كود الخصم"
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      className="flex-1 bg-[#0e071c] border border-purple-500/25 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-400"
                    />
                    <button
                      type="submit"
                      className="px-3.5 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/40 rounded-xl text-xs font-bold text-purple-200"
                    >
                      تطبيق
                    </button>
                  </div>
                  {discount > 0 && (
                    <p className="text-[11px] text-emerald-400 mt-1.5 flex items-center gap-1 font-semibold">
                      <Sparkles className="w-3 h-3" /> تم تطبيق خصم 20% بنجاح!
                    </p>
                  )}
                </form>

                {/* Buyer info */}
                <div className="pt-3 border-t border-purple-500/15 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs text-gray-300 block font-bold">بيانات استلام الترخيص والتحميل</label>
                    {user && (
                      <span className="text-[10px] text-purple-400 font-semibold">تم الملء من حسابك ✓</span>
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="اسمك الكامل"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    className="w-full bg-[#0e071c] border border-purple-500/25 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-400"
                  />
                  <input
                    type="email"
                    placeholder="البريد الإلكتروني للترخيص"
                    value={buyerEmail}
                    onChange={(e) => setBuyerEmail(e.target.value)}
                    className="w-full bg-[#0e071c] border border-purple-500/25 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-400"
                  />
                </div>
              </>
            )}
          </div>

          {/* Footer Checkout */}
          {!purchaseSuccess && cart.length > 0 && (
            <div className="p-5 border-t border-purple-500/20 bg-[#0e071c]/90 space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-gray-400">
                  <span>المجموع الفرعي:</span>
                  <span>${totalPrice} USD</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>خصم الكوبون:</span>
                    <span>-${Math.round(totalPrice * discount)} USD</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-black text-white pt-2 border-t border-purple-500/15">
                  <span>الإجمالي النهائي:</span>
                  <span className="text-purple-300">${finalAmount} USD</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isProcessing}
                className="w-full py-3 px-4 rounded-xl gold-btn-primary flex items-center justify-center gap-2 font-bold text-xs disabled:opacity-50 shadow-neon-purple"
              >
                {isProcessing ? (
                  <span>جاري معالجة الدفع والترخيص...</span>
                ) : (
                  <>
                    <span>إتمام الشراء والتحميل الفوري</span>
                    <ArrowRight className="w-4 h-4 rotate-180" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                <span>دفع آمن 100% مع ضمان استرجاع وتحميل مدى الحياة</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { X, Trash2, ShoppingBag, CheckCircle, ArrowRight, ShieldCheck, Download, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export function CartDrawer() {
  const { cart, removeFromCart, clearCart, isCartOpen, setIsCartOpen, totalPrice, totalItems } = useCart();
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [buyerName, setBuyerName] = useState('أحمد العبدالله');
  const [buyerEmail, setBuyerEmail] = useState('ahmed@domain.com');
  const [isProcessing, setIsProcessing] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState<any | null>(null);

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (coupon.trim().toUpperCase() === 'HERCULES2026' || coupon.trim().toUpperCase() === 'GOLD20') {
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
      // Process purchase for the first item or batch
      const primaryItem = cart[0].product;
      const res = await fetch('/api/market/buy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: primaryItem.id,
          buyerName: buyerName || 'عميل هركليز الملكي',
          buyerEmail: buyerEmail || 'client@hercules.com',
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

        // Trigger celebratory cosmic blue confetti
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#38BDF8', '#0EA5E9', '#67E8F9', '#FFFFFF'],
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
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 left-0 max-w-full flex pl-0 md:pl-10">
        <div className="w-screen max-w-md bg-ebony border-r border-gold-500/30 text-gray-100 flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-5 border-b border-gold-500/20 flex items-center justify-between bg-charcoal/50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">سلة المشتريات</h3>
                <p className="text-xs text-gray-400">{totalItems} منتج رقمي محدد</p>
              </div>
            </div>
            <button
              onClick={() => {
                setIsCartOpen(false);
                setPurchaseSuccess(null);
              }}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-charcoal transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {purchaseSuccess ? (
              <div className="text-center py-8 space-y-5 animate-in fade-in duration-300">
                <div className="w-16 h-16 mx-auto rounded-full bg-gold-500/20 border-2 border-gold-500 flex items-center justify-center text-gold-400 shadow-gold-sm">
                  <CheckCircle className="w-9 h-9" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white">تمت العملية بنجاح!</h4>
                  <p className="text-sm text-gold-300/80 mt-1">تهانينا، تم تأكيد طلبك وإتاحة التحميل الفوري</p>
                </div>

                <div className="p-4 rounded-xl bg-charcoal border border-gold-500/20 text-right space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">رقم الطلب:</span>
                    <span className="font-mono text-gold-300 font-semibold">{purchaseSuccess.orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">رمز ترخيص التحميل:</span>
                    <span className="font-mono text-white text-xs">{purchaseSuccess.downloadToken}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">المبلغ المدفوع:</span>
                    <span className="font-bold text-gold-400">${purchaseSuccess.totalPaid} USD</span>
                  </div>
                </div>

                <a
                  href={purchaseSuccess.downloadUrl}
                  download
                  onClick={() => alert(`بدأ تنزيل الملف مع رمز الترخيص: ${purchaseSuccess.downloadToken}`)}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl gold-btn-primary"
                >
                  <Download className="w-5 h-5" />
                  تحميل الملفات والموارد الرقمية الآن
                </a>

                <button
                  onClick={() => setPurchaseSuccess(null)}
                  className="text-xs text-gray-400 hover:text-gold-300 transition-colors"
                >
                  متابعة التسوق في المتجر
                </button>
              </div>
            ) : cart.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-16 h-16 mx-auto rounded-full bg-charcoal flex items-center justify-center text-gray-500">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="text-base font-semibold text-gray-300">سلتك فارغة حالياً</h4>
                <p className="text-xs text-gray-500 max-w-xs mx-auto">
                  تصفح قوالب المواقع، ملفات التصميم والمونتاج، وأدوات الذكاء الاصطناعي وأضف ما يعجبك.
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {cart.map(({ product }) => (
                    <div
                      key={product.id}
                      className="p-3 rounded-xl bg-charcoal border border-gold-500/15 flex gap-3 items-center"
                    >
                      <img
                        src={product.thumbnail}
                        alt={product.title}
                        className="w-16 h-16 rounded-lg object-cover border border-gold-500/20"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-semibold text-white line-clamp-1">{product.title}</h4>
                        <p className="text-[11px] text-gold-400/80 mt-0.5">{product.categoryName}</p>
                        <div className="text-xs font-bold text-gold-400 mt-1">
                          {product.price === 0 ? 'مجاني' : `$${product.price} USD`}
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="p-2 text-gray-500 hover:text-red-400 transition-colors"
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
                      className="flex-1 bg-charcoal-light border border-gold-500/20 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-gold-500"
                    />
                    <button
                      type="submit"
                      className="px-3 py-2 bg-gold-500/15 hover:bg-gold-500/25 border border-gold-500/40 rounded-lg text-xs font-semibold text-gold-300"
                    >
                      تطبيق
                    </button>
                  </div>
                  {discount > 0 && (
                    <p className="text-[11px] text-green-400 mt-1 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> تم تطبيق خصم 20% بنجاح!
                    </p>
                  )}
                </form>

                {/* Buyer info */}
                <div className="pt-3 border-t border-charcoal-light space-y-2">
                  <label className="text-xs text-gray-400 block font-medium">بيانات استلام الترخيص والتحميل</label>
                  <input
                    type="text"
                    placeholder="اسمك الكامل"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    className="w-full bg-charcoal-light border border-gold-500/20 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-500"
                  />
                  <input
                    type="email"
                    placeholder="البريد الإلكتروني للترخيص"
                    value={buyerEmail}
                    onChange={(e) => setBuyerEmail(e.target.value)}
                    className="w-full bg-charcoal-light border border-gold-500/20 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-500"
                  />
                </div>
              </>
            )}
          </div>

          {/* Footer Checkout */}
          {!purchaseSuccess && cart.length > 0 && (
            <div className="p-5 border-t border-gold-500/20 bg-charcoal/40 space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-gray-400">
                  <span>المجموع الفرعي:</span>
                  <span>${totalPrice} USD</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>خصم الكوبون:</span>
                    <span>-${Math.round(totalPrice * discount)} USD</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-charcoal-light">
                  <span>الإجمالي النهائي:</span>
                  <span className="text-gold-400">${finalAmount} USD</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isProcessing}
                className="w-full py-3 px-4 rounded-xl gold-btn-primary flex items-center justify-center gap-2 font-bold text-sm disabled:opacity-50"
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

              <div className="flex items-center justify-center gap-2 text-[11px] text-gray-400 pt-1">
                <ShieldCheck className="w-4 h-4 text-gold-400" />
                <span>دفع آمن 100% مع ضمان استرجاع وتحميل مدى الحياة</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

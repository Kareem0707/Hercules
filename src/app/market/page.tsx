'use client';

import React, { useState, useEffect } from 'react';
import { MarketProduct, MarketCategory } from '@/types';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import {
  ShoppingBag,
  Search,
  Plus,
  Star,
  CheckCircle,
  FileCode,
  Film,
  FileSpreadsheet,
  Palette,
  SlidersHorizontal,
  ExternalLink,
  Eye,
  Download,
  X,
  Sparkles,
  ShieldCheck,
  Tag,
} from 'lucide-react';

export default function MarketPage() {
  const [products, setProducts] = useState<MarketProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceFilter, setPriceFilter] = useState<'all' | 'free' | 'paid'>('all');
  const [selectedProduct, setSelectedProduct] = useState<MarketProduct | null>(null);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);

  // New product form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<MarketCategory>('templates-ui');
  const [newPrice, setNewPrice] = useState(29);
  const [newFileType, setNewFileType] = useState('React / Tailwind / Figma');
  const [newFileSize, setNewFileSize] = useState('45 MB');
  const [newDescription, setNewDescription] = useState('');
  const [newThumbnail, setNewThumbnail] = useState('https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { addToCart } = useCart();
  const { showToast } = useToast();

  const categories = [
    { id: 'all', label: 'كافة المنتجات', icon: SlidersHorizontal },
    { id: 'templates-ui', label: 'قوالب مواقع وواجهات UI', icon: FileCode },
    { id: 'adobe-video-photo', label: 'ملفات Photoshop وPremiere وAE', icon: Film },
    { id: 'notion-excel', label: 'قوالب Notion وملفات Excel', icon: FileSpreadsheet },
    { id: 'design-resources', label: 'ملفات تصميم وموارد جاهزة', icon: Palette },
    { id: 'tools-plugins', label: 'إضافات وبرامج وأدوات', icon: Tag },
  ];

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = `/api/market?`;
      if (selectedCategory !== 'all') url += `category=${selectedCategory}&`;
      if (searchQuery.trim()) url += `search=${encodeURIComponent(searchQuery.trim())}&`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  const filteredProducts = products.filter((p) => {
    if (priceFilter === 'free') return p.price === 0;
    if (priceFilter === 'paid') return p.price > 0;
    return true;
  });

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return alert('يرجى إدخال عنوان المنتج');

    setIsSubmitting(true);
    try {
      const categoryObj = categories.find((c) => c.id === newCategory);
      const res = await fetch('/api/market', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          titleEn: 'Digital Asset Resource',
          slug: newTitle.toLowerCase().replace(/\s+/g, '-'),
          description: newDescription || 'منتج رقمي عالي الجودة متوافق مع معايير هِرْكِليز الفاخرة.',
          category: newCategory,
          categoryName: categoryObj?.label || 'منتج رقمي',
          price: Number(newPrice),
          currency: 'USD',
          thumbnail: newThumbnail,
          gallery: [newThumbnail],
          fileType: newFileType,
          fileSize: newFileSize,
          downloadUrl: '/downloads/custom-asset.zip',
          seller: {
            name: 'صانع معتمد (أنت)',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
            verified: true,
            sales: 1,
          },
          tags: ['Digital Asset', 'Hercules', 'Creative'],
          featured: false,
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert('تم نشر منتجك في متجر هِرْكِليز بنجاح!');
        setIsAddProductOpen(false);
        setNewTitle('');
        setNewDescription('');
        fetchProducts();
      } else {
        alert(data.error || 'فشل نشر المنتج');
      }
    } catch (err) {
      alert('حدث خطأ أثناء النشر');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#05020a] min-h-screen text-gray-100 pb-24 tech-grid-bg" dir="rtl">
      {/* Header Banner */}
      <div className="relative py-14 bg-[#080312]/90 border-b border-white/[0.08] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="hud-badge mb-3">
                <ShoppingBag className="w-3.5 h-3.5 text-gold-400" />
                سوق الأصول الرقمية والتراخيص
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-white">
                المتجر الرقمي الفاخر
              </h1>
              <p className="mt-2 text-sm sm:text-base text-gray-300 max-w-2xl">
                بيع وشراء قوالب المواقع، ملفات Photoshop وPremiere، إضافات البرمجيات، قوالب Notion وإكسيل مع تحميل فوري وتراخيص تجارية موثقة.
              </p>
            </div>

            <button
              onClick={() => setIsAddProductOpen(true)}
              className="px-5 py-3 rounded-xl gold-btn-primary font-bold text-sm flex items-center gap-2 shadow-gold-sm"
            >
              <Plus className="w-4 h-4" />
              <span>ارفع منتجك وابدأ البيع</span>
            </button>
          </div>

          {/* Search Bar & Price Filters */}
          <div className="mt-8 flex flex-col md:flex-row gap-4 items-center justify-between">
            <form onSubmit={handleSearchSubmit} className="w-full md:w-96 relative">
              <input
                type="text"
                placeholder="ابحث عن قالب، إضافة، ملف فوتوشوب، إكسيل..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/60 border border-gold-500/25 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-gold-500 transition-colors"
              />
              <button
                type="submit"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gold-400 hover:text-gold-200"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>

            {/* Price Filter Chips */}
            <div className="flex items-center gap-2 self-start md:self-auto">
              <span className="text-xs text-gray-400 ml-1">التسعير:</span>
              {(['all', 'free', 'paid'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setPriceFilter(filter)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    priceFilter === filter
                      ? 'bg-gold-500 text-obsidian font-bold shadow-gold-sm'
                      : 'bg-black/40 border border-white/10 text-gray-300 hover:text-white'
                  }`}
                >
                  {filter === 'all' ? 'الكل' : filter === 'free' ? 'مجاني فقط' : 'مدفوع فقط'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="border-b border-charcoal-light bg-charcoal/40 sticky top-20 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 overflow-x-auto no-scrollbar flex items-center gap-2">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 flex-shrink-0 ${
                  isSelected
                    ? 'bg-gold-500 text-obsidian shadow-gold-sm'
                    : 'bg-charcoal border border-gold-500/15 text-gray-300 hover:text-gold-300 hover:border-gold-500/40'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs text-gray-400">
            تم العثور على <span className="text-gold-400 font-bold">{filteredProducts.length}</span> مورد رقمي متاح
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="rounded-2xl bg-charcoal border border-gold-500/10 h-80 animate-pulse" />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 rounded-2xl bg-charcoal/40 border border-gold-500/10 space-y-3">
            <ShoppingBag className="w-12 h-12 mx-auto text-gray-500" />
            <h3 className="text-lg font-bold text-gray-200">لا توجد منتجات مطابقة للبحث</h3>
            <p className="text-xs text-gray-400">جرب تغيير تصنيف البحث أو إعادة ضبط الفلاتر.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group rounded-2xl tech-card corner-bracket overflow-hidden flex flex-col justify-between"
              >
                {/* Thumbnail Image */}
                <div className="relative h-48 w-full overflow-hidden bg-ebony">
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Category Pill */}
                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-obsidian/80 backdrop-blur-md border border-gold-500/30 text-[11px] font-semibold text-gold-300">
                    {product.categoryName}
                  </span>

                  {/* Quick View Button */}
                  <button
                    onClick={() => setSelectedProduct(product)}
                    className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-bold"
                  >
                    <Eye className="w-4 h-4 text-gold-400" />
                    <span>معاينة تفاصيل المنتج</span>
                  </button>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3
                      onClick={() => setSelectedProduct(product)}
                      className="text-base font-bold text-white group-hover:text-gold-300 transition-colors line-clamp-1 cursor-pointer"
                    >
                      {product.title}
                    </h3>
                    <p className="mt-1 text-xs text-gray-400 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>

                    <div className="mt-3 flex items-center gap-3 text-[11px] text-gray-400">
                      <span className="flex items-center gap-1 text-gold-400">
                        <Star className="w-3.5 h-3.5 fill-gold-400 text-gold-400" />
                        <span className="font-bold">{product.rating}</span>
                        <span className="text-gray-500">({product.reviewsCount})</span>
                      </span>
                      <span>•</span>
                      <span>{product.fileType}</span>
                    </div>
                  </div>

                  {/* Seller & Price Strip */}
                  <div className="mt-5 pt-4 border-t border-charcoal-light flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={product.seller.avatar}
                        alt={product.seller.name}
                        className="w-6 h-6 rounded-full border border-gold-500/30 object-cover"
                      />
                      <span className="text-xs text-gray-300 font-medium">
                        {product.seller.name}
                      </span>
                    </div>

                    <div className="text-right">
                      <div className="text-base font-black text-gold-bright">
                        {product.price === 0 ? 'مجاني' : `$${product.price} USD`}
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="mt-3 pt-2 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="py-2 px-3 rounded-lg bg-charcoal-light border border-gold-500/20 text-xs font-semibold text-gray-200 hover:text-white hover:border-gold-500/40 text-center"
                    >
                      التفاصيل
                    </button>
                    <button
                      onClick={() => {
                        addToCart(product);
                        showToast(`تمت إضافة "${product.title}" إلى سلة مشترياتك! 🛒`, 'purple');
                      }}
                      className="py-2 px-3 rounded-lg gold-btn-primary text-xs font-bold flex items-center justify-center gap-1.5"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>{product.price === 0 ? 'تحميل مجاني' : 'شراء الآن'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Product Details Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-3xl rounded-3xl bg-ebony border border-gold-500/30 text-white shadow-gold-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="relative h-64 bg-charcoal overflow-hidden">
              <img
                src={selectedProduct.thumbnail}
                alt={selectedProduct.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ebony via-ebony/40 to-transparent" />
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 left-4 p-2 rounded-full bg-black/60 text-gray-300 hover:text-white border border-gold-500/30"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 right-6">
                <span className="px-3 py-1 rounded-full bg-gold-500/20 border border-gold-500/40 text-gold-300 text-xs font-bold">
                  {selectedProduct.categoryName}
                </span>
                <h2 className="text-2xl font-black text-white mt-1">
                  {selectedProduct.title}
                </h2>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 sm:p-8 space-y-6">
              <p className="text-sm text-gray-300 leading-relaxed">
                {selectedProduct.description}
              </p>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-charcoal border border-gold-500/15 text-xs">
                <div>
                  <span className="text-gray-400 block">نوع الملفات:</span>
                  <span className="font-bold text-white mt-0.5 block">{selectedProduct.fileType}</span>
                </div>
                <div>
                  <span className="text-gray-400 block">حجم التحميل:</span>
                  <span className="font-bold text-white mt-0.5 block">{selectedProduct.fileSize}</span>
                </div>
                <div>
                  <span className="text-gray-400 block">التقييم العام:</span>
                  <span className="font-bold text-gold-400 mt-0.5 block">★ {selectedProduct.rating} / 5</span>
                </div>
                <div>
                  <span className="text-gray-400 block">المبيعات:</span>
                  <span className="font-bold text-white mt-0.5 block">+{selectedProduct.salesCount} عملية</span>
                </div>
              </div>

              {/* Seller details */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-charcoal/50 border border-charcoal-light">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedProduct.seller.avatar}
                    alt={selectedProduct.seller.name}
                    className="w-10 h-10 rounded-full border border-gold-500/40 object-cover"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-white">{selectedProduct.seller.name}</span>
                      <ShieldCheck className="w-4 h-4 text-gold-400" />
                    </div>
                    <span className="text-[11px] text-gray-400">صانع ومطور معتمد في هركليز</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-gray-400">السعر النهائي</div>
                  <div className="text-2xl font-black text-gold-bright">
                    {selectedProduct.price === 0 ? 'مجاني' : `$${selectedProduct.price} USD`}
                  </div>
                </div>
              </div>

              {/* Action Strip */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => {
                    addToCart(selectedProduct);
                    showToast(`تمت إضافة "${selectedProduct.title}" إلى سلة مشترياتك! 🛒`, 'purple');
                    setSelectedProduct(null);
                  }}
                  className="flex-1 py-3.5 px-6 rounded-xl gold-btn-primary font-bold text-sm flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>{selectedProduct.price === 0 ? 'تحميل فوري مجاني' : 'إضافة إلى السلة وإتمام الطلب'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add New Product Modal */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-xl rounded-3xl bg-ebony border border-gold-500/30 text-white shadow-gold-lg p-6 sm:p-8 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-gold-500/20">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-gold-400" />
                <h3 className="text-lg font-bold text-white">نشر أصل رقمي جديد في المتجر</h3>
              </div>
              <button
                onClick={() => setIsAddProductOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="mt-6 space-y-4 text-xs">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">عنوان المنتج الرقمي *</label>
                <input
                  type="text"
                  placeholder="مثال: حزمة انتقالات بريميير سينمائية 4K"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  className="w-full bg-charcoal border border-gold-500/20 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-gold-500 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">القسم والتصنيف *</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as MarketCategory)}
                    className="w-full bg-charcoal border border-gold-500/20 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-gold-500 text-xs"
                  >
                    <option value="templates-ui">قوالب مواقع وواجهات UI</option>
                    <option value="adobe-video-photo">ملفات أدوبي ومونتاج</option>
                    <option value="notion-excel">قوالب Notion وملفات Excel</option>
                    <option value="design-resources">ملفات تصميم وموارد جاهزة</option>
                    <option value="tools-plugins">إضافات وبرامج وأدوات</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">السعر بالدولار ($) (0 للمجاني)</label>
                  <input
                    type="number"
                    min="0"
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full bg-charcoal border border-gold-500/20 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-gold-500 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">صيغة الملفات</label>
                  <input
                    type="text"
                    value={newFileType}
                    onChange={(e) => setNewFileType(e.target.value)}
                    placeholder="مثال: Next.js / PSD / Excel"
                    className="w-full bg-charcoal border border-gold-500/20 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-gold-500 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">حجم الملف التقديري</label>
                  <input
                    type="text"
                    value={newFileSize}
                    onChange={(e) => setNewFileSize(e.target.value)}
                    placeholder="مثال: 120 MB"
                    className="w-full bg-charcoal border border-gold-500/20 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-gold-500 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">رابط صورة المعاينة (Thumbnail URL)</label>
                <input
                  type="url"
                  value={newThumbnail}
                  onChange={(e) => setNewThumbnail(e.target.value)}
                  className="w-full bg-charcoal border border-gold-500/20 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-gold-500 text-xs"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">وصف المنتج ومميزاته</label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="اشرح محتويات الحزمة، المتطلبات، وكيفية الاستخدام..."
                  className="w-full bg-charcoal border border-gold-500/20 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gold-500 text-xs"
                />
              </div>

              <div className="pt-3 border-t border-charcoal-light flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-gray-400 hover:text-white"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl gold-btn-primary font-bold text-xs flex items-center gap-2"
                >
                  {isSubmitting ? 'جاري الحفظ والرفع...' : 'نشر المنتج الآن في هِرْكِليز'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

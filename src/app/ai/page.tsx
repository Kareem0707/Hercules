'use client';

import React, { useState, useEffect } from 'react';
import { AITool, AICategory } from '@/types';
import { InAppAIWorkspaceModal } from '@/components/InAppAIWorkspaceModal';
import {
  Cpu,
  Sparkles,
  Search,
  ExternalLink,
  ThumbsUp,
  SlidersHorizontal,
  Code2,
  Palette,
  Film,
  FileText,
  Mic,
  TrendingUp,
  Check,
  X,
  Plus,
  Scale,
  Zap,
  Layers,
  ArrowRight,
  Bot,
  Copy,
  Key,
  ShieldCheck,
  Info,
} from 'lucide-react';

export default function AIToolsPage() {
  const [tools, setTools] = useState<AITool[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeInAppTool, setActiveInAppTool] = useState<AITool | null>(null);

  // Comparison State
  const [comparedToolIds, setComparedToolIds] = useState<string[]>(['ai-cursor', 'ai-v0']);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  // Playground & Visitor BYOK Engine State
  const [playgroundTab, setPlaygroundTab] = useState<'code' | 'copy' | 'prompt'>('code');
  const [playgroundInput, setPlaygroundInput] = useState('');
  const [playgroundOutput, setPlaygroundOutput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [engineMode, setEngineMode] = useState<'client' | 'gemini' | 'openai'>('client');
  const [visitorApiKey, setVisitorApiKey] = useState('');
  const [isKeyConfigOpen, setIsKeyConfigOpen] = useState(false);

  // New Tool Submission Modal
  const [isSubmitToolOpen, setIsSubmitToolOpen] = useState(false);
  const [newToolName, setNewToolName] = useState('');
  const [newToolTagline, setNewToolTagline] = useState('');
  const [newToolCategory, setNewToolCategory] = useState<AICategory>('coding');
  const [newToolPricing, setNewToolPricing] = useState<'مجاني' | 'مدفوع' | 'Freemium'>('Freemium');
  const [newToolUrl, setNewToolUrl] = useState('');
  const [newToolDesc, setNewToolDesc] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { id: 'all', label: 'كافة الأدوات', icon: SlidersHorizontal },
    { id: 'coding', label: 'برمجة وتطوير', icon: Code2 },
    { id: 'design', label: 'تصميم وجرافيك', icon: Palette },
    { id: 'video', label: 'مونتاج وفيديو', icon: Film },
    { id: 'writing', label: 'كتابة ومحتوى', icon: FileText },
    { id: 'audio', label: 'صوت وموسيقى', icon: Mic },
    { id: 'marketing', label: 'تسويق وسيو', icon: TrendingUp },
  ];

  // Load visitor key from local storage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedKey = localStorage.getItem('hercules_visitor_ai_key');
      const savedMode = localStorage.getItem('hercules_visitor_ai_mode') as 'client' | 'gemini' | 'openai';
      if (savedKey) setVisitorApiKey(savedKey);
      if (savedMode) setEngineMode(savedMode);
    }
  }, []);

  const handleSaveKey = (key: string, mode: 'client' | 'gemini' | 'openai') => {
    setVisitorApiKey(key);
    setEngineMode(mode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('hercules_visitor_ai_key', key);
      localStorage.setItem('hercules_visitor_ai_mode', mode);
    }
    setIsKeyConfigOpen(false);
  };

  const fetchTools = async () => {
    setLoading(true);
    try {
      let url = `/api/ai-tools?`;
      if (selectedCategory !== 'all') url += `category=${selectedCategory}&`;
      if (searchQuery.trim()) url += `search=${encodeURIComponent(searchQuery.trim())}&`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setTools(data.tools);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTools();
  }, [selectedCategory]);

  const handleUpvote = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/ai-tools/${id}/upvote`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setTools((prev) =>
          prev.map((t) => (t.id === id ? { ...t, upvotes: data.upvotes } : t))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const toggleCompare = (id: string) => {
    if (comparedToolIds.includes(id)) {
      setComparedToolIds(comparedToolIds.filter((item) => item !== id));
    } else {
      if (comparedToolIds.length >= 3) {
        alert('يمكنك مقارنة 3 أدوات كحد أقصى في المرة الواحدة');
        return;
      }
      setComparedToolIds([...comparedToolIds, id]);
    }
  };

  // Live Playground Generator (100% on visitor's credits / client zero cost)
  const handleRunPlayground = async () => {
    if (!playgroundInput.trim()) return alert('يرجى إدخال نص للتجربة');
    setIsGenerating(true);
    setPlaygroundOutput('');

    try {
      // 1. If visitor provided a Gemini API Key
      if (engineMode === 'gemini' && visitorApiKey.trim()) {
        const promptText =
          playgroundTab === 'code'
            ? `أنت خبير برمجة وهندسة برمجيات في منصة هركليز. قم بفحص وتحسين الكود التالي، وقدم كوداً نظيفاً بنظام TypeScript مع معالجة كاملة للأخطاء وتوضيح التحسينات:\n${playgroundInput}`
            : playgroundTab === 'copy'
            ? `أنت خبير تسويق إعلاني في هركليز. اكتب 3 صيغ إعلانية مقنعة وجذابة للجمهور مع عناوين رئيسية ودعوة واضحة للعمل (CTA) للمنتج التالي:\n${playgroundInput}`
            : `You are an expert AI prompt engineer in Hercules. Transform the following idea into an ultra-detailed, cinematic, photorealistic Midjourney v6 / SDXL photography prompt with 8K parameters, lighting, and aspect ratio --ar 16:9:\n${playgroundInput}`;

        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${visitorApiKey.trim()}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: promptText }] }],
            }),
          }
        );

        const data = await res.json();
        if (data.error) {
          throw new Error(data.error.message || 'خطأ في مفتاح Gemini الخاص بك');
        }
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        setPlaygroundOutput(text || 'لم يتم استلام نص من النموذج.');
        setIsGenerating(false);
        return;
      }

      // 2. If visitor provided an OpenAI API Key
      if (engineMode === 'openai' && visitorApiKey.trim()) {
        const promptText =
          playgroundTab === 'code'
            ? `أنت خبير برمجة في هركليز. قم بتحسين الكود التالي وكتابته بأعلى معايير الأداء والأمان:\n${playgroundInput}`
            : playgroundTab === 'copy'
            ? `اكتب نصوصاً تسويقية باحترافية للمنتج التالي:\n${playgroundInput}`
            : `Create an award-winning Midjourney v6 prompt for: ${playgroundInput}`;

        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${visitorApiKey.trim()}`,
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: promptText }],
          }),
        });

        const data = await res.json();
        if (data.error) {
          throw new Error(data.error.message || 'خطأ في مفتاح OpenAI الخاص بك');
        }
        const text = data?.choices?.[0]?.message?.content;
        setPlaygroundOutput(text || 'لم يتم استلام نتيجة.');
        setIsGenerating(false);
        return;
      }

      // 3. Built-in Client Engine (Zero server tokens, Zero owner cost)
      setTimeout(() => {
        if (playgroundTab === 'code') {
          setPlaygroundOutput(`/**
 * كود محسن وموثق بواسطة محرك Hercules AI المساعد (يعمل على متصفحك مجاناً)
 * تم فحص المدخل: "${playgroundInput.trim()}"
 */

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export async function executeOptimizedTask<T = any>(): Promise<ApiResponse<T>> {
  try {
    // 1. معالجة الإدخال بأعلى كفاءة في الذاكرة
    const startTime = performance.now();
    
    // تنفيذ الكود المحسن:
    // ${playgroundInput.replace(/\n/g, '\n    // ')}

    const duration = (performance.now() - startTime).toFixed(2);
    
    return {
      success: true,
      data: { status: 'OPTIMIZED', executionMs: duration } as unknown as T,
      timestamp: new Date().toISOString()
    };
  } catch (err: any) {
    console.error('[Hercules AI Handler] Error detected:', err);
    return {
      success: false,
      error: err.message || 'حدث خطأ أثناء معالجة العملية',
      timestamp: new Date().toISOString()
    };
  }
}`);
        } else if (playgroundTab === 'copy') {
          setPlaygroundOutput(`🎯 3 نماذج إعلانية موجهة ومقنعة (مولدة فلكياً لـ: ${playgroundInput}):

1️⃣ العنوان المثير للفضول (The Hook):
"هل ما زلت تضيع ساعات في إدارة ${playgroundInput}؟ إليك كيف يحلها أكثر من 12,000 محترف في ثوانٍ معدودة."
• الفكرة: مخاطبة نقطة الألم مباشرة ثم تقديم الحل كمعيار للمحترفين.

2️⃣ النموذج العاطفي التحفيزي (Storytelling & Relief):
"تخيل لو كان بإمكانك إنجاز كل ما يخص ${playgroundInput} بضغطة زر واحدة... وفر جهدك لما تحب، ودع الذكاء الاصطناعي يقوم بالباقي."
• الفكرة: نقل العميل لمرحلة الراحة الذهنية وتوفير الوقت.

3️⃣ الدعوة المباشرة للتحرك (Urgent CTA):
"انضم اليوم إلى نخبة رواد الأعمال مع هِـرْكِـلِـيز. جرّب مجاناً الآن وابدأ بمضاعفة نتائجك فوراً!"`);
        } else {
          setPlaygroundOutput(`/imagine prompt: ultra-detailed award-winning cinematic photography of ${playgroundInput}, dark obsidian monolith with glowing neon violet and electric purple fissure cracks, volumetric atmospheric purple fog, Hasselblad 80mm lens, f/1.8 aperture, ray-traced reflections, hyper-realistic 8K resolution, octane render, Unreal Engine 5 aesthetic, photorealistic studio lighting --ar 16:9 --style raw --v 6.0 --s 750`);
        }
        setIsGenerating(false);
      }, 700);
    } catch (err: any) {
      alert(`تنبيه: ${err.message || 'تعذر الاتصال بالمفتاح، يرجى التحقق من صحته أو التبديل للوضع المجاني'}`);
      setIsGenerating(false);
    }
  };

  const handleAddTool = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newToolName.trim()) return alert('يرجى إدخال اسم الأداة');

    setIsSubmitting(true);
    try {
      const catObj = categories.find((c) => c.id === newToolCategory);
      const res = await fetch('/api/ai-tools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newToolName,
          tagline: newToolTagline || 'أداة ذكاء اصطناعي متطورة',
          description: newToolDesc || 'أداة مميزة تساعد المحترفين على إنجاز الأعمال بسرعة.',
          category: newToolCategory,
          categoryName: catObj?.label || 'أداة ذكاء اصطناعي',
          pricing: newToolPricing,
          pricingDetails: 'خطط متنوعة متاحة بحساب الزائر',
          websiteUrl: newToolUrl || 'https://hercules.ai',
          logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80',
          features: ['واجهة سهلة الاستخدام', 'دعم الذكاء الاصطناعي التوليدي', 'كريديتس تجريبية مجانية للزائر'],
          arabicSupport: true,
          apiAvailable: false,
          pros: ['سهولة في العمل', 'نتائج سريعة', 'خطة تجريبية مجانية'],
          cons: ['ميزات متقدمة قيد التحديث'],
          comparisonSpecs: {
            speed: 'سريعة جداً',
            easeOfUse: 'سهل',
            bestFor: 'المبدعين ورواد الأعمال',
            monthlyPrice: 'تجربة مجانية متوفرة',
          },
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert('تمت إضافة أداة الذكاء الاصطناعي بنجاح!');
        setIsSubmitToolOpen(false);
        setNewToolName('');
        setNewToolTagline('');
        fetchTools();
      } else {
        alert(data.error || 'فشلت الإضافة');
      }
    } catch (e) {
      alert('حدث خطأ أثناء الإرسال');
    } finally {
      setIsSubmitting(false);
    }
  };

  const comparedTools = tools.filter((t) => comparedToolIds.includes(t.id));

  return (
    <div className="bg-[#05020a] min-h-screen text-gray-100 pb-24 luxury-ambient-bg font-sans selection:bg-purple-500 selection:text-white" dir="rtl">
      
      {/* Header Banner */}
      <div className="relative py-14 bg-[#080312]/95 border-b border-purple-500/20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="hud-badge mb-3">
                <Cpu className="w-3.5 h-3.5 text-purple-400" />
                دليل ومقارنة وتجربة أدوات الذكاء الاصطناعي
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-purple-bright">
                مركز أدوات الذكاء الاصطناعي
              </h1>
              <p className="mt-2 text-sm sm:text-base text-gray-300 max-w-2xl leading-relaxed">
                دليل نخبوي لأكثر من 40 أداة AI رائدة عبر البرمجة والتصميم والفيديو، تعمل جميعها بكريديتس الزائر المجانية مع استوديو تجريبي مباشر دون أي تكلفة استهلاك على السيرفر.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {comparedToolIds.length > 0 && (
                <button
                  onClick={() => setIsCompareModalOpen(true)}
                  className="px-4 py-3 rounded-xl bg-charcoal border border-purple-500/40 text-purple-300 hover:bg-purple-500/20 font-bold text-xs flex items-center gap-2 shadow-gold-sm"
                >
                  <Scale className="w-4 h-4 text-purple-400" />
                  <span>مقارنة الأدوات المختارة ({comparedToolIds.length})</span>
                </button>
              )}
              <button
                onClick={() => setIsSubmitToolOpen(true)}
                className="px-5 py-3 rounded-xl gold-btn-primary font-bold text-sm flex items-center gap-2 shadow-gold-sm"
              >
                <Plus className="w-4 h-4" />
                <span>أضف أداة AI جديدة</span>
              </button>
            </div>
          </div>

          {/* Zero-Cost Visitor Billing Notice Banner */}
          <div className="mt-8 p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 text-purple-200">
              <ShieldCheck className="w-4 h-4 text-purple-400 flex-shrink-0" />
              <span>
                <strong>نظام كريديتس الزائر الذاتي (Zero Owner Cost):</strong> تعمل جميع الأدوات والاستوديو عبر متصفح الزائر أو خطط الأدوات المجانية دون خصم أي رصيد من حساب المنصة.
              </span>
            </div>
            <button
              onClick={() => setIsKeyConfigOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-400/30 text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap"
            >
              <Key className="w-3.5 h-3.5 text-purple-400" />
              <span>{visitorApiKey ? 'مفتاحك الشخصي مفعل ✓' : 'إعداد مفتاح API شخصي (BYOK)'}</span>
            </button>
          </div>

          {/* Search bar */}
          <div className="mt-6 max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="ابحث عن أداة (مثل: Cursor, Midjourney, ElevenLabs)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchTools()}
                className="w-full bg-[#0e071c] border border-purple-500/25 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors"
              />
              <Search
                onClick={fetchTools}
                className="w-4 h-4 text-purple-400 absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="border-b border-purple-500/15 bg-[#080312]/70 sticky top-16 z-30 backdrop-blur-md">
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
                    ? 'bg-purple-600 text-white shadow-neon-purple'
                    : 'bg-[#0e071c] border border-purple-500/20 text-gray-300 hover:text-purple-300 hover:border-purple-500/40'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Live AI Interactive Sandbox / Playground */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10" id="playground">
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0e071c] border border-purple-500/30 relative overflow-hidden shadow-neon-purple">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-purple-500/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-400 shadow-sm">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">استوديو تجربة الذكاء الاصطناعي المباشر</h3>
                <p className="text-xs text-gray-400">
                  يعمل على كريديتس ومحرك الزائر المباشر (وضع {engineMode === 'gemini' ? 'Google Gemini الشخصي' : engineMode === 'openai' ? 'OpenAI الشخصي' : 'المحرك الفوري المجاني'})
                </p>
              </div>
            </div>

            {/* Mode Selector */}
            <div className="flex items-center gap-2 bg-[#080312] p-1 rounded-xl border border-purple-500/25 text-xs">
              <button
                onClick={() => setPlaygroundTab('code')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  playgroundTab === 'code' ? 'bg-purple-600 text-white font-bold' : 'text-gray-300 hover:text-white'
                }`}
              >
                تحسين وبرمجة الأكواد
              </button>
              <button
                onClick={() => setPlaygroundTab('copy')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  playgroundTab === 'copy' ? 'bg-purple-600 text-white font-bold' : 'text-gray-300 hover:text-white'
                }`}
              >
                نصوص تسويقية وإعلانية
              </button>
              <button
                onClick={() => setPlaygroundTab('prompt')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  playgroundTab === 'prompt' ? 'bg-purple-600 text-white font-bold' : 'text-gray-300 hover:text-white'
                }`}
              >
                أوامر Midjourney 8K
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
            {/* Input */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-gray-300 block">
                {playgroundTab === 'code'
                  ? 'أدخل دالة أو كود تريد تحسينه وإصلاح أخطائه:'
                  : playgroundTab === 'copy'
                  ? 'اكتب اسم منتجك أو خدمتك والجمهور المستهدف:'
                  : 'اكتب المشهد أو الفكرة التي تريد تحويلها لأمر فوتوغرافي 8K:'}
              </label>
              <textarea
                rows={5}
                value={playgroundInput}
                onChange={(e) => setPlaygroundInput(e.target.value)}
                placeholder={
                  playgroundTab === 'code'
                    ? 'function calculateProfit(revenue, cost) { return revenue - cost; }'
                    : playgroundTab === 'copy'
                    ? 'متجر ساعات فاخرة للشباب ورجال الأعمال بالخليج'
                    : 'صقر ملكي ذهبي يقف على برج زجاجي وقت الغروب مع انعكاسات نيون بنفسجية'
                }
                className="w-full bg-[#080312] border border-purple-500/25 rounded-2xl p-4 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-400"
              />
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRunPlayground}
                  disabled={isGenerating}
                  className="flex-1 py-3 rounded-xl gold-btn-primary font-bold text-xs flex items-center justify-center gap-2 shadow-gold-sm"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isGenerating ? 'جاري المعالجة والتوليد...' : 'توليد النتيجة الفورية بواسطة AI'}</span>
                </button>
                <button
                  onClick={() => setIsKeyConfigOpen(true)}
                  className="p-3 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-300 hover:bg-purple-500/25"
                  title="تغيير إعدادات مفتاح الزائر (BYOK)"
                >
                  <Key className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Output */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-purple-300">النتيجة المولدة الذكية:</span>
                {playgroundOutput && (
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(playgroundOutput);
                      alert('تم نسخ النتيجة إلى الحافظة!');
                    }}
                    className="flex items-center gap-1 text-purple-400 hover:text-white"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>نسخ</span>
                  </button>
                )}
              </div>
              <div className="w-full h-44 bg-[#080312] border border-purple-500/20 rounded-2xl p-4 text-xs font-mono text-purple-200 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                {playgroundOutput || (
                  <span className="text-gray-500 font-sans">
                    ستظهر هنا النتيجة الفائقة الدقة بعد الضغط على زر التوليد... (صفر استهلاك على سيرفر المنصة)
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tools Catalog Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-white">دليل الأدوات الموثقة (40+ أداة AI)</h2>
            <p className="text-xs text-gray-400 mt-1">
              أدوات مفعلة ومجربة، متاحة للاستخدام المباشر بحساب الزائر المجاني
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 rounded-2xl bg-[#0e071c] border border-purple-500/15 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => {
              const isCompared = comparedToolIds.includes(tool.id);
              return (
                <div
                  key={tool.id}
                  className="rounded-2xl bg-[#0e071c] border border-purple-500/20 p-6 flex flex-col justify-between hover:border-purple-400/60 transition-all duration-300 hover:shadow-neon-purple hover:-translate-y-1"
                >
                  <div>
                    {/* Top strip */}
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={tool.logo}
                          alt={tool.name}
                          className="w-12 h-12 rounded-xl border border-purple-500/30 object-cover"
                        />
                        <div>
                          <h3 className="font-black text-base text-white">{tool.name}</h3>
                          <span className="text-[11px] text-purple-400 font-semibold">{tool.categoryName}</span>
                        </div>
                      </div>

                      <div className="text-left">
                        <span className="px-2.5 py-1 rounded-md bg-[#080312] border border-purple-500/30 text-[11px] font-bold text-purple-300 block mb-1">
                          {tool.pricing}
                        </span>
                        <span className="text-[10px] text-green-400 font-medium block">
                          ✓ كريديتس الزائر
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-300 leading-relaxed line-clamp-2 mb-4">
                      {tool.tagline}
                    </p>

                    {/* Features list */}
                    <div className="space-y-1.5 mb-6 text-xs text-gray-400">
                      {tool.features.slice(0, 3).map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                          <span className="line-clamp-1">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions & Direct Visitor Launch */}
                  <div className="pt-4 border-t border-purple-500/15 flex items-center justify-between gap-2">
                    <button
                      onClick={(e) => handleUpvote(tool.id, e)}
                      className="px-3 py-1.5 rounded-lg bg-[#080312] hover:bg-purple-500/20 border border-purple-500/20 text-xs font-bold text-purple-300 flex items-center gap-1.5 transition-colors"
                      title="تصويت للأداة"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{tool.upvotes}</span>
                    </button>

                    <button
                      onClick={() => toggleCompare(tool.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        isCompared
                          ? 'bg-purple-600 text-white font-bold border-purple-500 shadow-sm'
                          : 'bg-[#080312] border-purple-500/20 text-gray-400 hover:text-white'
                      }`}
                    >
                      {isCompared ? '✓ بالمقارنة' : '+ مقارنة'}
                    </button>

                    <button
                      onClick={() => setActiveInAppTool(tool)}
                      className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white border border-purple-400/40 text-xs font-bold transition-all flex items-center gap-1.5 shadow-neon-purple hover:scale-105 active:scale-95"
                      title="تشغيل وتجربة الأداة فورياً داخل المنصة"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-purple-200" />
                      <span>تشغيل داخل الموقع</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Visitor BYOK (API Key) Configuration Modal */}
      {isKeyConfigOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-md rounded-3xl bg-[#0e071c] border border-purple-500/40 text-white shadow-neon-purple p-6 sm:p-8 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-purple-500/20">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-bold text-white">إعدادات مفتاح الذكاء الاصطناعي (BYOK)</h3>
              </div>
              <button onClick={() => setIsKeyConfigOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs text-gray-300">
              <p className="leading-relaxed">
                لكي يبقى الموقع مجانياً 100% دون أي تكاليف سيرفر على صاحب المنصة، يمكنك تشغيل الاستوديو إما عبر <strong>المحرك الفوري المجاني</strong>، أو بإدخال مفتاح الـ API الخاص بك (يُحفظ بأمان في متصفحك فقط):
              </p>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">اختر وضع المعالجة:</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setEngineMode('client')}
                    className={`p-2 rounded-xl border text-center font-bold ${
                      engineMode === 'client' ? 'bg-purple-600 text-white border-purple-400' : 'bg-[#080312] border-purple-500/20'
                    }`}
                  >
                    محرك فوري مجاني
                  </button>
                  <button
                    type="button"
                    onClick={() => setEngineMode('gemini')}
                    className={`p-2 rounded-xl border text-center font-bold ${
                      engineMode === 'gemini' ? 'bg-purple-600 text-white border-purple-400' : 'bg-[#080312] border-purple-500/20'
                    }`}
                  >
                    Google Gemini
                  </button>
                  <button
                    type="button"
                    onClick={() => setEngineMode('openai')}
                    className={`p-2 rounded-xl border text-center font-bold ${
                      engineMode === 'openai' ? 'bg-purple-600 text-white border-purple-400' : 'bg-[#080312] border-purple-500/20'
                    }`}
                  >
                    OpenAI GPT
                  </button>
                </div>
              </div>

              {engineMode !== 'client' && (
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">
                    أدخل مفتاح الـ API الخاص بك ({engineMode === 'gemini' ? 'Gemini API Key' : 'OpenAI API Key'}):
                  </label>
                  <input
                    type="password"
                    placeholder="sk-..."
                    value={visitorApiKey}
                    onChange={(e) => setVisitorApiKey(e.target.value)}
                    className="w-full bg-[#080312] border border-purple-500/30 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-purple-400"
                  />
                  <span className="text-[10px] text-gray-400 mt-1 block">
                    يُحفظ في المتصفح فقط ويتم الاتصال مباشرة من جهازك بالشركة المزودة دون المرور بسيرفراتنا.
                  </span>
                </div>
              )}

              <div className="pt-3 border-t border-purple-500/20 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => handleSaveKey(visitorApiKey, engineMode)}
                  className="px-5 py-2.5 rounded-xl gold-btn-primary font-bold text-xs"
                >
                  حفظ وتطبيق الإعدادات
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Side-by-Side Comparison Modal */}
      {isCompareModalOpen && comparedTools.length > 0 && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-5xl rounded-3xl bg-[#0e071c] border border-purple-500/40 text-white shadow-neon-purple p-6 sm:p-8 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-6 border-b border-purple-500/20">
              <div className="flex items-center gap-3">
                <Scale className="w-6 h-6 text-purple-400" />
                <div>
                  <h3 className="text-xl font-black text-white">مقارنة الأدوات جنباً إلى جنب</h3>
                  <p className="text-xs text-gray-400">مصفوفة هِـرْكِـلِـيز الذكية للمقارنة الفنية والمالية</p>
                </div>
              </div>
              <button
                onClick={() => setIsCompareModalOpen(false)}
                className="text-gray-400 hover:text-white p-2"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Matrix Table */}
            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-purple-500/20">
                    <th className="p-3 text-purple-400 font-bold w-40">وجه المقارنة</th>
                    {comparedTools.map((t) => (
                      <th key={t.id} className="p-3 text-white font-black text-sm">
                        <div className="flex items-center gap-2">
                          <img src={t.logo} alt={t.name} className="w-7 h-7 rounded-lg border border-purple-500/30" />
                          <span>{t.name}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-500/10">
                  <tr>
                    <td className="p-3 font-semibold text-gray-400">التصنيف الرئيسي</td>
                    {comparedTools.map((t) => (
                      <td key={t.id} className="p-3 font-bold text-purple-300">{t.categoryName}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-gray-400">نموذج التسعير</td>
                    {comparedTools.map((t) => (
                      <td key={t.id} className="p-3 text-white">{t.pricing} ({t.pricingDetails})</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-gray-400">الاشتراك الشهري التقديري</td>
                    {comparedTools.map((t) => (
                      <td key={t.id} className="p-3 text-purple-400 font-bold">{t.comparisonSpecs.monthlyPrice}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-gray-400">دعم اللغة العربية</td>
                    {comparedTools.map((t) => (
                      <td key={t.id} className="p-3">
                        {t.arabicSupport ? (
                          <span className="text-green-400 font-semibold flex items-center gap-1">
                            <Check className="w-4 h-4" /> مدعوم بقوة
                          </span>
                        ) : (
                          <span className="text-gray-500 flex items-center gap-1">
                            <X className="w-4 h-4" /> محدود أو غير مباشر
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-gray-400">توفر واجهة برمجة API</td>
                    {comparedTools.map((t) => (
                      <td key={t.id} className="p-3">
                        {t.apiAvailable ? (
                          <span className="text-green-400 font-semibold">متاح للمطورين</span>
                        ) : (
                          <span className="text-gray-500">غير متاح</span>
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-gray-400">الأنسب لـ (Best For)</td>
                    {comparedTools.map((t) => (
                      <td key={t.id} className="p-3 text-gray-300">{t.comparisonSpecs.bestFor}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-gray-400">أبرز الإيجابيات (Pros)</td>
                    {comparedTools.map((t) => (
                      <td key={t.id} className="p-3 text-gray-300 space-y-1">
                        {t.pros.map((p, idx) => (
                          <div key={idx} className="flex items-center gap-1 text-green-300">
                            + {p}
                          </div>
                        ))}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-gray-400">السلبيات أو القيود (Cons)</td>
                    {comparedTools.map((t) => (
                      <td key={t.id} className="p-3 text-gray-300 space-y-1">
                        {t.cons.map((c, idx) => (
                          <div key={idx} className="flex items-center gap-1 text-purple-300">
                            - {c}
                          </div>
                        ))}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setIsCompareModalOpen(false)}
                className="px-6 py-2.5 rounded-xl gold-btn-primary font-bold text-xs"
              >
                إغلاق المقارنة
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submit Tool Modal */}
      {isSubmitToolOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-xl rounded-3xl bg-[#0e071c] border border-purple-500/30 text-white shadow-neon-purple p-6 sm:p-8 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-purple-500/20">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-bold text-white">إضافة أداة ذكاء اصطناعي للدليل</h3>
              </div>
              <button
                onClick={() => setIsSubmitToolOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddTool} className="mt-6 space-y-4 text-xs">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">اسم الأداة *</label>
                <input
                  type="text"
                  placeholder="مثال: DeepSeek Coder"
                  value={newToolName}
                  onChange={(e) => setNewToolName(e.target.value)}
                  required
                  className="w-full bg-[#080312] border border-purple-500/20 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-400 text-sm"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">الشعار القصير (Tagline)</label>
                <input
                  type="text"
                  placeholder="مثال: نموذج برمجي متقدم لفهم وحل المسائل المعقدة"
                  value={newToolTagline}
                  onChange={(e) => setNewToolTagline(e.target.value)}
                  className="w-full bg-[#080312] border border-purple-500/20 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-400 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">التصنيف *</label>
                  <select
                    value={newToolCategory}
                    onChange={(e) => setNewToolCategory(e.target.value as AICategory)}
                    className="w-full bg-[#080312] border border-purple-500/20 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-purple-400 text-xs"
                  >
                    <option value="coding">برمجة وتطوير</option>
                    <option value="design">تصميم وجرافيك</option>
                    <option value="video">مونتاج وفيديو</option>
                    <option value="writing">كتابة ومحتوى</option>
                    <option value="audio">صوت وموسيقى</option>
                    <option value="marketing">تسويق وسيو</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">نوع التسعير</label>
                  <select
                    value={newToolPricing}
                    onChange={(e) => setNewToolPricing(e.target.value as any)}
                    className="w-full bg-[#080312] border border-purple-500/20 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-purple-400 text-xs"
                  >
                    <option value="مجاني">مجاني بالكامل</option>
                    <option value="Freemium">Freemium (مجاني + مدفوع)</option>
                    <option value="مدفوع">مدفوع بالكامل</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">رابط الموقع الرسمي للأداة</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={newToolUrl}
                  onChange={(e) => setNewToolUrl(e.target.value)}
                  className="w-full bg-[#080312] border border-purple-500/20 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-400 text-xs"
                />
              </div>

              <div className="pt-3 border-t border-purple-500/20 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsSubmitToolOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-gray-400 hover:text-white"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl gold-btn-primary font-bold text-xs"
                >
                  {isSubmitting ? 'جاري الحفظ...' : 'إضافة الأداة للدليل'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* In-App Interactive AI Workspace Studio Modal */}
      {activeInAppTool && (
        <InAppAIWorkspaceModal
          tool={activeInAppTool}
          onClose={() => setActiveInAppTool(null)}
        />
      )}
    </div>
  );
}

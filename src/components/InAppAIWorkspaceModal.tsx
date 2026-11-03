'use client';

import React, { useState, useEffect } from 'react';
import { AITool } from '@/types';
import { useToast } from '@/context/ToastContext';
import { CreditsPricingModal } from './CreditsPricingModal';
import {
  X,
  ExternalLink,
  Sparkles,
  Maximize2,
  Minimize2,
  Code2,
  MessageSquare,
  Film,
  Mic,
  Copy,
  Check,
  Play,
  RotateCw,
  Zap,
  ShieldCheck,
  Globe,
  Sliders,
} from 'lucide-react';

interface InAppAIWorkspaceModalProps {
  tool: AITool | null;
  onClose: () => void;
}

export function InAppAIWorkspaceModal({ tool, onClose }: InAppAIWorkspaceModalProps) {
  if (!tool) return null;

  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'studio' | 'webview' | 'guide'>('studio');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Credits & Subscriptions State
  const [credits, setCredits] = useState<number>(1);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [planName, setPlanName] = useState('تجريبي مجاني (1 كريديت)');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCredits = localStorage.getItem('hercules_ai_credits');
      const savedPlan = localStorage.getItem('hercules_ai_plan');
      if (savedCredits !== null) {
        setCredits(Number(savedCredits));
      } else {
        localStorage.setItem('hercules_ai_credits', '1');
        setCredits(1);
      }
      if (savedPlan) {
        setPlanName(savedPlan);
      }
    }
  }, []);

  // Studio Interactive States
  const [inputPrompt, setInputPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [studioOutput, setStudioOutput] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  // Chat tool state
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'assistant'; text: string }>>([
    {
      sender: 'assistant',
      text: `مرحباً بك! أنا مساعد ${tool.name} المدمج داخل هِـرْكِـلِـيز. كيف يمكنني مساعدتك اليوم في ${tool.categoryName}؟`,
    },
  ]);

  // Image/Video state
  const [selectedRatio, setSelectedRatio] = useState('16:9');
  const [selectedStyle, setSelectedStyle] = useState('سينمائي 4K');

  // Audio state
  const [selectedVoice, setSelectedVoice] = useState('عمر - معلق صوتي عربي فخم');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast('تم نسخ المحتوى إلى الحافظة بنجاح! 📋', 'purple');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExecuteStudio = () => {
    if (!inputPrompt.trim()) return alert('يرجى كتابة نص أو فكرة للتجربة');

    // Credit gate: 1st time free, then must subscribe
    if (credits <= 0) {
      setIsPricingModalOpen(true);
      showToast('لقد استهلكت رصيدك المجاني الأول! يرجى اختيار إحدى الباقات للاستمرار ⚡', 'error');
      return;
    }

    setIsProcessing(true);
    setStudioOutput(null);

    // Deduct credit
    if (credits < 9999) {
      const nextCredits = credits - 1;
      setCredits(nextCredits);
      if (typeof window !== 'undefined') {
        localStorage.setItem('hercules_ai_credits', String(nextCredits));
      }
    }

    setTimeout(() => {
      if (tool.category === 'coding') {
        setStudioOutput(`// تم التوليد بنجاح بواسطة محرك ${tool.name} داخل هِـرْكِـلِـيز
// الطلب: ${inputPrompt}

import React, { useState, useEffect } from 'react';

export interface ModernComponentProps {
  title?: string;
  theme?: 'obsidian' | 'violet';
  onAction?: () => void;
}

export const Generated${tool.name.replace(/[^a-zA-Z]/g, '')}Component: React.FC<ModernComponentProps> = ({
  title = '${inputPrompt.slice(0, 30)}',
  onAction,
}) => {
  const [active, setActive] = useState(false);

  return (
    <div className="p-6 rounded-3xl bg-[#0e071c] border border-purple-500/30 text-white shadow-neon-purple">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-black text-purple-300">{title}</h3>
        <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-200 text-xs font-bold">
          ⚡ ${tool.name} Active
        </span>
      </div>
      <p className="text-xs text-gray-300 leading-relaxed mb-4">
        كود عالي الأداء معالَج بالكامل بنظام Serverless المتوافق مع Next.js 14 وTailwind CSS.
      </p>
      <button
        onClick={() => {
          setActive(!active);
          onAction?.();
        }}
        className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md transition-all"
      >
        {active ? 'تم التفعيل ✓' : 'تنفيذ العملية'}
      </button>
    </div>
  );
};`);
      } else if (tool.category === 'writing') {
        const newMsg = { sender: 'user' as const, text: inputPrompt };
        const replyMsg = {
          sender: 'assistant' as const,
          text: `بناءً على طلبك حول "${inputPrompt}":\n\n1. التحليل المباشر: الفكرة ممتازة وتستهدف شريحة عالية الاهتمام في سوق المحتوى.\n2. التوصيات العملية: ركّز على تقديم قيمة سريعة في أول 3 ثوانٍ، واستخدم صياغة جذابة ومقنعة.\n3. الصياغة المقترحة:\n"اكتشف الحل الأمثل لمضاعفة نتائجك مع ${inputPrompt} - خطوة بخطوة بأحدث تقنيات ${tool.name}."`,
        };
        setChatMessages((prev) => [...prev, newMsg, replyMsg]);
        setInputPrompt('');
      } else if (tool.category === 'video' || tool.category === 'design') {
        setStudioOutput({
          type: 'media',
          prompt: inputPrompt,
          style: selectedStyle,
          ratio: selectedRatio,
          previewUrl:
            tool.category === 'video'
              ? 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80'
              : 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
        });
      } else if (tool.category === 'audio') {
        setStudioOutput({
          type: 'audio',
          text: inputPrompt,
          voice: selectedVoice,
        });
      } else {
        setStudioOutput({
          type: 'general',
          result: `تم تحليل وتوليد استراتيجية التسويق والنمو لـ "${inputPrompt}" بنجاح باستخدام خوارزميات ${tool.name}.`,
        });
      }

      setIsProcessing(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      <div
        className={`relative w-full rounded-3xl bg-[#080312] border border-purple-500/40 text-white shadow-neon-purple flex flex-col transition-all duration-200 overflow-hidden ${
          isFullscreen ? 'h-[98vh] max-w-[98vw]' : 'h-[90vh] max-w-5xl'
        }`}
      >
        {/* Top Header Bar */}
        <div className="p-4 sm:px-6 bg-[#0e071c] border-b border-purple-500/20 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <img
              src={tool.logo}
              alt={tool.name}
              className="w-10 h-10 rounded-xl object-cover border border-purple-400/40 shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base text-white">{tool.name}</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>يعمل الآن داخل هِـرْكِـلِـيز</span>
                </span>
              </div>
              <p className="text-[11px] text-gray-400 mt-0.5">
                {tool.categoryName} • يعمل بكريديتس الزائر المجانية (Zero Server Cost)
              </p>
            </div>
          </div>

          {/* Tab Switcher inside Modal */}
          <div className="flex items-center gap-1 bg-[#080312] p-1 rounded-2xl border border-purple-500/25 text-xs font-bold">
            <button
              onClick={() => setActiveTab('studio')}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'studio'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-300" />
              <span>الاستوديو المباشر المدمج</span>
            </button>

            <button
              onClick={() => setActiveTab('webview')}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'webview'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>المتصفح المدمج (Webview)</span>
            </button>

            <button
              onClick={() => setActiveTab('guide')}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'guide'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>دليل الحساب المجاني</span>
            </button>
          </div>

          {/* Action Icons & Credits Upgrade */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPricingModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/40 text-purple-200 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
              title="الرصيد المتبقي لاستخدام الذكاء الاصطناعي"
            >
              <Zap className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
              <span>{credits >= 9999 ? 'غير محدود 🔥' : `${credits} كريديت`}</span>
              <span className="text-[10px] text-purple-300 font-normal">| شحن باقة</span>
            </button>

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white"
              title={isFullscreen ? 'تصغير' : 'ملء الشاشة'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <a
              href={tool.websiteUrl}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-xl bg-purple-500/15 hover:bg-purple-500/30 text-purple-300 hover:text-white border border-purple-500/30"
              title="فتح في نافذة مستقلة"
            >
              <ExternalLink className="w-4 h-4" />
            </a>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-300 transition-colors"
              title="إغلاق"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Main Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#05020a]">
          {activeTab === 'studio' ? (
            /* Tab 1: Interactive Live In-App Engine */
            <div className="h-full flex flex-col space-y-4">
              
              {/* Category-Specific Workspace */}
              {tool.category === 'writing' ? (
                /* Chat Conversation Workspace */
                <div className="flex-1 flex flex-col h-[520px] rounded-3xl bg-[#0e071c] border border-purple-500/25 p-4 sm:p-6 justify-between">
                  {/* Messages Feed */}
                  <div className="flex-1 overflow-y-auto space-y-3 p-2">
                    {chatMessages.map((msg, i) => (
                      <div
                        key={i}
                        className={`flex gap-3 max-w-[85%] ${
                          msg.sender === 'user' ? 'mr-auto flex-row-reverse' : 'ml-auto'
                        }`}
                      >
                        <div
                          className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                            msg.sender === 'user'
                              ? 'bg-purple-600 text-white'
                              : 'bg-gradient-to-br from-fuchsia-500 to-purple-800 text-white'
                          }`}
                        >
                          {msg.sender === 'user' ? 'أنت' : tool.name.slice(0, 1)}
                        </div>
                        <div
                          className={`p-3.5 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                            msg.sender === 'user'
                              ? 'bg-purple-600/30 text-white border border-purple-500/40 rounded-tr-none'
                              : 'bg-[#080312] text-gray-200 border border-purple-500/20 rounded-tl-none'
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    ))}
                    {isProcessing && (
                      <div className="flex items-center gap-2 text-xs text-purple-400 animate-pulse p-2">
                        <Sparkles className="w-4 h-4 animate-spin" />
                        <span>جاري صياغة الرد بواسطة {tool.name}...</span>
                      </div>
                    )}
                  </div>

                  {/* Chat Input */}
                  <div className="pt-3 border-t border-purple-500/20 flex gap-2">
                    <input
                      type="text"
                      placeholder={`اكتب رسالتك أو استفسارك هنا لـ ${tool.name}...`}
                      value={inputPrompt}
                      onChange={(e) => setInputPrompt(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleExecuteStudio()}
                      className="flex-1 bg-[#080312] border border-purple-500/30 rounded-2xl px-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-400"
                    />
                    <button
                      onClick={handleExecuteStudio}
                      disabled={isProcessing}
                      className="px-6 py-3 rounded-2xl gold-btn-primary font-bold text-xs flex items-center gap-1.5 shadow-gold-sm"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>إرسال</span>
                    </button>
                  </div>
                </div>
              ) : tool.category === 'coding' ? (
                /* Code Editor & Refactor Workspace */
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Code Input */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-gray-300">
                      <span className="flex items-center gap-1.5">
                        <Code2 className="w-4 h-4 text-purple-400" />
                        <span>محرر الكود والطلبات البرمجية لـ {tool.name}:</span>
                      </span>
                      <span className="text-[10px] text-purple-300">TypeScript / React 18</span>
                    </div>

                    <textarea
                      rows={12}
                      value={inputPrompt}
                      onChange={(e) => setInputPrompt(e.target.value)}
                      placeholder={`// الصق كودك هنا أو اطلب كتابة دالة أو واجهة مستخدم كاملة...\n// مثال:\nfunction handlePayment(cartItems) {\n  // أريد تحسين هذا الكود وإضافة معالجة الأخطاء\n}`}
                      className="w-full bg-[#080312] border border-purple-500/30 rounded-2xl p-4 text-xs font-mono text-purple-200 focus:outline-none focus:border-purple-400 leading-relaxed"
                    />

                    <button
                      onClick={handleExecuteStudio}
                      disabled={isProcessing}
                      className="w-full py-3 rounded-2xl gold-btn-primary font-bold text-xs flex items-center justify-center gap-2 shadow-gold-sm"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>{isProcessing ? 'جاري التحسين والبرمجة...' : `توليد الكود المحسن عبر ${tool.name}`}</span>
                    </button>
                  </div>

                  {/* Code Output */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-gray-300">
                      <span className="text-purple-300">النتيجة البرمجية المولدة:</span>
                      {studioOutput && (
                        <button
                          onClick={() => handleCopy(studioOutput)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 hover:text-white border border-purple-400/30 text-[11px]"
                        >
                          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copied ? 'تم النسخ' : 'نسخ الكود'}</span>
                        </button>
                      )}
                    </div>

                    <div className="w-full h-80 bg-[#080312] border border-purple-500/20 rounded-2xl p-4 text-xs font-mono text-emerald-300 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                      {studioOutput || (
                        <span className="text-gray-500 font-sans text-xs">
                          الصق الكود واضغط زر التوليد لعرض الكود المحدث مع الشرح والاختبارات البرمجية هنا فوراً...
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ) : tool.category === 'video' || tool.category === 'design' ? (
                /* Image / Video Generator Studio */
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs font-bold text-gray-300">
                      <span className="flex items-center gap-1.5">
                        <Film className="w-4 h-4 text-purple-400" />
                        <span>استوديو التوليد البصري لـ {tool.name}:</span>
                      </span>
                    </div>

                    <textarea
                      rows={5}
                      value={inputPrompt}
                      onChange={(e) => setInputPrompt(e.target.value)}
                      placeholder="اكتب وصف المشهد بالتفصيل (مثل: قصر فضائي ملكي باللونين الأسود والبنفسجي النيون المشع مع سديم كوني وإضاءة سينمائية 8K)..."
                      className="w-full bg-[#080312] border border-purple-500/30 rounded-2xl p-4 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-400"
                    />

                    {/* Aspect Ratio & Style */}
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block text-gray-400 mb-1">الأبعاد والنسبة:</label>
                        <select
                          value={selectedRatio}
                          onChange={(e) => setSelectedRatio(e.target.value)}
                          className="w-full bg-[#080312] border border-purple-500/30 rounded-xl p-2.5 text-white text-xs"
                        >
                          <option value="16:9">16:9 (عريض سينمائي 4K)</option>
                          <option value="9:16">9:16 (عمودي ريلز وستوري)</option>
                          <option value="1:1">1:1 (مربع إنستغرام)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-gray-400 mb-1">النمط البصري (Style):</label>
                        <select
                          value={selectedStyle}
                          onChange={(e) => setSelectedStyle(e.target.value)}
                          className="w-full bg-[#080312] border border-purple-500/30 rounded-xl p-2.5 text-white text-xs"
                        >
                          <option value="سينمائي 4K">سينمائي 4K Realism</option>
                          <option value="أوبسيديان نيون مشع">أوبسيديان نيون مشع (Theme)</option>
                          <option value="فوتوغرافي واقعي">فوتوغرافي واقعي Hasselblad</option>
                          <option value="أنمي 3D">أنمي 3D ثلاثي الأبعاد</option>
                        </select>
                      </div>
                    </div>

                    <button
                      onClick={handleExecuteStudio}
                      disabled={isProcessing}
                      className="w-full py-3.5 rounded-2xl gold-btn-primary font-bold text-xs flex items-center justify-center gap-2 shadow-gold-sm"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>{isProcessing ? 'جاري الريندر والتوليد...' : `توليد ومعاينة المشهد عبر ${tool.name}`}</span>
                    </button>
                  </div>

                  {/* Media Preview Box */}
                  <div className="space-y-3">
                    <span className="text-xs font-bold text-purple-300 block">شاشة العرض والمعاينة المباشرة:</span>
                    <div className="w-full h-80 rounded-2xl bg-[#080312] border border-purple-500/30 overflow-hidden relative flex items-center justify-center">
                      {studioOutput?.previewUrl ? (
                        <div className="relative w-full h-full group">
                          <img
                            src={studioOutput.previewUrl}
                            alt="AI Preview"
                            className="w-full h-full object-cover animate-in fade-in duration-500"
                          />
                          <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/90 to-transparent text-xs text-white">
                            <div className="font-bold">{studioOutput.prompt}</div>
                            <div className="text-[10px] text-purple-300 mt-0.5">
                              {studioOutput.style} • النسبة {studioOutput.ratio}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center p-6 text-gray-500 text-xs">
                          <Film className="w-8 h-8 text-purple-400/40 mx-auto mb-2" />
                          <span>ستظهر هنا معاينة الصورة أو الفيديو المولد بدقة فائقة...</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                /* Audio & Speech Synthesizer */
                <div className="space-y-4 max-w-xl mx-auto p-6 rounded-3xl bg-[#0e071c] border border-purple-500/25">
                  <div className="flex items-center gap-2 text-sm font-bold text-white mb-2">
                    <Mic className="w-5 h-5 text-purple-400" />
                    <span>محاكي التوليد الصوتي والتعليق لـ {tool.name}:</span>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-1">اختر النبرة الصوتية:</label>
                    <select
                      value={selectedVoice}
                      onChange={(e) => setSelectedVoice(e.target.value)}
                      className="w-full bg-[#080312] border border-purple-500/30 rounded-xl p-3 text-xs text-white"
                    >
                      <option value="عمر - معلق صوتي عربي فخم">عمر - معلق صوتي عربي فخم (Deep Cinematic)</option>
                      <option value="سارة - وثائقي وهادئ">سارة - وثائقي وهادئ (Calm Documentary)</option>
                      <option value="Adam - إنجليزي تجاري">Adam - إنجليزي تجاري (Commercial English)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-1">النص المطلوب تحويله لصوت طبيعي:</label>
                    <textarea
                      rows={4}
                      value={inputPrompt}
                      onChange={(e) => setInputPrompt(e.target.value)}
                      placeholder="اكتب النص هنا لسماعه ومحاكاته بصوت بشري فائق الواقعية..."
                      className="w-full bg-[#080312] border border-purple-500/30 rounded-2xl p-4 text-xs text-white focus:outline-none focus:border-purple-400"
                    />
                  </div>

                  <button
                    onClick={handleExecuteStudio}
                    disabled={isProcessing}
                    className="w-full py-3.5 rounded-2xl gold-btn-primary font-bold text-xs flex items-center justify-center gap-2 shadow-gold-sm"
                  >
                    <Play className="w-4 h-4" />
                    <span>{isProcessing ? 'جاري توليد الصوت الطبيعي...' : `محاكاة وتوليد الصوت عبر ${tool.name}`}</span>
                  </button>

                  {studioOutput?.type === 'audio' && (
                    <div className="p-4 rounded-2xl bg-purple-500/15 border border-purple-400/40 flex items-center justify-between text-xs mt-4">
                      <div>
                        <div className="font-bold text-white">تم توليد الصوت بنجاح!</div>
                        <div className="text-[10px] text-purple-300 mt-0.5">النبرة: {studioOutput.voice}</div>
                      </div>
                      <button
                        onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                        className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold flex items-center gap-1.5 shadow-sm"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>{isPlayingAudio ? 'إيقاف' : 'استماع للمعاينة'}</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

            </div>
          ) : activeTab === 'webview' ? (
            /* Tab 2: Embedded Webview (Iframe) */
            <div className="h-full flex flex-col space-y-2">
              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/25 flex items-center justify-between text-xs text-purple-200">
                <span>
                  <strong>المتصفح المدمج المباشر:</strong> يتم تشغيل موقع الأداة الرسمي مباشرة داخل متصفحك لتسجيل الدخول والاستمتاع بالخدمة.
                </span>
                <a
                  href={tool.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-[11px] flex items-center gap-1"
                >
                  <span>فتح في نافذة كاملة</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="flex-1 w-full h-[520px] rounded-2xl bg-black border border-purple-500/30 overflow-hidden relative">
                <iframe
                  src={tool.websiteUrl}
                  title={tool.name}
                  className="w-full h-full border-0"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                />
              </div>
            </div>
          ) : (
            /* Tab 3: Free Credits & Visitor Plan Guide */
            <div className="max-w-2xl mx-auto space-y-6 py-6">
              <div className="p-6 rounded-3xl bg-[#0e071c] border border-purple-500/30 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-400">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">كيف تستخدم {tool.name} مجاناً 100%؟</h4>
                    <p className="text-xs text-purple-300">نظام كريديتس الزائر الذاتي بدون أي تكاليف سيرفر</p>
                  </div>
                </div>

                <div className="space-y-3 text-xs text-gray-300 leading-relaxed pt-2">
                  <div className="p-3.5 rounded-2xl bg-[#080312] border border-purple-500/20 space-y-1">
                    <div className="font-bold text-white">1. نموذج التسعير الرسمي للأداة:</div>
                    <p className="text-gray-400">{tool.pricing} ({tool.pricingDetails})</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#080312] border border-purple-500/20 space-y-1">
                    <div className="font-bold text-white">2. تسجيل الدخول المجاني بحساب Google:</div>
                    <p className="text-gray-400">
                      تمنحك الأداة تلقائياً رصيداً تجريبياً مجانياً فور تسجيل الدخول بحسابك دون الحاجة لبطاقة بنكية.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#080312] border border-purple-500/20 space-y-1">
                    <div className="font-bold text-white">3. الاستخدام عبر استوديو هِـرْكِـلِـيز:</div>
                    <p className="text-gray-400">
                      يمكنك الاستفادة من المحرك الداخلي السريع لتوليد الأكواد والصور والنصوص دون مغادرة المنصة.
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setActiveTab('studio')}
                    className="px-6 py-2.5 rounded-xl gold-btn-primary font-bold text-xs shadow-gold-sm"
                  >
                    بدء التجربة المباشرة الآن
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Credits & Subscription Plans Modal */}
      <CreditsPricingModal
        isOpen={isPricingModalOpen}
        onClose={() => setIsPricingModalOpen(false)}
        onSuccess={(newCredits, name) => {
          setCredits(newCredits);
          setPlanName(name);
        }}
      />
    </div>
  );
}

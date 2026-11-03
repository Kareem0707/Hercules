'use client';

import React, { useState, useEffect } from 'react';
import { LaunchpadProduct, PartnerPost } from '@/types';
import { useAuth } from '@/context/AuthContext';
import {
  Rocket,
  Flame,
  ArrowUp,
  MessageSquare,
  Users,
  ExternalLink,
  Plus,
  Crown,
  Sparkles,
  Share2,
  CheckCircle,
  X,
  Briefcase,
  Search,
  Handshake,
  Mail,
  Calendar,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function LaunchpadPage() {
  const [launches, setLaunches] = useState<LaunchpadProduct[]>([]);
  const [partnerPosts, setPartnerPosts] = useState<PartnerPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'launches' | 'partners'>('launches');

  // Selected project for detailed modal
  const [selectedLaunch, setSelectedLaunch] = useState<LaunchpadProduct | null>(null);

  // Waitlist form state
  const { user } = useAuth();
  const [waitlistEmail, setWaitlistEmail] = useState(user?.email || '');
  const [waitlistJoined, setWaitlistJoined] = useState(false);

  useEffect(() => {
    if (user?.email) {
      setWaitlistEmail(user.email);
      setPartnerEmail(user.email);
    }
  }, [user]);

  // Launch product modal
  const [isLaunchModalOpen, setIsLaunchModalOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectTagline, setProjectTagline] = useState('');
  const [projectCategory, setProjectCategory] = useState('SaaS');
  const [projectDemoUrl, setProjectDemoUrl] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [projectSeekingPartners, setProjectSeekingPartners] = useState(false);
  const [isSubmittingLaunch, setIsSubmittingLaunch] = useState(false);

  // Partner post modal
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
  const [partnerProjectTitle, setPartnerProjectTitle] = useState('');
  const [partnerRoleNeeded, setPartnerRoleNeeded] = useState('شريك تقني خبير (CTO)');
  const [partnerEquity, setPartnerEquity] = useState('15% - 25% أسهم');
  const [partnerStage, setPartnerStage] = useState('مرحلة النموذج الأولي MVP');
  const [partnerDesc, setPartnerDesc] = useState('');
  const [partnerEmail, setPartnerEmail] = useState('');
  const [isSubmittingPartner, setIsSubmittingPartner] = useState(false);

  const fetchLaunchpadData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/launchpad');
      const data = await res.json();
      if (data.success) {
        setLaunches(data.launches);
        setPartnerPosts(data.partnerPosts);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLaunchpadData();
  }, []);

  const handleUpvote = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/launchpad/${id}/upvote`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setLaunches((prev) =>
          prev.map((l) => (l.id === id ? { ...l, upvotes: data.upvotes, hasUpvoted: true } : l))
        );
        if (selectedLaunch && selectedLaunch.id === id) {
          setSelectedLaunch({ ...selectedLaunch, upvotes: data.upvotes, hasUpvoted: true });
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleJoinWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLaunch || !waitlistEmail.trim()) return;

    try {
      const res = await fetch(`/api/launchpad/${selectedLaunch.id}/waitlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: waitlistEmail }),
      });
      const data = await res.json();
      if (data.success) {
        setWaitlistJoined(true);
        setSelectedLaunch({
          ...selectedLaunch,
          earlyAdoptersCount: data.total,
        });

        // Trigger confetti
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#A855F7', '#C084FC', '#D946EF', '#FFFFFF'],
        });
      }
    } catch (e) {
      alert('حدث خطأ أثناء الانضمام');
    }
  };

  const handleCreateLaunch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim() || !projectTagline.trim()) return alert('يرجى ملء الحقول المطلوبة');

    setIsSubmittingLaunch(true);
    try {
      const res = await fetch('/api/launchpad', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: projectName,
          tagline: projectTagline,
          description: projectDesc || 'مشروع تقني صاعد تم إطلاقه على منصة هِرْكِليز.',
          logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=150&q=80',
          coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
          category: projectCategory,
          demoUrl: projectDemoUrl || 'https://hercules.launchpad',
          launchDate: new Date().toISOString().split('T')[0],
          makers: [
            {
              name: 'مؤسس طموح (أنت)',
              role: 'المؤسس التقني',
              avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
            },
          ],
          seekingPartners: projectSeekingPartners,
          partnerRoles: projectSeekingPartners ? ['شريك تقني', 'مدير تسويق نمو'] : [],
          verified: true,
          featured: false,
          status: 'live',
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert('🚀 مبروك! تم إطلاق مشروعك بنجاح على هِرْكِليز!');
        setIsLaunchModalOpen(false);
        setProjectName('');
        setProjectTagline('');
        fetchLaunchpadData();
      } else {
        alert(data.error || 'فشل إطلاق المشروع');
      }
    } catch (e) {
      alert('حدث خطأ أثناء الإطلاق');
    } finally {
      setIsSubmittingLaunch(false);
    }
  };

  const handleCreatePartnerPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerProjectTitle.trim() || !partnerRoleNeeded.trim()) return alert('يرجى ملء بيانات الطلب');

    setIsSubmittingPartner(true);
    try {
      const res = await fetch('/api/launchpad/partner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectTitle: partnerProjectTitle,
          founderName: 'مؤسس معتمد (أنت)',
          founderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
          roleNeeded: partnerRoleNeeded,
          equityOffered: partnerEquity,
          stage: partnerStage,
          description: partnerDesc || 'نبحث عن شريك موهوب للانضمام لرحلة بناء المشروع.',
          contactEmail: partnerEmail || 'founder@hercules.launch',
          tags: ['Co-founder', 'Equity', 'Startup'],
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert('تم نشر طلب البحث عن شريك بنجاح!');
        setIsPartnerModalOpen(false);
        setPartnerProjectTitle('');
        setPartnerDesc('');
        fetchLaunchpadData();
      } else {
        alert(data.error || 'فشل نشر الطلب');
      }
    } catch (e) {
      alert('حدث خطأ أثناء النشر');
    } finally {
      setIsSubmittingPartner(false);
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
                <Rocket className="w-3.5 h-3.5 text-gold-400" />
                منصة إطلاق المشاريع والمنتجات التقنية
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-white">
                منصة إطلاق المشاريع التقنية
              </h1>
              <p className="mt-2 text-sm sm:text-base text-gray-300 max-w-2xl">
                المكان الأفضل للمطورين ورواد الأعمال لعرض منتجاتهم، واكتساب أول 1,000 مستخدم، والتنافس على المركز الأول يومياً، والعثور على شركاء تقنيين واستثماريين.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPartnerModalOpen(true)}
                className="px-4 py-3 rounded-xl bg-charcoal border border-gold-500/30 text-gold-300 hover:bg-gold-500/15 font-bold text-xs flex items-center gap-2"
              >
                <Handshake className="w-4 h-4 text-gold-400" />
                <span>ابحث عن شريك</span>
              </button>
              <button
                onClick={() => setIsLaunchModalOpen(true)}
                className="px-5 py-3 rounded-xl gold-btn-primary font-bold text-sm flex items-center gap-2 shadow-gold-sm"
              >
                <Rocket className="w-4 h-4" />
                <span>أطلق مشروعك التقني اليوم</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mt-8 flex items-center gap-4 border-b border-charcoal-light pb-1">
            <button
              onClick={() => setActiveTab('launches')}
              className={`pb-3 text-sm font-bold flex items-center gap-2 transition-all relative ${
                activeTab === 'launches'
                  ? 'text-gold-300 border-b-2 border-gold-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Flame className="w-4 h-4 text-gold-400" />
              <span>إطلاقات اليوم والأسبوع ({launches.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('partners')}
              className={`pb-3 text-sm font-bold flex items-center gap-2 transition-all relative ${
                activeTab === 'partners'
                  ? 'text-gold-300 border-b-2 border-gold-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4 text-gold-400" />
              <span>سوق الشركاء والمؤسسين التقنيين ({partnerPosts.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {activeTab === 'launches' ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-gold-400" />
                <h2 className="text-xl font-black text-white">ترتيب أفضل المنتجات اليوم</h2>
              </div>
              <span className="text-xs text-gray-400">التصويت متاح للجميع مباشرة</span>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-28 rounded-2xl bg-charcoal border border-gold-500/10 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {launches.map((item, index) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSelectedLaunch(item);
                      setWaitlistJoined(false);
                    }}
                    className="p-5 rounded-2xl bg-charcoal border border-gold-500/20 hover:border-gold-500/50 transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
                  >
                    <div className="flex items-start sm:items-center gap-4 flex-1">
                      {/* Rank badge */}
                      <div className="text-center w-8">
                        <span className={`text-sm font-black font-mono ${
                          index === 0 ? 'text-gold-400 text-lg' : 'text-gray-400'
                        }`}>
                          #{index + 1}
                        </span>
                      </div>

                      {/* Logo */}
                      <img
                        src={item.logo}
                        alt={item.name}
                        className="w-14 h-14 rounded-xl border border-gold-500/30 object-cover flex-shrink-0"
                      />

                      {/* Details */}
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-base text-white group-hover:text-gold-300 transition-colors">
                            {item.name}
                          </h3>
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-ebony border border-gold-500/20 text-gold-300">
                            {item.category}
                          </span>
                          {item.seekingPartners && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/20 border border-amber-500/30 text-amber-300">
                              يبحث عن شريك
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-gray-300 mt-1 line-clamp-1 leading-relaxed">
                          {item.tagline}
                        </p>

                        <div className="flex items-center gap-4 mt-2 text-[11px] text-gray-400">
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5 text-gold-400" />
                            <span>{item.earlyAdoptersCount} مستخدم أولي</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="w-3.5 h-3.5 text-gray-400" />
                            <span>{item.commentsCount} تعليق</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Upvote Button */}
                    <button
                      onClick={(e) => handleUpvote(item.id, e)}
                      className={`px-5 py-3 rounded-xl border flex flex-col items-center justify-center min-w-[70px] transition-all self-end sm:self-auto ${
                        item.hasUpvoted
                          ? 'bg-gold-500 text-obsidian border-gold-500 font-bold shadow-gold-sm'
                          : 'bg-ebony border-gold-500/30 text-gold-300 hover:border-gold-500 hover:bg-gold-500/10'
                      }`}
                    >
                      <ArrowUp className="w-4 h-4 mb-0.5" />
                      <span className="text-xs font-black">{item.upvotes}</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Partners Board */
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-black text-white">سوق المؤسسين والشركاء التقنيين</h2>
                <p className="text-xs text-gray-400 mt-1">
                  تواصل مباشرة مع مؤسسين يبحثون عن شريك تقني (CTO) أو مسوق نمو أو مصمم واجهات بحصص وأسهم.
                </p>
              </div>
              <button
                onClick={() => setIsPartnerModalOpen(true)}
                className="px-4 py-2.5 rounded-xl gold-btn-primary font-bold text-xs flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>أضف طلب شريك لمشروعك</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {partnerPosts.map((post) => (
                <div
                  key={post.id}
                  className="rounded-2xl bg-charcoal border border-gold-500/20 p-6 gold-glass-hover flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3 text-xs">
                      <span className="text-gold-400 font-bold">{post.stage}</span>
                      <span className="text-gray-500">{post.date}</span>
                    </div>

                    <h3 className="font-bold text-base text-white">{post.projectTitle}</h3>
                    <div className="mt-2 p-2.5 rounded-lg bg-ebony border border-gold-500/20 text-xs">
                      <span className="text-gray-400 block text-[10px]">الدور المطلوب:</span>
                      <span className="font-bold text-gold-300">{post.roleNeeded}</span>
                      <span className="text-gray-400 block text-[10px] mt-1.5">المقابل / الأسهم:</span>
                      <span className="font-bold text-white">{post.equityOffered}</span>
                    </div>

                    <p className="text-xs text-gray-300 mt-3 leading-relaxed line-clamp-3">
                      {post.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-charcoal-light flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={post.founderAvatar}
                        alt={post.founderName}
                        className="w-7 h-7 rounded-full border border-gold-500/30 object-cover"
                      />
                      <span className="text-xs text-gray-300 font-medium">{post.founderName}</span>
                    </div>

                    <a
                      href={`mailto:${post.contactEmail}`}
                      className="px-3 py-1.5 rounded-lg bg-gold-500/15 text-gold-300 hover:bg-gold-500 hover:text-obsidian text-xs font-bold transition-colors flex items-center gap-1"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>تواصل الآن</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Project Detail Modal */}
      {selectedLaunch && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-3xl rounded-3xl bg-ebony border border-gold-500/30 text-white shadow-gold-lg overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Cover image */}
            <div className="relative h-60 bg-charcoal">
              <img
                src={selectedLaunch.coverImage}
                alt={selectedLaunch.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ebony via-ebony/30 to-transparent" />
              <button
                onClick={() => setSelectedLaunch(null)}
                className="absolute top-4 left-4 p-2 rounded-full bg-black/60 text-gray-300 hover:text-white border border-gold-500/30"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 right-6 flex items-center gap-4">
                <img
                  src={selectedLaunch.logo}
                  alt={selectedLaunch.name}
                  className="w-16 h-16 rounded-2xl border-2 border-gold-500 object-cover shadow-gold-sm"
                />
                <div>
                  <h2 className="text-2xl font-black text-white">{selectedLaunch.name}</h2>
                  <p className="text-xs text-gold-300">{selectedLaunch.tagline}</p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6">
              <p className="text-sm text-gray-300 leading-relaxed">
                {selectedLaunch.description}
              </p>

              {/* Early Adopters Waitlist Box */}
              <div className="p-5 rounded-2xl bg-charcoal border border-gold-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-gold-400" />
                    <h4 className="text-sm font-bold text-white">انضم لقائمة المستخدمين الأوائل واحصل على مزايا حصرية</h4>
                  </div>
                  <span className="text-xs text-gold-400 font-bold">
                    {selectedLaunch.earlyAdoptersCount} مسجل
                  </span>
                </div>

                {waitlistJoined ? (
                  <div className="p-3 rounded-xl bg-gold-500/20 border border-gold-500 text-xs text-gold-300 font-bold flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>تم تسجيل بريدك في قائمة الوصول المبكر! سنتواصل معك قريباً.</span>
                  </div>
                ) : (
                  <form onSubmit={handleJoinWaitlist} className="flex gap-2">
                    <input
                      type="email"
                      placeholder="أدخل بريدك الإلكتروني للحصول على اشتراك تجريبي..."
                      value={waitlistEmail}
                      onChange={(e) => setWaitlistEmail(e.target.value)}
                      required
                      className="flex-1 bg-ebony border border-gold-500/20 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-gold-500"
                    />
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl gold-btn-primary font-bold text-xs"
                    >
                      انضمام
                    </button>
                  </form>
                )}
              </div>

              {/* Makers Section */}
              <div>
                <h4 className="text-xs font-bold text-gray-400 mb-2">فريق العمل والمؤسسون:</h4>
                <div className="flex flex-wrap gap-3">
                  {selectedLaunch.makers.map((m, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 rounded-xl bg-charcoal border border-charcoal-light">
                      <img src={m.avatar} alt={m.name} className="w-8 h-8 rounded-full border border-gold-500/30 object-cover" />
                      <div>
                        <div className="text-xs font-bold text-white">{m.name}</div>
                        <div className="text-[10px] text-gray-400">{m.role}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-4 border-t border-charcoal-light flex items-center justify-between gap-3">
                <a
                  href={selectedLaunch.demoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-3 rounded-xl bg-charcoal-light border border-gold-500/30 text-xs font-bold text-gold-300 hover:text-white flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>زيارة الموقع التجريبي للمنتج</span>
                </a>

                <button
                  onClick={(e) => handleUpvote(selectedLaunch.id, e)}
                  className="px-6 py-3 rounded-xl gold-btn-primary font-bold text-xs flex items-center gap-2"
                >
                  <ArrowUp className="w-4 h-4" />
                  <span>تصويت للمشروع ({selectedLaunch.upvotes})</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Launch New Product Modal */}
      {isLaunchModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-xl rounded-3xl bg-ebony border border-gold-500/30 text-white shadow-gold-lg p-6 sm:p-8 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-gold-500/20">
              <div className="flex items-center gap-2">
                <Rocket className="w-5 h-5 text-gold-400" />
                <h3 className="text-lg font-bold text-white">إطلاق مشروع تقني جديد على هِرْكِليز</h3>
              </div>
              <button
                onClick={() => setIsLaunchModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLaunch} className="mt-6 space-y-4 text-xs">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">اسم المشروع أو التطبيق *</label>
                <input
                  type="text"
                  placeholder="مثال: ذكي AI - مساعد خدمة العملاء"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  required
                  className="w-full bg-charcoal border border-gold-500/20 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-gold-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">الشعار القصير (Tagline) *</label>
                <input
                  type="text"
                  placeholder="مثال: أتمتة الردود على العملاء عبر واتساب وإنستغرام بنقرة واحدة"
                  value={projectTagline}
                  onChange={(e) => setProjectTagline(e.target.value)}
                  required
                  className="w-full bg-charcoal border border-gold-500/20 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-gold-500 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">التصنيف *</label>
                  <select
                    value={projectCategory}
                    onChange={(e) => setProjectCategory(e.target.value)}
                    className="w-full bg-charcoal border border-gold-500/20 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-gold-500 text-xs"
                  >
                    <option value="SaaS">SaaS (برمجيات سحابية)</option>
                    <option value="AI Tool">أداة ذكاء اصطناعي</option>
                    <option value="Mobile App">تطبيق جوال</option>
                    <option value="Fintech">تقنية مالية (Fintech)</option>
                    <option value="E-Commerce">تجارة إلكترونية</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">رابط الموقع أو الـ MVP</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={projectDemoUrl}
                    onChange={(e) => setProjectDemoUrl(e.target.value)}
                    className="w-full bg-charcoal border border-gold-500/20 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-gold-500 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">عن المشروع والمشكلة التي يحلها</label>
                <textarea
                  rows={3}
                  value={projectDesc}
                  onChange={(e) => setProjectDesc(e.target.value)}
                  placeholder="اشرح لرواد الأعمال والمستخدمين ماذا يقدم مشروعك..."
                  className="w-full bg-charcoal border border-gold-500/20 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gold-500 text-xs"
                />
              </div>

              <div className="p-3 rounded-xl bg-charcoal border border-charcoal-light flex items-center justify-between">
                <div>
                  <span className="font-semibold text-white block">هل تبحث عن شركاء تقنيين أو استثماريين؟</span>
                  <span className="text-[11px] text-gray-400">سيتم إضافة شارة "يبحث عن شريك" للمشروع</span>
                </div>
                <input
                  type="checkbox"
                  checked={projectSeekingPartners}
                  onChange={(e) => setProjectSeekingPartners(e.target.checked)}
                  className="w-4 h-4 accent-gold-500"
                />
              </div>

              <div className="pt-3 border-t border-charcoal-light flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsLaunchModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-gray-400 hover:text-white"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingLaunch}
                  className="px-6 py-2.5 rounded-xl gold-btn-primary font-bold text-xs"
                >
                  {isSubmittingLaunch ? 'جاري الإطلاق...' : 'إطلاق المشروع وبدء جمع الأصوات 🚀'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Post Partner Request Modal */}
      {isPartnerModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-xl rounded-3xl bg-ebony border border-gold-500/30 text-white shadow-gold-lg p-6 sm:p-8 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-gold-500/20">
              <div className="flex items-center gap-2">
                <Handshake className="w-5 h-5 text-gold-400" />
                <h3 className="text-lg font-bold text-white">إضافة إعلان بحث عن شريك تقني أو تسويقي</h3>
              </div>
              <button
                onClick={() => setIsPartnerModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePartnerPost} className="mt-6 space-y-4 text-xs">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">اسم وفكرة المشروع *</label>
                <input
                  type="text"
                  placeholder="مثال: منصة أتمتة العقود الذكية"
                  value={partnerProjectTitle}
                  onChange={(e) => setPartnerProjectTitle(e.target.value)}
                  required
                  className="w-full bg-charcoal border border-gold-500/20 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-gold-500 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">الدور المطلوب *</label>
                  <input
                    type="text"
                    value={partnerRoleNeeded}
                    onChange={(e) => setPartnerRoleNeeded(e.target.value)}
                    placeholder="مثال: شريك تقني (CTO)"
                    className="w-full bg-charcoal border border-gold-500/20 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-gold-500 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">الأسهم / المقابل المعروض</label>
                  <input
                    type="text"
                    value={partnerEquity}
                    onChange={(e) => setPartnerEquity(e.target.value)}
                    placeholder="مثال: 20% أسهم أو راتب + نسبة"
                    className="w-full bg-charcoal border border-gold-500/20 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-gold-500 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">مرحلة المشروع الحالية</label>
                <input
                  type="text"
                  value={partnerStage}
                  onChange={(e) => setPartnerStage(e.target.value)}
                  placeholder="مثال: MVP جاهز مع عملاء أو مرحلة التأسيس"
                  className="w-full bg-charcoal border border-gold-500/20 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-gold-500 text-xs"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">البريد الإلكتروني للتواصل المباشر *</label>
                <input
                  type="email"
                  value={partnerEmail}
                  onChange={(e) => setPartnerEmail(e.target.value)}
                  placeholder="founder@startup.com"
                  className="w-full bg-charcoal border border-gold-500/20 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-gold-500 text-xs"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">تفاصيل ومواصفات الشريك المطلوب</label>
                <textarea
                  rows={3}
                  value={partnerDesc}
                  onChange={(e) => setPartnerDesc(e.target.value)}
                  placeholder="اشرح الخبرات المطلوبة، التفرغ المتوقع، وتطلعات الفريق..."
                  className="w-full bg-charcoal border border-gold-500/20 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gold-500 text-xs"
                />
              </div>

              <div className="pt-3 border-t border-charcoal-light flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsPartnerModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-gray-400 hover:text-white"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingPartner}
                  className="px-6 py-2.5 rounded-xl gold-btn-primary font-bold text-xs"
                >
                  {isSubmittingPartner ? 'جاري النشر...' : 'نشر طلب الشراكة'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}



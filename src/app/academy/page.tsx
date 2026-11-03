'use client';

import React, { useState, useEffect } from 'react';
import { Course, LearningTrack, Certificate, QuizQuestion } from '@/types';
import { useAuth } from '@/context/AuthContext';
import {
  BookOpen,
  Award,
  CheckCircle,
  PlayCircle,
  Clock,
  Sparkles,
  Crown,
  FileQuestion,
  UserCheck,
  ChevronDown,
  X,
  Printer,
  Download,
  Share2,
  ShieldCheck,
  Plus,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AcademyPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [tracks, setTracks] = useState<LearningTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Active viewing course
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);

  // Quiz state
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Certificate state
  const { user } = useAuth();
  const [generatedCertificate, setGeneratedCertificate] = useState<Certificate | null>(null);
  const [studentNameInput, setStudentNameInput] = useState(user?.name || 'محمود عبد السلام');

  useEffect(() => {
    if (user?.name) {
      setStudentNameInput(user.name);
    }
  }, [user]);

  // Instructor Publish modal
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseDesc, setNewCourseDesc] = useState('');
  const [newCoursePrice, setNewCoursePrice] = useState(49);
  const [newCourseDuration, setNewCourseDuration] = useState('14 ساعة تدريبية');
  const [isPublishing, setIsPublishing] = useState(false);

  const fetchAcademyData = async () => {
    setLoading(true);
    try {
      let url = `/api/academy?`;
      if (selectedCategory !== 'all') url += `category=${selectedCategory}&`;
      if (selectedLevel !== 'all') url += `level=${selectedLevel}&`;

      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setCourses(data.courses);
        setTracks(data.tracks);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAcademyData();
  }, [selectedCategory, selectedLevel]);

  // Handle lesson completion
  const toggleLessonComplete = (lessonId: string) => {
    setCompletedLessons((prev) =>
      prev.includes(lessonId) ? prev.filter((id) => id !== lessonId) : [...prev, lessonId]
    );
  };

  // Submit Quiz & Issue Certificate
  const handleQuizSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCourse?.quiz) return;

    const questions = activeCourse.quiz.questions;
    let correctCount = 0;

    questions.forEach((q) => {
      if (quizAnswers[q.id] === q.correctAnswer) {
        correctCount += 1;
      }
    });

    const scorePct = Math.round((correctCount / questions.length) * 100);
    setQuizScore(scorePct);
    setQuizSubmitted(true);

    if (scorePct >= (activeCourse.quiz.passingScore || 60)) {
      // Confetti celebration
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#A855F7', '#C084FC', '#D946EF', '#FFFFFF'],
      });

      // Issue certificate in DB
      try {
        const res = await fetch('/api/academy/certificate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            studentName: studentNameInput || 'طالب أكاديمية هركليز',
            courseTitle: activeCourse.title,
            instructorName: activeCourse.instructor.name,
            score: scorePct,
          }),
        });
        const data = await res.json();
        if (data.success) {
          setGeneratedCertificate(data.certificate);
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Publish course handler
  const handlePublishCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseTitle.trim()) return alert('يرجى كتابة عنوان الكورس');

    setIsPublishing(true);
    try {
      const res = await fetch('/api/academy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newCourseTitle,
          description: newCourseDesc || 'كورس احترافي مقدم من أحد خبراء هِرْكِليز.',
          instructor: {
            name: 'م. أحمد الخبير (أنت)',
            title: 'مدرب ومحاضر معتمد',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
            rating: 5.0,
          },
          category: 'ai',
          categoryName: 'تقنيات وذكاء اصطناعي',
          level: 'شامل',
          duration: newCourseDuration,
          lessonsCount: 18,
          price: Number(newCoursePrice),
          thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
          isCertificateIncluded: true,
          modules: [
            {
              title: 'الوحدة الأولى: البداية والتأسيس العملي',
              lessons: [
                { id: `l-${Date.now()}-1`, title: 'المقدمة وخارطة الطريق الكاملة', duration: '15 دقيقة', isFreePreview: true },
                { id: `l-${Date.now()}-2`, title: 'تجهيز بيئة العمل والأدوات', duration: '25 دقيقة', isFreePreview: false },
              ],
            },
          ],
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert('تم نشر الكورس في أكاديمية هركليز بنجاح!');
        setIsPublishModalOpen(false);
        setNewCourseTitle('');
        setNewCourseDesc('');
        fetchAcademyData();
      } else {
        alert(data.error || 'فشل نشر الكورس');
      }
    } catch (err) {
      alert('حدث خطأ أثناء النشر');
    } finally {
      setIsPublishing(false);
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
                <BookOpen className="w-3.5 h-3.5 text-gold-400" />
                الأكاديمية والشهادات المهنية المعتمدة
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-white">
                أكاديمية هِرْكِليز الاحترافية
              </h1>
              <p className="mt-2 text-sm sm:text-base text-gray-300 max-w-2xl">
                مسارات تعليمية متكاملة في هندسة الذكاء الاصطناعي والموشن جرافيكس وتطوير الويب، مدعومة باختبارات عملية وشهادات إتمام موثقة عالمياً.
              </p>
            </div>

            <button
              onClick={() => setIsPublishModalOpen(true)}
              className="px-5 py-3 rounded-xl gold-btn-primary font-bold text-sm flex items-center gap-2 shadow-gold-sm"
            >
              <Plus className="w-4 h-4" />
              <span>انضم كمدرب وانشر كورسك</span>
            </button>
          </div>
        </div>
      </div>

      {/* Learning Tracks Showcase (مسارات تعليمية كاملة) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="flex items-center gap-2 mb-6">
          <Award className="w-5 h-5 text-gold-400" />
          <h2 className="text-2xl font-black text-white">مسارات التخصص الوظيفي الشاملة</h2>
          <span className="text-xs text-gold-300 px-2.5 py-0.5 rounded-full bg-gold-500/10 border border-gold-500/30">
            خارطة طريق كاملة من الصفر للاحتراف
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tracks.map((track) => (
            <div
              key={track.id}
              className="rounded-2xl tech-card corner-bracket p-6 flex flex-col justify-between relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gold-500/5 blur-xl pointer-events-none" />
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-300 text-xs font-bold">
                    {track.badge}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock className="w-3.5 h-3.5 text-gold-400" />
                    <span>{track.totalDuration}</span>
                  </div>
                </div>

                <h3 className="text-lg font-black text-white leading-snug">{track.title}</h3>
                <p className="mt-2 text-xs text-gray-300 leading-relaxed">{track.description}</p>

                <div className="mt-4 pt-4 border-t border-charcoal-light space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-gray-400">
                    <span>المسمى الوظيفي المستهدف:</span>
                    <span className="text-gold-300 font-semibold">{track.careerOutcome}</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-400">
                    <span>مستوى المسار:</span>
                    <span className="text-white">{track.level}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => {
                    const firstCourse = courses.find((c) => track.courses.includes(c.id)) || courses[0];
                    if (firstCourse) setActiveCourse(firstCourse);
                  }}
                  className="w-full py-2.5 rounded-xl bg-charcoal-light border border-gold-500/30 text-gold-300 hover:bg-gold-500/20 font-bold text-xs flex items-center justify-center gap-2 transition-all"
                >
                  <PlayCircle className="w-4 h-4 text-gold-400" />
                  <span>بدء دراسة هذا المسار</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Courses Catalog */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-black text-white">دليل الكورسات والدبلومات</h2>
            <p className="text-xs text-gray-400 mt-1">اختر من بين الكورسات المدفوعة والمجانية المتاحة حالياً</p>
          </div>

          {/* Level Filter Tabs */}
          <div className="flex items-center gap-2">
            {['all', 'مبتدئ', 'متوسط', 'شامل'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedLevel === lvl
                    ? 'bg-gold-500 text-obsidian font-bold shadow-gold-sm'
                    : 'bg-charcoal border border-gold-500/20 text-gray-300 hover:text-white'
                }`}
              >
                {lvl === 'all' ? 'جميع المستويات' : lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="rounded-2xl tech-card corner-bracket overflow-hidden flex flex-col justify-between"
            >
              <div className="relative h-44 w-full bg-ebony overflow-hidden">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-obsidian/80 backdrop-blur-md border border-gold-500/30 text-[11px] font-semibold text-gold-300">
                  {course.categoryName}
                </span>
                <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm text-[11px] text-gray-300">
                  {course.duration}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3
                    onClick={() => setActiveCourse(course)}
                    className="text-base font-bold text-white hover:text-gold-300 cursor-pointer transition-colors line-clamp-2"
                  >
                    {course.title}
                  </h3>
                  <p className="mt-1.5 text-xs text-gray-400 line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>

                  <div className="mt-4 flex items-center gap-2">
                    <img
                      src={course.instructor.avatar}
                      alt={course.instructor.name}
                      className="w-7 h-7 rounded-full border border-gold-500/30 object-cover"
                    />
                    <div>
                      <div className="text-xs font-semibold text-white">{course.instructor.name}</div>
                      <div className="text-[10px] text-gray-400">{course.instructor.title}</div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-charcoal-light flex items-center justify-between">
                  <div className="text-base font-black text-gold-bright">
                    {course.price === 0 ? 'مجاني بالكامل' : `$${course.price} USD`}
                  </div>

                  <button
                    onClick={() => setActiveCourse(course)}
                    className="py-2 px-4 rounded-xl gold-btn-primary font-bold text-xs flex items-center gap-1.5"
                  >
                    <PlayCircle className="w-3.5 h-3.5" />
                    <span>دخول الكورس والدروس</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Course Player & Modules Modal */}
      {activeCourse && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl rounded-3xl bg-ebony border border-gold-500/30 text-white shadow-gold-lg overflow-hidden animate-in fade-in duration-200">
            {/* Header */}
            <div className="p-5 border-b border-gold-500/20 bg-charcoal flex items-center justify-between">
              <div>
                <span className="text-xs text-gold-400 font-semibold">{activeCourse.categoryName}</span>
                <h3 className="text-lg font-bold text-white mt-0.5">{activeCourse.title}</h3>
              </div>
              <button
                onClick={() => setActiveCourse(null)}
                className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-charcoal-light"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player Placeholder */}
            <div className="aspect-video w-full bg-black relative flex items-center justify-center border-b border-charcoal-light">
              <div className="text-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-full bg-gold-500/20 border-2 border-gold-500 flex items-center justify-center mx-auto text-gold-400 shadow-gold-sm">
                  <PlayCircle className="w-8 h-8" />
                </div>
                <h4 className="text-sm font-bold text-white">
                  المشغل التعليمي التفاعلي – الدرس المختار
                </h4>
                <p className="text-xs text-gray-400 max-w-md mx-auto">
                  دروس عالية الجودة مع إمكانية التمرير، تسريع المشاهدة، وتطبيق المشاريع البرمجية المصاحبة.
                </p>
              </div>
            </div>

            {/* Modules & Lessons List */}
            <div className="p-6 max-h-80 overflow-y-auto space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-gold-300">محتويات ومنهج الكورس:</h4>
                <span className="text-xs text-gray-400">
                  {completedLessons.length} دروس مكتملة
                </span>
              </div>

              {activeCourse.modules.map((mod, modIdx) => (
                <div key={modIdx} className="rounded-xl bg-charcoal border border-charcoal-light p-4 space-y-2">
                  <h5 className="text-xs font-bold text-gold-400">{mod.title}</h5>
                  <div className="space-y-1.5 pt-1">
                    {mod.lessons.map((lesson) => {
                      const isDone = completedLessons.includes(lesson.id);
                      return (
                        <div
                          key={lesson.id}
                          className="flex items-center justify-between p-2.5 rounded-lg bg-charcoal-light hover:bg-gold-500/10 text-xs transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => toggleLessonComplete(lesson.id)}
                              className={`w-4 h-4 rounded border flex items-center justify-center ${
                                isDone
                                  ? 'bg-gold-500 border-gold-500 text-obsidian'
                                  : 'border-gray-500 text-transparent'
                              }`}
                            >
                              ✓
                            </button>
                            <span className={isDone ? 'line-through text-gray-400' : 'text-gray-200'}>
                              {lesson.title}
                            </span>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="text-[11px] text-gray-400">{lesson.duration}</span>
                            {lesson.isFreePreview && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-500/20 text-green-300 border border-green-500/30">
                                معاينة مجانية
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Actions: Take Quiz & Certificate */}
            <div className="p-5 border-t border-gold-500/20 bg-charcoal flex flex-wrap items-center justify-between gap-4">
              <div className="text-xs text-gray-400">
                أكمل الدروس وتجاوز الاختبار للحصول على <span className="text-gold-300 font-bold">شهادة هِرْكِليز الموثقة</span>
              </div>

              <div className="flex items-center gap-3">
                {activeCourse.quiz && (
                  <button
                    onClick={() => {
                      setIsQuizOpen(true);
                      setQuizSubmitted(false);
                      setQuizScore(null);
                    }}
                    className="py-2.5 px-5 rounded-xl gold-btn-primary font-bold text-xs flex items-center gap-2"
                  >
                    <FileQuestion className="w-4 h-4" />
                    <span>بدء الاختبار التطبيقي للحصول على الشهادة</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quiz Modal */}
      {isQuizOpen && activeCourse?.quiz && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl rounded-3xl bg-ebony border border-gold-500/30 text-white shadow-gold-lg p-6 sm:p-8 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-gold-500/20">
              <div>
                <span className="text-xs text-gold-400 font-semibold">الاختبار النهائي للكورس</span>
                <h3 className="text-lg font-bold text-white mt-0.5">{activeCourse.quiz.title}</h3>
              </div>
              <button
                onClick={() => setIsQuizOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleQuizSubmit} className="mt-6 space-y-6">
              {/* Student Name */}
              <div className="p-4 rounded-xl bg-charcoal border border-gold-500/20">
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  اسمك الكامل كما تريده أن يظهر على الشهادة المعتمدة:
                </label>
                <input
                  type="text"
                  value={studentNameInput}
                  onChange={(e) => setStudentNameInput(e.target.value)}
                  required
                  placeholder="مثال: محمود عبد السلام"
                  className="w-full bg-ebony border border-gold-500/30 rounded-lg px-3 py-2 text-sm text-gold-300 font-bold focus:outline-none focus:border-gold-500"
                />
              </div>

              {/* Questions */}
              {activeCourse.quiz.questions.map((q, idx) => (
                <div key={q.id} className="p-4 rounded-xl bg-charcoal border border-charcoal-light space-y-3">
                  <div className="font-bold text-sm text-white">
                    <span className="text-gold-400 font-mono ml-1.5">{idx + 1}.</span>
                    {q.question}
                  </div>

                  <div className="space-y-2 pt-1 text-xs">
                    {q.options.map((opt, optIdx) => (
                      <label
                        key={optIdx}
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                          quizAnswers[q.id] === optIdx
                            ? 'bg-gold-500/15 border-gold-500/50 text-gold-300 font-semibold'
                            : 'bg-ebony border-charcoal-light hover:border-gold-500/20 text-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name={q.id}
                          checked={quizAnswers[q.id] === optIdx}
                          onChange={() => setQuizAnswers({ ...quizAnswers, [q.id]: optIdx })}
                          className="accent-gold-500"
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>

                  {quizSubmitted && (
                    <div className="text-[11px] p-2.5 rounded bg-charcoal-light text-gold-300 mt-2">
                      💡 {q.explanation}
                    </div>
                  )}
                </div>
              ))}

              {quizScore !== null && (
                <div className={`p-4 rounded-xl text-center border font-bold text-sm ${
                  quizScore >= (activeCourse.quiz.passingScore || 60)
                    ? 'bg-gold-500/20 border-gold-500 text-gold-300'
                    : 'bg-red-500/20 border-red-500 text-red-300'
                }`}>
                  درجتك في الاختبار: {quizScore}% {quizScore >= 60 ? '🎉 تهانينا! اجتزت الاختبار بنجاح وتم إصدار شهادتك!' : '❌ لم تتجاوز درجة النجاح، يمكنك المحاولة مجدداً.'}
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-charcoal-light">
                <button
                  type="button"
                  onClick={() => setIsQuizOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-gray-400 hover:text-white"
                >
                  إغلاق
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl gold-btn-primary font-bold text-xs"
                >
                  تسليم الإجابات واعتماد النتيجة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Certificate Viewer Modal */}
      {generatedCertificate && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-3xl rounded-3xl bg-ebony border-2 border-gold-500 p-8 text-white shadow-gold-lg animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setGeneratedCertificate(null)}
              className="absolute top-4 left-4 p-2 rounded-full bg-black/60 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Printable Certificate Frame */}
            <div className="border-4 border-gold-500/40 p-8 rounded-2xl bg-gradient-to-b from-charcoal to-obsidian relative overflow-hidden text-center space-y-6">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/10 blur-2xl" />
              <div className="w-14 h-14 mx-auto rounded-full bg-gold-500/20 border-2 border-gold-500 flex items-center justify-center text-gold-400 shadow-gold-sm">
                <Crown className="w-7 h-7" />
              </div>

              <div>
                <span className="text-xs uppercase tracking-widest text-gold-400 font-bold block">
                  HERCULES ACADEMY OF TECHNOLOGY
                </span>
                <h2 className="text-3xl font-black text-gold-bright mt-1">
                  شهادة إتمام معتمدة
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  تُمنح هذه الشهادة الرسمية تقديراً لاجتياز المتطلبات الأكاديمية والمشاريع بنجاح
                </p>
              </div>

              <div className="py-2">
                <span className="text-xs text-gray-400">تُمنح للطالب المتميز:</span>
                <div className="text-2xl font-black text-white underline decoration-gold-500 underline-offset-8 mt-1">
                  {generatedCertificate.studentName}
                </div>
              </div>

              <div className="max-w-md mx-auto text-xs text-gray-300 leading-relaxed">
                لاشتراكه وإتمامه مساق:{' '}
                <span className="text-gold-300 font-bold block text-sm mt-0.5">
                  {generatedCertificate.courseTitle}
                </span>
                بتقدير: <span className="font-bold text-gold-400">{generatedCertificate.grade}</span> ({generatedCertificate.score}%)
              </div>

              {/* Certificate Signatures & Code */}
              <div className="pt-6 border-t border-gold-500/20 grid grid-cols-3 items-center text-xs text-gray-400">
                <div className="text-right">
                  <span className="block text-[10px] text-gray-500">تاريخ الإصدار:</span>
                  <span className="font-mono text-white">{generatedCertificate.issueDate}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-gray-500">الرقم المرجعي الموثق:</span>
                  <span className="font-mono text-gold-400 font-bold">{generatedCertificate.certificateCode}</span>
                </div>
                <div className="text-left">
                  <span className="block text-[10px] text-gray-500">المدرب المعتمد:</span>
                  <span className="font-bold text-white">{generatedCertificate.instructorName}</span>
                </div>
              </div>
            </div>

            {/* Print/Download button */}
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                onClick={() => window.print()}
                className="px-6 py-2.5 rounded-xl gold-btn-primary font-bold text-xs flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>طباعة وتحميل الشهادة PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Instructor Publish Course Modal */}
      {isPublishModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-xl rounded-3xl bg-ebony border border-gold-500/30 text-white shadow-gold-lg p-6 sm:p-8 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-gold-500/20">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-gold-400" />
                <h3 className="text-lg font-bold text-white">نشر كورس تدريبي جديد في الأكاديمية</h3>
              </div>
              <button
                onClick={() => setIsPublishModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePublishCourse} className="mt-6 space-y-4 text-xs">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">عنوان الكورس أو الدبلومة *</label>
                <input
                  type="text"
                  placeholder="مثال: هندسة واجهات المستخدم المتقدمة بـ Next.js 14"
                  value={newCourseTitle}
                  onChange={(e) => setNewCourseTitle(e.target.value)}
                  required
                  className="w-full bg-charcoal border border-gold-500/20 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-gold-500 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">السعر ($) (0 للمجاني)</label>
                  <input
                    type="number"
                    min="0"
                    value={newCoursePrice}
                    onChange={(e) => setNewCoursePrice(Number(e.target.value))}
                    className="w-full bg-charcoal border border-gold-500/20 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-gold-500 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">إجمالي ساعات التدريب</label>
                  <input
                    type="text"
                    value={newCourseDuration}
                    onChange={(e) => setNewCourseDuration(e.target.value)}
                    placeholder="مثال: 16 ساعة"
                    className="w-full bg-charcoal border border-gold-500/20 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-gold-500 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">وصف الكورس والأهداف التعليمية</label>
                <textarea
                  rows={3}
                  value={newCourseDesc}
                  onChange={(e) => setNewCourseDesc(e.target.value)}
                  placeholder="اشرح ماذا سيتعلم الطالب، المتطلبات، والمشاريع..."
                  className="w-full bg-charcoal border border-gold-500/20 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gold-500 text-xs"
                />
              </div>

              <div className="pt-3 border-t border-charcoal-light flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsPublishModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-gray-400 hover:text-white"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isPublishing}
                  className="px-6 py-2.5 rounded-xl gold-btn-primary font-bold text-xs"
                >
                  {isPublishing ? 'جاري الاعتماد والنشر...' : 'نشر الكورس وتفعيل التسجيل'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

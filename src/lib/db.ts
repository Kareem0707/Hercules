import fs from 'fs';
import path from 'path';
import {
  MarketProduct,
  Course,
  LearningTrack,
  Certificate,
  AITool,
  LaunchpadProduct,
  PartnerPost,
  User,
} from '@/types';

export interface DatabaseSchema {
  products: MarketProduct[];
  courses: Course[];
  learningTracks: LearningTrack[];
  certificates: Certificate[];
  aiTools: AITool[];
  launches: LaunchpadProduct[];
  partnerPosts: PartnerPost[];
  users: User[];
  orders: {
    id: string;
    productId: string;
    productTitle: string;
    amount: number;
    buyerName: string;
    buyerEmail: string;
    date: string;
    downloadToken: string;
  }[];
  waitlistEntries: {
    id: string;
    launchId: string;
    email: string;
    date: string;
  }[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'hercules.json');

// Ensure data folder exists
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Initial Seed Data
const initialData: DatabaseSchema = {
  products: [
    {
      id: 'prod-1',
      title: 'قالب واجهات SaaS فاخر – Hercules Next.js & Tailwind UI',
      titleEn: 'Hercules SaaS Dashboard & Landing UI Kit',
      slug: 'hercules-saas-ui-kit',
      description: 'أقوى قالب عربي وعالمي لبناء منصات البرمجيات ولوحات التحكم الفاخرة باللونين الأسود والذهبي. يحتوي على أكثر من 45 صفحة ومكون جاهز مع دعم RTL كامل وDark Mode ملكي.',
      category: 'templates-ui',
      categoryName: 'قوالب مواقع وواجهات UI',
      price: 49,
      currency: 'USD',
      rating: 4.9,
      reviewsCount: 128,
      salesCount: 412,
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80'
      ],
      fileType: 'Next.js 14 / Tailwind / Figma',
      fileSize: '65 MB',
      downloadUrl: '/downloads/hercules-saas-v2.zip',
      seller: {
        name: 'كريم المنصور',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        verified: true,
        sales: 1250,
      },
      tags: ['Next.js', 'Tailwind', 'SaaS', 'RTL', 'Dashboard'],
      featured: true,
      createdAt: '2026-10-15',
    },
    {
      id: 'prod-2',
      title: 'حزمة المؤثرات السينمائية الذهبية لـ Premiere Pro وAfter Effects',
      titleEn: 'Cinematic Gold Transitions & Presets Pack',
      slug: 'cinematic-gold-transitions',
      description: 'حزمة احترافية تضم 350+ انتقال سينمائي، وتدرجات لونية LUTs سينمائية، ومؤثرات بصرية ذهبية MOGRT قابلة للتعديل بضغطة زر لدعم صناع المحتوى والمونتيرين.',
      category: 'adobe-video-photo',
      categoryName: 'ملفات أدوبي ومونتاج',
      price: 29,
      currency: 'USD',
      rating: 4.8,
      reviewsCount: 94,
      salesCount: 650,
      thumbnail: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80'
      ],
      fileType: 'Premiere Pro / After Effects (.mogrt / .aep)',
      fileSize: '1.4 GB',
      downloadUrl: '/downloads/gold-motion-pack.zip',
      seller: {
        name: 'رامي استوديو',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        verified: true,
        sales: 890,
      },
      tags: ['Premiere', 'After Effects', 'LUTs', 'Transitions', 'Cinematic'],
      featured: true,
      createdAt: '2026-10-20',
    },
    {
      id: 'prod-3',
      title: 'نظام إدارة الشركات والعمل الحر الشامل على Notion (Notion OS)',
      titleEn: 'Ultimate Agency & Freelancer Notion OS',
      slug: 'ultimate-agency-notion-os',
      description: 'نظام تشغيل متكامل على Notion لإدارة المشاريع والعملاء والفواتير والمهام اليومية وتتبع الإيرادات. مصمم خصيصاً للوكالات والمستقلين وأصحاب المشاريع الناشئة.',
      category: 'notion-excel',
      categoryName: 'قوالب Notion وملفات Excel',
      price: 19,
      currency: 'USD',
      rating: 5.0,
      reviewsCount: 210,
      salesCount: 1120,
      thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80'
      ],
      fileType: 'Notion Template Link + PDF Guide',
      fileSize: '12 MB',
      downloadUrl: '/downloads/notion-os-elite.zip',
      seller: {
        name: 'سارة التميمي',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
        verified: true,
        sales: 2400,
      },
      tags: ['Notion', 'Productivity', 'Agency', 'CRM', 'Freelancing'],
      featured: true,
      createdAt: '2026-10-18',
    },
    {
      id: 'prod-4',
      title: 'لوحة التحكم المالية والتحليل الذكي للاستثمارات على Excel',
      titleEn: 'Smart Financial Dashboard & Investment Tracker Excel',
      slug: 'financial-excel-dashboard',
      description: 'ملف إكسيل متقدم جداً مدعوم بماكرو وحسابات تلقائية لإدارة التدفقات النقدية ومتابعة المحافظ الاستثمارية وتحليل الأداء المالي مع رسوم بيانية تفاعلية.',
      category: 'notion-excel',
      categoryName: 'قوالب Notion وملفات Excel',
      price: 0,
      currency: 'USD',
      rating: 4.7,
      reviewsCount: 340,
      salesCount: 3890,
      thumbnail: 'https://images.unsplash.com/photo-1543286386-713bdd548da4?auto=format&fit=crop&w=800&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1543286386-713bdd548da4?auto=format&fit=crop&w=1200&q=80'
      ],
      fileType: 'Microsoft Excel (.xlsx + Macro)',
      fileSize: '8.5 MB',
      downloadUrl: '/downloads/excel-finance-v3.xlsx',
      seller: {
        name: 'أحمد زهران',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
        verified: true,
        sales: 520,
      },
      tags: ['Excel', 'Finance', 'Free', 'Dashboard', 'Investment'],
      featured: false,
      createdAt: '2026-10-12',
    },
    {
      id: 'prod-5',
      title: 'حزمة أيقونات ثلاثية الأبعاد 3D Metallic Gold & Obsidian',
      titleEn: '3D Gold & Obsidian Icons Pack (120+ Icons)',
      slug: '3d-gold-obsidian-icons',
      description: 'أكثر من 120 عنصر وأيقونة ثلاثية الأبعاد بدقة فائقة 4K بخلفيات شفافة PNG وملفات Blender الأصلية، صممت بالذهب الملكي والزجاج الأسود الداكن لتمنح تصاميمك طابع الفخامة المطلقة.',
      category: 'design-resources',
      categoryName: 'ملفات تصميم وموارد جاهزة',
      price: 35,
      currency: 'USD',
      rating: 4.9,
      reviewsCount: 78,
      salesCount: 430,
      thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80'
      ],
      fileType: 'Blender 4.0 / PNG 4K / Figma File',
      fileSize: '850 MB',
      downloadUrl: '/downloads/3d-gold-icons.zip',
      seller: {
        name: 'استوديو مدار',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        verified: true,
        sales: 980,
      },
      tags: ['3D', 'Icons', 'Gold', 'Blender', 'Design'],
      featured: true,
      createdAt: '2026-10-22',
    },
    {
      id: 'prod-6',
      title: 'إضافة ووردبريس لأتمتة السيو والربط الذكي بالذكاء الاصطناعي',
      titleEn: 'Hercules AI SEO Automation Plugin',
      slug: 'hercules-ai-seo-plugin',
      description: 'إضافة ووردبريس فائقة الأداء تقوم بتحليل المحتوى وتوليد الميتا ديسكريبشن وروابط السيو الداخلية وإعادة صياغة المقالات تلقائياً باستخدام نموذج GPT-4o.',
      category: 'tools-plugins',
      categoryName: 'إضافات وبرامج وأدوات',
      price: 59,
      currency: 'USD',
      rating: 4.8,
      reviewsCount: 65,
      salesCount: 290,
      thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80'
      ],
      fileType: 'WordPress Plugin (.zip) + API Key',
      fileSize: '4.2 MB',
      downloadUrl: '/downloads/wp-hercules-seo.zip',
      seller: {
        name: 'م. طارق العريان',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
        verified: true,
        sales: 740,
      },
      tags: ['WordPress', 'SEO', 'AI Plugin', 'Automation'],
      featured: false,
      createdAt: '2026-10-25',
    },
  ],
  courses: [
    {
      id: 'course-1',
      title: 'الدبلومة المتكاملة لهندسة الذكاء الاصطناعي وتطوير وكلاء AI Agents',
      description: 'تعلّم بناء وكلاء ذكاء اصطناعي ذاتية القيادة وتطبيقات LLMs باستخدام Python وLangChain وNext.js وOpenAI APIs مع مشاريع حقيقية متقدمة.',
      instructor: {
        name: 'د. يوسف الحكيم',
        title: 'كبير باحثي الذكاء الاصطناعي ومؤسس تقني',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        rating: 4.95,
      },
      category: 'ai',
      categoryName: 'ذكاء اصطناعي وتطوير',
      level: 'شامل',
      duration: '24 ساعة تدريبية',
      lessonsCount: 38,
      price: 89,
      thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      enrolledCount: 840,
      rating: 4.9,
      isCertificateIncluded: true,
      learningTrackId: 'track-ai',
      modules: [
        {
          title: 'المحور الأول: المفاهيم الأساسية وهندسة التلقين المتقدمة Prompt Engineering',
          lessons: [
            { id: 'c1-l1', title: 'مقدمة في نماذج اللغة الكبيرة LLMs وكيف تفكر', duration: '25 دقيقة', isFreePreview: true, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
            { id: 'c1-l2', title: 'أسرار كتابة الـ Prompts لبرمجة الأنظمة الذكية', duration: '40 دقيقة', isFreePreview: true },
            { id: 'c1-l3', title: 'تقنيات الـ Few-Shot وChain of Thought', duration: '35 دقيقة', isFreePreview: false },
          ],
        },
        {
          title: 'المحور الثاني: بناء وتدريب الـ AI Agents وRAG Systems',
          lessons: [
            { id: 'c1-l4', title: 'مقدمة في LangChain وLangGraph', duration: '45 دقيقة', isFreePreview: false },
            { id: 'c1-l5', title: 'ربط النماذج بقواعد البيانات المتجهة Vector Databases', duration: '50 دقيقة', isFreePreview: false },
            { id: 'c1-l6', title: 'مشروع عملي: بناء وكيل تحليل مالي مستقل يتخذ قرارات استثمارية', duration: '65 دقيقة', isFreePreview: false },
          ],
        },
      ],
      quiz: {
        id: 'quiz-1',
        title: 'اختبار تقييم مهارات هندسة الذكاء الاصطناعي',
        passingScore: 70,
        questions: [
          {
            id: 'q1',
            question: 'ما هي التقنية المستخدمة لتزويد نماذج اللغة بمعلومات خارجية حديثة وخاصة دون إعادة تدريبها؟',
            options: ['Fine-Tuning', 'Retrieval-Augmented Generation (RAG)', 'Quantization', 'Zero-shot Prompting'],
            correctAnswer: 1,
            explanation: 'تقنية RAG تتيح للنموذج استرجاع بيانات دقيقة من قواعد بيانات متجهة وتغذيتها في السياق.',
          },
          {
            id: 'q2',
            question: 'ما هو المفهوم الأساسي للـ AI Agent مقارنة بمجرد روبوت محادثة عادي؟',
            options: [
              'قدرته على حفظ المحادثات الطويلة فقط',
              'القدرة على التخطيط، واستخدام الأدوات (Tools)، وتنفيذ خطوات متتابعة بشكل مستقل',
              'سرعة إرجاع النصوص فقط',
              'استخدام واجهات رسومية ملونة',
            ],
            correctAnswer: 1,
            explanation: 'الوكيل الذكي (Agent) يتميز بالاستقلالية في اتخاذ القرارات واستدعاء الأدوات الخارجية والوصول للأهداف.',
          },
          {
            id: 'q3',
            question: 'أي نوع من قواعد البيانات يُستخدم عادة لحفظ التضمينات الدلالية (Vector Embeddings)؟',
            options: ['Relational SQL', 'Vector Database مثل Pinecone أو Chroma', 'Key-Value Redis فقط', 'CSV Files'],
            correctAnswer: 1,
            explanation: 'قواعد البيانات المتجهة (Vector DB) متخصصة في حساب تشابه المتجهات والبحث الدلالي.',
          },
        ],
      },
    },
    {
      id: 'course-2',
      title: 'ماستر كلاس الإعلانات والموشن جرافيكس الاحترافي بـ After Effects',
      description: 'أتقن صناعة الإعلانات التجارية ثلاثية الأبعاد والموشن جرافيكس السينمائي من الفكرة والستوري بورد إلى التحريك والإخراج النهائي.',
      instructor: {
        name: 'عمر الشريف',
        title: 'مدير إبداعي ومخرج موشن جرافيكس',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
        rating: 4.88,
      },
      category: 'motion',
      categoryName: 'تصميم وموشن جرافيكس',
      level: 'متوسط',
      duration: '16 ساعة تدريبية',
      lessonsCount: 26,
      price: 59,
      thumbnail: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80',
      enrolledCount: 620,
      rating: 4.85,
      isCertificateIncluded: true,
      learningTrackId: 'track-motion',
      modules: [
        {
          title: 'المحور الأول: مبادئ التحريك الكلاسيكي الـ 12 وتطبيقها رقمياً',
          lessons: [
            { id: 'c2-l1', title: 'قواعد التوقيت والتباطؤ والتسارع (Easing Mastery)', duration: '30 دقيقة', isFreePreview: true },
            { id: 'c2-l2', title: 'التحكم الاحترافي في الـ Speed Graph وValue Graph', duration: '45 دقيقة', isFreePreview: false },
          ],
        },
      ],
      quiz: {
        id: 'quiz-2',
        title: 'اختبار ماستر كلاس الموشن جرافيكس',
        passingScore: 60,
        questions: [
          {
            id: 'q2-1',
            question: 'ما هو المنحنى الأهم في After Effects للتحكم في انسيابية الحركة الطبيعية؟',
            options: ['Graph Editor (Speed & Value Curves)', 'Audio Waveform', 'Layer Opacity', 'Mask Feather'],
            correctAnswer: 0,
            explanation: 'الـ Graph Editor هو الأساس لضبط التباطؤ والتسارع بما يحاكي فيزياء الواقع.',
          },
          {
            id: 'q2-2',
            question: 'ما هو مبدأ التحريك الذي يسبق الفعل الرئيسي لتهيئة عين المشاهد؟',
            options: ['Squash and Stretch', 'Anticipation (التوقع)', 'Staging', 'Follow Through'],
            correctAnswer: 1,
            explanation: 'التوقع (Anticipation) يهيئ المشاهد للحركة الكبرى مثل انحناء الشخص قبل القفز.',
          },
        ],
      },
    },
    {
      id: 'course-3',
      title: 'بناء وتطوير تطبيقات الويب الحديثة بـ Next.js 14 وTailwind (مجاني)',
      description: 'كورس تدريبي مكثف وعملي لبناء تطبيقات Full-Stack عصرية بتقنيات App Router وServer Components والربط بقواعد البيانات الحديثة.',
      instructor: {
        name: 'م. أحمد خالد',
        title: 'مطور برمجيات واستشاري حلول سحابية',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
        rating: 4.92,
      },
      category: 'fullstack',
      categoryName: 'برمجة وتطوير الويب',
      level: 'شامل',
      duration: '12 ساعة تدريبية',
      lessonsCount: 22,
      price: 0,
      thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
      enrolledCount: 3120,
      rating: 4.95,
      isCertificateIncluded: true,
      learningTrackId: 'track-fullstack',
      modules: [
        {
          title: 'المحور الأول: أسس Next.js 14 والهيكلية الحديثة',
          lessons: [
            { id: 'c3-l1', title: 'الفرق الجوهري بين Pages Router وApp Router', duration: '20 دقيقة', isFreePreview: true },
            { id: 'c3-l2', title: 'مفهوم Server Components وClient Components ومتى تستخدم كلاً منهما', duration: '35 دقيقة', isFreePreview: true },
          ],
        },
      ],
      quiz: {
        id: 'quiz-3',
        title: 'اختبار Next.js 14 الاحترافي',
        passingScore: 70,
        questions: [
          {
            id: 'q3-1',
            question: 'بشكل افتراضي في مجلد app في Next.js، جميع المكونات تُعتبر:',
            options: ['Client Components', 'React Server Components (RSC)', 'Static HTML فقط', 'API Endpoints'],
            correctAnswer: 1,
            explanation: 'في Next.js App Router، جميع المكونات افتراضياً هي Server Components ما لم يُكتب "use client".',
          },
        ],
      },
    },
  ],
  learningTracks: [
    {
      id: 'track-ai',
      title: 'مسار مهندس الذكاء الاصطناعي الكامل (AI Engineer Career Path)',
      description: 'خارطة طريق متكاملة من الصفر حتى بناء ودمج ونشر وكلاء ذكاء اصطناعي وتطبيقات SaaS ذكية تنافس عالمياً.',
      icon: 'Cpu',
      totalDuration: '65 ساعة تدريبية',
      coursesCount: 4,
      careerOutcome: 'مهندس ذكاء اصطناعي / مطور تطبيقات LLMs',
      level: 'شامل من الصفر للاحتراف',
      badge: 'مسار النخبة',
      courses: ['course-1'],
    },
    {
      id: 'track-fullstack',
      title: 'مسار مطور الويب المتكامل الفاخر (Full-Stack Elite Path)',
      description: 'تعلم تطوير الواجهات التفاعلية، بناء الخوادم السحابية، إدارة قواعد البيانات ونظم الدفع الإلكتروني بثقة تامة.',
      icon: 'Code2',
      totalDuration: '50 ساعة تدريبية',
      coursesCount: 3,
      careerOutcome: 'Full-Stack Developer / SaaS Builder',
      level: 'مبتدئ إلى متقدم',
      badge: 'الأكثر طلباً',
      courses: ['course-3'],
    },
    {
      id: 'track-motion',
      title: 'مسار مخرج ومصمم الموشن جرافيكس التجاري (Motion Maestro)',
      description: 'احترف صناعة المواد الإعلانية، الهويات البصرية المتحركة، وخدع الفيديو ثلاثية الأبعاد بأسلوب سينمائي.',
      icon: 'Sparkles',
      totalDuration: '40 ساعة تدريبية',
      coursesCount: 3,
      careerOutcome: 'Senior Motion Graphic Designer',
      level: 'متوسط إلى خبير',
      badge: 'معتمد دولياً',
      courses: ['course-2'],
    },
  ],
  certificates: [
    {
      id: 'cert-1',
      certificateCode: 'HERC-ACAD-2026-9941',
      studentName: 'محمود عبد السلام',
      courseTitle: 'الدبلومة المتكاملة لهندسة الذكاء الاصطناعي وتطوير وكلاء AI Agents',
      instructorName: 'د. يوسف الحكيم',
      issueDate: '2026-10-28',
      score: 95,
      grade: 'امتياز مع مرتبة الشرف',
    },
  ],
  aiTools: [
    {
      id: 'ai-cursor',
      name: 'Cursor AI',
      tagline: 'محرر الأكواد الأذكى في العالم المدعوم بالذكاء الاصطناعي الفائق',
      description: 'مبني على VS Code ويتيح للمطورين كتابة الشيفرات البرمجية، تصحيح الأخطاء، وإعادة هيكلة المشاريع بالكامل باستخدام نماذج Claude 3.5 Sonnet وGPT-4o بنقرة واحدة.',
      category: 'coding',
      categoryName: 'برمجة وتطوير',
      pricing: 'Freemium',
      pricingDetails: 'نسخة مجانية متاحة + خطة Pro بـ $20/شهرياً',
      websiteUrl: 'https://cursor.com',
      logo: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=150&q=80',
      upvotes: 1840,
      rating: 4.95,
      features: ['تعديل الأكواد عبر كامل الـ Codebase', 'دعم Claude 3.5 Sonnet المباشر', 'إكمال تلقائي فائق السرعة', 'شات مدمج مع السياق البرمجي الكامل'],
      arabicSupport: true,
      apiAvailable: true,
      pros: ['فهم استثنائي للمشاريع الضخمة', 'سرعة هائلة في التوليد', 'تكامل سلس مع إضافات VS Code'],
      cons: ['يحتاج اشتراك مدفوع للنماذج غير المحدودة'],
      comparisonSpecs: {
        speed: 'فائقة جداً (10/10)',
        easeOfUse: 'سهل للمبرمجين',
        bestFor: 'المطورين ومبرمجي المشاريع المعقدة',
        monthlyPrice: '$20 / شهر',
      },
    },
    {
      id: 'ai-midjourney',
      name: 'Midjourney v6',
      tagline: 'المعيار الذهبي لتوليد الصور والرسومات الفنية الخيالية والواقعية',
      description: 'المنصة الرائدة عالمياً في تحويل الأوصاف النصية إلى صور فوتوغرافية وتصاميم فنية مذهلة مع تحكم دقيق في الإضاءة والأنسجة والكاميرا.',
      category: 'design',
      categoryName: 'تصميم وجرافيك',
      pricing: 'مدفوع',
      pricingDetails: 'تبدأ الباقات من $10/شهر حتى $60/شهر',
      websiteUrl: 'https://midjourney.com',
      logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80',
      upvotes: 2450,
      rating: 4.92,
      features: ['واقعية فوتوغرافية غير مسبوقة', 'تحكم في نسب الأبعاد والتفاصيل', 'توليد أنماط ستايل لا نهائية', 'واجهة ويب حديثة بجانب ديسكورد'],
      arabicSupport: false,
      apiAvailable: false,
      pros: ['أعلى جودة إضاءة وألوان وواقعية', 'مجتمع ضخم وأفكار ملهمة'],
      cons: ['لا يدعم الكتابة بالعربية مباشرة على الصور', 'لا توجد نسخة مجانية حالياً'],
      comparisonSpecs: {
        speed: 'سريعة (9/10)',
        easeOfUse: 'متوسط يحتاج تعلم Prompts',
        bestFor: 'المصممين والفنانين والإعلانات التجارية',
        monthlyPrice: '$10 - $30 / شهر',
      },
    },
    {
      id: 'ai-runway',
      name: 'Runway Gen-3 Alpha',
      tagline: 'إنتاج وتوليد الفيديو السينمائي عالي الدقة بالذكاء الاصطناعي',
      description: 'منصة ثورية تتيح للمخرجين وصناع الأفلام توليد لقطات فيديو سينمائية من النصوص أو الصور مع تحكم احترافي في حركة الكاميرا والسرعة.',
      category: 'video',
      categoryName: 'مونتاج وفيديو',
      pricing: 'Freemium',
      pricingDetails: 'أرصدة مجانية للتجربة + خطط تبدأ من $12/شهر',
      websiteUrl: 'https://runwayml.com',
      logo: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=150&q=80',
      upvotes: 1620,
      rating: 4.86,
      features: ['توليد فيديو بدقة 4K', 'التحكم بالكاميرا الإخراجية (Camera Pan/Zoom)', 'تحويل الصور الثابتة إلى فيديو مفعم بالحياة', 'حذف العناصر من الفيديو بنقرة'],
      arabicSupport: true,
      apiAvailable: true,
      pros: ['اتساق حركي عالي جداً', 'أدوات تحكم احترافية بالمشهد'],
      cons: ['استهلاك النقاط سريع في المقاطع الطويلة'],
      comparisonSpecs: {
        speed: 'متوسطة نظراً لدقة الريندر',
        easeOfUse: 'سهل جداً',
        bestFor: 'صناع الأفلام والمونتيرين والإعلانات',
        monthlyPrice: '$12 - $76 / شهر',
      },
    },
    {
      id: 'ai-elevenlabs',
      name: 'ElevenLabs',
      tagline: 'المحاكاة الصوتية وتوليد الأصوات البشرية الطبيعية بجميع اللغات',
      description: 'أفضل محرك صوتي لتوليد التعليق الصوتي الصوتي والدبلجة واستنساخ الأصوات بدرجة تطابق ومشاعر إنسانية مذهلة مع دعم فائق للهجات العربية.',
      category: 'audio',
      categoryName: 'صوت وموسيقى',
      pricing: 'Freemium',
      pricingDetails: 'خطة مجانية 10,000 حرف/شهر + خطط تبدأ من $5/شهر',
      websiteUrl: 'https://elevenlabs.io',
      logo: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=150&q=80',
      upvotes: 2100,
      rating: 4.96,
      features: ['دعم مخارج الحروف العربية بدقة عالية', 'استنساخ الصوت من عينة مدتها دقيقة واحدة', 'التحكم في نبرة الصوت والمشاعر (الحماس، الهدوء)', 'مكتبة أصوات عالمية ضخمة'],
      arabicSupport: true,
      apiAvailable: true,
      pros: ['أفضل نطق عربي على الإطلاق', 'واجهة برمجة تطبيقات API قوية'],
      cons: ['الخطط المتقدمة تتطلب تكلفة إضافية للاستخدام المكثف'],
      comparisonSpecs: {
        speed: 'فائقة لحظية (Real-time)',
        easeOfUse: 'سهل جداً (بضغطة زر)',
        bestFor: 'البودكاست، الدوبلاج، الإعلانات، قنوات اليوتيوب',
        monthlyPrice: '$5 - $22 / شهر',
      },
    },
    {
      id: 'ai-chatgpt',
      name: 'ChatGPT Plus (GPT-4o)',
      tagline: 'المساعد الذكي الأوسع انتشاراً للأعمال والبحث والكتابة المعقدة',
      description: 'النموذج متعدد الوسائط المتكامل للتحليل البياني، البرمجة، كتابة المقالات، وتصفح الإنترنت المباشر مع الصوت اللحظي المتقدم.',
      category: 'writing',
      categoryName: 'كتابة ومحتوى',
      pricing: 'Freemium',
      pricingDetails: 'نسخة مجانية متاحة + خطة Plus بـ $20/شهرياً',
      websiteUrl: 'https://chatgpt.com',
      logo: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=150&q=80',
      upvotes: 3100,
      rating: 4.94,
      features: ['تحليل المستندات والبيانات الضخمة', 'توليد الأكواد والصور عبر DALL-E', 'وضع الصوت التفاعلي المتقدم Advanced Voice', 'إنشاء Custom GPTs خاصة'],
      arabicSupport: true,
      apiAvailable: true,
      pros: ['فهم سياقي ممتاز للغة العربية الفصحى واللهجات', 'إمكانيات شاملة في شتى المجالات'],
      cons: ['قد يقدم إجابات عامة أحياناً ما لم يتم توجيهه بدقة'],
      comparisonSpecs: {
        speed: 'فائقة جداً',
        easeOfUse: 'أسهل واجهة في العالم',
        bestFor: 'الطلاب، الباحثين، الكتاب، ورواد الأعمال',
        monthlyPrice: '$20 / شهر',
      },
    },
    {
      id: 'ai-v0',
      name: 'v0 by Vercel',
      tagline: 'توليد واجهات المستخدم الكاملة كوداً وتصميماً بالذكاء الاصطناعي',
      description: 'أداة فورية تتيح لك كتابة وصف التطبيق أو رفع صورة سكتش والحصول على كود React وTailwind CSS وShadcn نظيف وجاهز للنسخ في مشروعك.',
      category: 'coding',
      categoryName: 'برمجة وتطوير',
      pricing: 'Freemium',
      pricingDetails: 'نقاط مجانية شهرية + خطة Premium بـ $20/شهر',
      websiteUrl: 'https://v0.dev',
      logo: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=150&q=80',
      upvotes: 1980,
      rating: 4.9,
      features: ['توليد كود React وTailwind جاهز', 'معاينة حية وفورية في المتصفح', 'تعديل جزئي لأي عنصر بمجرد النقر عليه', 'تصدير مباشر لمشاريع Next.js'],
      arabicSupport: true,
      apiAvailable: false,
      pros: ['توفير ساعات طويلة من بناء الواجهات', 'كود معياري احترافي'],
      cons: ['يركز على الواجهات الأمامية أكثر من المنطق الخلفي'],
      comparisonSpecs: {
        speed: 'سريعة جداً',
        easeOfUse: 'سهل وممتع',
        bestFor: 'مبتكري المنتجات ومطوري الواجهات Frontend',
        monthlyPrice: '$20 / شهر',
      },
    },
  ],
  launches: [
    {
      id: 'launch-1',
      name: 'ناقل AI (Naqil AI)',
      tagline: 'الوكيل اللوجستي الذكي لإدارة أساطيل الشحن وتخفيض تكاليف الوقود',
      description: 'منصة SaaS ذكية تستخدم خوارزميات الذكاء الاصطناعي التوليدي لتحسين مسارات التوزيع اليومية، وتوقع أعطال الشاحنات، وتقليل الانبعاثات بنسبة تصل إلى 28% في منطقة الخليج والشرق الأوسط.',
      logo: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=150&q=80',
      coverImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
      category: 'AI Tool',
      demoUrl: 'https://naqil-ai.demo.app',
      launchDate: '2026-10-31',
      upvotes: 432,
      rankToday: 1,
      makers: [
        {
          name: 'سعود الهاشمي',
          role: 'المؤسس والرئيس التنفيذي',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        },
        {
          name: 'ليلى النجار',
          role: 'شريك مؤسس ومدير الذكاء الاصطناعي',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        },
      ],
      seekingPartners: true,
      partnerRoles: ['مستثمر ملاك (Angel Investor)', 'مدير تسويق نمو (Growth Lead)'],
      earlyAdoptersCount: 1250,
      commentsCount: 68,
      verified: true,
      featured: true,
      status: 'live',
    },
    {
      id: 'launch-2',
      name: 'فواتير بلس (Fawateer Plus)',
      tagline: 'الفوترة الإلكترونية الذكية المتوافقة مع أنظمة الضرائب العربية بنقرة واحدة',
      description: 'تطبيق سحابي يربط المتاجر الإلكترونية والشركات بنظام الفوترة الإلكترونية مع توليد رموز QR المشفرة وتقارير الإقرارات الضريبية التلقائية بأعلى معايير الأمان.',
      logo: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=150&q=80',
      coverImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80',
      category: 'Fintech',
      demoUrl: 'https://fawateerplus.app',
      launchDate: '2026-10-31',
      upvotes: 367,
      rankToday: 2,
      makers: [
        {
          name: 'مروان البكري',
          role: 'المؤسس التقني',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
        },
      ],
      seekingPartners: false,
      earlyAdoptersCount: 890,
      commentsCount: 42,
      verified: true,
      featured: true,
      status: 'live',
    },
    {
      id: 'launch-3',
      name: 'محرر (Mowharer AI)',
      tagline: 'مساعد الكتابة وصياغة المحتوى التسويقي المتخصص باللغة العربية واللهجات',
      description: 'أول نموذج لغوي متخصص في فهم ثقافة السوق العربي، يكتب إعلانات ومنشورات وبوستات تفاعلية تناسب كل بلد ولهجة بدقة متناهية ودون ركاكة الترجمة الحرفية.',
      logo: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=150&q=80',
      coverImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80',
      category: 'SaaS',
      demoUrl: 'https://mowharer.ai',
      launchDate: '2026-10-30',
      upvotes: 289,
      rankToday: 3,
      makers: [
        {
          name: 'منى الشامي',
          role: 'المؤسسة وصانعة المحتوى',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
        },
      ],
      seekingPartners: true,
      partnerRoles: ['شريك تقني خبير (CTO)'],
      earlyAdoptersCount: 1640,
      commentsCount: 54,
      verified: true,
      featured: false,
      status: 'live',
    },
    {
      id: 'launch-4',
      name: 'صانع 3D (Sanea Studio)',
      tagline: 'توليد تصاميم وتجارب الواقع المعزز للمتاجر الإلكترونية خلال ثوانٍ',
      description: 'أداة تسمح للمتاجر برفع صور المنتجات ليقوم الذكاء الاصطناعي ببناء نموذج تفاعلي ثلاثي الأبعاد يمكن للعميل تجربته داخل غرفته عبر الهاتف قبل الشراء.',
      logo: 'https://images.unsplash.com/photo-1633412802994-5c058f151b66?auto=format&fit=crop&w=150&q=80',
      coverImage: 'https://images.unsplash.com/photo-1633412802994-5c058f151b66?auto=format&fit=crop&w=1200&q=80',
      category: 'E-Commerce',
      demoUrl: 'https://sanea3d.io',
      launchDate: '2026-10-29',
      upvotes: 215,
      rankToday: 4,
      makers: [
        {
          name: 'خالد الصالح',
          role: 'مهندس رسوميات ومطور Unity',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
        },
      ],
      seekingPartners: true,
      partnerRoles: ['مسوق تجارة إلكترونية B2B'],
      earlyAdoptersCount: 710,
      commentsCount: 31,
      verified: true,
      featured: false,
      status: 'live',
    },
  ],
  partnerPosts: [
    {
      id: 'partner-1',
      projectTitle: 'تطبيق ناقل AI للشحن اللوجستي الذكي',
      founderName: 'سعود الهاشمي',
      founderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      roleNeeded: 'مدير تسويق نمو واستحواذ (Growth Marketing Lead)',
      equityOffered: '10% - 15% أسهم (Equity) + عمولات مبيعات',
      stage: 'حاصل على تمويل تجريبي مع 12 عميل B2B',
      description: 'نبحث عن شريك شغوف بالتسويق الرقمي وبناء استراتيجيات الـ B2B ولديه شبكة علاقات قوية في قطاع سلاسل الإمداد بالمملكة والخليج.',
      contactEmail: 'saud@naqil-ai.com',
      date: 'منذ يومين',
      tags: ['B2B', 'SaaS', 'Logistics', 'Equity'],
    },
    {
      id: 'partner-2',
      projectTitle: 'منصة محرر (Mowharer AI) للمحتوى العربي',
      founderName: 'منى الشامي',
      founderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      roleNeeded: 'شريك تقني مؤسس (Co-founder & CTO)',
      equityOffered: '25% - 35% أسهم (Co-founder Equity)',
      stage: 'النموذج الأولي MVP يعمل ومكتمل بنسبة 80%',
      description: 'أبحث عن مهندس برمجيات متمرس في Python وFastAPI وNext.js وLLMs لقيادة الجانب الهندسي التقني والبنية التحتية للمنصة.',
      contactEmail: 'mona@mowharer.ai',
      date: 'منذ 4 أيام',
      tags: ['AI', 'Python', 'Next.js', 'CTO', 'Co-Founder'],
    },
    {
      id: 'partner-3',
      projectTitle: 'منصة تداول وتدريب الأصول الرقمية للمستقلين',
      founderName: 'ياسين الفهد',
      founderAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      roleNeeded: 'مصمم تجربة وواجهة مستخدم (Lead UI/UX Designer)',
      equityOffered: '8% أسهم أو مقابل مالي لكل إنجاز',
      stage: 'مرحلة التخطيط المتقدم وجمع الفريق',
      description: 'نرغب في ضم مصمم واجهات فذ يبدع في تصاميم الدارك مود الفاخرة لإنشاء هوية التطبيق وتجربة الاستخدام.',
      contactEmail: 'yaseen@crypto-freelance.app',
      date: 'منذ أسبوع',
      tags: ['UI/UX', 'Figma', 'Fintech'],
    },
  ],
  users: [
    {
      id: 'usr-admin',
      name: 'المدير العام (Hercules Admin)',
      email: 'admin@hercules.luxury',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      joinedAt: '2026-01-01',
      stats: {
        purchases: 18,
        certificates: 5,
        projectsLaunched: 2,
        salesEarned: 14500,
      },
    },
    {
      id: 'usr-creator-1',
      name: 'كريم المنصور',
      email: 'karim@hercules.market',
      role: 'creator',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      joinedAt: '2026-03-10',
      stats: {
        purchases: 4,
        certificates: 2,
        projectsLaunched: 1,
        salesEarned: 20188,
      },
    },
    {
      id: 'usr-maker-1',
      name: 'سعود الهاشمي',
      email: 'saud@naqil-ai.com',
      role: 'maker',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      joinedAt: '2026-04-12',
      stats: {
        purchases: 7,
        certificates: 1,
        projectsLaunched: 3,
        salesEarned: 0,
      },
    },
  ],
  orders: [
    {
      id: 'ord-1001',
      productId: 'prod-1',
      productTitle: 'قالب واجهات SaaS فاخر – Hercules Next.js & Tailwind UI',
      amount: 49,
      buyerName: 'عبد الله العتيبي',
      buyerEmail: 'abdullah@client.com',
      date: '2026-10-30',
      downloadToken: 'HERC-DL-8827-X',
    },
    {
      id: 'ord-1002',
      productId: 'prod-2',
      productTitle: 'حزمة المؤثرات السينمائية الذهبية لـ Premiere Pro وAfter Effects',
      amount: 29,
      buyerName: 'ياسين منصور',
      buyerEmail: 'yaseen@media.io',
      date: '2026-10-31',
      downloadToken: 'HERC-DL-9912-Y',
    },
  ],
  waitlistEntries: [
    {
      id: 'wait-1',
      launchId: 'launch-1',
      email: 'early-user1@tech.com',
      date: '2026-10-31',
    },
    {
      id: 'wait-2',
      launchId: 'launch-1',
      email: 'investor@capital.sa',
      date: '2026-10-31',
    },
  ],
};

// Database helper class
class HerculesDB {
  private cache: DatabaseSchema | null = null;

  private load(): DatabaseSchema {
    if (this.cache) return this.cache;

    ensureDataDir();
    if (!fs.existsSync(DB_FILE)) {
      this.save(initialData);
      this.cache = initialData;
      return initialData;
    }

    try {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      this.cache = JSON.parse(content);
      return this.cache!;
    } catch (err) {
      console.error('Error reading Hercules DB, restoring initial data:', err);
      this.save(initialData);
      this.cache = initialData;
      return initialData;
    }
  }

  private save(data: DatabaseSchema): void {
    ensureDataDir();
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    this.cache = data;
  }

  // --- Reset & Seed ---
  public resetToSeed(): DatabaseSchema {
    this.save(initialData);
    return initialData;
  }

  public getRawData(): DatabaseSchema {
    return this.load();
  }

  // --- Market Products ---
  public getProducts(category?: string, search?: string): MarketProduct[] {
    const data = this.load();
    let items = [...data.products];

    if (category && category !== 'all') {
      items = items.filter((p) => p.category === category);
    }
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      items = items.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.titleEn.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return items;
  }

  public getProductById(id: string): MarketProduct | undefined {
    const data = this.load();
    return data.products.find((p) => p.id === id);
  }

  public addProduct(product: Omit<MarketProduct, 'id' | 'createdAt' | 'salesCount' | 'rating' | 'reviewsCount'>): MarketProduct {
    const data = this.load();
    const newProduct: MarketProduct = {
      ...product,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      salesCount: 0,
      rating: 5.0,
      reviewsCount: 1,
    };
    data.products.unshift(newProduct);
    this.save(data);
    return newProduct;
  }

  public deleteProduct(id: string): boolean {
    const data = this.load();
    const lenBefore = data.products.length;
    data.products = data.products.filter((p) => p.id !== id);
    if (data.products.length !== lenBefore) {
      this.save(data);
      return true;
    }
    return false;
  }

  public toggleProductFeatured(id: string): boolean {
    const data = this.load();
    const prod = data.products.find((p) => p.id === id);
    if (prod) {
      prod.featured = !prod.featured;
      this.save(data);
      return true;
    }
    return false;
  }

  public purchaseProduct(productId: string, buyerName: string, buyerEmail: string): { orderId: string; downloadToken: string; downloadUrl: string } {
    const data = this.load();
    const product = data.products.find((p) => p.id === productId);
    if (!product) throw new Error('Product not found');

    product.salesCount += 1;
    const downloadToken = `HERC-DL-${Math.floor(1000 + Math.random() * 9000)}-${Date.now().toString(36).toUpperCase()}`;
    const orderId = `ord-${Date.now()}`;

    data.orders.unshift({
      id: orderId,
      productId: product.id,
      productTitle: product.title,
      amount: product.price,
      buyerName,
      buyerEmail,
      date: new Date().toISOString().split('T')[0],
      downloadToken,
    });

    this.save(data);
    return {
      orderId,
      downloadToken,
      downloadUrl: product.downloadUrl,
    };
  }

  // --- Academy Courses & Tracks ---
  public getCourses(category?: string, level?: string): Course[] {
    const data = this.load();
    let items = [...data.courses];
    if (category && category !== 'all') {
      items = items.filter((c) => c.category === category);
    }
    if (level && level !== 'all') {
      items = items.filter((c) => c.level === level);
    }
    return items;
  }

  public getCourseById(id: string): Course | undefined {
    const data = this.load();
    return data.courses.find((c) => c.id === id);
  }

  public getLearningTracks(): LearningTrack[] {
    const data = this.load();
    return data.learningTracks;
  }

  public issueCertificate(studentName: string, courseTitle: string, instructorName: string, score: number): Certificate {
    const data = this.load();
    const certificateCode = `HERC-ACAD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const grade = score >= 90 ? 'امتياز مع مرتبة الشرف' : score >= 80 ? 'جيد جداً' : 'ناجح بجدارة';

    const newCert: Certificate = {
      id: `cert-${Date.now()}`,
      certificateCode,
      studentName,
      courseTitle,
      instructorName,
      issueDate: new Date().toISOString().split('T')[0],
      score,
      grade,
    };

    data.certificates.unshift(newCert);
    this.save(data);
    return newCert;
  }

  public addCourse(course: Omit<Course, 'id' | 'enrolledCount' | 'rating'>): Course {
    const data = this.load();
    const newCourse: Course = {
      ...course,
      id: `course-${Date.now()}`,
      enrolledCount: 0,
      rating: 5.0,
    };
    data.courses.unshift(newCourse);
    this.save(data);
    return newCourse;
  }

  // --- AI Tools ---
  public getAITools(category?: string, search?: string): AITool[] {
    const data = this.load();
    let items = [...data.aiTools];
    if (category && category !== 'all') {
      items = items.filter((t) => t.category === category);
    }
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      items = items.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.tagline.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q)
      );
    }
    return items;
  }

  public getAIToolById(id: string): AITool | undefined {
    const data = this.load();
    return data.aiTools.find((t) => t.id === id);
  }

  public upvoteAITool(id: string): number {
    const data = this.load();
    const tool = data.aiTools.find((t) => t.id === id);
    if (tool) {
      tool.upvotes += 1;
      this.save(data);
      return tool.upvotes;
    }
    return 0;
  }

  public addAITool(tool: Omit<AITool, 'id' | 'upvotes' | 'rating'>): AITool {
    const data = this.load();
    const newTool: AITool = {
      ...tool,
      id: `ai-${Date.now()}`,
      upvotes: 1,
      rating: 5.0,
    };
    data.aiTools.unshift(newTool);
    this.save(data);
    return newTool;
  }

  // --- Launchpad ---
  public getLaunches(): LaunchpadProduct[] {
    const data = this.load();
    // Sort by upvotes descending
    return [...data.launches].sort((a, b) => b.upvotes - a.upvotes);
  }

  public getLaunchById(id: string): LaunchpadProduct | undefined {
    const data = this.load();
    return data.launches.find((l) => l.id === id);
  }

  public upvoteLaunch(id: string): number {
    const data = this.load();
    const item = data.launches.find((l) => l.id === id);
    if (item) {
      item.upvotes += 1;
      this.save(data);
      return item.upvotes;
    }
    return 0;
  }

  public joinWaitlist(launchId: string, email: string): { success: boolean; total: number } {
    const data = this.load();
    const item = data.launches.find((l) => l.id === launchId);
    if (!item) throw new Error('Launch project not found');

    item.earlyAdoptersCount += 1;
    data.waitlistEntries.unshift({
      id: `wait-${Date.now()}`,
      launchId,
      email,
      date: new Date().toISOString().split('T')[0],
    });

    this.save(data);
    return { success: true, total: item.earlyAdoptersCount };
  }

  public addLaunch(launch: Omit<LaunchpadProduct, 'id' | 'upvotes' | 'rankToday' | 'earlyAdoptersCount' | 'commentsCount'>): LaunchpadProduct {
    const data = this.load();
    const newLaunch: LaunchpadProduct = {
      ...launch,
      id: `launch-${Date.now()}`,
      upvotes: 1,
      rankToday: data.launches.length + 1,
      earlyAdoptersCount: 1,
      commentsCount: 0,
    };
    data.launches.unshift(newLaunch);
    this.save(data);
    return newLaunch;
  }

  public getPartnerPosts(): PartnerPost[] {
    const data = this.load();
    return data.partnerPosts;
  }

  public addPartnerPost(post: Omit<PartnerPost, 'id' | 'date'>): PartnerPost {
    const data = this.load();
    const newPost: PartnerPost = {
      ...post,
      id: `partner-${Date.now()}`,
      date: 'اليوم',
    };
    data.partnerPosts.unshift(newPost);
    this.save(data);
    return newPost;
  }

  // --- Admin Statistics & Overview ---
  public getAdminStats() {
    const data = this.load();
    const totalRevenue = data.orders.reduce((sum, o) => sum + o.amount, 0);
    const totalSalesCount = data.orders.length;
    const totalProducts = data.products.length;
    const totalCourses = data.courses.length;
    const totalStudents = data.courses.reduce((sum, c) => sum + c.enrolledCount, 0);
    const totalCertificates = data.certificates.length;
    const totalAITools = data.aiTools.length;
    const totalLaunches = data.launches.length;
    const totalUpvotes = data.launches.reduce((sum, l) => sum + l.upvotes, 0);
    const totalUsers = data.users.length;

    return {
      totalRevenue,
      totalSalesCount,
      totalProducts,
      totalCourses,
      totalStudents,
      totalCertificates,
      totalAITools,
      totalLaunches,
      totalUpvotes,
      totalUsers,
      recentOrders: data.orders.slice(0, 5),
      recentLaunches: data.launches.slice(0, 5),
      recentCertificates: data.certificates.slice(0, 5),
    };
  }

  public getUsers(): User[] {
    const data = this.load();
    return data.users;
  }

  public createUser(userData: { name: string; email: string; role?: User['role']; avatar?: string }): User {
    const data = this.load();
    const existing = data.users.find((u) => u.email.toLowerCase() === userData.email.toLowerCase());
    if (existing) {
      return existing;
    }
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: userData.name,
      email: userData.email,
      role: userData.role || 'user',
      avatar: userData.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(userData.name)}`,
      joinedAt: new Date().toISOString().split('T')[0],
      stats: {
        purchases: 0,
        certificates: 0,
        projectsLaunched: 0,
        salesEarned: 0,
      },
    };
    data.users.unshift(newUser);
    this.save(data);
    return newUser;
  }

  public deleteUser(userId: string): boolean {
    const data = this.load();
    const initialLen = data.users.length;
    data.users = data.users.filter((u) => u.id !== userId);
    if (data.users.length !== initialLen) {
      this.save(data);
      return true;
    }
    return false;
  }

  public updateUserRole(userId: string, role: User['role']): boolean {
    const data = this.load();
    const u = data.users.find((user) => user.id === userId);
    if (u) {
      u.role = role;
      this.save(data);
      return true;
    }
    return false;
  }
}

// Singleton export
export const db = new HerculesDB();

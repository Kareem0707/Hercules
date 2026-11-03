export type MarketCategory = 
  | 'templates-ui'
  | 'adobe-video-photo'
  | 'tools-plugins'
  | 'notion-excel'
  | 'design-resources';

export interface MarketProduct {
  id: string;
  title: string;
  titleEn: string;
  slug: string;
  description: string;
  category: MarketCategory;
  categoryName: string;
  price: number;
  currency: 'USD' | 'SAR' | 'EGP';
  rating: number;
  reviewsCount: number;
  salesCount: number;
  thumbnail: string;
  gallery: string[];
  fileType: string;
  fileSize: string;
  downloadUrl: string;
  seller: {
    name: string;
    avatar: string;
    verified: boolean;
    sales: number;
  };
  tags: string[];
  featured: boolean;
  status?: 'active' | 'pending' | 'rejected';
  createdAt: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface CourseLesson {
  id: string;
  title: string;
  duration: string;
  isFreePreview: boolean;
  videoUrl?: string;
  completed?: boolean;
}

export interface CourseModule {
  title: string;
  lessons: CourseLesson[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: {
    name: string;
    title: string;
    avatar: string;
    rating: number;
  };
  category: 'fullstack' | 'ai' | 'motion' | 'uiux' | 'business';
  categoryName: string;
  level: 'مبتدئ' | 'متوسط' | 'متقدم' | 'شامل';
  duration: string;
  lessonsCount: number;
  price: number;
  thumbnail: string;
  enrolledCount: number;
  rating: number;
  isCertificateIncluded: boolean;
  learningTrackId?: string;
  status?: 'active' | 'pending' | 'rejected';
  modules: CourseModule[];
  quiz?: {
    id: string;
    title: string;
    passingScore: number;
    questions: QuizQuestion[];
  };
}

export interface LearningTrack {
  id: string;
  title: string;
  description: string;
  icon: string;
  totalDuration: string;
  coursesCount: number;
  careerOutcome: string;
  level: string;
  badge: string;
  courses: string[]; // Course IDs
}

export interface Certificate {
  id: string;
  certificateCode: string;
  studentName: string;
  courseTitle: string;
  instructorName: string;
  issueDate: string;
  score: number;
  grade: string;
}

export type AICategory = 
  | 'coding' 
  | 'design' 
  | 'video' 
  | 'writing' 
  | 'audio' 
  | 'marketing';

export interface AITool {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: AICategory;
  categoryName: string;
  pricing: 'مجاني' | 'مدفوع' | 'Freemium' | 'تجربة مجانية';
  pricingDetails: string;
  websiteUrl: string;
  logo: string;
  upvotes: number;
  rating: number;
  features: string[];
  arabicSupport: boolean;
  apiAvailable: boolean;
  pros: string[];
  cons: string[];
  comparisonSpecs: {
    speed: string;
    easeOfUse: string;
    bestFor: string;
    monthlyPrice: string;
  };
}

export interface LaunchpadProduct {
  id: string;
  name: string;
  tagline: string;
  description: string;
  logo: string;
  coverImage: string;
  category: string;
  demoUrl: string;
  launchDate: string;
  upvotes: number;
  rankToday: number;
  makers: {
    name: string;
    role: string;
    avatar: string;
  }[];
  seekingPartners: boolean;
  partnerRoles?: string[];
  earlyAdoptersCount: number;
  commentsCount: number;
  verified: boolean;
  featured: boolean;
  status: 'live' | 'upcoming' | 'pending';
  hasUpvoted?: boolean;
}

export interface PartnerPost {
  id: string;
  projectTitle: string;
  founderName: string;
  founderAvatar: string;
  roleNeeded: string;
  equityOffered: string;
  stage: string;
  description: string;
  contactEmail: string;
  date: string;
  tags: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'creator' | 'instructor' | 'maker' | 'user';
  avatar: string;
  joinedAt: string;
  stats?: {
    purchases?: number;
    certificates?: number;
    projectsLaunched?: number;
    salesEarned?: number;
  };
}

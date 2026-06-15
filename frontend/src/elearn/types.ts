export type Role = "admin" | "formateur" | "etudiant";

export type UserStatus = "active" | "pending" | "rejected";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  xp: number;
  level: number;
  badges: string[];
  status: UserStatus;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: string[];
  answerIndex: number;
}

export interface Quiz {
  id: string;
  moduleId: string;
  timeLimitSec: number;
  questions: QuizQuestion[];
}

export type ChapterContentType = "video" | "text" | "pdf";

export interface Chapter {
  id: string;
  title: string;
  contentType: ChapterContentType;
  content: string;
}

export interface CourseModule {
  id: string;
  title: string;
  chapters: Chapter[];
  quiz: Quiz;
}

export interface Course {
  id: string;
  trainerId: string;
  title: string;
  description: string;
  price: number;
  published: boolean;
  rating: number;
  ratingCount: number;
  modules: CourseModule[];
  finalProject: string;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  paid: boolean;
  amount: number;
  enrolledAt: string;
}

export interface QuizResult {
  id: string;
  userId: string;
  courseId: string;
  moduleId: string;
  score: number;
  passed: boolean;
  createdAt: string;
}

export interface Progression {
  id: string;
  userId: string;
  courseId: string;
  unlockedModuleIds: string[];
  completedModuleIds: string[];
  chapterDoneMap: Record<string, boolean>;
}

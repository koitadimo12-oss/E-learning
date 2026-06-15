import { seedCourses, seedUsers } from "../data/seed";
import type { Course, Enrollment, Progression, QuizResult, User } from "../types";

const KEYS = {
  users: "elearn_users",
  courses: "elearn_courses",
  enrollments: "elearn_enrollments",
  quizResults: "elearn_quiz_results",
  progressions: "elearn_progressions",
  session: "elearn_session",
} as const;

function read<T>(key: string, fallback: T): T {
  const value = localStorage.getItem(key);
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function initializeStorage() {
  if (!localStorage.getItem(KEYS.users)) write(KEYS.users, seedUsers);
  if (!localStorage.getItem(KEYS.courses)) write(KEYS.courses, seedCourses);
  if (!localStorage.getItem(KEYS.enrollments)) write(KEYS.enrollments, []);
  if (!localStorage.getItem(KEYS.quizResults)) write(KEYS.quizResults, []);
  if (!localStorage.getItem(KEYS.progressions)) write(KEYS.progressions, []);
}

export const storage = {
  keys: KEYS,
  getUsers: () => read<User[]>(KEYS.users, []),
  setUsers: (users: User[]) => write(KEYS.users, users),
  getCourses: () => read<Course[]>(KEYS.courses, []),
  setCourses: (courses: Course[]) => write(KEYS.courses, courses),
  getEnrollments: () => read<Enrollment[]>(KEYS.enrollments, []),
  setEnrollments: (rows: Enrollment[]) => write(KEYS.enrollments, rows),
  getQuizResults: () => read<QuizResult[]>(KEYS.quizResults, []),
  setQuizResults: (rows: QuizResult[]) => write(KEYS.quizResults, rows),
  getProgressions: () => read<Progression[]>(KEYS.progressions, []),
  setProgressions: (rows: Progression[]) => write(KEYS.progressions, rows),
  getSession: () => read<User | null>(KEYS.session, null),
  setSession: (user: User | null) => write(KEYS.session, user),
};

import { coursesService } from "./coursesService";
import { progressionService } from "./progressionService";
import { storage } from "./storage";
import type { QuizResult } from "../types";

function makeId(prefix: string) {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}

export const quizResultsService = {
  listByUser(userId: string) {
    return storage.getQuizResults().filter((r) => r.userId === userId);
  },

  submit(userId: string, courseId: string, moduleId: string, goodAnswers: number, total: number) {
    const score = Math.round((goodAnswers / total) * 100);
    const passed = score >= 50;
    const result: QuizResult = {
      id: makeId("quiz"),
      userId,
      courseId,
      moduleId,
      score,
      passed,
      createdAt: new Date().toISOString(),
    };
    storage.setQuizResults([...storage.getQuizResults(), result]);
    if (passed) progressionService.completeModule(userId, courseId, moduleId);
    return result;
  },

  latestForModule(userId: string, moduleId: string) {
    return this.listByUser(userId)
      .filter((r) => r.moduleId === moduleId)
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))[0];
  },

  averageScore(userId: string) {
    const rows = this.listByUser(userId);
    if (rows.length === 0) return 0;
    return Math.round(rows.reduce((s, r) => s + r.score, 0) / rows.length);
  },

  moduleByQuizId(quizId: string) {
    const courses = coursesService.list();
    for (const course of courses) {
      for (const mod of course.modules) {
        if (mod.quiz.id === quizId) return { course, module: mod };
      }
    }
    return null;
  },
};

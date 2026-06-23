import type { QuizResult } from "../types";

export const quizResultsService = {
  listByUser(_userId: string): QuizResult[] {
    return [];
  },

  save(_result: QuizResult) {
    return _result;
  },

  bestByModule(_userId: string, _courseId: string, _moduleId: string) {
    return null;
  },

  moduleByQuizId(_quizId: string) {
    return null as { moduleId: string; courseId: string } | null;
  },

  submit(_userId: string, _courseId: string, _moduleId: string, _score: number, _total: number) {
    return { passed: false, score: 0 };
  },

  averageScore(_userId: string, _courseId = "") {
    return 0;
  },
};

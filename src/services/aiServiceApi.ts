import { apiPost } from "./apiClient";

export type AiAdviceResponse = {
  level: string;
  message: string;
  actions: string[];
  path?: string[];
  recommendedCourses?: { title: string; reason: string }[];
  recommendedBooks?: { title: string; reason: string }[];
};

export async function getAiAdvice(input: { lastScore?: number; topic?: string; lang?: string }) {
  return apiPost<AiAdviceResponse>("/ai/advice", input);
}


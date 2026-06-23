import { apiPost } from "./apiClient";

export type AiAdviceResponse = {
  message: string;
  strengths?: string[];
  weaknesses?: string[];
  actions: string[];
  path?: string[];
  recommendedCourses?: { title: string; reason: string }[];
  recommendedBooks?: { title: string; author: string }[];
};


export async function getAiAdvice(input: {
  lastScore?: number;
  topic?: string;
  lang?: string;
  answers?: any;
}) {
  return apiPost<AiAdviceResponse>("/ai/advice", input);
}

export type DailyGameInfo = {
  title: string;
  description: string;
  topic: string;
  difficulty: number;
  xp: number;
  emoji: string;
};

export async function getAiDailyGame(input: {
  coursesTitles: string[];
  level: number;
  lang?: string;
}) {
  return apiPost<DailyGameInfo>("/ai/daily-game", input);
}

import { apiPost } from "./apiClient";

export type AiGameResponse = {
  lang: string;
  type: "timed-quiz" | "fill-code" | "logic-puzzle";
  difficulty: number;
  title: string;
  rules: string;
  reward: { xp: number; badge: string | null };
  payload: any;
};

export async function getAiMiniGame(input: {
  lang?: string;
  topic?: string;
  lastScore?: number;
  level?: number;
}) {
  return apiPost<AiGameResponse>("/ai/game", input);
}


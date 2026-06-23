import { apiPost } from "./apiClient";

export type AiLessonResponse = {
  response: string;
};

export async function getAiLesson(input: {
  lang?: string;
  courseTitle?: string;
  lessonTitle?: string;
  youtubeUrl?: string;
}) {
  return apiPost<AiLessonResponse>("/ai/lesson", input);
}

export async function askAiSimplify(input: {
  topic: string;
  context?: string;
  lang?: string;
}) {
  return apiPost<{ response: string }>("/ai/simplify", input);
}

export async function askAiExample(input: {
  topic: string;
  context?: string;
  lang?: string;
}) {
  return apiPost<{ response: string }>("/ai/example", input);
}

export async function askAiChat(input: {
  message: string;
  context?: string;
  lang?: string;
}) {
  return apiPost<{ response: string }>("/ai/chat", input);
}

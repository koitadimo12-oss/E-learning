import { apiPost } from "./apiClient";

export type AiLessonResponse = {
  lang: string;
  topic: string;
  youtubeUrl: string | null;
  transcript: string;
  content: {
    summary: string;
    keyPoints: string[];
    example: string;
    deepDive: string;
  };
};

export async function getAiLesson(input: {
  lang?: string;
  courseTitle?: string;
  lessonTitle?: string;
  youtubeUrl?: string;
}) {
  return apiPost<AiLessonResponse>("/ai/lesson", input);
}


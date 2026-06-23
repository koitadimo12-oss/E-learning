import type { Progression } from "../types";

function emptyProgress(userId: string, courseId: string): Progression {
  return {
    id: `${userId}-${courseId}`,
    userId,
    courseId,
    unlockedModuleIds: [],
    completedModuleIds: [],
    chapterDoneMap: {},
  };
}

export const progressionService = {
  initializeCourseProgress(userId: string, courseId: string) {
    return emptyProgress(userId, courseId);
  },

  get(userId: string, courseId: string) {
    return emptyProgress(userId, courseId);
  },

  byCourse(userId: string, courseId: string) {
    return emptyProgress(userId, courseId);
  },

  progressPercent(_userId: string, _courseId: string) {
    return 0;
  },

  markChapterDone(_userId: string, _courseId: string, _chapterId: string) {
    return null;
  },

  completeModule(_userId: string, _courseId: string, _moduleId: string) {
    return null;
  },

  listByUser(_userId: string) {
    return [] as Progression[];
  },
};

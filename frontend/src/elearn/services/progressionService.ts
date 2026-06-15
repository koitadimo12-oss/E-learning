import { coursesService } from "./coursesService";
import { storage } from "./storage";
import type { Progression } from "../types";

function makeId(prefix: string) {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}

export const progressionService = {
  initializeCourseProgress(userId: string, courseId: string) {
    const rows = storage.getProgressions();
    const exists = rows.find((p) => p.userId === userId && p.courseId === courseId);
    if (exists) return exists;
    const course = coursesService.getById(courseId);
    if (!course || course.modules.length === 0) return null;
    const progress: Progression = {
      id: makeId("prog"),
      userId,
      courseId,
      unlockedModuleIds: [course.modules[0].id],
      completedModuleIds: [],
      chapterDoneMap: {},
    };
    storage.setProgressions([...rows, progress]);
    return progress;
  },

  byCourse(userId: string, courseId: string) {
    return storage.getProgressions().find((p) => p.userId === userId && p.courseId === courseId) ?? null;
  },

  markChapterDone(userId: string, courseId: string, chapterId: string) {
    const rows = storage.getProgressions();
    const next = rows.map((p) =>
      p.userId === userId && p.courseId === courseId
        ? { ...p, chapterDoneMap: { ...p.chapterDoneMap, [chapterId]: true } }
        : p,
    );
    storage.setProgressions(next);
  },

  completeModule(userId: string, courseId: string, moduleId: string) {
    const course = coursesService.getById(courseId);
    if (!course) return;
    const rows = storage.getProgressions();
    const next = rows.map((p) => {
      if (p.userId !== userId || p.courseId !== courseId) return p;
      const completed = p.completedModuleIds.includes(moduleId) ? p.completedModuleIds : [...p.completedModuleIds, moduleId];
      const currentIndex = course.modules.findIndex((m) => m.id === moduleId);
      const nextModule = course.modules[currentIndex + 1];
      const unlocked = nextModule && !p.unlockedModuleIds.includes(nextModule.id) ? [...p.unlockedModuleIds, nextModule.id] : p.unlockedModuleIds;
      return { ...p, completedModuleIds: completed, unlockedModuleIds: unlocked };
    });
    storage.setProgressions(next);
  },

  progressPercent(userId: string, courseId: string) {
    const course = coursesService.getById(courseId);
    const progress = this.byCourse(userId, courseId);
    if (!course || !progress || course.modules.length === 0) return 0;
    return Math.round((progress.completedModuleIds.length / course.modules.length) * 100);
  },
};

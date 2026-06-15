import { storage } from "./storage";
import { progressionService } from "./progressionService";
import type { Enrollment } from "../types";

function makeId(prefix: string) {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}

export const enrollmentsService = {
  listByUser(userId: string) {
    return storage.getEnrollments().filter((e) => e.userId === userId);
  },

  listByCourse(courseId: string) {
    return storage.getEnrollments().filter((e) => e.courseId === courseId);
  },

  isEnrolled(userId: string, courseId: string) {
    return storage.getEnrollments().some((e) => e.userId === userId && e.courseId === courseId);
  },

  enroll(userId: string, courseId: string, amount: number) {
    if (this.isEnrolled(userId, courseId)) throw new Error("Deja inscrit.");
    const enrollment: Enrollment = {
      id: makeId("enroll"),
      userId,
      courseId,
      paid: amount > 0,
      amount,
      enrolledAt: new Date().toISOString(),
    };
    const rows = storage.getEnrollments();
    storage.setEnrollments([...rows, enrollment]);
    progressionService.initializeCourseProgress(userId, courseId);
    return enrollment;
  },
};

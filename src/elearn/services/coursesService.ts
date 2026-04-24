import { storage } from "./storage";
import type { Course } from "../types";

function makeId(prefix: string) {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}

export const coursesService = {
  list() {
    return storage.getCourses();
  },

  getById(id: string) {
    return storage.getCourses().find((c) => c.id === id) ?? null;
  },

  create(payload: Omit<Course, "id" | "rating" | "ratingCount">) {
    const rows = storage.getCourses();
    const course: Course = { ...payload, id: makeId("course"), rating: 0, ratingCount: 0 };
    storage.setCourses([...rows, course]);
    return course;
  },

  update(id: string, patch: Partial<Course>) {
    const updated = storage.getCourses().map((c) => (c.id === id ? { ...c, ...patch } : c));
    storage.setCourses(updated);
    return updated.find((c) => c.id === id) ?? null;
  },

  remove(id: string) {
    storage.setCourses(storage.getCourses().filter((c) => c.id !== id));
  },

  addRating(courseId: string, stars: number) {
    const rows = storage.getCourses();
    const next = rows.map((course) => {
      if (course.id !== courseId) return course;
      const total = course.rating * course.ratingCount + stars;
      const ratingCount = course.ratingCount + 1;
      return { ...course, ratingCount, rating: Number((total / ratingCount).toFixed(1)) };
    });
    storage.setCourses(next);
  },
};

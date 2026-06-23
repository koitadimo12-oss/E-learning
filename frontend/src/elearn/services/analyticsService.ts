import { coursesService } from "./coursesService";
import { enrollmentsService } from "./enrollmentsService";
import { quizResultsService } from "./quizResultsService";
import { usersService } from "./usersService";

export const analyticsService = {
  adminStats() {
    const courses = coursesService.list();
    const users = usersService.list();
    const enrollments = courses.flatMap((c) => enrollmentsService.listByCourse(c.id));
    return {
      totalUsers: users.length,
      totalCourses: courses.length,
      pendingTrainers: users.filter((u) => u.role === "formateur" && u.status === "pending").length,
      totalRevenue: enrollments.reduce((sum, e) => sum + e.amount, 0),
      totalEnrollments: enrollments.length,
    };
  },
};

export function studentDashboardStats(userId: string) {
  const enrolled = enrollmentsService.listByUser(userId);
  const avgScore = quizResultsService.averageScore(userId, "");
  const completed = enrolled.filter((en) => {
    const course = coursesService.getById(en.courseId);
    const passed = quizResultsService.listByUser(userId).filter((r) => r.courseId === en.courseId && r.passed);
    return course && passed.length >= course.modules.length;
  });
  return {
    enrolledCount: enrolled.length,
    completedCount: completed.length,
    avgScore,
  };
}

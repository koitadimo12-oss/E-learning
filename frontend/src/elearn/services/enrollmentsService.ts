function makeId(prefix: string) {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}

export const enrollmentsService = {
  listByUser(_userId: string) {
    return [] as import("../types").Enrollment[];
  },

  listByCourse(_courseId: string) {
    return [] as import("../types").Enrollment[];
  },

  isEnrolled(_userId: string, _courseId: string) {
    return false;
  },

  enroll(userId: string, courseId: string, amount: number) {
    return {
      id: makeId("enroll"),
      userId,
      courseId,
      paid: amount > 0,
      amount,
      enrolledAt: new Date().toISOString(),
    };
  },
};

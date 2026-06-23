// Stockage local désactivé — les données passent par l'API backend.
export function initializeStorage() {
  /* no-op */
}

export const storage = {
  keys: {} as Record<string, string>,
  getUsers: () => [] as never[],
  setUsers: (_users: never[]) => undefined,
  getCourses: () => [] as never[],
  setCourses: (_courses: never[]) => undefined,
  getEnrollments: () => [] as never[],
  setEnrollments: (_rows: never[]) => undefined,
  getQuizResults: () => [] as never[],
  setQuizResults: (_rows: never[]) => undefined,
  getProgressions: () => [] as never[],
  setProgressions: (_rows: never[]) => undefined,
  getSession: () => null,
  setSession: (_user: null) => undefined,
};

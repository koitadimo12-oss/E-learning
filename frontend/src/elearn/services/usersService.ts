import { storage } from "./storage";
import type { User, UserStatus } from "../types";

export const usersService = {
  list() {
    return storage.getUsers();
  },

  update(userId: string, patch: Partial<User>) {
    const rows = storage.getUsers().map((u) => (u.id === userId ? { ...u, ...patch } : u));
    storage.setUsers(rows);
    const session = storage.getSession();
    if (session?.id === userId) {
      const updated = rows.find((u) => u.id === userId) ?? null;
      storage.setSession(updated);
    }
    return rows.find((u) => u.id === userId) ?? null;
  },

  remove(userId: string) {
    storage.setUsers(storage.getUsers().filter((u) => u.id !== userId));
  },

  setTrainerStatus(userId: string, status: UserStatus) {
    return this.update(userId, { status });
  },

  grantXp(userId: string, amount: number) {
    const user = storage.getUsers().find((u) => u.id === userId);
    if (!user) return null;
    const xp = user.xp + amount;
    const level = Math.max(1, Math.floor(xp / 100) + 1);
    const badges = [...user.badges];
    if (level >= 2 && !badges.includes("Level 2")) badges.push("Level 2");
    if (level >= 3 && !badges.includes("Level 3")) badges.push("Level 3");
    return this.update(userId, { xp, level, badges });
  },
};

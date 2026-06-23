import { authApi } from "../../services/authApi";
import type { User, UserStatus } from "../types";

function mapUser(u: import("../../services/authApi").ApiUser): User {
  return {
    id: u.id,
    name: u.nom,
    email: u.email,
    password: "",
    role: u.role === "admin" ? "admin" : u.role === "formateur" ? "formateur" : "etudiant",
    xp: u.xp ?? 0,
    level: u.niveau ?? 1,
    badges: u.badges ?? [],
    status: "active",
  };
}

let cache: User[] = [];

export const usersService = {
  async refresh() {
    const rows = await authApi.listUsers();
    cache = rows.map(mapUser);
    return cache;
  },

  list() {
    return cache;
  },

  async update(_userId: string, patch: Partial<User>) {
    const user = await authApi.updateProfile({
      xp: patch.xp,
      niveau: patch.level,
      badges: patch.badges,
    });
    const mapped = mapUser(user);
    cache = cache.map((u) => (u.id === mapped.id ? mapped : u));
    return mapped;
  },

  async remove(_userId: string) {
    throw new Error("Suppression utilisateur non disponible via API.");
  },

  setTrainerStatus(_userId: string, _status: UserStatus) {
    throw new Error("Validation formateur : à brancher sur l'API.");
  },

  async grantXp(userId: string, amount: number) {
    const me = await authApi.me();
    if (me.id !== userId) return null;
    const xp = (me.xp ?? 0) + amount;
    const level = Math.max(1, Math.floor(xp / 100) + 1);
    const badges = [...(me.badges ?? [])];
    if (level >= 2 && !badges.includes("Level 2")) badges.push("Level 2");
    if (level >= 3 && !badges.includes("Level 3")) badges.push("Level 3");
    const updated = await authApi.updateProfile({ xp, niveau: level, badges });
    return mapUser(updated);
  },
};

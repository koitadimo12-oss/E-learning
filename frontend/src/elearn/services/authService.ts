import { authApi, type ApiUser } from "../../services/authApi";
import type { Role, User } from "../types";

function mapApiUser(u: ApiUser): User {
  return {
    id: u.id,
    name: u.nom,
    email: u.email,
    password: "",
    role: (u.role === "admin" ? "admin" : u.role === "formateur" ? "formateur" : "etudiant") as Role,
    xp: u.xp ?? 0,
    level: u.niveau ?? 1,
    badges: u.badges ?? [],
    status: "active",
  };
}

export const authService = {
  async login(email: string, password: string) {
    const res = await authApi.login(email, password);
    const user = mapApiUser(res.user);
    if (user.role === "formateur" && user.status !== "active") {
      throw new Error("Compte formateur en attente de validation admin.");
    }
    return user;
  },

  async registerStudent(name: string, email: string, password: string) {
    const res = await authApi.register({ nom: name, email, motDePasse: password, role: "etudiant" });
    return mapApiUser(res.user);
  },

  async registerTrainer(_name: string, _email: string, _password: string) {
    throw new Error("Inscription formateur : utilisez le formulaire dédié (à brancher sur l'API).");
  },

  logout() {
    authApi.logout();
  },

  async currentUser() {
    if (!authApi) return null;
    try {
      const u = await authApi.me();
      return mapApiUser(u);
    } catch {
      return null;
    }
  },

  requireRole(user: User | null, roles: Role[]) {
    return !!user && roles.includes(user.role);
  },
};

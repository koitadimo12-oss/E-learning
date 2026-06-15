import { storage } from "./storage";
import type { Role, User } from "../types";

function makeId(prefix: string) {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}

export const authService = {
  login(email: string, password: string) {
    const user = storage.getUsers().find((u) => u.email === email && u.password === password);
    if (!user) throw new Error("Identifiants invalides.");
    if (user.role === "formateur" && user.status !== "active") {
      throw new Error("Compte formateur en attente de validation admin.");
    }
    storage.setSession(user);
    return user;
  },

  registerStudent(name: string, email: string, password: string) {
    const users = storage.getUsers();
    if (users.some((u) => u.email === email)) throw new Error("Email deja utilise.");
    const user: User = {
      id: makeId("student"),
      name,
      email,
      password,
      role: "etudiant",
      xp: 10,
      level: 1,
      badges: ["First Login"],
      status: "active",
    };
    storage.setUsers([...users, user]);
    storage.setSession(user);
    return user;
  },

  registerTrainer(name: string, email: string, password: string) {
    const users = storage.getUsers();
    if (users.some((u) => u.email === email)) throw new Error("Email deja utilise.");
    const trainer: User = {
      id: makeId("trainer"),
      name,
      email,
      password,
      role: "formateur",
      xp: 0,
      level: 1,
      badges: [],
      status: "pending",
    };
    storage.setUsers([...users, trainer]);
    return trainer;
  },

  logout() {
    storage.setSession(null);
  },

  currentUser() {
    return storage.getSession();
  },

  requireRole(user: User | null, roles: Role[]) {
    return !!user && roles.includes(user.role);
  },
};

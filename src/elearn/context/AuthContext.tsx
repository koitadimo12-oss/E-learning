import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { authService } from "../services/authService";
import { usersService } from "../services/usersService";
import type { User } from "../types";

type AuthContextValue = {
  user: User | null;
  login: (email: string, password: string) => void;
  registerStudent: (name: string, email: string, password: string) => void;
  registerTrainer: (name: string, email: string, password: string) => void;
  logout: () => void;
  refreshUser: () => void;
  grantXp: (amount: number) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(authService.currentUser());

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      login(email, password) {
        setUser(authService.login(email, password));
      },
      registerStudent(name, email, password) {
        setUser(authService.registerStudent(name, email, password));
      },
      registerTrainer(name, email, password) {
        authService.registerTrainer(name, email, password);
      },
      logout() {
        authService.logout();
        setUser(null);
      },
      refreshUser() {
        setUser(authService.currentUser());
      },
      grantXp(amount) {
        if (!user) return;
        const updated = usersService.grantXp(user.id, amount);
        if (updated) setUser(updated);
      },
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth doit etre utilise dans AuthProvider.");
  return ctx;
}

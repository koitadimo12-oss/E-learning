import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { authService } from "../services/authService";
import { usersService } from "../services/usersService";
import type { User } from "../types";

type AuthContextValue = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  registerStudent: (name: string, email: string, password: string) => Promise<void>;
  registerTrainer: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  grantXp: (amount: number) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    void authService.currentUser().then(setUser);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      async login(email, password) {
        setUser(await authService.login(email, password));
      },
      async registerStudent(name, email, password) {
        setUser(await authService.registerStudent(name, email, password));
      },
      async registerTrainer(name, email, password) {
        await authService.registerTrainer(name, email, password);
      },
      logout() {
        authService.logout();
        setUser(null);
      },
      async refreshUser() {
        setUser(await authService.currentUser());
      },
      async grantXp(amount) {
        if (!user) return;
        const updated = await usersService.grantXp(user.id, amount);
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

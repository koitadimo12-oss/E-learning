import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getThemePref, setThemePref } from "../../services/stockageLocal";
import { useState } from "react";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive ? "bg-blue-600 text-white" : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
  }`;

const items: { to: string; label: string; emoji: string }[] = [
  { to: "/admin/dashboard", label: "Dashboard", emoji: "🏠" },
  { to: "/admin/users", label: "Utilisateurs", emoji: "👥" },
  { to: "/admin/trainers", label: "Formateurs", emoji: "🧑‍🏫" },
  { to: "/admin/courses", label: "Tous les cours", emoji: "📚" },
  { to: "/admin/validation", label: "Validation", emoji: "✔️" },
  { to: "/admin/stats", label: "Statistiques globales", emoji: "📊" },
  { to: "/admin/revenue", label: "Revenus (simulation)", emoji: "💰" },
  { to: "/admin/settings", label: "Paramètres", emoji: "⚙️" },
  { to: "/admin/profil", label: "Profil", emoji: "👤" },
];

export function AdminLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [dark, setDark] = useState(() => getThemePref() === "dark");

  const toggleTheme = () => {
    const next = getThemePref() === "dark" ? "light" : "dark";
    setThemePref(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    setDark(next === "dark");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <aside className="flex w-64 shrink-0 flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-200 p-4 dark:border-slate-800">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Administration</p>
          <p className="truncate font-bold text-slate-900 dark:text-white">{user?.name}</p>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-3">
          {items.map((item) => (
            <NavLink key={item.to} to={item.to} className={linkClass} end={item.to === "/admin/dashboard"}>
              <span aria-hidden>{item.emoji}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="space-y-2 border-t border-slate-200 p-3 dark:border-slate-800">
          <button
            type="button"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700"
            onClick={() => navigate("/")}
          >
            ↩ Retour plateforme
          </button>
          <button
            type="button"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700"
            onClick={toggleTheme}
          >
            {dark ? "☀️ Mode clair" : "🌙 Mode sombre"}
          </button>
          <button type="button" className="w-full rounded-lg bg-rose-600 px-3 py-2 text-sm font-semibold text-white" onClick={handleLogout}>
            Déconnexion
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto p-6">
        <div className="mb-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Console admin</p>
          <p className="font-semibold">Gestion centralisée des utilisateurs, cours, validations et revenus.</p>
        </div>
        <Outlet />
      </main>
    </div>
  );
}

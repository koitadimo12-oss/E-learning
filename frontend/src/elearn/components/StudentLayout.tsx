import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getThemePref, setThemePref } from "../../services/stockageLocal";
import { useState } from "react";

const items: { to: string; label: string; emoji: string }[] = [
  { to: "/dashboard", label: "Dashboard", emoji: "🏠" },
  { to: "/etudiant/parcours", label: "Parcours", emoji: "🎯" },
  { to: "/mes-cours", label: "Mes cours", emoji: "📖" },
  { to: "/mes-quiz", label: "Quiz", emoji: "🧠" },
  { to: "/progression", label: "Progression", emoji: "📈" },
  { to: "/certificats", label: "Certificats", emoji: "🏆" },
  { to: "/etudiant/profil", label: "Profil", emoji: "👤" },
];

const navCls = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition ${
    isActive ? "bg-blue-600 text-white shadow" : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
  }`;

export function StudentLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [dark, setDark] = useState(() => getThemePref() === "dark");

  const toggleTheme = () => {
    const next = getThemePref() === "dark" ? "light" : "dark";
    setThemePref(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    setDark(next === "dark");
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <aside className="flex w-72 shrink-0 flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-200 p-4 dark:border-slate-800">
          <NavLink to="/" className="font-bold text-blue-600 dark:text-blue-400">
            Kaay Niou Diang
          </NavLink>
          <p className="truncate text-sm text-slate-500 dark:text-slate-400">{user?.name}</p>
          <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Espace étudiant</p>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-3">
          {items.map((item) => (
            <NavLink key={item.to} to={item.to} className={navCls} end={item.to === "/dashboard"}>
              <span aria-hidden>{item.emoji}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="space-y-2 border-t border-slate-200 p-3 dark:border-slate-800">
          <button type="button" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700" onClick={toggleTheme}>
            {dark ? "☀️ Mode clair" : "🌙 Mode sombre"}
          </button>
          <button
            type="button"
            className="w-full rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white dark:bg-slate-100 dark:text-slate-900"
            onClick={() => {
              logout();
              navigate("/");
            }}
          >
            Déconnexion
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs uppercase tracking-wider text-slate-500">Session active</p>
            <p className="font-semibold">Bienvenue {user?.name}, prêt pour un nouveau module ?</p>
          </div>
          <Outlet />
        </div>
      </main>
    </div>
  );
}

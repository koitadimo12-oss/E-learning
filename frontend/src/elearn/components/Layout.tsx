import { Link, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getThemePref, setThemePref } from "../../services/stockageLocal";

export function Layout() {
  const { user, logout } = useAuth();
  const [dark, setDark] = useState(() => getThemePref() === "dark");

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleTheme = () => {
    const next = getThemePref() === "dark" ? "light" : "dark";
    setThemePref(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    setDark(next === "dark");
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
      <header className="border-b border-slate-300 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-800">
        <nav className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="font-bold">
              eLearn
            </Link>
            <Link to="/">Accueil</Link>
            <Link to="/courses">Catalogue</Link>
            {user?.role === "etudiant" && <Link to="/dashboard">Dashboard</Link>}
            {user?.role === "formateur" && <Link to="/formateur/dashboard">Espace formateur</Link>}
            {user?.role === "admin" && <Link to="/admin/dashboard">Espace admin</Link>}
          </div>
          <div className="flex items-center gap-2">
            <button className="rounded bg-slate-200 px-3 py-1 dark:bg-slate-700" onClick={toggleTheme}>
              {dark ? "Mode clair" : "Mode sombre"}
            </button>
            {user ? (
              <>
                <span className="text-sm">{user.name}</span>
                <button className="rounded bg-rose-500 px-3 py-1 text-white" onClick={logout}>
                  Deconnexion
                </button>
              </>
            ) : (
              <>
                <Link to="/login">Connexion (e-learning)</Link>
                <Link to="/register">Inscription (e-learning)</Link>
              </>
            )}
          </div>
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}

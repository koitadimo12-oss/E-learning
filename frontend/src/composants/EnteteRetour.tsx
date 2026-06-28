import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getThemePref, setThemePref } from "../services/stockageLocal";

type Props = {
  to: string;
  label?: string;
  titre?: string | React.ReactNode;
  sousTitre?: string;
  themeToggle?: boolean;
};

export default function EnteteRetour(props: Props) {
  const { to, label = "Retour", titre, sousTitre, themeToggle = true } = props;
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    setDarkMode(document.documentElement.classList.contains("dark"));
  }, []);

  const cycleTheme = () => {
    const next = getThemePref() === "dark" ? "light" : "dark";
    setThemePref(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    setDarkMode(next === "dark");
  };

  return (
    <header className="sticky top-0 z-40 flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3 border-b border-gray-200/80 dark:border-slate-700/80 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md">
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={() => navigate(to)}
          className="inline-flex items-center gap-2 shrink-0 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-slate-100 hover:bg-gray-100 dark:hover:bg-slate-800 transition"
        >
          <span aria-hidden>←</span>
          {label}
        </button>
        {(titre || sousTitre) && (
          <div className="min-w-0">
            {titre && <h1 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">{titre}</h1>}
            {sousTitre && <p className="text-xs text-gray-500 dark:text-slate-400 truncate">{sousTitre}</p>}
          </div>
        )}
      </div>
      {themeToggle && (
        <button
          type="button"
          onClick={cycleTheme}
          className="rounded-xl border border-gray-200 dark:border-slate-600 px-3 py-2 text-sm font-medium text-gray-800 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-900 transition"
          aria-label="Basculer le thème"
        >
          {darkMode ? "☀️ Clair" : "🌙 Sombre"}
        </button>
      )}
    </header>
  );
}
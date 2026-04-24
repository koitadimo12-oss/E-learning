import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getThemePref, setThemePref } from "../services/stockageLocal";

type Props = {
  etudiant?: { nom: string } | null;
  onDeconnexion?: () => void;
  /** Barre fixe en haut (accueil) */
  fixe?: boolean;
};

export default function BarreNavigation(props: Props) {
  const { etudiant, onDeconnexion, fixe = false } = props;
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    setDarkMode(document.documentElement.classList.contains("dark"));
  }, []);

  const handleProfileClick = () => {
    if (!etudiant) navigate("/connexion");
    else navigate("/profil");
  };

  const toggleTheme = () => {
    const next = getThemePref() === "dark" ? "light" : "dark";
    setThemePref(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    setDarkMode(next === "dark");
  };

  return (
    <nav
      className={`${
        fixe ? "fixed top-0 left-0 right-0" : "sticky top-0"
      } z-50 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-gray-100 dark:border-slate-800 shadow-sm`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate("/")}
          onKeyDown={(e) => e.key === "Enter" && navigate("/")}
          role="button"
          tabIndex={0}
        >
          <img
            src="/logo2.png"
            alt="Logo Kaay Niou Diang"
            className="w-14 h-14 sm:w-16 sm:h-16 object-contain"
            onError={(e) => {
              const img = e.currentTarget;
              img.style.display = "none";
            }}
          />
          <div>
            <h1 className="font-bold text-lg sm:text-2xl bg-gradient-to-r from-blue-600 to-orange-500 dark:from-blue-400 dark:to-orange-400 bg-clip-text text-transparent">
              Kaay Niou Diang
            </h1>
            <p className="text-[10px] sm:text-xs text-gray-500 dark:text-slate-400 font-medium tracking-wide">Cours · Progression</p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4 justify-between flex-wrap">
          <ul className="hidden sm:flex flex-wrap gap-5 font-medium items-center text-sm text-gray-700 dark:text-slate-300">
            <li className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer" onClick={() => navigate("/")}>
              Accueil
            </li>
            <li className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer" onClick={() => navigate("/cours")}>
              Cours
            </li>
            <li
              className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
              onClick={() => navigate("/#a-propos")}
              aria-label="À propos"
            >
              À propos
            </li>
          </ul>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              className="rounded-xl border border-gray-200 dark:border-slate-600 px-2.5 py-2 text-sm text-gray-800 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-900 transition"
              aria-label="Thème clair ou sombre"
            >
              {darkMode ? "☀️" : "🌙"}
            </button>

            {!etudiant ? (
              <button
                type="button"
                onClick={() => navigate("/connexion")}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer transition font-semibold text-sm"
              >
                Connexion
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => navigate("/tableau-bord")}
                  className="hidden sm:inline text-sm font-semibold text-gray-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Tableau de bord
                </button>
                <button
                  type="button"
                  onClick={handleProfileClick}
                  className="flex items-center gap-2 text-sm hover:text-blue-600 dark:hover:text-blue-400 transition cursor-pointer"
                >
                  <span className="text-gray-800 dark:text-slate-200 font-medium max-w-[120px] truncate">{etudiant.nom}</span>
                  <span
                    className="w-8 h-8 rounded-full bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-600 flex items-center justify-center text-gray-700 dark:text-slate-200 font-bold text-xs"
                    aria-hidden
                  >
                    {etudiant.nom
                      .split(" ")
                      .filter(Boolean)
                      .slice(0, 2)
                      .map((p: string) => p[0])
                      .join("")}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onDeconnexion?.();
                    navigate("/");
                  }}
                  className="bg-gray-900 dark:bg-slate-800 text-white px-3 py-2 rounded-lg hover:bg-gray-800 dark:hover:bg-slate-700 cursor-pointer transition font-semibold text-sm"
                >
                  Déco
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

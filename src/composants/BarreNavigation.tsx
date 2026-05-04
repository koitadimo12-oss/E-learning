import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { getThemePref, setThemePref } from "../services/stockageLocal";
import { FiMenu, FiX, FiMoon, FiSun, FiUser, FiLogOut, FiBookOpen } from "react-icons/fi";

type Props = {
  etudiant?: { nom: string; id: number } | null;
  onDeconnexion?: () => void;
  /** Barre fixe en haut (accueil) */
  fixe?: boolean;
};

export default function BarreNavigation(props: Props) {
  const { etudiant, onDeconnexion, fixe = false } = props;
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setDarkMode(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleTheme = () => {
    const next = getThemePref() === "dark" ? "light" : "dark";
    setThemePref(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    setDarkMode(next === "dark");
  };

  const navLinks = [
    { to: "/", label: "Accueil" },
    { to: "/cours", label: "Cours" },
    { to: "/bibliotheque", label: "Bibliothèque" },
    { to: "/#a-propos", label: "À propos", isScroll: true },
  ];

  const handleScrollTo = (e: React.MouseEvent, to: string) => {
    if (to.startsWith("/#")) {
      e.preventDefault();
      const id = to.split("#")[1];
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        setMobileMenuOpen(false);
      } else {
        navigate(to);
        setMobileMenuOpen(false);
      }
    }
  };

  return (
    <nav
      className={`${
        fixe ? "fixed top-0 left-0 right-0" : "sticky top-0"
      } z-[100] bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-gray-100 dark:border-slate-800 shadow-sm transition-colors duration-300`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 sm:h-20 items-center">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <img
                src="/logo2.png"
                alt="Logo Kaay Niou Diang"
                className="w-12 h-12 sm:w-14 sm:h-14 object-contain transition-transform group-hover:scale-110"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-orange-500 rounded-full blur opacity-0 group-hover:opacity-20 transition" />
            </div>
            <div className="hidden xs:block">
              <h1 className="font-black text-xl sm:text-2xl bg-gradient-to-r from-blue-600 to-orange-500 dark:from-blue-400 dark:to-orange-400 bg-clip-text text-transparent tracking-tight">
                Kaay Niou Diang
              </h1>
              <p className="text-[10px] text-gray-500 dark:text-slate-400 font-bold uppercase tracking-[0.15em] -mt-1">
                E-Learning Platform
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <ul className="flex items-center gap-6">
              {navLinks.map((link) => (
                <li key={link.to}>
                  {link.isScroll ? (
                    <button
                      onClick={(e) => handleScrollTo(e, link.to)}
                      className="py-2 text-sm font-bold text-gray-600 dark:text-slate-300 transition-all hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
                    >
                      {link.label}
                    </button>
                  ) : (
                    <NavLink
                      to={link.to}
                      className={({ isActive }) =>
                        `relative py-2 text-sm font-bold transition-all hover:text-blue-600 dark:hover:text-blue-400 ${
                          isActive 
                            ? "text-blue-600 dark:text-blue-400 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-blue-600 dark:after:bg-blue-400" 
                            : "text-gray-600 dark:text-slate-300"
                        }`
                      }
                    >
                      {link.label}
                    </NavLink>
                  )}
                </li>
              ))}
            </ul>

            <div className="h-6 w-px bg-gray-200 dark:bg-slate-800 mx-2" />

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={toggleTheme}
                className="p-2.5 rounded-xl border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-900 transition-all active:scale-95 shadow-sm"
                title={darkMode ? "Mode clair" : "Mode sombre"}
              >
                {darkMode ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
              </button>

              {!etudiant ? (
                <Link
                  to="/connexion"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl transition-all font-bold text-sm shadow-lg shadow-blue-500/20 active:scale-95 flex items-center gap-2"
                >
                  <FiUser className="w-4 h-4" />
                  Connexion
                </Link>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    to="/tableau-bord"
                    className="flex items-center gap-3 p-1 pr-4 rounded-full bg-slate-100 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 hover:border-blue-300 transition-all"
                  >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-sm shadow-md">
                      {etudiant.nom.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-bold text-gray-700 dark:text-slate-200 hidden lg:block">Tableau de bord</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      onDeconnexion?.();
                      navigate("/");
                    }}
                    className="p-2.5 rounded-xl border border-rose-100 dark:border-rose-900/30 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all"
                    title="Déconnexion"
                  >
                    <FiLogOut className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-gray-200 dark:border-slate-800 text-gray-600 dark:text-slate-300"
            >
              {darkMode ? <FiSun /> : <FiMoon />}
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-slate-900 text-gray-900 dark:text-white"
            >
              {mobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-slate-950 border-b border-gray-100 dark:border-slate-800 animate-in slide-in-from-top duration-300">
          <div className="px-4 py-6 space-y-4">
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.to}>
                  {link.isScroll ? (
                    <button
                      onClick={(e) => handleScrollTo(e, link.to)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-bold text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-900 w-full text-left"
                    >
                      {link.label}
                    </button>
                  ) : (
                    <NavLink
                      to={link.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-xl text-base font-bold transition-all ${
                          isActive
                            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                            : "text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-900"
                        }`
                      }
                    >
                      {link.label === "Bibliothèque" && <FiBookOpen className="w-5 h-5" />}
                      {link.label}
                    </NavLink>
                  )}
                </li>
              ))}
            </ul>

            <div className="pt-4 border-t border-gray-100 dark:border-slate-800">
              {!etudiant ? (
                <Link
                  to="/connexion"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-4 bg-blue-600 text-white rounded-2xl font-black shadow-lg shadow-blue-500/20"
                >
                  <FiUser className="w-5 h-5" />
                  Connexion
                </Link>
              ) : (
                <div className="space-y-3">
                  <Link
                    to="/tableau-bord"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-4 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800"
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                      {etudiant.nom.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">{etudiant.nom}</p>
                      <p className="text-xs text-gray-500">Mon tableau de bord</p>
                    </div>
                  </Link>
                  <button
                    onClick={() => {
                      onDeconnexion?.();
                      setMobileMenuOpen(false);
                      navigate("/");
                    }}
                    className="flex items-center justify-center gap-2 w-full py-4 border border-rose-200 dark:border-rose-900/30 text-rose-600 rounded-2xl font-bold"
                  >
                    <FiLogOut className="w-5 h-5" />
                    Déconnexion
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

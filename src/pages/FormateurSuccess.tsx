import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import EnteteRetour from "../composants/EnteteRetour";
import { estFormateurValide, getSessionFormateur } from "../services/formateurService";

export default function FormateurSuccess() {
  const navigate = useNavigate();
  const f = getSessionFormateur();
  if (!f) return <Navigate to="/connexion-formateur" replace />;
  if (!estFormateurValide(f)) return <Navigate to="/formateur/pending" replace />;

  useEffect(() => {
    const timer = setTimeout(() => navigate("/formateur/dashboard", { replace: true }), 3500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100">
      <EnteteRetour to="/" label="Accueil" titre="Validation compte formateur" sousTitre={f.email} />
      <main className="max-w-3xl mx-auto px-6 py-10">
        <section className="rounded-2xl border border-emerald-200 dark:border-emerald-700 bg-white dark:bg-slate-900 p-8 shadow-sm animate-knd-fade-up">
          <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">🎉 Felicitations !</p>
          <p className="mt-2 text-lg font-semibold">Votre compte formateur a ete valide.</p>
          <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-3 py-1 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
            🔔 Votre compte formateur a ete valide
          </p>

          <div className="mt-6 rounded-xl border border-gray-200 dark:border-slate-700 p-5">
            <p className="font-semibold">👨‍🏫 Vous pouvez maintenant :</p>
            <ul className="mt-2 space-y-1 text-gray-700 dark:text-slate-300">
              <li>- creer des cours</li>
              <li>- ajouter des videos</li>
              <li>- gerer vos etudiants</li>
            </ul>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigate("/formateur/dashboard")}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-colors"
            >
              Acceder a mon espace
            </button>
            <p className="text-sm text-gray-500 dark:text-slate-400 self-center">Redirection automatique en cours...</p>
          </div>
        </section>
      </main>
    </div>
  );
}

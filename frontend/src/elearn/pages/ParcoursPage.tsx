import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type Props = { variant?: "public" | "student" };

export default function ParcoursPage({ variant = "public" }: Props) {
  const { user } = useAuth();
  const isStudent = variant === "student" || user?.role === "etudiant";

  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Parcours d&apos;apprentissage</h1>
      <p className="max-w-2xl text-slate-600 dark:text-slate-300">
        Parcours guidés : suivez les modules dans l&apos;ordre, validez les quiz et débloquez la suite. Les parcours sont liés aux cours du catalogue.
      </p>
      <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-lg font-semibold">Démarrer</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          {isStudent
            ? "Consultez vos cours inscrits depuis « Mes cours » ou le catalogue."
            : "Connectez-vous ou inscrivez-vous pour suivre un parcours et enregistrer votre progression."}
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link to="/courses" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
            Voir le catalogue
          </Link>
          {!isStudent && (
            <>
              <Link to="/login" className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold dark:border-slate-600">
                Connexion
              </Link>
              <Link to="/register" className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold dark:border-slate-600">
                Inscription
              </Link>
            </>
          )}
          {isStudent && (
            <Link to="/mes-cours" className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white dark:bg-slate-200 dark:text-slate-900">
              Mes cours
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

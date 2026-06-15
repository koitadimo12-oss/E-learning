import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import EnteteRetour from "../composants/EnteteRetour";
import { getSessionFormateur, setSessionFormateur } from "../services/formateurService";

export default function FormateurPending() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const f = getSessionFormateur();
  if (!f) return <Navigate to="/connexion-formateur" replace />;

  const isRefused = f.statut === "refuse" || params.get("state") === "refused";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100">
      <EnteteRetour to="/" label="Accueil" titre="Statut compte formateur" sousTitre={f.email} />
      <main className="max-w-3xl mx-auto px-6 py-10 space-y-6">
        <section className="rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-8">
          <p className={`text-2xl font-extrabold ${isRefused ? "text-red-600 dark:text-red-400" : "text-orange-600 dark:text-orange-400"}`}>
            {isRefused ? "❌ Votre demande a ete refusee" : "⏳ Votre compte est en cours de validation"}
          </p>
          <p className="mt-3 text-gray-600 dark:text-slate-400 leading-relaxed">
            {isRefused
              ? "Un administrateur n'a pas valide votre demande pour le moment. Vous pouvez mettre a jour votre dossier puis renvoyer une demande."
              : "Un administrateur examine votre dossier. Vous recevrez l'acces complet des que votre statut passe a accepte."}
          </p>
        </section>

        <div className="flex flex-wrap gap-3">
          {!isRefused && (
            <button
              type="button"
              onClick={() => navigate("/connexion-formateur")}
              className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold"
            >
              Verifier a nouveau
            </button>
          )}
          <button
            type="button"
            onClick={() => navigate("/admin")}
            className="px-5 py-2.5 rounded-xl bg-slate-800 text-white font-semibold"
          >
            Ouvrir admin pour validation
          </button>
          <button
            type="button"
            onClick={() => {
              setSessionFormateur(null);
              navigate("/");
            }}
            className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-slate-600 font-semibold"
          >
            Retour accueil
          </button>
        </div>
        {!isRefused && (
          <p className="text-xs text-gray-500 dark:text-slate-400">
            Compte de demo valide: formateur@demo.com / Demo123!@#
          </p>
        )}
      </main>
    </div>
  );
}

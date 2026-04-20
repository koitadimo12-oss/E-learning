import { Navigate, useNavigate } from "react-router-dom";
import EnteteRetour from "../composants/EnteteRetour";
import { estFormateurValide, getSessionFormateur, scoreClassementFormateur, setSessionFormateur } from "../services/formateurService";

export default function DashboardFormateur() {
  const navigate = useNavigate();
  const f = getSessionFormateur();
  if (!f) return <Navigate to="/connexion-formateur" replace />;
  if (f.statut === "refuse") return <Navigate to="/formateur/pending?state=refused" replace />;
  if (f.statut === "en_attente") return <Navigate to="/formateur/pending" replace />;
  if (!estFormateurValide(f)) return <Navigate to="/connexion-formateur" replace />;

  const score = scoreClassementFormateur(f);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100">
      <EnteteRetour
        to="/"
        label="Accueil"
        titre="Dashboard formateur"
        sousTitre={f.email}
      />

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        <div className="rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6">
          <p className="text-sm text-gray-500 dark:text-slate-400">Statut validation</p>
          <p className="text-2xl font-bold mt-1 capitalize">{f.statut.replace("_", " ")}</p>
          <p className="mt-3 inline-flex items-center rounded-full bg-emerald-100 dark:bg-emerald-900/40 px-3 py-1 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
            👨‍🏫 Formateur verifie
          </p>
          <p className="text-sm text-gray-600 dark:text-slate-400 mt-2">
            Vous pouvez maintenant publier des cours, ajouter des videos et suivre vos etudiants.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6">
            <h2 className="font-bold text-lg">Score classement</h2>
            <p className="text-4xl font-extrabold text-blue-600 dark:text-blue-400 mt-2 tabular-nums">{Math.round(score)}</p>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-2">
              Basé sur cours publiés, étudiants, notes, taux de réussite aux quiz et likes.
            </p>
          </div>
          <div className="rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 space-y-2 text-sm">
            <p>
              <span className="font-semibold">Spécialité :</span> {f.specialite}
            </p>
            <p>
              <span className="font-semibold">Expérience :</span> {f.experience}
            </p>
            <p>
              <span className="font-semibold">Portfolio :</span> {f.portfolio}
            </p>
            <p>
              <span className="font-semibold">LinkedIn :</span> {f.linkedin}
            </p>
            <p>
              <span className="font-semibold">GitHub :</span> {f.github}
            </p>
            <p>
              <span className="font-semibold">CV :</span> {f.cvFileName ?? "Non fourni"}
            </p>
            <p>
              <span className="font-semibold">Preuve :</span> {f.preuve}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-dashed border-gray-300 dark:border-slate-600 p-6 text-sm text-gray-600 dark:text-slate-400">
          <p className="font-semibold text-gray-900 dark:text-white">Actions rapides (démo)</p>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>Créer un cours avec vidéos YouTube et quiz</li>
            <li>Voir les statistiques d’engagement des apprenants</li>
            <li>Répondre aux commentaires sur vos parcours</li>
          </ul>
        </div>

        <button
          type="button"
          onClick={() => {
            setSessionFormateur(null);
            navigate("/");
          }}
          className="px-5 py-2.5 rounded-xl bg-gray-900 dark:bg-slate-800 text-white font-semibold"
        >
          Déconnexion formateur
        </button>
      </main>
    </div>
  );
}

import BarreNavigation from "../composants/BarreNavigation";
import PiedPage from "../composants/PiedPage";
import { scoreClassementFormateur, listeFormateurs } from "../services/formateurService";
import { listeEtudiants } from "../services/etudiantService";
import type { Etudiant } from "../services/etudiantService";

type Props = { etudiant: Etudiant | null; onDeconnexion: () => void };

export default function Classements(props: Props) {
  const { etudiant, onDeconnexion } = props;
  const etus = [...listeEtudiants()].sort((a, b) => (b.points ?? 0) - (a.points ?? 0));
  const forms = [...listeFormateurs()]
    .filter((f) => f.statut === "accepte")
    .sort((a, b) => scoreClassementFormateur(b) - scoreClassementFormateur(a));
  const ecoles = Object.entries(
    etus.reduce<Record<string, number>>((acc, e) => {
      acc[e.ecoleCanonique] = (acc[e.ecoleCanonique] ?? 0) + (e.points ?? 0);
      return acc;
    }, {})
  )
    .map(([label, score]) => ({ ecoleId: label.toLowerCase(), label, score }))
    .sort((a, b) => b.score - a.score);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100">
      <BarreNavigation etudiant={etudiant} onDeconnexion={onDeconnexion} />

      <section className="max-w-5xl mx-auto px-6 py-10 space-y-12">
        <div>
          <h1 className="text-3xl font-bold">Classements</h1>
          <p className="mt-2 text-gray-600 dark:text-slate-400">Étudiants, formateurs et écoles — données réelles locales.</p>
        </div>

        <div className="rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6">
          <h2 className="text-xl font-bold">Étudiants</h2>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Points, streak, défis</p>
          <ol className="mt-4 space-y-2">
            {etus.slice(0, 12).map((e, i) => (
              <li key={e.id} className="flex justify-between gap-4 text-sm border-b border-gray-100 dark:border-slate-800 pb-2">
                <span>
                  <span className="font-bold text-blue-600 dark:text-blue-400 mr-2">#{i + 1}</span>
                  {e.nom}
                  <span className="text-gray-500 dark:text-slate-500 ml-2">({e.ecoleCanonique})</span>
                </span>
                <span className="shrink-0 font-mono">
                  {e.points ?? 0} pts · 🔥 {e.streak ?? 0}j
                </span>
              </li>
            ))}
          </ol>
        </div>

        <div className="rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6">
          <h2 className="text-xl font-bold">Formateurs</h2>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
            Score : cours×20 + étudiants×1 + note×10 + taux quiz×30 + likes×1
          </p>
          <ol className="mt-4 space-y-2">
            {forms.length === 0 ? (
              <li className="text-gray-500">Aucun formateur validé pour le moment.</li>
            ) : (
              forms.map((f, i) => (
                <li key={f.id} className="flex justify-between gap-4 text-sm border-b border-gray-100 dark:border-slate-800 pb-2">
                  <span>
                    <span className="font-bold text-orange-600 dark:text-orange-400 mr-2">#{i + 1}</span>
                    {f.nom}
                  </span>
                  <span className="font-mono">{Math.round(scoreClassementFormateur(f))} pts</span>
                </li>
              ))
            )}
          </ol>
        </div>

        <div className="rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6">
          <h2 className="text-xl font-bold">Écoles</h2>
          <ol className="mt-4 space-y-2">
            {ecoles.map((s, i) => (
              <li key={s.ecoleId} className="flex justify-between gap-4 text-sm border-b border-gray-100 dark:border-slate-800 pb-2">
                <span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400 mr-2">#{i + 1}</span>
                  {s.label}
                </span>
                <span className="font-mono">{s.score} pts</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <PiedPage />
    </div>
  );
}

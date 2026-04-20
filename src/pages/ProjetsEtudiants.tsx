import { useMemo, useState } from "react";
import BarreNavigation from "../composants/BarreNavigation";
import PiedPage from "../composants/PiedPage";
import { getLabelEcoleCanonique } from "../services/ecoleService";
import {
  getLikesProjet,
  incrementerLikeProjet,
  PROJETS_ETUDIANTS,
  topProjets,
} from "../services/projetsEtudiantsService";
import type { Etudiant } from "../services/etudiantService";
import { aDejaLike } from "../services/stockageLocal";

type Props = { etudiant: Etudiant | null; onDeconnexion: () => void };

export default function ProjetsEtudiants(props: Props) {
  const { etudiant, onDeconnexion } = props;
  const [tick, setTick] = useState(0);

  const ordered = useMemo(() => {
    void tick;
    return topProjets();
  }, [tick]);

  const like = (id: string) => {
    if (!etudiant) return;
    incrementerLikeProjet(id, etudiant.id);
    setTick((t) => t + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100">
      <BarreNavigation etudiant={etudiant} onDeconnexion={onDeconnexion} />

      <section className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold">Cours & projets étudiants (UGC)</h1>
        <p className="mt-2 text-gray-600 dark:text-slate-400">
          Projets partagés par la communauté. Chaque étudiant peut liker une seule fois un projet.
        </p>

        <div className="mt-10 space-y-10">
          {ordered.map((p, index) => (
            <article
              key={p.id}
              className="rounded-2xl overflow-hidden border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm"
            >
              <div className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  {index === 0 && (
                    <span className="inline-block text-xs font-bold text-orange-600 dark:text-orange-400 mb-1">Top projet</span>
                  )}
                  <h2 className="text-xl font-bold">{p.titre}</h2>
                  <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
                    {p.auteur} · {getLabelEcoleCanonique(p.ecoleId)} · {p.stack}
                  </p>
                </div>
                <button
                  type="button"
                  disabled={!etudiant || aDejaLike(etudiant.id, "projet", p.id)}
                  onClick={() => like(p.id)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 font-semibold border border-red-100 dark:border-red-900 disabled:opacity-50"
                >
                  ❤️ Like · {getLikesProjet(p.id)}
                </button>
              </div>
              <div className="aspect-video bg-black">
                <iframe title={p.titre} src={p.youtubeEmbed} className="w-full h-full" allowFullScreen />
              </div>
            </article>
          ))}
        </div>

        <p className="mt-10 text-sm text-gray-500 dark:text-slate-500">
          Projets disponibles : {PROJETS_ETUDIANTS.length} entrées dans le catalogue.
        </p>
      </section>

      <PiedPage />
    </div>
  );
}

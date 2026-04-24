import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { listeCours, type Cours } from "../services/coursService";
import type { Etudiant } from "../services/etudiantService";

type CoursSuivi = Etudiant["coursSuivis"][number];
import BarreNavigation from "../composants/BarreNavigation";
import BarreProgression from "../composants/BarreProgression";
import CarteCours from "../composants/CarteCours";
import PiedPage from "../composants/PiedPage";

export default function Profil(props: any) {
  const { etudiant, onDeconnexion } = props;
  const navigate = useNavigate();

  const coursEtudiant = useMemo((): Cours[] => {
    return etudiant.coursSuivis
      .map((cs: CoursSuivi) => {
        const c = listeCours.find((c) => c.id === cs.idCours);
        if (!c) return null;
        return { ...c, progression: cs.progression };
      })
      .filter(Boolean) as Cours[];
  }, [etudiant]);

  const moyenne = Math.round(
    etudiant.coursSuivis.reduce((acc: number, cs: CoursSuivi) => acc + cs.progression, 0) / Math.max(1, listeCours.length)
  );
  const coursTermines = etudiant.coursSuivis.filter((cs: CoursSuivi) => cs.progression >= 100).length;
  const parcoursActifs = etudiant.coursSuivis.filter((cs: CoursSuivi) => cs.progression > 0 && cs.progression < 100).length;
  const totalBadges = (etudiant.badges ?? []).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-50 dark:from-slate-900 dark:to-slate-950">
      <BarreNavigation etudiant={etudiant} onDeconnexion={onDeconnexion} />

      <section className="max-w-6xl mx-auto px-6 py-12 md:py-16">
        <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-8 md:p-10 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] font-bold text-blue-600 dark:text-blue-300">Espace étudiant</p>
              <h2 className="mt-3 text-3xl md:text-4xl font-black text-gray-900 dark:text-white">Profil magnifique & productif</h2>
              <p className="mt-3 text-gray-700 dark:text-slate-300 max-w-2xl">
                Un profil clair avec vos statistiques de progression, vos badges et des accès rapides vers vos actions clés.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate("/tableau-bord")}
              className="px-6 py-3 rounded-2xl bg-gray-900 text-white dark:bg-white dark:text-slate-900 font-bold hover:opacity-90 transition"
            >
              Retour au tableau de bord
            </button>
          </div>
        </div>

        <div className="mt-8 grid md:grid-cols-4 gap-4">
          {[
            { label: "Progression moyenne", value: `${moyenne}%`, helper: `Sur ${listeCours.length} cours` },
            { label: "Cours terminés", value: `${coursTermines}`, helper: "Objectifs validés" },
            { label: "Parcours actifs", value: `${parcoursActifs}`, helper: "En cours actuellement" },
            { label: "Badges obtenus", value: `${totalBadges}`, helper: "Récompenses gagnées" },
          ].map((card) => (
            <article
              key={card.label}
              className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-md"
            >
              <p className="text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">{card.label}</p>
              <p className="mt-2 text-3xl font-black text-slate-900 dark:text-white">{card.value}</p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{card.helper}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 grid lg:grid-cols-[1.15fr_0.85fr] gap-6">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-md">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Informations personnelles</h3>
            <div className="mt-5 grid sm:grid-cols-2 gap-4 text-gray-700 dark:text-slate-300">
              <p>
                <span className="font-semibold text-gray-900 dark:text-white">Nom :</span> {etudiant.nom}
              </p>
              <p>
                <span className="font-semibold text-gray-900 dark:text-white">Email :</span> {etudiant.email}
              </p>
              <p>
                <span className="font-semibold text-gray-900 dark:text-white">Niveau :</span> {etudiant.niveauEtude}
              </p>
              <p>
                <span className="font-semibold text-gray-900 dark:text-white">Points :</span> {etudiant.points ?? 0}
              </p>
              <p>
                <span className="font-semibold text-gray-900 dark:text-white">Streak :</span> 🔥 {etudiant.streak ?? 0} jours
              </p>
            </div>
            <div className="pt-5">
              <span className="font-semibold text-gray-900 dark:text-white">Badges :</span>{" "}
              {(etudiant.badges ?? []).length ? (
                <span className="inline-flex flex-wrap gap-2 mt-2">
                  {(etudiant.badges ?? []).map((b: string) => (
                    <span
                      key={b}
                      className="px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-900/40 text-orange-800 dark:text-orange-200 text-xs font-semibold"
                    >
                      {b}
                    </span>
                  ))}
                </span>
              ) : (
                <span className="text-gray-500">Aucun pour le moment</span>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-md">
            <p className="text-sm text-gray-500 dark:text-slate-400 font-semibold uppercase tracking-wide">Progression moyenne</p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-4xl font-bold text-blue-700 dark:text-blue-400 tabular-nums">{moyenne}%</span>
              <span className="text-gray-500 text-sm dark:text-slate-400">sur {listeCours.length} cours</span>
            </div>
            <div className="mt-4">
              <BarreProgression progression={moyenne} />
            </div>
            <div className="mt-6 space-y-2">
              <button
                type="button"
                onClick={() => navigate("/cours")}
                className="w-full py-3 rounded-xl bg-orange-500 text-white font-semibold hover:bg-orange-400 transition"
              >
                Continuer mon apprentissage
              </button>
              <button
                type="button"
                onClick={() => navigate("/favoris")}
                className="w-full py-3 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                Voir mes favoris
              </button>
            </div>
          </div>
        </div>

        <h3 className="text-2xl font-bold mt-12 mb-6 text-gray-900 dark:text-white">Mes cours suivis</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {coursEtudiant.length > 0 ? (
            coursEtudiant.map((c) => (
              <CarteCours key={c.id} cours={c} onVoirCours={(id: number) => navigate(`/cours/${id}`)} />
            ))
          ) : (
            <p className="text-gray-600 col-span-full bg-white rounded-2xl border border-dashed border-gray-200 p-8 text-center">
              Vous n&apos;avez pas encore commencé de cours.{" "}
              <button
                type="button"
                onClick={() => navigate("/cours")}
                className="text-blue-600 font-semibold hover:underline"
              >
                Explorer le catalogue
              </button>
            </p>
          )}
        </div>
      </section>

      <PiedPage />
    </div>
  );
}

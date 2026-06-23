import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCoursCache, chargerCours } from "../services/coursApi";
import type { Cours } from "../services/coursService";
import type { Etudiant } from "../services/etudiantService";
import { genererCertificatPdf } from "../services/certificatService";
import { getParcoursMeta } from "../services/parcoursService";

type CoursSuivi = Etudiant["coursSuivis"][number];
import BarreNavigation from "../composants/BarreNavigation";
import BarreProgression from "../composants/BarreProgression";
import CarteCours from "../composants/CarteCours";
import PiedPage from "../composants/PiedPage";

export default function Profil(props: any) {
  const { etudiant, onDeconnexion } = props;
  const navigate = useNavigate();
  const [listeCours, setListeCours] = useState<Cours[]>(() => getCoursCache());

  useEffect(() => {
    chargerCours().then(setListeCours);
  }, []);

  const coursEtudiant = useMemo((): Cours[] => {
    return etudiant.coursSuivis
      .map((cs: CoursSuivi) => {
        const c = listeCours.find((c) => c.id === cs.idCours);
        if (!c) return null;
        return { ...c, progression: cs.progression };
      })
      .filter(Boolean) as Cours[];
  }, [etudiant, listeCours]);

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
        <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-8 md:p-10 shadow-xl animate-knd-fade-up">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div>
              <h2 className="mt-3 text-3xl md:text-4xl font-black text-gray-900 dark:text-white">Mon profil étudiant</h2>
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
              className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-md hover:-translate-y-1 transition"
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

        <div className="mt-8 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-md">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Certificats</h3>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Les certificats sont disponibles apres validation du parcours complet et du projet final.
          </p>
          <div className="mt-4 space-y-3">
            {etudiant.projetParcoursValide && etudiant.parcoursGuideChoisi && (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/30 p-4">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">
                    {getParcoursMeta(etudiant.parcoursGuideChoisi)?.titre ?? "Parcours guide"}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-300">Certificat global de parcours disponible.</p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    genererCertificatPdf(
                      etudiant.nom,
                      getParcoursMeta(etudiant.parcoursGuideChoisi)?.titre ?? "Parcours guide",
                      etudiant.dateValidationParcours ?? new Date().toISOString()
                    )
                  }
                  className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
                >
                  Telecharger certificat parcours
                </button>
              </div>
            )}

            {coursEtudiant
              .filter((cours) => {
                const suivi = etudiant.coursSuivis.find((cs: CoursSuivi) => cs.idCours === cours.id);
                return (suivi?.progression ?? 0) >= 100;
              })
              .map((cours) => {
                const suivi = etudiant.coursSuivis.find((cs: CoursSuivi) => cs.idCours === cours.id);
                const valide = suivi?.projetFinalValide === true;
                return (
                  <div
                    key={`cert-${cours.id}`}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 p-4"
                  >
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-slate-100">{cours.titre}</p>
                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        {valide ? "Projet final valide." : "Projet final non valide."}
                      </p>
                    </div>
                    <button
                      type="button"
                      disabled={!valide}
                      onClick={() =>
                        genererCertificatPdf(
                          etudiant.nom,
                          cours.titre,
                          suivi?.dateValidationProjet ?? new Date().toISOString()
                        )
                      }
                      className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Telecharger PDF
                    </button>
                  </div>
                );
              })}
            {coursEtudiant.filter((cours) => {
              const suivi = etudiant.coursSuivis.find((cs: CoursSuivi) => cs.idCours === cours.id);
              return (suivi?.progression ?? 0) >= 100;
            }).length === 0 && (
              <p className="text-sm text-slate-700 dark:text-slate-300">Aucun certificat disponible pour le moment.</p>
            )}
          </div>
        </div>

        <h3 className="text-2xl font-bold mt-12 mb-6 text-gray-900 dark:text-white">Mes cours suivis</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {coursEtudiant.length > 0 ? (
            coursEtudiant.map((c) => (
              <CarteCours key={c.id} cours={c} onVoirCours={(id: number) => navigate(`/cours/${id}`)} />
            ))
          ) : (
            <p className="text-gray-700 dark:text-slate-100 col-span-full bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-gray-200 dark:border-slate-700 p-8 text-center font-medium">
              Vous n&apos;avez pas encore commencé de cours.{" "}
              <button
                type="button"
                onClick={() => navigate("/cours")}
                className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
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

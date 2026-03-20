import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import type { Etudiant } from "../services/etudiantService";
import { listeCours, type Cours } from "../services/coursService";
import BarreNavigation from "../composants/BarreNavigation";
import BarreProgression from "../composants/BarreProgression";
import PiedPage from "../composants/PiedPage";

export default function TableauBord({
  etudiant,
  onDeconnexion,
}: {
  etudiant: Etudiant;
  onDeconnexion: () => void;
}) {
  const navigate = useNavigate();

  const coursSuivis = useMemo((): Cours[] => {
    return etudiant.coursSuivis
      .map((cs) => {
        const c = listeCours.find((x) => x.id === cs.idCours);
        if (!c) return null;
        return { ...c, progression: cs.progression };
      })
      .filter(Boolean) as Cours[];
  }, [etudiant]);

  const suivisIds = useMemo(() => new Set(etudiant.coursSuivis.map((cs) => cs.idCours)), [etudiant]);

  const nonCommences = useMemo((): Cours[] => {
    return listeCours.filter((c) => !suivisIds.has(c.id));
  }, [suivisIds]);

  const recommendations = useMemo((): Array<{ cours: Cours; progression: number }> => {
    const low = etudiant.coursSuivis
      .filter((cs) => cs.progression < 40)
      .map((cs) => {
        const c = listeCours.find((x) => x.id === cs.idCours);
        return c ? { cours: c, progression: cs.progression } : null;
      })
      .filter(Boolean) as Array<{ cours: Cours; progression: number }>;

    const notStarted = nonCommences.slice(0, 3).map((c) => ({ cours: c, progression: 0 }));

    // On évite les doublons par id
    const seen = new Set<number>();
    const pick: Array<{ cours: Cours; progression: number }> = [];

    low.concat(notStarted).forEach((r) => {
      if (seen.has(r.cours.id)) return;
      seen.add(r.cours.id);
      pick.push(r);
    });

    return pick.slice(0, 4);
  }, [etudiant, nonCommences]);

  const totalCoursSuivis = etudiant.coursSuivis.length;
  const moyenne =
    totalCoursSuivis > 0
      ? Math.round(
          etudiant.coursSuivis.reduce((acc, cs) => acc + cs.progression, 0) / totalCoursSuivis
        )
      : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white">
      <BarreNavigation etudiant={etudiant} onDeconnexion={onDeconnexion} />

      <section className="max-w-6xl mx-auto px-6 md:px-10 py-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Bonjour, {etudiant.nom}</h1>
            <p className="text-gray-600 mt-2 max-w-xl">
              Voici votre tableau de bord : progression, recommandations et historique.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 w-full md:w-80">
            <p className="text-sm text-gray-500 font-semibold">Progression moyenne</p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-4xl font-bold text-blue-700">{moyenne}%</span>
              <span className="text-gray-500">sur {totalCoursSuivis} cours</span>
            </div>
            <div className="mt-4">
              <BarreProgression progression={moyenne} />
            </div>
            <button
              type="button"
              onClick={() => navigate("/profil")}
              className="mt-4 w-full bg-gray-900 text-white py-3 rounded-xl hover:bg-gray-800 transition font-semibold"
            >
              Voir mon profil
            </button>
          </div>
        </div>

        <div className="mt-12 grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6">Progression des cours</h2>

            {coursSuivis.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {coursSuivis.map((c) => (
                  <div key={c.id} className="bg-white rounded-xl shadow p-6">
                    <div className="flex items-center gap-4">
                      <img src={c.image} alt={c.titre} className="w-16 h-16 object-cover rounded-lg" />
                      <div>
                        <h3 className="font-bold">{c.titre}</h3>
                        <p className="text-sm text-gray-500">{c.instructeur}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <BarreProgression progression={c.progression ?? 0} />
                    </div>
                    <button
                      onClick={() => navigate(`/cours/${c.id}`)}
                      className="mt-4 w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition"
                    >
                      Continuer
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow p-8">
                <p className="text-gray-700 font-semibold">
                  Vous n’avez encore suivi aucun cours. Lancez votre premier apprentissage !
                </p>
                <button
                  onClick={() => navigate("/cours")}
                  className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Explorer les cours
                </button>
              </div>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-6">Recommandations</h2>

            {recommendations.length > 0 ? (
              <div className="space-y-4">
                {recommendations.map(({ cours, progression }) => (
                  <div key={cours.id} className="bg-white rounded-xl shadow p-6">
                    <div className="flex items-center gap-4">
                      <img
                        src={cours.image}
                        alt={cours.titre}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div>
                        <h3 className="font-bold">{cours.titre}</h3>
                        <p className="text-sm text-gray-500">{cours.instructeur}</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <BarreProgression progression={progression} />
                    </div>
                    <button
                      onClick={() => navigate(`/cours/${cours.id}`)}
                      className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                      Ouvrir le cours
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 bg-white rounded-xl shadow p-6">
                Rien à recommander pour le moment. Continuez comme ça !
              </p>
            )}
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Historique des cours</h2>

          {coursSuivis.length > 0 ? (
            <div className="bg-white rounded-xl shadow overflow-hidden">
              <div className="grid grid-cols-5 gap-4 bg-gray-50 px-6 py-3 text-sm font-semibold text-gray-700">
                <div>Nom</div>
                <div>Instructeur</div>
                <div className="col-span-2">Progression</div>
                <div>Action</div>
              </div>
              <div className="divide-y">
                {coursSuivis.map((c) => (
                  <div key={c.id} className="px-6 py-4 grid grid-cols-5 gap-4 items-center">
                    <div className="font-medium">{c.titre}</div>
                    <div className="text-gray-600 text-sm">{c.instructeur}</div>
                    <div className="col-span-2">
                      <BarreProgression progression={c.progression ?? 0} />
                    </div>
                    <div className="text-right">
                      <button
                        onClick={() => navigate(`/cours/${c.id}`)}
                        className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
                      >
                        Voir
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow p-8 text-gray-700 font-semibold">
              Votre historique apparaîtra ici après le quiz.
            </div>
          )}
        </div>
      </section>

      <PiedPage />
    </div>
  );
}


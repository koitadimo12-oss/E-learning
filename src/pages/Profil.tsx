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

  const moyenne =
    etudiant.coursSuivis.length > 0
      ? Math.round(
          etudiant.coursSuivis.reduce((acc: number, cs: CoursSuivi) => acc + cs.progression, 0) /
            etudiant.coursSuivis.length
        )
      : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-50">
      <BarreNavigation etudiant={etudiant} onDeconnexion={onDeconnexion} />

      <section className="max-w-6xl mx-auto px-6 py-12 md:py-16">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
          <div className="flex-1">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Profil étudiant</h2>
            <div className="mt-6 space-y-2 text-gray-700">
              <p>
                <span className="font-semibold text-gray-900">Nom :</span> {etudiant.nom}
              </p>
              <p>
                <span className="font-semibold text-gray-900">Email :</span> {etudiant.email}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 w-full md:w-96">
            <p className="text-sm text-gray-500 font-semibold uppercase tracking-wide">Progression moyenne</p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-4xl font-bold text-blue-700 tabular-nums">{moyenne}%</span>
              <span className="text-gray-500 text-sm">sur {etudiant.coursSuivis.length} cours</span>
            </div>
            <div className="mt-4">
              <BarreProgression progression={moyenne} />
            </div>
            <button
              type="button"
              onClick={() => navigate("/tableau-bord")}
              className="mt-5 w-full bg-gray-900 text-white py-3 rounded-xl hover:bg-gray-800 transition font-semibold shadow-md"
            >
              Ouvrir le tableau de bord
            </button>
          </div>
        </div>

        <h3 className="text-2xl font-bold mt-12 mb-6 text-gray-900">Mes cours suivis</h3>
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

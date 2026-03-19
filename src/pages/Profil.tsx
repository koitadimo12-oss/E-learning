import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import type { Etudiant } from "../services/etudiantService";
import { listeCours, type Cours } from "../services/coursService";
import BarreNavigation from "../composants/BarreNavigation";
import BarreProgression from "../composants/BarreProgression";
import CarteCours from "../composants/CarteCours";

export default function Profil({
  etudiant,
  onDeconnexion,
}: {
  etudiant: Etudiant;
  onDeconnexion: () => void;
}) {
  const navigate = useNavigate();

  const coursEtudiant = useMemo((): Cours[] => {
    return etudiant.coursSuivis
      .map((cs) => {
        const c = listeCours.find((c) => c.id === cs.idCours);
        if (!c) return null;
        return { ...c, progression: cs.progression };
      })
      .filter(Boolean) as Cours[];
  }, [etudiant]);

  const moyenne =
    etudiant.coursSuivis.length > 0
      ? Math.round(
          etudiant.coursSuivis.reduce((acc, cs) => acc + cs.progression, 0) /
            etudiant.coursSuivis.length
        )
      : 0;

  return (
    <div className="min-h-screen bg-gray-100">
      <BarreNavigation etudiant={etudiant} onDeconnexion={onDeconnexion} />
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div>
            <h2 className="text-3xl font-bold">Profil étudiant</h2>
            <p className="text-gray-600 mt-2">Nom : {etudiant.nom}</p>
            <p className="text-gray-600">Email : {etudiant.email}</p>
          </div>

          <div className="bg-white rounded-xl shadow p-6 w-full md:w-80">
            <p className="text-sm text-gray-500 font-semibold">Progression moyenne</p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-4xl font-bold text-blue-700">{moyenne}%</span>
              <span className="text-gray-500">
                sur {etudiant.coursSuivis.length} cours
              </span>
            </div>
            <div className="mt-4">
              <BarreProgression progression={moyenne} />
            </div>
            <button
              onClick={() => navigate("/tableau-bord")}
              className="mt-4 w-full bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-800 transition"
            >
              Ouvrir le tableau de bord
            </button>
          </div>
        </div>

        <h3 className="text-2xl mt-10 mb-4">Mes cours suivis</h3>
        <div className="grid md:grid-cols-4 gap-6">
          {coursEtudiant.length > 0 ? coursEtudiant.map(c =>
            <CarteCours key={c.id} cours={c} onVoirCours={() => navigate(`/cours/${c.id}`)} />
          ) : <p>Vous n'avez pas encore commencé de cours.</p>}
        </div>
      </section>
    </div>
  );
}

import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import BarreNavigation from "../composants/BarreNavigation";
import PiedPage from "../composants/PiedPage";
import CarteCours from "../composants/CarteCours";
import { listeCours } from "../services/coursService";
import { getFavorisCoursIds } from "../services/stockageLocal";
import type { Etudiant } from "../services/etudiantService";

type Props = { etudiant: Etudiant | null; onDeconnexion: () => void };

export default function Favoris(props: Props) {
  const { etudiant, onDeconnexion } = props;
  const navigate = useNavigate();
  const ids = getFavorisCoursIds();

  const cours = useMemo(() => {
    return listeCours
      .filter((c) => ids.includes(c.id))
      .map((c) => {
        const suivi = etudiant?.coursSuivis.find((s) => s.idCours === c.id);
        return { ...c, progression: suivi?.progression ?? 0 };
      });
  }, [ids, etudiant]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100">
      <BarreNavigation etudiant={etudiant} onDeconnexion={onDeconnexion} />
      <section className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold">Mes favoris</h1>
        <p className="text-gray-600 dark:text-slate-400 mt-2">Cours enregistrés sur cet appareil.</p>
        {cours.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-gray-300 dark:border-slate-600 p-10 text-center">
            <p>Aucun favori pour le moment.</p>
            <button
              type="button"
              onClick={() => navigate("/cours")}
              className="mt-4 px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold"
            >
              Explorer les cours
            </button>
          </div>
        ) : (
          <div className="mt-10 grid md:grid-cols-2 gap-6">
            {cours.map((c) => (
              <CarteCours key={c.id} cours={c} onVoirCours={(id: number) => navigate(`/cours/${id}`)} />
            ))}
          </div>
        )}
      </section>
      <PiedPage />
    </div>
  );
}

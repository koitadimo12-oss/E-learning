import { useNavigate } from "react-router-dom";
import BarreNavigation from "../composants/BarreNavigation";
import PiedPage from "../composants/PiedPage";
import CarteCours from "../composants/CarteCours";
import { listeCours, type Cours } from "../services/coursService";
import type { Etudiant } from "../services/etudiantService";

export default function ListeCours({
  etudiant,
  onDeconnexion,
}: {
  etudiant: Etudiant | null;
  onDeconnexion: () => void;
}) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100">
      <BarreNavigation etudiant={etudiant} onDeconnexion={onDeconnexion} />

      <section className="max-w-6xl mx-auto px-6 md:px-10 py-16">
        <h1 className="text-4xl font-bold mb-10 text-center">Tous les cours</h1>

        <div className="grid md:grid-cols-4 gap-6">
          {listeCours.map((cours: Cours) => (
            <CarteCours
              key={cours.id}
              cours={cours}
              onVoirCours={() => navigate(`/cours/${cours.id}`)}
            />
          ))}
        </div>
      </section>

      <PiedPage />
    </div>
  );
}

import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import BarreNavigation from "../composants/BarreNavigation";
import PiedPage from "../composants/PiedPage";
import CarteCours from "../composants/CarteCours";
import BarreRecherche from "../composants/BarreRecherche";
import { listeCours } from "../services/coursService";
import type { Etudiant } from "../services/etudiantService";

interface Props {
  etudiant: Etudiant | null;
  onDeconnexion: () => void;
}

export default function PageCours({ etudiant, onDeconnexion }: Props) {
  const navigate = useNavigate();
  const [recherche, setRecherche] = useState("");

  const coursFiltres = useMemo(
    () => listeCours.filter(c => c.titre.toLowerCase().includes(recherche.toLowerCase())),
    [recherche]
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <BarreNavigation etudiant={etudiant} onDeconnexion={onDeconnexion} />

      <section className="max-w-6xl mx-auto px-6 md:px-10 py-16">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <h1 className="text-3xl font-bold mb-2 text-gray-900">Tous les cours</h1>
          <div className="md:w-80">
            <BarreRecherche valeur={recherche} onChange={setRecherche} />
          </div>
        </div>

        <div className="mt-10 grid md:grid-cols-3 gap-6">
          {coursFiltres.map(cours => (
            <CarteCours key={cours.id} cours={cours} onVoirCours={(id) => navigate(`/cours/${id}`)} />
          ))}
        </div>
      </section>

      <PiedPage />
    </div>
  );
}

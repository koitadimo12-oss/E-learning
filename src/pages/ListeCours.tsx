import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import BarreNavigation from "../composants/BarreNavigation";
import PiedPage from "../composants/PiedPage";
import CarteCours from "../composants/CarteCours";
import BarreRecherche from "../composants/BarreRecherche";
import { listeCours } from "../services/coursService";
import type { Etudiant } from "../services/etudiantService";

export default function ListeCours({
  etudiant,
  onDeconnexion,
}: {
  etudiant: Etudiant | null;
  onDeconnexion: () => void;
}) {
  const navigate = useNavigate();
  const [recherche, setRecherche] = useState("");
  const [categorie, setCategorie] = useState("Toutes");
  const [niveau, setNiveau] = useState("Tous");

  const categories = useMemo(
    () => ["Toutes", ...new Set(listeCours.map((c) => c.categorie))],
    []
  );

  const coursFiltres = useMemo(() => {
    const coursAvecProgression = listeCours.map((cours) => {
      const suivi = etudiant?.coursSuivis.find((cs) => cs.idCours === cours.id);
      return { ...cours, progression: suivi?.progression ?? 0 };
    });

    return coursAvecProgression.filter((cours) => {
      const matchRecherche =
        cours.titre.toLowerCase().includes(recherche.toLowerCase()) ||
        cours.description.toLowerCase().includes(recherche.toLowerCase()) ||
        cours.instructeur.toLowerCase().includes(recherche.toLowerCase());
      const matchCategorie = categorie === "Toutes" || cours.categorie === categorie;
      const matchNiveau = niveau === "Tous" || cours.niveau === niveau;
      return matchRecherche && matchCategorie && matchNiveau;
    });
  }, [recherche, categorie, niveau, etudiant]);

  return (
    <div className="min-h-screen bg-gray-100">
      <BarreNavigation etudiant={etudiant} onDeconnexion={onDeconnexion} />

      <section className="max-w-6xl mx-auto px-6 md:px-10 py-16">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold">Catalogue premium</h1>
            <p className="mt-2 text-gray-600">
              Filtrez vos cours par categorie, niveau et recherche.
            </p>
          </div>
          <div className="w-full lg:w-[420px]">
            <BarreRecherche valeur={recherche} onChange={setRecherche} />
          </div>
        </div>

        <div className="mt-6 bg-white rounded-xl p-4 shadow-sm border border-gray-100 grid sm:grid-cols-3 gap-3">
          <select
            value={categorie}
            onChange={(e) => setCategorie(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                Categorie: {cat}
              </option>
            ))}
          </select>
          <select
            value={niveau}
            onChange={(e) => setNiveau(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg"
          >
            <option value="Tous">Niveau: Tous</option>
            <option value="Debutant">Niveau: Debutant</option>
            <option value="Intermediaire">Niveau: Intermediaire</option>
          </select>
          <button
            onClick={() => {
              setRecherche("");
              setCategorie("Toutes");
              setNiveau("Tous");
            }}
            className="px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Reinitialiser
          </button>
        </div>

        <div className="mt-8 grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {coursFiltres.map((cours) => (
            <CarteCours
              key={cours.id}
              cours={cours}
              onVoirCours={() => navigate(`/cours/${cours.id}`)}
            />
          ))}
        </div>

        {coursFiltres.length === 0 && (
          <p className="mt-6 text-center text-gray-500">
            Aucun cours ne correspond aux filtres selectionnes.
          </p>
        )}
      </section>

      <PiedPage />
    </div>
  );
}

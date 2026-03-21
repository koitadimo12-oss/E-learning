import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import BarreNavigation from "../composants/BarreNavigation";
import PiedPage from "../composants/PiedPage";
import CarteCours from "../composants/CarteCours";
import BarreRecherche from "../composants/BarreRecherche";
import { listeCours } from "../services/coursService";
export default function ListeCours(props: any) {
  const { etudiant, onDeconnexion } = props;
  const navigate = useNavigate();
  const [recherche, setRecherche] = useState("");
  const [categorie, setCategorie] = useState("Toutes");

  const categories = useMemo(
    () => ["Toutes", ...new Set(listeCours.map((c) => c.categorie))],
    []
  );

  const coursFiltres = useMemo(() => {
    const coursAvecProgression = listeCours.map((cours) => {
      const suivi = etudiant?.coursSuivis.find((cs: { idCours: number; progression: number }) => cs.idCours === cours.id);
      return { ...cours, progression: suivi?.progression ?? 0 };
    });

    return coursAvecProgression.filter((cours) => {
      const matchRecherche =
        cours.titre.toLowerCase().includes(recherche.toLowerCase()) ||
        cours.description.toLowerCase().includes(recherche.toLowerCase()) ||
        cours.instructeur.toLowerCase().includes(recherche.toLowerCase());
      const matchCategorie = categorie === "Toutes" || cours.categorie === categorie;
      return matchRecherche && matchCategorie;
    });
  }, [recherche, categorie, etudiant]);

  return (
    <div className="min-h-screen bg-gray-50">
      <BarreNavigation etudiant={etudiant} onDeconnexion={onDeconnexion} />

      <section className="bg-white border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-10">
          <h1 className="text-3xl font-bold text-center text-gray-900">Cours</h1>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-[1fr_260px_auto] gap-3 items-center">
            <BarreRecherche valeur={recherche} onChange={setRecherche} />

            <select
              value={categorie}
              onChange={(e) => setCategorie(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-orange-300"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "Toutes" ? "Catégorie" : cat}
                </option>
              ))}
            </select>

            <button
              type="button"
              className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-semibold"
            >
              Filtrer
            </button>
          </div>

          <div className="mt-3 text-right text-sm text-gray-500">
            {coursFiltres.length} cours trouvés
          </div>

          <div className="mt-10 grid md:grid-cols-2 gap-6">
          {coursFiltres.map((cours) => (
            <CarteCours
              key={cours.id}
              cours={cours}
              onVoirCours={(id: number) => navigate(`/cours/${id}`)}
            />
          ))}
          </div>

          {coursFiltres.length === 0 && (
            <p className="mt-10 text-center text-gray-500 font-medium">
              Aucun cours ne correspond à vos filtres.
            </p>
          )}
        </div>
      </section>

      <PiedPage />
    </div>
  );
}

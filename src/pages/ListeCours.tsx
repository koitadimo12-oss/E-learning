import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { listeCours, getCategories } from "../services/coursService";
import CarteCours from "../composants/CarteCours";
import BarreRecherche from "../composants/BarreRecherche";

export default function ListeCours() {
  const [recherche, setRecherche] = useState("");
  const [categorie, setCategorie] = useState("Toutes");
  const navigate = useNavigate();
  const categories = getCategories();

  const coursFiltres = listeCours.filter((c) => {
    const matchRecherche = c.titre.toLowerCase().includes(recherche.toLowerCase());
    const matchCategorie = categorie === "Toutes" || c.categorie === categorie;
    return matchRecherche && matchCategorie;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 p-6">
      <h1 className="text-3xl font-bold text-blue-800 mb-2">Nos Cours</h1>
      <p className="text-orange-500 font-medium mb-6">Trouvez la formation qui vous convient</p>

      <div className="mb-4">
        <BarreRecherche valeur={recherche} onChange={setRecherche} />
      </div>

      <div className="flex gap-2 flex-wrap mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategorie(cat)}
            className={`px-4 py-1 rounded-full text-sm border-2 transition font-medium ${
              categorie === cat
                ? "bg-orange-500 text-white border-orange-500"
                : "bg-white text-blue-700 border-blue-300 hover:border-orange-400 hover:text-orange-500"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {coursFiltres.length === 0 ? (
        <p className="text-gray-500">Aucun cours trouvé.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {coursFiltres.map((cours) => (
            <CarteCours
              key={cours.id}
              cours={cours}
              onClick={(id) => navigate(`/cours/${id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

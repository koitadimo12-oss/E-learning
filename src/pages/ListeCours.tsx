import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { listeCours, getCategories } from "../services/coursService";
import CarteCours from "../composants/CarteCours";
import BarreRecherche from "../composants/BarreRecherche";
import Navbar from "../composants/Navbar";

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
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-500 text-white py-14 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-extrabold mb-2">Apprenez à votre rythme 🚀</h1>
          <p className="text-blue-100 text-lg mb-8">
            Découvrez nos formations et boostez vos compétences dès aujourd'hui.
          </p>
          <div className="max-w-xl">
            <BarreRecherche valeur={recherche} onChange={setRecherche} />
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="flex gap-6 mb-8 text-sm text-gray-500">
          <span className="font-semibold text-blue-800 text-base">{listeCours.length} cours disponibles</span>
        </div>

        {/* Filtres catégories */}
        <div className="flex gap-2 flex-wrap mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategorie(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${
                categorie === cat
                  ? "bg-orange-500 text-white border-orange-500 shadow-sm"
                  : "bg-white text-gray-600 border-gray-200 hover:border-orange-300 hover:text-orange-500"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grille */}
        {coursFiltres.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-5xl mb-4">😕</p>
            <p className="text-lg">Aucun cours trouvé pour "{recherche}"</p>
          </div>
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
    </div>
  );
}

import { useParams, useNavigate } from "react-router-dom";
import { getCours } from "../services/coursService";
import BarreProgression from "../composants/BarreProgression";

export default function PageCours() {
  const { id } = useParams();
  const navigate = useNavigate();
  const cours = getCours(Number(id));

  if (!cours) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <p className="text-gray-500 text-lg">Cours introuvable.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 p-6">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 text-orange-500 hover:text-orange-700 font-medium text-sm transition"
        >
          ← Retour
        </button>

        <img
          src={cours.image}
          alt={cours.titre}
          className="w-full h-56 object-cover rounded-2xl mb-6 border-4 border-orange-200"
        />

        <span className="text-xs bg-orange-100 text-orange-600 px-3 py-1 rounded-full font-medium">
          {cours.categorie}
        </span>

        <h1 className="text-3xl font-bold text-blue-800 mt-3 mb-1">{cours.titre}</h1>
        <p className="text-sm text-orange-500 font-medium mb-1">Instructeur : {cours.instructeur}</p>
        <p className="text-sm text-blue-500 mb-4">Durée : {cours.duree}</p>

        <p className="text-gray-700 mb-6">{cours.description}</p>

        <div className="bg-white rounded-2xl shadow p-4 mb-6 border-l-4 border-blue-500">
          <h2 className="text-lg font-semibold text-blue-800 mb-2">Contenu du cours</h2>
          <p className="text-gray-600 text-sm">{cours.contenu}</p>
        </div>

        <div className="bg-white rounded-2xl shadow p-4 border-l-4 border-orange-400">
          <h2 className="text-lg font-semibold text-blue-800 mb-2">Votre progression</h2>
          <BarreProgression progression={cours.progression} />
        </div>
      </div>
    </div>
  );
}

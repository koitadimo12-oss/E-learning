import type { Cours } from "../services/coursService";
import BarreProgression from "./BarreProgression";

interface Props {
  cours: Cours;
  onVoirCours: (id: number) => void; // on garde l'interface comme demandé
}

export default function CarteCours({ cours, onVoirCours }: Props) {
  return (
    <div
      onClick={() => onVoirCours(cours.id)}
      className="bg-white rounded-xl shadow hover:shadow-lg transition cursor-pointer overflow-hidden border border-gray-100"
    >
      <img src={cours.image} className="w-full h-40 object-cover rounded-t-xl" />

      <div className="p-4">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
            {cours.categorie}
          </span>
          <span className="text-xs text-gray-500">{cours.duree}</span>
        </div>
        <h2 className="font-bold text-lg">{cours.titre}</h2>
        <p className="text-sm text-gray-500 mb-1">{cours.instructeur}</p>
        <p className="text-xs text-gray-500 mb-2">Niveau: {cours.niveau}</p>

        <BarreProgression progression={cours.progression ?? 0} />

        <button
          onClick={(e) => {
            e.stopPropagation();
            onVoirCours(cours.id);
          }}
          className="mt-3 w-full bg-orange-500 text-white py-2 rounded-lg"
        >
          Voir le cours
        </button>
      </div>
    </div>
  );
}

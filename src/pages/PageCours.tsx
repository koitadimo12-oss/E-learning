import type { Cours } from "../services/coursService";
import BarreProgression from "../composants/BarreProgression";

interface Props {
  cours: Cours;
  onVoirCours: (id: number) => void; // on garde l'interface comme demandé
}

export default function CarteCours({ cours, onVoirCours }: Props) {
  return (
    <div
      onClick={() => onVoirCours(cours.id)}
      className="bg-white rounded-xl shadow hover:scale-105 transition cursor-pointer"
    >
      <img src={cours.image} className="w-full h-40 object-cover rounded-t-xl" />

      <div className="p-4">
        <h2 className="font-bold text-lg">{cours.titre}</h2>
        <p className="text-sm text-gray-500 mb-2">{cours.instructeur}</p>

        <BarreProgression progression={cours.progression ?? 0} />

        <button
          onClick={() => onVoirCours(cours.id)}
          className="mt-3 w-full bg-orange-500 text-white py-2 rounded-lg"
        >
          Voir le cours
        </button>
      </div>
    </div>
  );
}

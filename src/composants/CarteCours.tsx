import type { Cours } from "../services/coursService";
import BarreProgression from "./BarreProgression";

interface Props {
  cours: Cours;
  onClick: (id: number) => void;
}

export default function CarteCours({ cours, onClick }: Props) {
  return (
    <div
      className="bg-white rounded-2xl shadow-md p-4 cursor-pointer hover:shadow-xl border border-orange-100 hover:border-orange-300 transition"
      onClick={() => onClick(cours.id)}
    >
      <img
        src={cours.image}
        alt={cours.titre}
        className="w-full h-40 object-cover rounded-xl mb-3"
      />
      <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full font-medium">
        {cours.categorie}
      </span>
      <h3 className="text-lg font-semibold mt-2 mb-1 text-blue-800">{cours.titre}</h3>
      <p className="text-sm text-gray-500 mb-3 line-clamp-2">{cours.description}</p>
      <BarreProgression progression={cours.progression} />
    </div>
  );
}

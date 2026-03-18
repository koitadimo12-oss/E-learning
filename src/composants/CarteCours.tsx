import type { Cours } from "../services/coursService";
import BarreProgression from "./BarreProgression";

interface Props {
  cours: Cours;
  onClick: (id: number) => void;
}

const categorieColors: Record<string, string> = {
  "Développement Web": "bg-blue-100 text-blue-600",
  "Programmation": "bg-purple-100 text-purple-600",
  "Design": "bg-pink-100 text-pink-600",
  "Backend": "bg-green-100 text-green-600",
};

export default function CarteCours({ cours, onClick }: Props) {
  const badgeColor = categorieColors[cours.categorie] ?? "bg-orange-100 text-orange-600";

  return (
    <div
      className="bg-white rounded-2xl shadow hover:shadow-lg border border-gray-100 hover:border-orange-200 transition-all duration-200 cursor-pointer group overflow-hidden"
      onClick={() => onClick(cours.id)}
    >
      <div className="relative overflow-hidden">
        <img
          src={cours.image}
          alt={cours.titre}
          className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <span className={`absolute top-3 left-3 text-xs px-2.5 py-1 rounded-full font-semibold ${badgeColor}`}>
          {cours.categorie}
        </span>
      </div>
      <div className="p-4">
        <h3 className="text-base font-bold text-blue-900 mb-1 group-hover:text-orange-500 transition-colors">
          {cours.titre}
        </h3>
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{cours.description}</p>
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
          <span>🕐 {cours.duree}</span>
          <span>•</span>
          <span>👤 {cours.instructeur}</span>
        </div>
        <BarreProgression progression={cours.progression} />
      </div>
    </div>
  );
}

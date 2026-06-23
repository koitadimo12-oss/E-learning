import { useMemo, useState } from "react";

import type { Cours } from "../services/coursService";
import BarreProgression from "./BarreProgression";

export default function CarteCours(props: any) {
  const { cours, onVoirCours } = props as { cours: Cours; onVoirCours: (id: number) => void };
  const [imgErreur, setImgErreur] = useState(false);
  const tag2 = useMemo(() => {
    const left = cours.titre.split(":")[0]?.trim();
    return left && left !== cours.badge ? left : "";
  }, [cours.badge, cours.titre]);

  const initials = useMemo(() => {
    const parts = cours.instructeur.split(" ").filter(Boolean);
    const a = parts[0]?.[0] ?? "";
    const b = parts[1]?.[0] ?? "";
    return (a + b).toUpperCase();
  }, [cours.instructeur]);

  const showImage = Boolean(cours.image) && !imgErreur;

  return (
    <div
      onClick={() => onVoirCours(cours.id)}
      className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer overflow-hidden border border-slate-100 dark:border-slate-800 flex flex-col group"
    >
      <div className="relative h-28 bg-gradient-to-r from-blue-700 to-indigo-600 overflow-hidden">
        {showImage ? (
          <img
            src={cours.image}
            alt={cours.titre}
            className="w-full h-full object-cover"
            onError={() => setImgErreur(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/90">
            <span className="font-extrabold text-lg">{cours.badge ?? cours.categorie}</span>
          </div>
        )}

        <div className="absolute top-3 left-3 flex items-center gap-2">
          {cours.badge ? (
            <span className="text-xs bg-white/90 text-gray-900 px-3 py-1 rounded-full font-semibold">
              {cours.badge}
            </span>
          ) : (
            <span className="text-xs bg-white/90 text-gray-900 px-3 py-1 rounded-full font-semibold">
              {cours.categorie}
            </span>
          )}
          {tag2 && (
            <span className="hidden sm:inline-flex text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-semibold">
              {tag2}
            </span>
          )}
        </div>

        {cours.nouveau && (
          <div className="absolute top-3 right-3">
            <span className="text-xs bg-orange-500 text-white px-3 py-1 rounded-full font-semibold">
              Nouveau
            </span>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-extrabold text-lg leading-tight text-gray-900 dark:text-slate-100">{cours.titre}</h2>
            <p className="text-sm text-gray-600 dark:text-slate-300 mt-1">{cours.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-3">
          <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-600 flex items-center justify-center text-sm font-bold text-blue-700 dark:text-blue-300">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 dark:text-slate-100 truncate">{cours.instructeur}</p>
            <p className="text-xs text-gray-500 dark:text-slate-300">Niveau: {cours.niveau}</p>
          </div>
        </div>

        <div className="mt-4">
          <BarreProgression progression={cours.progression ?? 0} />
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onVoirCours(cours.id);
          }}
          className="mt-4 w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 py-2.5 rounded-xl group-hover:bg-orange-500 group-hover:text-white transition-colors font-bold border border-slate-200 dark:border-slate-700 group-hover:border-orange-500"
        >
          Visualiser le cours
        </button>
      </div>
    </div>
  );
}

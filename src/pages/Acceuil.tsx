import { useNavigate } from "react-router-dom";

import BarreNavigation from "../composants/BarreNavigation";
import PiedPage from "../composants/PiedPage";
import CarteCours from "../composants/CarteCours";
import { listeCours } from "../services/coursService";
import type { Etudiant } from "../services/etudiantService";

export default function Acceuil({
  etudiant,
  onDeconnexion,
}: {
  etudiant: Etudiant | null;
  onDeconnexion: () => void;
}) {
  const navigate = useNavigate();
  const coursPopulaires = listeCours.slice(0, 4);


  return (
    <div className="min-h-screen bg-gray-50">
      <BarreNavigation etudiant={etudiant} onDeconnexion={onDeconnexion} />

      <section className="relative overflow-hidden">
        <img
          src="/Hero.png"
          alt="Hero Kaay Niou Diang"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 via-blue-700/40 to-transparent" />

        <div className="relative max-w-6xl mx-auto px-6 md:px-10 py-16 md:py-24">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3">
              <img src="/logo2.png" alt="Logo Kaay Niou Diang" className="w-14 h-14 object-contain" />
              <p className="font-semibold text-blue-100">Kaay Niou Diang</p>
            </div>

            <h1 className="mt-4 text-4xl md:text-5xl font-bold text-white leading-tight">
              Plateforme de cours en ligne pour apprendre facilement
            </h1>
            <p className="mt-4 text-lg text-blue-50/95">
              Avant connexion ou inscription, vous pouvez deja consulter nos cours populaires.
              Ensuite connectez-vous pour suivre votre progression et passer les quiz.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate("/cours")}
                className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-xl shadow hover:bg-orange-600 transition"
              >
                Explorer les cours
              </button>
              <button
                onClick={() => (etudiant ? navigate("/profil") : navigate("/connexion"))}
                className="px-6 py-3 bg-white/10 border border-white/30 text-white font-semibold rounded-xl hover:bg-white/15 transition"
              >
                {etudiant ? "Aller au profil" : "Connexion et inscription"}
              </button>
            </div>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white/10 border border-white/20 rounded-xl p-4">
                <p className="text-3xl font-bold text-white">{listeCours.length}</p>
                <p className="text-white/80">Cours disponibles</p>
              </div>
              <div className="bg-white/10 border border-white/20 rounded-xl p-4">
                <p className="text-3xl font-bold text-white">Quiz</p>
                <p className="text-white/80">Pour vérifier vos acquis</p>
              </div>
              <div className="bg-white/10 border border-white/20 rounded-xl p-4">
                <p className="text-3xl font-bold text-white">Suivi</p>
                <p className="text-white/80">Progression des cours</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 max-w-6xl mx-auto px-6 md:px-10">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Cours populaires</h2>
            <p className="mt-2 text-gray-600">
              Les 4 cours principaux visibles avant connexion.
            </p>
          </div>
          <button
            onClick={() => navigate("/cours")}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Voir tous les cours
          </button>
        </div>

        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {coursPopulaires.map((cours) => (
            <CarteCours
              key={cours.id}
              cours={cours}
              onVoirCours={() => navigate(`/cours/${cours.id}`)}
            />
          ))}
        </div>
      </section>

      <PiedPage />
    </div>
  );
}

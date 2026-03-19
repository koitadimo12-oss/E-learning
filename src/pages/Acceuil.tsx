import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import BarreNavigation from "../composants/BarreNavigation";
import PiedPage from "../composants/PiedPage";
import CarteCours from "../composants/CarteCours";
import CarteTemoignage from "../composants/CarteTemoignages";
import BarreRecherche from "../composants/BarreRecherche";
import { listeCours, type Cours } from "../services/coursService";
import type { Etudiant } from "../services/etudiantService";

export default function Acceuil({
  etudiant,
  onDeconnexion,
}: {
  etudiant: Etudiant | null;
  onDeconnexion: () => void;
}) {
  const navigate = useNavigate();
  const [recherche, setRecherche] = useState("");

  const coursFiltres = useMemo(
    () =>
      listeCours.filter((cours) =>
        cours.titre.toLowerCase().includes(recherche.toLowerCase())
      ),
    [recherche]
  );

  const temoignages = [
    {
      nom: "Awa",
      texte:
        "Les cours sont clairs et bien structurés. J’ai progressé rapidement en math."
    },
    {
      nom: "Mamadou",
      texte:
        "Super plateforme ! J’ai trouvé exactement le niveau que je cherchais, et le quiz aide vraiment."
    },
    {
      nom: "Fatou",
      texte:
        "Une bonne expérience mobile et des explications accessibles. Je recommande vivement."
    }
  ];

  const pourquoi = [
    {
      titre: "Qualité",
      image: "/images/qualite.png",
      texte: "Des cours construits par des pédagogues pour apprendre efficacement."
    },
    {
      titre: "Apprentissage",
      image: "/images/apprentissage.png",
      texte: "Un rythme adapté à votre disponibilité, depuis n’importe où."
    },
    {
      titre: "Certificat",
      image: "/images/certificat.png",
      texte: "Un parcours structuré avec des acquis mesurés pour progresser."
    }
  ];

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
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              Plateforme de cours en ligne pour progresser rapidement
            </h1>
            <p className="mt-4 text-lg text-blue-50/95">
              Apprenez, progressez et construisez vos compétences avec des cours
              structurés et un suivi de progression.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate("/cours")}
                className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-xl shadow hover:bg-orange-600 transition"
              >
                Explorer les cours
              </button>
              <button
                onClick={() => (etudiant ? navigate("/profil") : navigate("/inscription"))}
                className="px-6 py-3 bg-white/10 border border-white/30 text-white font-semibold rounded-xl hover:bg-white/15 transition"
              >
                {etudiant ? "Aller au profil" : "Créer un compte"}
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
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">
          Pourquoi nous choisir ?
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {pourquoi.map((p) => (
            <div
              key={p.titre}
              className="bg-white rounded-xl shadow p-6 text-center border border-gray-100"
            >
              <img src={p.image} alt={p.titre} className="w-16 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">{p.titre}</h3>
              <p className="text-gray-600">{p.texte}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 bg-white border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <h2 className="text-3xl font-bold mb-10 text-center text-gray-900">
            Témoignages
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {temoignages.map((t) => (
              <CarteTemoignage key={t.nom} nom={t.nom} texte={t.texte} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 max-w-6xl mx-auto px-6 md:px-10">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">
          Comment ça marche
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
            <p className="text-sm font-semibold text-blue-700">Étape 1</p>
            <h3 className="font-bold mt-2">Inscrivez-vous</h3>
            <p className="text-gray-600 mt-2">
              Créez votre compte et commencez à suivre vos progrès.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
            <p className="text-sm font-semibold text-blue-700">Étape 2</p>
            <h3 className="font-bold mt-2">Explorez un cours</h3>
            <p className="text-gray-600 mt-2">
              Ouvrez un cours, lisez le contenu, puis passez au quiz.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
            <p className="text-sm font-semibold text-blue-700">Étape 3</p>
            <h3 className="font-bold mt-2">Passez le quiz</h3>
            <p className="text-gray-600 mt-2">
              Le quiz (6 questions) détermine automatiquement votre progression.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">
            Questions fréquentes
          </h2>

          <div className="max-w-3xl mx-auto space-y-4">
            <details className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <summary className="font-semibold cursor-pointer">
                Est-ce que je peux reprendre un cours ?
              </summary>
              <p className="text-gray-600 mt-2">
                Oui. Vous pouvez revoir le contenu et repasser le quiz pour
                améliorer votre progression.
              </p>
            </details>

            <details className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <summary className="font-semibold cursor-pointer">
                Quels sont les prérequis ?
              </summary>
              <p className="text-gray-600 mt-2">
                Les cours sont conçus pour démarrer facilement. Vous pouvez
                progresser cours après cours.
              </p>
            </details>

            <details className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <summary className="font-semibold cursor-pointer">
                Comment ma progression est-elle calculée ?
              </summary>
              <p className="text-gray-600 mt-2">
                À la fin du cours, le quiz de 6 questions est noté, puis votre
                progression est mise à jour automatiquement.
              </p>
            </details>
          </div>
        </div>
      </section>

      <section className="py-16 max-w-6xl mx-auto px-6 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Cours populaires</h2>
            <p className="mt-2 text-gray-600">
              Recherchez un cours et lancez votre apprentissage.
            </p>
          </div>

          <div className="md:w-[360px]">
            <BarreRecherche valeur={recherche} onChange={setRecherche} />
          </div>
        </div>

        <div className="mt-10 grid md:grid-cols-3 gap-6">
          {coursFiltres.map((cours: Cours) => (
            <CarteCours
              key={cours.id}
              cours={cours}
              onVoirCours={() => navigate(`/cours/${cours.id}`)}
            />
          ))}
        </div>

        <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate("/cours")}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition"
          >
            Voir tous les cours
          </button>
          <button
            onClick={() => navigate("/connexion")}
            className="px-6 py-3 bg-gray-100 text-gray-900 font-semibold rounded-xl hover:bg-gray-200 transition border border-gray-200"
          >
            Je me connecte
          </button>
        </div>
      </section>

      <PiedPage />
    </div>
  );
}

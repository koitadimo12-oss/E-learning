import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import BarreNavigation from "../composants/BarreNavigation";
import PiedPage from "../composants/PiedPage";
import CarteCours from "../composants/CarteCours";
import CarteTemoignage from "../composants/CarteTemoignages";
import SectionReveal from "../composants/SectionReveal";
import { listeCours } from "../services/coursService";
import type { Cours } from "../services/coursService";
import type { Etudiant } from "../services/etudiantService";
import { useCountUp } from "../hooks/useCountUp";
import { useInViewOnce } from "../hooks/useInViewOnce";

export default function Acceuil({
  etudiant,
  onDeconnexion,
}: {
  etudiant: Etudiant | null;
  onDeconnexion: () => void;
}) {
  const navigate = useNavigate();
  const coursPopulaires = useMemo(() => listeCours.slice(0, 4), []);
  const categoriesUniques = useMemo(
    () => [...new Set(listeCours.map((c) => c.categorie))],
    []
  );

  const { ref: heroStatsRef, visible: heroStatsVisible } = useInViewOnce();
  const countCours = useCountUp(20, 1600, heroStatsVisible);

  const temoignages = [
    {
      nom: "Awa",
      texte: "Les cours sont clairs et bien structurés. J'ai progressé rapidement en math.",
    },
    {
      nom: "Mamadou",
      texte: "Super plateforme ! J'ai trouvé exactement le niveau que je cherchais, et le quiz aide vraiment.",
    },
    {
      nom: "Fatou",
      texte: "Une bonne expérience mobile et des explications accessibles. Je recommande vivement.",
    },
  ];

  const pourquoi = [
    {
      titre: "Qualité",
      image: "/images/qualite.png",
      texte: "Des cours construits par des pédagogues pour apprendre efficacement.",
    },
    {
      titre: "Apprentissage",
      image: "/images/apprentissage.png",
      texte: "Un rythme adapté à votre disponibilité, depuis n'importe où.",
    },
    {
      titre: "Certificat",
      image: "/images/certificat.png",
      texte: "Un parcours structuré avec des acquis mesurés pour progresser.",
    },
  ];

  const badgesConfiance = [
    "Apprenants motivés",
    "Contenu structuré",
    "Quiz & suivi",
    "Accessible mobile",
    "Kaay Niou Diang",
  ];

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <BarreNavigation etudiant={etudiant} onDeconnexion={onDeconnexion} />

      {/* Hero — conservé + embellissements (blobs, zoom léger, compteur animé) */}
      <section className="relative overflow-hidden min-h-[520px] md:min-h-[580px]">
        <img
          src="/Hero.png"
          alt="Hero Kaay Niou Diang"
          className="absolute inset-0 w-full h-full object-cover animate-knd-ken-burns"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/75 via-blue-700/45 to-transparent" />

        <div
          className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full bg-orange-400/25 blur-3xl animate-knd-float-slow"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute bottom-0 left-1/3 w-96 h-96 rounded-full bg-blue-400/20 blur-3xl animate-knd-float-slow knd-delay-200"
          aria-hidden
        />

        <div className="relative max-w-6xl mx-auto px-6 md:px-10 py-16 md:py-24">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight animate-knd-fade-up">
              Plateforme de cours en ligne pour progresser rapidement
            </h1>
            <p className="mt-4 text-lg text-blue-50/95 animate-knd-fade-up knd-delay-100">
              Apprenez, progressez et construisez vos compétences avec des cours structurés et un suivi de
              progression.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 animate-knd-fade-up knd-delay-200">
              <button
                onClick={() => navigate("/cours")}
                className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-xl shadow-lg hover:bg-orange-600 transition hover:scale-[1.02] active:scale-[0.98] animate-knd-pulse-cta"
              >
                Explorer les cours
              </button>
              <button
                onClick={() => (etudiant ? navigate("/profil") : navigate("/inscription"))}
                className="px-6 py-3 bg-white/10 border border-white/30 text-white font-semibold rounded-xl hover:bg-white/15 transition backdrop-blur-sm"
              >
                {etudiant ? "Aller au profil" : "Créer un compte"}
              </button>
            </div>

            <div ref={heroStatsRef} className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white/10 border border-white/20 rounded-xl p-4 backdrop-blur-md hover:bg-white/15 transition-colors duration-300">
                <p className="text-3xl font-bold text-white tabular-nums">{countCours}+</p>
                <p className="text-white/80">Cours disponibles</p>
              </div>
              <div className="bg-white/10 border border-white/20 rounded-xl p-4 backdrop-blur-md hover:bg-white/15 transition-colors duration-300">
                <p className="text-3xl font-bold text-white">Quiz</p>
                <p className="text-white/80">Pour vérifier vos acquis</p>
              </div>
              <div className="bg-white/10 border border-white/20 rounded-xl p-4 backdrop-blur-md hover:bg-white/15 transition-colors duration-300">
                <p className="text-3xl font-bold text-white">Suivi</p>
                <p className="text-white/80">Progression des cours</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nouvelle section animée — bandeau confiance (n’enlève rien au-dessus) */}
      <div className="relative bg-slate-900 text-white py-4 overflow-hidden border-y border-white/10">
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-slate-900 to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-slate-900 to-transparent z-10" />
        <div className="flex whitespace-nowrap animate-knd-marquee">
          {[...badgesConfiance, ...badgesConfiance].map((label, i) => (
            <span key={`${label}-${i}`} className="mx-10 text-sm font-medium text-blue-100/90 tracking-wide">
              ✦ {label}
            </span>
          ))}
        </div>
      </div>

      <SectionReveal>
        <section className="py-16 max-w-6xl mx-auto px-6 md:px-10">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">Pourquoi nous choisir ?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {pourquoi.map((p, i) => (
              <div
                key={p.titre}
                className="bg-white rounded-xl shadow-md p-6 text-center border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                style={{ animationDelay: `${i * 90}ms` }}
              >
                <img src={p.image} alt={p.titre} className="w-16 mx-auto mb-4 drop-shadow-sm" />
                <h3 className="font-semibold mb-2">{p.titre}</h3>
                <p className="text-gray-600">{p.texte}</p>
              </div>
            ))}
          </div>
        </section>
      </SectionReveal>

      {/* Nouvelle section — domaines couverts */}
      <SectionReveal>
        <section className="py-14 bg-gradient-to-br from-blue-50 via-white to-orange-50/40 border-y border-gray-100">
          <div className="max-w-6xl mx-auto px-6 md:px-10 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Domaines couverts</h2>
            <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
              Des parcours variés pour monter en compétences, du développement aux soft skills.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {categoriesUniques.map((cat, i) => (
                <span
                  key={cat}
                  className="px-4 py-2 rounded-full text-sm font-semibold bg-white/90 border border-blue-100 text-blue-800 shadow-sm hover:shadow-md hover:scale-105 transition-transform duration-300"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>
        </section>
      </SectionReveal>

      <SectionReveal>
        <section className="py-16 bg-white border-y border-gray-100">
          <div className="max-w-6xl mx-auto px-6 md:px-10">
            <h2 className="text-3xl font-bold mb-10 text-center text-gray-900">Témoignages</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {temoignages.map((t) => (
                <CarteTemoignage key={t.nom} nom={t.nom} texte={t.texte} />
              ))}
            </div>
          </div>
        </section>
      </SectionReveal>

      <SectionReveal>
        <section className="py-16 max-w-6xl mx-auto px-6 md:px-10">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">Comment ça marche</h2>
          <div className="grid md:grid-cols-3 gap-6 relative">
            <div className="hidden md:block absolute top-12 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-blue-200 via-orange-200 to-blue-200 -z-0 rounded-full" aria-hidden />
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 relative z-[1] hover:shadow-lg transition-shadow duration-300">
              <p className="text-sm font-semibold text-blue-700">Étape 1</p>
              <h3 className="font-bold mt-2">Inscrivez-vous</h3>
              <p className="text-gray-600 mt-2">Créez votre compte et commencez à suivre vos progrès.</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 relative z-[1] hover:shadow-lg transition-shadow duration-300">
              <p className="text-sm font-semibold text-blue-700">Étape 2</p>
              <h3 className="font-bold mt-2">Explorez un cours</h3>
              <p className="text-gray-600 mt-2">Ouvrez un cours, lisez le contenu, puis passez au quiz.</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 relative z-[1] hover:shadow-lg transition-shadow duration-300">
              <p className="text-sm font-semibold text-blue-700">Étape 3</p>
              <h3 className="font-bold mt-2">Passez le quiz</h3>
              <p className="text-gray-600 mt-2">
                Le quiz (6 questions) détermine automatiquement votre progression.
              </p>
            </div>
          </div>
        </section>
      </SectionReveal>

      {/* Nouvelle section — appel à l’action */}
      <SectionReveal>
        <section className="py-14 px-6 md:px-10">
          <div className="max-w-6xl mx-auto rounded-2xl overflow-hidden shadow-xl border border-white/20 bg-gradient-to-r from-blue-700 via-blue-600 to-orange-500 text-white relative">
            <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_20%_50%,white,transparent_50%)] pointer-events-none" />
            <div className="relative px-8 py-10 md:py-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold knd-shimmer-text">Prêt à commencer ?</h2>
                <p className="mt-2 text-blue-50 max-w-xl">
                  Rejoignez la communauté, suivez vos cours au rythme qui vous convient et mesurez vos progrès avec
                  les quiz.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <button
                  onClick={() => navigate("/inscription")}
                  className="px-6 py-3 bg-white text-blue-700 font-semibold rounded-xl shadow hover:bg-blue-50 transition hover:scale-[1.02]"
                >
                  Créer un compte
                </button>
                <button
                  onClick={() => navigate("/cours")}
                  className="px-6 py-3 bg-white/15 border border-white/40 font-semibold rounded-xl hover:bg-white/25 transition"
                >
                  Parcourir les cours
                </button>
              </div>
            </div>
          </div>
        </section>
      </SectionReveal>

      <SectionReveal>
        <section className="py-16 bg-white border-y border-gray-100">
          <div className="max-w-6xl mx-auto px-6 md:px-10">
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">Questions fréquentes</h2>
            <div className="max-w-3xl mx-auto space-y-4">
              <details className="bg-gray-50 rounded-xl p-4 border border-gray-100 open:shadow-md transition-shadow">
                <summary className="font-semibold cursor-pointer list-none flex items-center justify-between gap-2">
                  Est-ce que je peux reprendre un cours ?
                  <span className="text-orange-500 text-lg leading-none">+</span>
                </summary>
                <p className="text-gray-600 mt-2">
                  Oui. Vous pouvez revoir le contenu et repasser le quiz pour améliorer votre progression.
                </p>
              </details>
              <details className="bg-gray-50 rounded-xl p-4 border border-gray-100 open:shadow-md transition-shadow">
                <summary className="font-semibold cursor-pointer list-none flex items-center justify-between gap-2">
                  Quels sont les prérequis ?
                  <span className="text-orange-500 text-lg leading-none">+</span>
                </summary>
                <p className="text-gray-600 mt-2">
                  Les cours sont conçus pour démarrer facilement. Vous pouvez progresser cours après cours.
                </p>
              </details>
              <details className="bg-gray-50 rounded-xl p-4 border border-gray-100 open:shadow-md transition-shadow">
                <summary className="font-semibold cursor-pointer list-none flex items-center justify-between gap-2">
                  Comment ma progression est-elle calculée ?
                  <span className="text-orange-500 text-lg leading-none">+</span>
                </summary>
                <p className="text-gray-600 mt-2">
                  À la fin du cours, le quiz de 6 questions est noté, puis votre progression est mise à jour
                  automatiquement.
                </p>
              </details>
            </div>
          </div>
        </section>
      </SectionReveal>

      <SectionReveal>
        <section className="py-16 max-w-6xl mx-auto px-6 md:px-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Cours populaires</h2>
              <p className="mt-2 text-gray-600">Découvrez une sélection de cours pour lancer votre apprentissage.</p>
            </div>
          </div>

          <div className="mt-10 grid md:grid-cols-3 gap-6">
            {coursPopulaires.map((cours: Cours, i) => (
              <div
                key={cours.id}
                className="animate-knd-fade-up"
                style={{ animationDelay: `${Math.min(i, 5) * 80}ms` }}
              >
                <CarteCours cours={cours} onVoirCours={(id) => navigate(`/cours/${id}`)} />
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate("/cours")}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition shadow-md hover:shadow-lg"
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
      </SectionReveal>

      {/* Nouvelle section — accroche finale */}
      <SectionReveal>
        <section className="pb-16 max-w-6xl mx-auto px-6 md:px-10">
          <div className="rounded-2xl border border-dashed border-blue-200 bg-blue-50/60 px-8 py-10 text-center">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">Une question sur un cours ?</h2>
            <p className="mt-2 text-gray-600 max-w-lg mx-auto">
              Explorez le catalogue, lisez les descriptions et lancez un parcours : la progression et les quiz vous
              guident pas à pas.
            </p>
            <button
              type="button"
              onClick={() => navigate("/cours")}
              className="mt-6 inline-flex items-center justify-center px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition hover:-translate-y-0.5 shadow"
            >
              Découvrir le catalogue
            </button>
          </div>
        </section>
      </SectionReveal>

      <PiedPage />
    </div>
  );
}

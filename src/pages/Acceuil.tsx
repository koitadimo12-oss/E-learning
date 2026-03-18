import { useEffect, useState } from "react";
import BarreNavigation from "../composants/BarreNavigation";
import PiedPage from "../composants/PiedPage";
import CarteCours from "../composants/CarteCours";
import CarteTemoignage from "../composants/CarteTemoignages";

export default function Accueil() {
  // Animation chiffres
  const [coursCount, setCoursCount] = useState(0);
  const [etudiantsCount, setEtudiantsCount] = useState(0);
  const [profCount, setProfCount] = useState(0);
  const [catCount, setCatCount] = useState(0);

  useEffect(() => {
    const increment = (setter: Function, target: number, speed = 20) => {
      let current = 0;
      const step = Math.ceil(target / speed);
      const interval = setInterval(() => {
        current += step;
        if (current >= target) {
          setter(target);
          clearInterval(interval);
        } else {
          setter(current);
        }
      }, 50);
    };

    increment(setCoursCount, 500);
    increment(setEtudiantsCount, 2000);
    increment(setProfCount, 50);
    increment(setCatCount, 10);
  }, []);

  return (
    <div className="bg-gray-100">

      <BarreNavigation />

      {/* HERO */}
      <section className="bg-blue-600 text-white py-20 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-10 grid md:grid-cols-2 items-center gap-6">

          <div className="animate-fadeIn">
            <h1 className="text-5xl font-bold mb-6">
              Apprenez en ligne facilement
            </h1>

            <p className="mb-6 text-lg">
              Des centaines de cours pour améliorer vos compétences en technologie, mathématiques et sciences.
            </p>

            <button className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors">
              Voir les cours
            </button>
          </div>

          <img src="/hero.png" className="animate-slideIn" />

        </div>
      </section>

      {/* STATISTIQUES */}
      <section className="py-16 bg-white text-center">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
          <div className="animate-fadeUp">
            <h2 className="text-3xl font-bold text-blue-600">{coursCount}+</h2>
            <p>Cours disponibles</p>
          </div>
          <div className="animate-fadeUp delay-100">
            <h2 className="text-3xl font-bold text-blue-600">{etudiantsCount}+</h2>
            <p>Étudiants inscrits</p>
          </div>
          <div className="animate-fadeUp delay-200">
            <h2 className="text-3xl font-bold text-blue-600">{profCount}+</h2>
            <p>Professeurs</p>
          </div>
          <div className="animate-fadeUp delay-300">
            <h2 className="text-3xl font-bold text-blue-600">{catCount}+</h2>
            <p>Catégories</p>
          </div>
        </div>
      </section>

      {/* COURS POPULAIRES */}
      <section className="max-w-6xl mx-auto px-10 py-16">
        <h2 className="text-3xl font-bold text-center mb-10 animate-fadeIn">
          Cours populaires
        </h2>
        <div className="grid md:grid-cols-4 gap-6">
          <CarteCours
            image="/cours/react.png"
            titre="React pour débutants"
            auteur="Professeur Ali"
            duree="10 heures"
          />
          <CarteCours
            image="/cours/python.png"
            titre="Python complet"
            auteur="Professeur Sara"
            duree="12 heures"
          />
          <CarteCours
            image="/cours/math.png"
            titre="Mathématiques"
            auteur="Professeur Diallo"
            duree="8 heures"
          />
          <CarteCours
            image="/cours/science.png"
            titre="Sciences"
            auteur="Professeur Fatou"
            duree="9 heures"
          />
        </div>
      </section>

      {/* POURQUOI NOUS */}
      <section className="bg-gray-200 py-16 text-center">
        <h2 className="text-3xl font-bold mb-10 animate-fadeIn">
          Pourquoi choisir Kaay Niou Diang ?
        </h2>
        <div className="grid md:grid-cols-4 max-w-6xl mx-auto gap-8">
          <div className="animate-fadeUp">
            <h3 className="font-bold text-lg">Cours de qualité</h3>
            <p>Des contenus créés par des experts avec des supports complets.</p>
          </div>
          <div className="animate-fadeUp delay-100">
            <h3 className="font-bold text-lg">Apprentissage flexible</h3>
            <p>Apprenez à votre rythme, où que vous soyez.</p>
          </div>
          <div className="animate-fadeUp delay-200">
            <h3 className="font-bold text-lg">Certificat reconnu</h3>
            <p>Recevez un certificat officiel après chaque cours.</p>
          </div>
          <div className="animate-fadeUp delay-300">
            <h3 className="font-bold text-lg">Support étudiant</h3>
            <p>Bénéficiez d’un suivi et d’une assistance personnalisée.</p>
          </div>
        </div>
      </section>

      {/* TEMOIGNAGES */}
      <section className="py-16">
        <h2 className="text-3xl font-bold text-center mb-10 animate-fadeIn">
          Témoignages étudiants
        </h2>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          <CarteTemoignage
            image="/temoignages/etudiant1.png"
            nom="Amadou"
            texte="Cette plateforme m'a beaucoup aidé à apprendre React."
          />
          <CarteTemoignage
            image="/temoignages/etudiant2.png"
            nom="Fatou"
            texte="Les cours sont très clairs et faciles à suivre."
          />
        </div>
      </section>

      <PiedPage />

    </div>
  );
}

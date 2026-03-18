import { useEffect, useState, useRef } from "react";
import BarreNavigation from "../composants/BarreNavigation";
import PiedPage from "../composants/PiedPage";
import CarteCours from "../composants/CarteCours";
import CarteTemoignage from "../composants/CarteTemoignages";

export default function Accueil() {
  // États pour les statistiques
  const [coursCount, setCoursCount] = useState(0);
  const [etudiantsCount, setEtudiantsCount] = useState(0);
  const [profCount, setProfCount] = useState(0);
  const [catCount, setCatCount] = useState(0);
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);

  // Observer scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setStatsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    if (statsRef.current) observer.observe(statsRef.current);
  }, []);

  // Animation chiffres
  useEffect(() => {
    if (!statsVisible) return;

    const animateCount = (setter: Function, target: number, duration = 1500) => {
      let start = 0;
      const step = () => {
        start += target / (duration / 16);
        if (start >= target) setter(target);
        else {
          setter(Math.floor(start));
          requestAnimationFrame(step);
        }
      };
      requestAnimationFrame(step);
    };

    animateCount(setCoursCount, 500);
    animateCount(setEtudiantsCount, 2000);
    animateCount(setProfCount, 50);
    animateCount(setCatCount, 10);
  }, [statsVisible]);

  return (
    <div className="bg-gray-100 min-h-screen">

      <BarreNavigation />

      {/* HERO */}
      <section className="bg-blue-600 text-white py-20">
        <div className="max-w-6xl mx-auto px-6 md:px-10 flex flex-col md:flex-row items-center gap-10">
          
          <div className="md:w-1/2 text-center md:text-left">
            <h1 className="text-5xl font-bold mb-6">
              Apprenez en ligne facilement
            </h1>
            <p className="mb-6 text-lg">
              Des centaines de cours pour améliorer vos compétences.
            </p>
            <button className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-lg font-semibold text-white">
              Voir les cours
            </button>
          </div>

          <div className="md:w-1/2">
            <img src="/public/Hero.png" className="w-full rounded-xl" />
          </div>
        </div>
      </section>

      {/* STATISTIQUES */}
      <section ref={statsRef} className="py-16 bg-white text-center">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
          <div>
            <h2 className="text-3xl font-bold text-blue-600">{coursCount}+</h2>
            <p>Cours disponibles</p>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-blue-600">{etudiantsCount}+</h2>
            <p>Étudiants inscrits</p>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-blue-600">{profCount}+</h2>
            <p>Professeurs</p>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-blue-600">{catCount}+</h2>
            <p>Catégories</p>
          </div>
        </div>
      </section>

      {/* COURS */}
      <section className="max-w-6xl mx-auto px-6 md:px-10 py-16">
        <h2 className="text-3xl font-bold text-center mb-10">Cours populaires</h2>

        <div className="grid md:grid-cols-4 gap-6">
          <CarteCours image="/cours/react.png" titre="React" auteur="Ali" duree="10h" />
          <CarteCours image="/cours/python.png" titre="Python" auteur="Sara" duree="12h" />
          <CarteCours image="/cours/math.png" titre="Maths" auteur="Diallo" duree="8h" />
          <CarteCours image="/cours/science.png" titre="Science" auteur="Fatou" duree="9h" />
        </div>
      </section>

      {/* POURQUOI NOUS */}
      <section className="bg-gray-200 py-16 text-center">
        <h2 className="text-3xl font-bold mb-10">
          Pourquoi choisir Kaay Niou Diang ?
        </h2>

        <div className="grid md:grid-cols-3 max-w-6xl mx-auto gap-8 px-4">

          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <img src="/images/qualite.png" className="w-32 mx-auto mb-4" />
            <h3 className="font-bold text-lg">Cours de qualité</h3>
            <p>Des contenus créés par des experts.</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <img src="/images/apprentissage.png" className="w-32 mx-auto mb-4" />
            <h3 className="font-bold text-lg">Apprentissage flexible</h3>
            <p>Apprenez à votre rythme.</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <img src="/images/certificat.png" className="w-32 mx-auto mb-4" />
            <h3 className="font-bold text-lg">Certificat</h3>
            <p>Obtenez un certificat après chaque cours.</p>
          </div>

        </div>
      </section>

      {/* TEMOIGNAGES */}
      <section className="py-16">
        <h2 className="text-3xl font-bold text-center mb-10">
          Témoignages étudiants
        </h2>

        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          <CarteTemoignage image="/images/etudiant1.png" nom="Amadou" texte="Très utile !" />
          <CarteTemoignage image="/images/etudiant2.png" nom="Fatou" texte="Super plateforme !" />
        </div>
      </section>

      <PiedPage />
    </div>
  );
}

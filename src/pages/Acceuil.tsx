import { useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import BarreNavigation from "../composants/BarreNavigation";
import PiedPage from "../composants/PiedPage";
import CarteCours from "../composants/CarteCours";
import CarteTemoignage from "../composants/CarteTemoignages";
import SectionReveal from "../composants/SectionReveal";
import { listeCours } from "../services/coursService";
import type { Cours } from "../services/coursService";
import { useCountUp } from "../hooks/useCountUp";
import { useInViewOnce } from "../hooks/useInViewOnce";
import { getDernierCoursId, getNotificationsDemo, getObjectifDuJour } from "../services/stockageLocal";
import { toucherStreak } from "../services/etudiantService";
import type { Etudiant } from "../services/etudiantService";

type Props = { etudiant: Etudiant | null; onDeconnexion: () => void };

export default function Acceuil(props: Props) {
  const { etudiant, onDeconnexion } = props;
  const navigate = useNavigate();
  const location = useLocation();

  const coursPopulaires = useMemo(() => [...listeCours].sort(() => 0.5 - Math.random()).slice(0, 6), []);
  const categoriesUniques = useMemo(() => [...new Set(listeCours.map((c) => c.categorie))], []);
  const dernierId = getDernierCoursId();
  const dernierCours = dernierId ? listeCours.find((c) => c.id === dernierId) : undefined;
  const objectif = getObjectifDuJour();
  const notifs = getNotificationsDemo();

  const { ref: heroStatsRef, visible: heroStatsVisible } = useInViewOnce();
  const countCours = useCountUp(listeCours.length, 1600, heroStatsVisible);

  useEffect(() => {
    if (etudiant) toucherStreak(etudiant.id);
  }, [etudiant?.id]);

  useEffect(() => {
    if (location.hash === "#a-propos") {
      const section = document.getElementById("a-propos");
      section?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [location.hash]);

  const temoignages = [
    { nom: "Awa", texte: "Les cours sont clairs et bien structurés. J’ai progressé rapidement." },
    { nom: "Mamadou", texte: "Quiz utiles et communauté par école : ça change tout." },
    { nom: "Fatou", texte: "Les challenges entre écoles motivent vraiment à aller au bout des projets." },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 overflow-x-hidden">
      <BarreNavigation etudiant={etudiant} onDeconnexion={onDeconnexion} fixe />

      {/* Offset pour barre fixe */}
      <div className="pt-[76px] sm:pt-[84px]" />

      {/* Hero — mesh, typographie forte, glass */}
      <section className="relative knd-mesh-hero knd-animated-gradient text-white">
        <div
          className="pointer-events-none absolute top-24 right-[10%] w-40 h-40 rounded-full bg-orange-500/20 blur-3xl knd-orbit-dot"
          aria-hidden
        />
        <div className="relative max-w-6xl mx-auto px-6 md:px-10 py-16 md:py-24">
          <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-12 items-center">
            <div>
              <p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase text-blue-200/90">
                <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
                Kaay Niou Diang
              </p>
              <h2 className="mt-5 text-4xl sm:text-5xl md:text-6xl font-black leading-[1.05] tracking-tight">
                Apprenez sans friction.
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-300 via-white to-blue-200">
                  Progressez avec votre école.
                </span>
              </h2>
              <p className="mt-6 text-lg text-blue-100/90 max-w-xl leading-relaxed">
                Cours YouTube, quiz intelligents, favoris & notes locales, communauté par établissement et compétitions
                inter-écoles — une expérience pensée pour la vie réelle des étudiants.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <button
                  type="button"
                  onClick={() => navigate("/cours")}
                  className="px-8 py-4 rounded-2xl bg-orange-500 hover:bg-orange-400 text-white font-bold shadow-lg shadow-orange-500/25 transition hover:-translate-y-0.5"
                >
                  Explorer les cours
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/demo")}
                  className="px-8 py-4 rounded-2xl border border-blue-300/40 text-blue-100 font-semibold hover:bg-white/10 transition"
                >
                  Mode démo
                </button>
                <button
                  type="button"
                  onClick={() => (etudiant ? navigate("/tableau-bord") : navigate("/inscription"))}
                  className="px-8 py-4 rounded-2xl knd-glass text-white font-semibold hover:bg-white/10 transition"
                >
                  {etudiant ? "Mon tableau de bord" : "Créer un compte"}
                </button>
              </div>

              <div ref={heroStatsRef} className="mt-12 grid grid-cols-3 gap-3 sm:gap-4 max-w-lg">
                {[
                  { label: "Cours", val: `${countCours}+` },
                  { label: "Écoles", val: "6+" },
                  { label: "Streak max", val: "∞" },
                ].map((s) => (
                  <div key={s.label} className="knd-glass rounded-2xl px-3 py-4 text-center">
                    <p className="text-2xl sm:text-3xl font-black tabular-nums">{s.val}</p>
                    <p className="text-[10px] sm:text-xs uppercase tracking-widest text-blue-100/80">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="knd-glass rounded-3xl p-6 md:p-8 space-y-5">
                <p className="text-sm font-bold text-orange-200 uppercase tracking-widest">Aperçu plateforme</p>
                <div className="grid grid-cols-2 gap-3">
                  {["Cours & quiz", "Challenges", "Communauté", "Classements"].map((t) => (
                    <div
                      key={t}
                      className="rounded-2xl bg-white/5 border border-white/10 px-4 py-5 text-sm font-semibold hover:bg-white/10 transition cursor-default"
                    >
                      {t}
                    </div>
                  ))}
                </div>
                <div className="rounded-2xl overflow-hidden border border-white/10 aspect-video bg-black/40">
                  <img
                    src="/Hero.png"
                    alt=""
                    className="w-full h-full object-cover opacity-90"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bandeau notifications démo */}
      {etudiant && (
        <div className="bg-slate-900/95 border-y border-white/5">
          <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <p className="text-sm text-slate-300">
              <span className="font-semibold text-white">Notifications</span> — {notifs.filter((n) => !n.lu).length} non lues
              (démo)
            </p>
            <div className="flex flex-wrap gap-2">
              {notifs.slice(0, 2).map((n) => (
                <span
                  key={n.id}
                  className="text-xs px-3 py-1 rounded-full bg-blue-500/15 text-blue-200 border border-blue-500/20"
                >
                  {n.titre}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bloc étudiant connecté */}
      {etudiant && (
        <section className="bg-gradient-to-b from-slate-900 to-slate-950 border-b border-white/5">
          <div className="max-w-6xl mx-auto px-6 md:px-10 py-14">
            <h3 className="text-2xl md:text-3xl font-bold text-white">Votre accueil étudiant</h3>
            <p className="text-slate-400 mt-2">
              {etudiant.ecoleCanonique} · {etudiant.niveauEtude}
            </p>
            <div className="mt-8 grid md:grid-cols-3 gap-6">
              <div className="rounded-2xl bg-slate-800/80 border border-white/10 p-6">
                <p className="text-xs font-bold uppercase tracking-widest text-orange-300">Streak</p>
                <p className="text-4xl font-black mt-2">🔥 {etudiant.streak ?? 0} jours</p>
                <p className="text-sm text-slate-400 mt-2">Revenez chaque jour pour maintenir votre série.</p>
              </div>
              <div className="rounded-2xl bg-slate-800/80 border border-white/10 p-6">
                <p className="text-xs font-bold uppercase tracking-widest text-blue-300">Objectif du jour</p>
                <p className="text-base font-medium mt-3 leading-relaxed text-slate-200">{objectif}</p>
              </div>
              <div className="rounded-2xl bg-slate-800/80 border border-white/10 p-6 flex flex-col">
                <p className="text-xs font-bold uppercase tracking-widest text-emerald-300">Reprendre</p>
                {dernierCours ? (
                  <>
                    <p className="font-bold mt-3 text-lg">{dernierCours.titre}</p>
                    <button
                      type="button"
                      onClick={() => navigate(`/cours/${dernierCours.id}`)}
                      className="mt-auto pt-4 w-full py-3 rounded-xl bg-white text-slate-900 font-bold hover:bg-orange-400 hover:text-white transition"
                    >
                      Continuer
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => navigate("/cours")}
                    className="mt-4 py-3 rounded-xl bg-blue-600 text-white font-bold"
                  >
                    Choisir un cours
                  </button>
                )}
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => navigate("/favoris")}
                className="px-5 py-2.5 rounded-xl border border-white/20 text-sm font-semibold hover:bg-white/5"
              >
                ❤️ Mes favoris
              </button>
              <button
                type="button"
                onClick={() => navigate("/challenges")}
                className="px-5 py-2.5 rounded-xl border border-white/20 text-sm font-semibold hover:bg-white/5"
              >
                ⚔️ Challenges
              </button>
              <button
                type="button"
                onClick={() => navigate("/classements")}
                className="px-5 py-2.5 rounded-xl border border-white/20 text-sm font-semibold hover:bg-white/5"
              >
                🏆 Classements
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Bento fonctionnalités */}
      <SectionReveal>
        <section className="py-20 bg-white dark:bg-slate-950">
          <div className="max-w-6xl mx-auto px-6 md:px-10">
            <h3 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white">Une plateforme complète</h3>
            <p className="text-center text-gray-600 dark:text-slate-400 mt-3 max-w-2xl mx-auto">
              Normalisation des écoles (alias), gamification, projets étudiants et compétition — sans sacrifier la clarté.
            </p>
            <div className="mt-12 grid md:grid-cols-3 gap-5">
              {[
                {
                  t: "Écoles unifiées",
                  d: "Liste contrôlée + autocomplete. UNIPRO = univers professionnel : tout est normalisé.",
                  c: "from-blue-600/40 to-indigo-600/30",
                },
                {
                  t: "Parcours cours",
                  d: "YouTube intégré, playlist, progression auto, quiz 2/3 pour valider.",
                  c: "from-orange-500/40 to-rose-600/30",
                },
                {
                  t: "Réseau & défis",
                  d: "Communauté par école, chat simulé, challenges inter-écoles et classements.",
                  c: "from-emerald-500/35 to-teal-600/25",
                },
              ].map((b) => (
                <div
                  key={b.t}
                  className={`rounded-3xl p-8 bg-gradient-to-br ${b.c} border border-white/10 text-white shadow-xl`}
                >
                  <h4 className="text-xl font-bold">{b.t}</h4>
                  <p className="mt-3 text-sm text-white/85 leading-relaxed">{b.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </SectionReveal>

      <SectionReveal>
        <section className="py-16 bg-gray-100 dark:bg-slate-900/50 border-y border-gray-200 dark:border-white/5">
          <div className="max-w-6xl mx-auto px-6 md:px-10 text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Domaines couverts</h3>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {categoriesUniques.map((cat) => (
                <span
                  key={cat}
                  className="px-4 py-2 rounded-full text-sm font-semibold bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-blue-700 dark:text-blue-100 hover:border-orange-400/50 transition"
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>
        </section>
      </SectionReveal>

      <SectionReveal>
        <section className="py-16 max-w-6xl mx-auto px-6 md:px-10">
          <h3 className="text-3xl font-bold text-center text-gray-900 dark:text-white">Cours populaires</h3>
          <div className="mt-10 grid md:grid-cols-3 gap-6">
            {coursPopulaires.map((cours: Cours) => (
              <div key={cours.id} className="dark:[&_.bg-white]:bg-slate-900 dark:[&_.text-gray-900]:text-white dark:[&_.border-gray-100]:border-slate-800">
                <CarteCours cours={cours} onVoirCours={(id: number) => navigate(`/cours/${id}`)} />
              </div>
            ))}
          </div>
          <div className="mt-10 flex justify-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/cours")}
              className="px-8 py-3 rounded-2xl bg-orange-500 text-white font-bold hover:bg-orange-400 transition"
            >
              Voir tout le catalogue
            </button>
          </div>
        </section>
      </SectionReveal>

      <SectionReveal>
        <section className="py-16 bg-gray-100 dark:bg-slate-900/30 border-y border-gray-200 dark:border-white/5">
          <div className="max-w-6xl mx-auto px-6 md:px-10">
            <h3 className="text-3xl font-bold text-center text-gray-900 dark:text-white">Témoignages</h3>
            <div className="mt-10 grid md:grid-cols-3 gap-6">
              {temoignages.map((t) => (
                <div key={t.nom} className="[&_p]:text-gray-700 dark:[&_p]:text-slate-200 [&_h3]:text-gray-900 dark:[&_h3]:text-white">
                  <CarteTemoignage nom={t.nom} texte={t.texte} />
                </div>
              ))}
            </div>
          </div>
        </section>
      </SectionReveal>

      <SectionReveal>
        <section id="a-propos" className="py-16 max-w-6xl mx-auto px-6 md:px-10">
          <div className="knd-glass rounded-3xl p-8 md:p-12 text-white">
            <h3 className="text-3xl md:text-4xl font-bold">À propos de Kaay Niou Diang</h3>
            <p className="mt-4 text-blue-100/90 leading-relaxed">
              Kaay Niou Diang est une plateforme d&apos;apprentissage en ligne qui aide les étudiants à apprendre à leur
              rythme avec des cours clairs, des quiz utiles, une communauté active et des challenges motivants.
            </p>
            <div className="mt-8 grid md:grid-cols-3 gap-4">
              {[
                {
                  titre: "Notre mission",
                  texte: "Rendre l'apprentissage accessible avec des contenus pratiques, progressifs et modernes.",
                },
                {
                  titre: "Notre méthode",
                  texte: "Chaque cours suit une structure simple : leçons, notes personnelles, quiz et progression.",
                },
                {
                  titre: "Notre vision",
                  texte: "Construire une communauté d'apprenants autonomes capables de créer de vrais projets.",
                },
              ].map((item) => (
                <div key={item.titre} className="rounded-2xl bg-white/5 border border-white/10 p-5">
                  <h4 className="font-bold text-white">{item.titre}</h4>
                  <p className="mt-2 text-sm text-blue-100/90">{item.texte}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </SectionReveal>

      <SectionReveal>
        <section className="py-16 bg-gray-100 dark:bg-slate-900/40 border-y border-gray-200 dark:border-white/5">
          <div className="max-w-6xl mx-auto px-6 md:px-10">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white text-center">Pourquoi choisir la plateforme</h3>
            <div className="mt-10 grid md:grid-cols-4 gap-4">
              {[
                "Parcours guidé et lisible",
                "Communauté par école",
                "Challenges avec classement",
                "Mode démo sans inscription",
              ].map((r) => (
                <div key={r} className="rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 text-gray-800 dark:text-slate-200 text-sm font-medium">
                  {r}
                </div>
              ))}
            </div>
          </div>
        </section>
      </SectionReveal>

      <SectionReveal>
        <section className="py-16 max-w-6xl mx-auto px-6 md:px-10">
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white text-center">FAQ rapide</h3>
          <div className="mt-10 grid md:grid-cols-2 gap-5">
            {[
              {
                q: "Faut-il s'inscrire pour accéder à la communauté ?",
                r: "Oui. L'inscription est requise pour la communauté, les challenges, les projets et les classements.",
              },
              {
                q: "Puis-je tester la plateforme sans compte ?",
                r: "Oui. Le mode démo permet d'explorer l'expérience complète en quelques minutes.",
              },
              {
                q: "Mes notes sont-elles sauvegardées ?",
                r: "Oui. Elles sont sauvegardées localement sur votre appareil pendant la navigation.",
              },
              {
                q: "Comment fonctionne le like ?",
                r: "Chaque étudiant peut liker une seule fois une leçon, un projet ou un formateur.",
              },
            ].map((f) => (
              <article key={f.q} className="rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6">
                <h4 className="font-bold text-gray-900 dark:text-white">{f.q}</h4>
                <p className="mt-2 text-sm text-gray-700 dark:text-slate-300">{f.r}</p>
              </article>
            ))}
          </div>
        </section>
      </SectionReveal>

      <SectionReveal>
        <section className="pb-20 max-w-6xl mx-auto px-6 md:px-10">
          <div className="rounded-3xl border border-orange-500/30 bg-gradient-to-r from-orange-500/20 via-blue-600/20 to-indigo-600/20 p-10 text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-white">Prêt à rejoindre l’aventure ?</h3>
            <p className="mt-3 text-slate-200 max-w-xl mx-auto">
              Inscription avec choix d’école contrôlé, tableaux de bord épurés et navigation fluide sur mobile.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={() => navigate("/inscription")}
                className="px-8 py-3 rounded-2xl bg-white text-slate-900 font-bold hover:bg-orange-400 hover:text-white transition"
              >
                Je m’inscris
              </button>
              <button
                type="button"
                onClick={() => navigate("/connexion")}
                className="px-8 py-3 rounded-2xl border border-white/40 text-white font-semibold hover:bg-white/10"
              >
                J’ai déjà un compte
              </button>
            </div>
          </div>
        </section>
      </SectionReveal>

      <div className="[&_footer]:mt-0">
        <PiedPage />
      </div>
    </div>
  );
}

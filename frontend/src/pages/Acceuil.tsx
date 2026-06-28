import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BarreNavigation from "../composants/BarreNavigation";
import PiedPage from "../composants/PiedPage";
import CarteCours from "../composants/CarteCours";
import CarteTemoignage from "../composants/CarteTemoignages";
import SectionReveal from "../composants/SectionReveal";
import { 
  Flame, Heart, User, Sparkles, GraduationCap, Trophy, Star, 
  Library, Unlock, Bot, Rocket, Brain, LineChart, Globe, BadgeCheck
} from "lucide-react";
import { listeCours } from "../services/coursService";
import type { Cours } from "../services/coursService";
import { chargerCours, getCoursCache } from "../services/coursApi";
import { getStatsPlateforme, type StatsPlateforme } from "../services/statsApi";
import { useCountUp } from "../hooks/useCountUp";
import { useInViewOnce } from "../hooks/useInViewOnce";
import { getDernierCoursId, getObjectifDuJour } from "../services/stockageLocal";
import type { Etudiant } from "../services/etudiantService";

type Props = { etudiant: Etudiant | null; onDeconnexion: () => void };

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1513258496099-48168024aec0?w=1200&auto=format&fit=crop",
];

const CYCLING_WORDS = ["efficacement", "rapidement", "intelligemment", "durablement"];

const TICKER_ITEMS = [
  { text: "Bibliothèque numérique", icon: <Library className="inline w-4 h-4 mr-1.5 mb-0.5" /> },
  { text: "Quiz intelligents", icon: <Brain className="inline w-4 h-4 mr-1.5 mb-0.5" /> },
  { text: "Certificats", icon: <Trophy className="inline w-4 h-4 mr-1.5 mb-0.5" /> },
  { text: "Streaks quotidiens", icon: <Flame className="inline w-4 h-4 mr-1.5 mb-0.5" /> },
  { text: "Universités prestigieuses", icon: <GraduationCap className="inline w-4 h-4 mr-1.5 mb-0.5" /> },
  { text: "Micro-learning", icon: <Sparkles className="inline w-4 h-4 mr-1.5 mb-0.5" /> },
  { text: "Suivi de progression", icon: <LineChart className="inline w-4 h-4 mr-1.5 mb-0.5" /> },
  { text: "Assistant IA", icon: <Bot className="inline w-4 h-4 mr-1.5 mb-0.5" /> },
  { text: "Accessibilité globale", icon: <Globe className="inline w-4 h-4 mr-1.5 mb-0.5" /> },
  // Repeated for marquee
  { text: "Bibliothèque numérique", icon: <Library className="inline w-4 h-4 mr-1.5 mb-0.5" /> },
  { text: "Quiz intelligents", icon: <Brain className="inline w-4 h-4 mr-1.5 mb-0.5" /> },
  { text: "Certificats", icon: <Trophy className="inline w-4 h-4 mr-1.5 mb-0.5" /> },
  { text: "Streaks quotidiens", icon: <Flame className="inline w-4 h-4 mr-1.5 mb-0.5" /> },
  { text: "Universités prestigieuses", icon: <GraduationCap className="inline w-4 h-4 mr-1.5 mb-0.5" /> },
  { text: "Micro-learning", icon: <Sparkles className="inline w-4 h-4 mr-1.5 mb-0.5" /> },
  { text: "Suivi de progression", icon: <LineChart className="inline w-4 h-4 mr-1.5 mb-0.5" /> },
  { text: "Assistant IA", icon: <Bot className="inline w-4 h-4 mr-1.5 mb-0.5" /> },
  { text: "Accessibilité globale", icon: <Globe className="inline w-4 h-4 mr-1.5 mb-0.5" /> },
];

export default function Acceuil(props: Props) {
  const { etudiant, onDeconnexion } = props;
  const navigate = useNavigate();
  const location = useLocation();
  const [wordIdx, setWordIdx] = useState(0);
  const [imgIdx, setImgIdx] = useState(0);
  const [stats, setStats] = useState<StatsPlateforme>({
    coursDisponibles: 0,
    livresDisponibles: 0,
    etudiantsActifs: 0,
  });
  const [coursApi, setCoursApi] = useState<Cours[]>(() => getCoursCache());

  useEffect(() => {
    void chargerCours().then(setCoursApi).catch(() => undefined);
    void getStatsPlateforme().then(setStats).catch(() => undefined);
  }, []);

  const tousLesCours = coursApi.length > 0 ? coursApi : listeCours;
  const coursPopulaires = useMemo(() => [...tousLesCours].sort(() => 0.5 - Math.random()).slice(0, 6), [tousLesCours]);
  const categoriesUniques = useMemo(() => [...new Set(tousLesCours.map((c) => c.categorie))], [tousLesCours]);
  const dernierId = getDernierCoursId();
  const dernierCours = dernierId ? tousLesCours.find((c) => c.id === dernierId) : undefined;
  const objectif = getObjectifDuJour();

  const { ref: heroStatsRef, visible: heroStatsVisible } = useInViewOnce();
  const countCours = useCountUp(stats.coursDisponibles, 1600, heroStatsVisible);
  const countEtudiants = useCountUp(stats.etudiantsActifs, 1600, heroStatsVisible);
  const countLivres = useCountUp(stats.livresDisponibles, 1600, heroStatsVisible);



  useEffect(() => {
    if (location.hash === "#a-propos") {
      document.getElementById("a-propos")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [location.hash]);

  // Word cycling animation
  useEffect(() => {
    const t = setInterval(() => setWordIdx(i => (i + 1) % CYCLING_WORDS.length), 2800);
    return () => clearInterval(t);
  }, []);

  // Image slider
  useEffect(() => {
    const t = setInterval(() => setImgIdx(i => (i + 1) % HERO_IMAGES.length), 5000);
    return () => clearInterval(t);
  }, []);

  const temoignages = [
    { nom: "Awa", texte: "Les cours sont clairs et bien structurés. J'ai progressé rapidement." },
    { nom: "Mamadou", texte: "Quiz utiles et progression claire : ça change tout." },
    { nom: "Fatou", texte: "Les cours sont pratiques et motivants du début à la fin." },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100">
      <BarreNavigation etudiant={etudiant} onDeconnexion={onDeconnexion} fixe />

      {/* ── HERO with image slider ── */}
      <section className="relative overflow-hidden text-white min-h-[92vh] flex items-center">
        {/* Sliding background images */}
        {HERO_IMAGES.map((src, i) => (
          <div
            key={src}
            className="absolute inset-0 transition-opacity duration-1000"
            style={{ opacity: i === imgIdx ? 1 : 0, zIndex: 0 }}
          >
            <img src={src} alt="" className="w-full h-full object-cover animate-knd-ken-burns" />
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-blue-950/80 to-slate-900/85" />
          </div>
        ))}

        {/* Decorative blobs */}
        <div className="pointer-events-none absolute top-24 right-[8%] w-48 h-48 rounded-full bg-orange-500/20 blur-3xl knd-orbit-dot" aria-hidden />
        <div className="pointer-events-none absolute bottom-16 left-[5%] w-56 h-56 rounded-full bg-blue-600/15 blur-3xl" aria-hidden />

        <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-10 py-16 md:py-24 w-full">
          <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-14 items-center">
            {/* LEFT */}
            <div>
              <p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase text-blue-200/90 animate-knd-fade-up">
                <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
                Kaay Niou Diang
              </p>

              <h2 className="mt-5 text-4xl sm:text-5xl md:text-6xl font-black leading-[1.05] tracking-tight animate-knd-fade-up knd-delay-100">
                {etudiant ? `Bon retour ${etudiant.nom.split(" ")[0]}.` : "Apprenez"}
                {/* Animated cycling word */}
                {!etudiant && (
                  <span className="block relative h-[1.1em] overflow-hidden">
                    {CYCLING_WORDS.map((w, i) => (
                      <span
                        key={w}
                        className="absolute left-0 text-transparent bg-clip-text bg-gradient-to-r from-orange-300 via-amber-200 to-blue-300 transition-all duration-700"
                        style={{
                          opacity: i === wordIdx ? 1 : 0,
                          transform: i === wordIdx ? "translateY(0)" : i < wordIdx ? "translateY(-100%)" : "translateY(100%)",
                        }}
                      >
                        {w}.
                      </span>
                    ))}
                  </span>
                )}
                {etudiant && (
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-300 via-white to-blue-200">
                    Cap sur le niveau {etudiant.niveauEtude}.
                  </span>
                )}
              </h2>

              <p className="mt-5 text-base sm:text-lg text-blue-100/90 max-w-xl leading-relaxed animate-knd-fade-up knd-delay-200">
                Cours YouTube, quiz intelligents, favoris &amp; notes locales — une expérience pensée pour la vie réelle des étudiants.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row gap-4 animate-knd-fade-up knd-delay-300">
                <button
                  onClick={() => navigate("/cours")}
                  className="px-8 py-4 rounded-2xl bg-orange-500 hover:bg-orange-400 text-white font-bold shadow-lg shadow-orange-500/30 transition hover:-translate-y-0.5 animate-knd-pulse-cta"
                >
                  Explorer les cours
                </button>
                <button
                  onClick={() => etudiant ? navigate("/tableau-bord") : navigate("/inscription")}
                  className="px-8 py-4 rounded-2xl knd-glass text-white font-semibold hover:bg-white/10 transition"
                >
                  {etudiant ? "Mon tableau de bord" : "Créer un compte"}
                </button>
              </div>

              <div ref={heroStatsRef} className="mt-12 grid grid-cols-3 gap-3 sm:gap-4 max-w-lg animate-knd-fade-up knd-delay-400">
                {[
                  { label: "Cours", val: countCours },
                  { label: "Étudiants inscrits", val: countEtudiants },
                  { label: "Livres", val: countLivres },
                ].map((s) => (
                  <div key={s.label} className="knd-glass rounded-2xl px-3 py-4 text-center">
                    <p className="text-2xl sm:text-3xl font-black tabular-nums">{s.val}</p>
                    <p className="text-[10px] sm:text-xs uppercase tracking-widest text-blue-100/80">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — image dots + feature tiles */}
            <div className="relative animate-knd-fade-up knd-delay-200">
              <div className="knd-glass rounded-3xl p-6 md:p-8 space-y-5">
                <p className="text-sm font-bold text-orange-200 uppercase tracking-widest">Aperçu plateforme</p>
                <div className="grid grid-cols-2 gap-3">
                  {["Cours & quiz", "Progression", "Tableau de bord", "Certificats"].map((t) => (
                    <div key={t} className="rounded-2xl bg-white/5 border border-white/10 px-4 py-5 text-sm font-semibold hover:bg-white/10 transition cursor-default">
                      {t}
                    </div>
                  ))}
                </div>
                {/* Slider thumbnail dots */}
                <div className="flex gap-2 justify-center pt-2">
                  {HERO_IMAGES.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setImgIdx(i)}
                      className={`transition-all rounded-full ${i === imgIdx ? "w-6 h-2 bg-orange-400" : "w-2 h-2 bg-white/30"}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TICKER MARQUEE ── */}
      <div className="bg-orange-500 py-3 overflow-hidden">
        <div className="knd-ticker inline-flex gap-10">
          {TICKER_ITEMS.map((item, i) => (
            <span key={i} className="text-white font-bold text-sm shrink-0 mx-4 flex items-center">{item.icon} {item.text}</span>
          ))}
        </div>
      </div>

      {/* ── Student block ── */}
      {etudiant && (
        <section className="bg-gradient-to-b from-slate-900 to-slate-950 border-b border-white/5">
          <div className="max-w-6xl mx-auto px-6 md:px-10 py-14">
            <h3 className="text-2xl md:text-3xl font-bold text-white">Votre accueil étudiant</h3>
            <p className="text-slate-400 mt-2">Niveau actuel : {etudiant.niveauEtude}</p>
            <div className="mt-8 grid md:grid-cols-3 gap-6">
              <div className="rounded-2xl bg-slate-800/80 border border-white/10 p-6">
                <p className="text-xs font-bold uppercase tracking-widest text-orange-300">Streak</p>
                <p className="text-4xl font-black mt-2 flex items-center gap-2"><Flame className="w-8 h-8 text-orange-500" /> {etudiant.streak ?? 0} jours</p>
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
                    <p className="font-bold mt-3 text-lg text-white">{dernierCours.titre}</p>
                    <button onClick={() => navigate(`/cours/${dernierCours.id}`)} className="mt-auto pt-4 w-full py-3 rounded-xl bg-white text-slate-900 font-bold hover:bg-orange-400 hover:text-white transition">
                      Continuer
                    </button>
                  </>
                ) : (
                  <button onClick={() => navigate("/cours")} className="mt-4 py-3 rounded-xl bg-blue-600 text-white font-bold">
                    Choisir un cours
                  </button>
                )}
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <button onClick={() => navigate("/favoris")} className="px-5 py-2.5 rounded-xl border border-white/20 text-sm font-semibold hover:bg-white/5 text-white flex items-center gap-2"><Heart className="w-4 h-4" /> Mes favoris</button>
              <button onClick={() => navigate("/profil")} className="px-5 py-2.5 rounded-xl border border-white/20 text-sm font-semibold hover:bg-white/5 text-white flex items-center gap-2"><User className="w-4 h-4" /> Mon profil</button>
            </div>
          </div>
        </section>
      )}

      {/* ── Features bento ── */}
      <SectionReveal>
        <section className="py-20 bg-white dark:bg-slate-950">
          <div className="max-w-6xl mx-auto px-6 md:px-10">
            <h3 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white">Une plateforme complète</h3>
            <p className="text-center text-gray-600 dark:text-slate-300 mt-3 max-w-2xl mx-auto">
              Une expérience e-learning fluide, lisible et motivante avec des parcours pratiques.
            </p>
            <div className="mt-12 grid md:grid-cols-3 gap-5">
              {[
                { t: "Parcours cours", d: "YouTube intégré, playlist, progression auto et quiz pour valider chaque module.", c: "from-blue-700 to-indigo-700" },
                { t: "Suivi intelligent", d: "Objectifs quotidiens, reprise rapide du dernier cours et indicateurs utiles.", c: "from-orange-600 to-rose-700" },
                { t: "Expérience immersive", d: "Interface premium claire en mode clair et confortable en mode sombre.", c: "from-emerald-600 to-teal-700" },
              ].map((b) => (
                <div key={b.t} className={`rounded-3xl p-8 bg-gradient-to-br ${b.c} border border-white/10 text-white shadow-xl hover:-translate-y-1 transition-transform duration-300`}>
                  <h4 className="text-xl font-bold">{b.t}</h4>
                  <p className="mt-3 text-sm text-white/90 leading-relaxed">{b.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </SectionReveal>

      {/* ── Domains ── */}
      <SectionReveal>
        <section className="py-16 bg-gray-100 dark:bg-slate-900/50 border-y border-gray-200 dark:border-white/5">
          <div className="max-w-6xl mx-auto px-6 md:px-10 text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Domaines couverts</h3>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {categoriesUniques.map((cat) => (
                <span key={cat} className="px-4 py-2 rounded-full text-sm font-semibold bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-blue-700 dark:text-blue-100 hover:border-orange-400/50 transition cursor-default">
                  {cat}
                </span>
              ))}
            </div>
          </div>
        </section>
      </SectionReveal>

      {/* ── Popular courses ── */}
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
          <div className="mt-10 flex justify-center">
            <button onClick={() => navigate("/cours")} className="px-8 py-3 rounded-2xl bg-orange-500 text-white font-bold hover:bg-orange-400 transition">
              Voir tout le catalogue
            </button>
          </div>
        </section>
      </SectionReveal>

      {/* ── Universities ── */}
      <SectionReveal>
        <section className="py-16 bg-gray-100 dark:bg-slate-900/30 border-y border-gray-200 dark:border-white/5">
          <div className="max-w-6xl mx-auto px-6 md:px-10">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white text-center">Universités prestigieuses</h3>
            <p className="text-center text-gray-600 dark:text-slate-300 mt-3 max-w-2xl mx-auto">Accédez aux cours des plus grandes universités du monde.</p>
            <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { name: "Harvard", img: "https://images.unsplash.com/photo-1562774053-701939374585?w=600&auto=format&fit=crop", count: "6 cours" },
                { name: "MIT", img: "https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=600&auto=format&fit=crop", count: "3 cours" },
                { name: "Stanford", img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop", count: "3 cours" },
                { name: "Oxford", img: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&auto=format&fit=crop", count: "3 cours" },
              ].map((u) => (
                <button key={u.name} onClick={() => navigate(`/cours?university=${encodeURIComponent(u.name)}`)}
                  className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden text-left hover:-translate-y-1 transition-all shadow-sm hover:shadow-lg group">
                  <div className="h-32 overflow-hidden">
                    <img src={u.img} alt={u.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-4">
                    <p className="font-bold text-slate-900 dark:text-white">{u.name}</p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-medium">{u.count} disponibles</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      </SectionReveal>

      {/* ── Testimonials ── */}
      <SectionReveal>
        <section className="py-16 bg-gray-100 dark:bg-slate-900/30 border-y border-gray-200 dark:border-white/5">
          <div className="max-w-6xl mx-auto px-6 md:px-10">
            <h3 className="text-3xl font-bold text-center text-gray-900 dark:text-white">Témoignages</h3>
            <div className="mt-10 grid md:grid-cols-3 gap-6">
              {temoignages.map((t) => (
                <div key={t.nom} className="[&_p]:text-gray-800 dark:[&_p]:text-slate-100 [&_h3]:text-gray-900 dark:[&_h3]:text-white">
                  <CarteTemoignage nom={t.nom} texte={t.texte} />
                </div>
              ))}
            </div>
          </div>
        </section>
      </SectionReveal>

      {/* ── About ── */}
      <SectionReveal>
        <section id="a-propos" className="py-16 max-w-6xl mx-auto px-6 md:px-10">
          <div className="rounded-3xl p-8 md:p-12 border border-slate-200 dark:border-slate-700 bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100 shadow-xl">
            <h3 className="text-3xl md:text-4xl font-bold">À propos de Kaay Niou Diang</h3>
            <p className="mt-4 text-slate-700 dark:text-slate-200 leading-relaxed">
              Kaay Niou Diang est une plateforme d&apos;apprentissage en ligne qui aide les étudiants à apprendre à leur rythme avec des cours clairs, des quiz utiles et une progression motivante.
            </p>
            <div className="mt-8 grid md:grid-cols-3 gap-4">
              {[
                { titre: "Notre mission", texte: "Rendre l'apprentissage accessible avec des contenus pratiques, progressifs et modernes." },
                { titre: "Notre méthode", texte: "Chaque cours suit une structure simple : leçons, notes personnelles, quiz et progression." },
                { titre: "Notre vision", texte: "Construire une génération d'apprenants autonomes capables d'évoluer en continu." },
              ].map((item) => (
                <div key={item.titre} className="rounded-2xl bg-slate-50 border border-slate-200 p-5 dark:bg-slate-800 dark:border-slate-700">
                  <h4 className="font-bold text-slate-900 dark:text-white">{item.titre}</h4>
                  <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{item.texte}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </SectionReveal>

      {/* ── IMAGE SHOWCASE (visiteurs uniquement) ── */}
      {!etudiant && (
        <SectionReveal>
          <section className="py-20 bg-gradient-to-b from-slate-950 to-slate-900 overflow-hidden relative">
            {/* Ambient blobs */}
            <div className="pointer-events-none absolute top-0 left-1/4 w-96 h-96 rounded-full bg-blue-600/10 blur-3xl" aria-hidden />
            <div className="pointer-events-none absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-orange-500/10 blur-3xl" aria-hidden />

            <div className="max-w-6xl mx-auto px-6 md:px-10 relative z-10">
              <div className="text-center mb-16">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-300 text-xs font-black uppercase tracking-[0.2em] mb-4">
                  <Sparkles className="w-3.5 h-3.5" /> Pourquoi nous choisir
                </span>
                <h3 className="text-3xl md:text-5xl font-black text-white leading-tight">
                  Une expérience conçue pour<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-blue-400">votre réussite</span>
                </h3>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {/* Card 1 — Apprentissage */}
                <div
                  className="group relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
                  style={{ animation: "floatCard 6s ease-in-out infinite" }}
                >
                  <div className="h-64 overflow-hidden">
                    <img
                      src="/images/apprentissage.png"
                      alt="Apprentissage interactif"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <GraduationCap className="w-6 h-6 text-blue-300" />
                      <span className="px-2 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-[10px] font-black uppercase tracking-widest">Apprentissage</span>
                    </div>
                    <h4 className="font-black text-white text-xl">Cours interactifs</h4>
                    <p className="text-slate-300 text-sm mt-1 leading-relaxed">
                      Des vidéos, quiz et explications IA pour maîtriser chaque sujet à votre rythme.
                    </p>
                  </div>
                </div>

                {/* Card 2 — Certificats (légèrement décalée vers le bas) */}
                <div
                  className="group relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl md:mt-10"
                  style={{ animation: "floatCard 6s ease-in-out infinite 2s" }}
                >
                  <div className="h-64 overflow-hidden">
                    <img
                      src="/images/certificat.png"
                      alt="Certificats reconnus"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <BadgeCheck className="w-6 h-6 text-orange-300" />
                      <span className="px-2 py-0.5 rounded-full bg-orange-500/20 border border-orange-400/30 text-orange-300 text-[10px] font-black uppercase tracking-widest">Certificats</span>
                    </div>
                    <h4 className="font-black text-white text-xl">Validez vos compétences</h4>
                    <p className="text-slate-300 text-sm mt-1 leading-relaxed">
                      Obtenez des certificats reconnus après chaque parcours complété avec succès.
                    </p>
                  </div>
                </div>

                {/* Card 3 — Qualité */}
                <div
                  className="group relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
                  style={{ animation: "floatCard 6s ease-in-out infinite 4s" }}
                >
                  <div className="h-64 overflow-hidden">
                    <img
                      src="/images/qualite.png"
                      alt="Qualité pédagogique"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="w-6 h-6 text-emerald-300" />
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-black uppercase tracking-widest">Qualité</span>
                    </div>
                    <h4 className="font-black text-white text-xl">Contenu premium</h4>
                    <p className="text-slate-300 text-sm mt-1 leading-relaxed">
                      Une IA Mistral intégrée pour des explications toujours à la hauteur.
                    </p>
                  </div>
                </div>
              </div>

              {/* Animated stats row */}
              <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { val: "50+", label: "Livres numériques", icon: <Library className="w-8 h-8 mx-auto text-blue-300" /> },
                  { val: "100%", label: "Gratuit à l'inscription", icon: <Unlock className="w-8 h-8 mx-auto text-emerald-300" /> },
                  { val: "24/7", label: "IA disponible", icon: <Bot className="w-8 h-8 mx-auto text-orange-300" /> },
                  { val: "∞", label: "Progression illimitée", icon: <Rocket className="w-8 h-8 mx-auto text-purple-300" /> },
                ].map((stat, i) => (
                  <div
                    key={stat.label}
                    className="text-center p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all hover:-translate-y-1"
                    style={{ animation: `fadeSlideUp 0.6s ease-out ${i * 0.15}s both` }}
                  >
                    <div className="flex justify-center mb-2">{stat.icon}</div>
                    <p className="text-3xl font-black text-white mt-3">{stat.val}</p>
                    <p className="text-slate-400 text-xs mt-1 font-medium">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <style>{`
              @keyframes floatCard {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-10px); }
              }
              @keyframes fadeSlideUp {
                from { opacity: 0; transform: translateY(30px); }
                to { opacity: 1; transform: translateY(0); }
              }
            `}</style>
          </section>
        </SectionReveal>
      )}

      {/* ── CTA ── */}
      <SectionReveal>
        <section className="pb-20 max-w-6xl mx-auto px-6 md:px-10">
          <div className="rounded-3xl border border-orange-300/60 dark:border-orange-500/30 bg-gradient-to-r from-orange-100 via-blue-100 to-indigo-100 dark:from-orange-500/20 dark:via-blue-600/20 dark:to-indigo-600/20 p-10 text-center shadow-xl">
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Prêt à rejoindre l'aventure ?</h3>
            <p className="mt-3 text-slate-700 dark:text-slate-200 max-w-xl mx-auto">Inscription rapide, tableaux de bord épurés et navigation fluide sur mobile.</p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <button onClick={() => navigate("/inscription")} className="px-8 py-3 rounded-2xl bg-orange-500 text-white font-bold hover:bg-orange-400 transition">Je m'inscris</button>
              <button onClick={() => navigate("/connexion")} className="px-8 py-3 rounded-2xl border border-slate-400/60 dark:border-white/40 text-slate-900 dark:text-white font-semibold hover:bg-white/50 dark:hover:bg-white/10">J'ai déjà un compte</button>
            </div>
          </div>
        </section>
      </SectionReveal>


      <div className="[&_footer]:mt-0"><PiedPage /></div>
    </div>
  );
}

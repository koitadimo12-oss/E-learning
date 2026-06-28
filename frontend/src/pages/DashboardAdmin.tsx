import { useEffect, useState, useMemo } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import {
  BarChart, GraduationCap, BookOpen, Library, Shield, LogOut,
  Trophy, AlertTriangle, Medal, Plus, Edit, Trash2, Search, Crown, Flame
} from "lucide-react";
import EnteteRetour from "../composants/EnteteRetour";
import { deconnexionAdmin, estAdminConnecte } from "../services/adminService";
import type { Chapitre, Cours } from "../services/coursService";
import {
  chargerCours,
  creerCours,
  getCoursCache,
  modifierCours,
  supprimerCours,
} from "../services/coursApi";
import { listeEtudiants, type Etudiant } from "../services/etudiantService";
import { listeTousCommentairesCours, supprimerCommentaireCours } from "../services/commentairesService";
import { creerLivre, listerLivres, supprimerLivre, type Livre } from "../services/livresApi";

const CATEGORIES = ["Programmation", "Developpement Web", "Data", "Science", "Soft Skills"] as const;
const NIVEAUX = ["Debutant", "Intermediaire"] as const;

type ChapitreForm = { titre: string; videoYoutube: string; duree: string };

function youtubeEmbed(url: string): string {
  const u = url.trim();
  if (!u) return "";
  if (u.includes("/embed/")) return u;
  const m = u.match(/(?:youtu\.be\/|v=|shorts\/)([A-Za-z0-9_-]{11})/);
  if (m) return `https://www.youtube.com/embed/${m[1]}`;
  return u;
}

function chapitreVide(): ChapitreForm {
  return { titre: "", videoYoutube: "", duree: "30 min" };
}

/* ═══════════════════════════════════════════
   PALETTE DIAGRAMMES
   ═══════════════════════════════════════════ */
const CHART_COLORS = [
  "#6366f1", // indigo
  "#f97316", // orange
  "#06b6d4", // cyan
  "#10b981", // emerald
  "#f43f5e", // rose
  "#a855f7", // purple
  "#eab308", // yellow
];

/* ═══════════════════════════════════════════
   SVG — DONUT CHART
   ═══════════════════════════════════════════ */
function DonutChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) return <p className="text-sm text-gray-400 text-center py-8">Aucune donnée</p>;

  const radius = 80;
  const cx = 110;
  const cy = 110;
  const stroke = 32;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="flex flex-col lg:flex-row items-center gap-6">
      <svg width="220" height="220" viewBox="0 0 220 220" className="shrink-0">
        {data.map((d, i) => {
          const pct = d.value / total;
          const dashLen = pct * circumference;
          const dashOffset = -offset * circumference;
          offset += pct;
          return (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={radius}
              fill="none"
              stroke={d.color}
              strokeWidth={stroke}
              strokeDasharray={`${dashLen} ${circumference - dashLen}`}
              strokeDashoffset={dashOffset}
              transform={`rotate(-90 ${cx} ${cy})`}
              className="transition-all duration-700"
              style={{ opacity: 0.92 }}
            />
          );
        })}
        <text x={cx} y={cy - 6} textAnchor="middle" className="fill-gray-800 dark:fill-white text-2xl font-black">{total}</text>
        <text x={cx} y={cy + 14} textAnchor="middle" className="fill-gray-500 dark:fill-slate-400 text-[11px]">cours</text>
      </svg>
      <div className="grid grid-cols-2 gap-x-6 gap-y-2">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            <span className="w-3 h-3 rounded-full shrink-0" style={{ background: d.color }} />
            <span className="text-gray-700 dark:text-slate-300 font-medium truncate">{d.label}</span>
            <span className="font-bold text-gray-900 dark:text-white ml-auto">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   SVG — HORIZONTAL BAR CHART
   ═══════════════════════════════════════════ */
function BarChartH({ data }: { data: { label: string; value: number; color: string }[] }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  if (data.length === 0) return <p className="text-sm text-gray-400 text-center py-8">Aucune donnée</p>;

  return (
    <div className="space-y-3">
      {data.map((d, i) => (
        <div key={i} className="flex items-center gap-3">
          <span className="text-xs font-medium text-gray-600 dark:text-slate-400 w-32 truncate text-right">{d.label}</span>
          <div className="flex-1 h-7 rounded-lg bg-gray-100 dark:bg-slate-800 overflow-hidden relative">
            <div
              className="h-full rounded-lg transition-all duration-1000 ease-out"
              style={{ width: `${(d.value / max) * 100}%`, background: d.color, minWidth: d.value > 0 ? "24px" : 0 }}
            />
          </div>
          <span className="text-sm font-bold text-gray-900 dark:text-white w-8 text-right">{d.value}</span>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════
   SVG — PROGRESS RING
   ═══════════════════════════════════════════ */
function ProgressRing({ percent, label, color = "#6366f1" }: { percent: number; label: string; color?: string }) {
  const r = 60;
  const circ = 2 * Math.PI * r;
  const dashLen = (percent / 100) * circ;

  return (
    <div className="flex flex-col items-center gap-3">
      <svg width="150" height="150" viewBox="0 0 150 150">
        <circle cx="75" cy="75" r={r} fill="none" stroke="currentColor" strokeWidth="10" className="text-gray-200 dark:text-slate-800" />
        <circle
          cx="75" cy="75" r={r} fill="none"
          stroke={color} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={`${dashLen} ${circ - dashLen}`}
          transform="rotate(-90 75 75)"
          className="transition-all duration-1000"
        />
        <text x="75" y="70" textAnchor="middle" className="fill-gray-800 dark:fill-white text-2xl font-black">{Math.round(percent)}%</text>
        <text x="75" y="90" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400 text-[10px]">complétion</text>
      </svg>
      <p className="text-sm font-semibold text-gray-700 dark:text-slate-300">{label}</p>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MINI SPARKLINE
   ═══════════════════════════════════════════ */
function Sparkline({ data, color = "#6366f1" }: { data: number[]; color?: string }) {
  if (data.length < 2) return null;
  const max = Math.max(...data, 1);
  const w = 100;
  const h = 32;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - (v / max) * h}`).join(" ");

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="mt-2 opacity-60">
      <polyline fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={points} />
    </svg>
  );
}

/* ═══════════════════════════════════════════
   STAT CARD PREMIUM
   ═══════════════════════════════════════════ */
function StatCardPremium({
  label, value, icon, gradient, sparkData, suffix = "",
}: {
  label: string; value: number; icon: React.ReactNode; gradient: string; sparkData?: number[]; suffix?: string;
}) {
  return (
    <div
      className="relative rounded-2xl p-5 overflow-hidden border border-white/10 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 group"
      style={{ animation: "knd-fade-up 0.65s cubic-bezier(0.22,1,0.36,1) both" }}
    >
      {/* Gradient bg */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-90`} />
      {/* Glass layer */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
      {/* Decorative blob */}
      <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/10 blur-xl group-hover:scale-125 transition-transform duration-500" />

      <div className="relative z-10 text-white">
        <div className="flex items-center justify-between">
          <span className="text-3xl">{icon}</span>
          {sparkData && <Sparkline data={sparkData} color="rgba(255,255,255,0.5)" />}
        </div>
        <p className="mt-3 text-3xl font-black tabular-nums">
          {value.toLocaleString("fr-FR")}{suffix}
        </p>
        <p className="mt-1 text-sm font-medium text-white/80">{label}</p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN DASHBOARD
   ═══════════════════════════════════════════ */
export default function DashboardAdmin() {
  const navigate = useNavigate();
  if (!estAdminConnecte()) return <Navigate to="/admin" replace />;

  const [version, setVersion] = useState(0);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [etudiants, setEtudiants] = useState<Etudiant[]>([]);
  const [listeCours, setListeCours] = useState<Cours[]>(() => getCoursCache());
  const [livres, setLivres] = useState<Livre[]>([]);
  const [rechercheCours, setRechercheCours] = useState("");
  const [coursOuvert, setCoursOuvert] = useState<number | null>(null);
  const [coursEnEdition, setCoursEnEdition] = useState<number | null>(null);
  const [nouveauCours, setNouveauCours] = useState({
    titre: "",
    description: "",
    instructeur: "",
    categorie: "Programmation" as (typeof CATEGORIES)[number],
    niveau: "Debutant" as (typeof NIVEAUX)[number],
    duree: "2h 00",
    image: "",
  });
  const [chapitresForm, setChapitresForm] = useState<ChapitreForm[]>([
    { titre: "Introduction", videoYoutube: "", duree: "30 min" },
  ]);
  const [editChapitres, setEditChapitres] = useState<ChapitreForm[]>([]);
  const [nouveauLivre, setNouveauLivre] = useState({ title: "", author: "", description: "", pdfUrl: "" });
  const [commentaires, setCommentaires] = useState(() => listeTousCommentairesCours());

  const rechargerDonnees = async () => {
    const [etu, cours, books] = await Promise.all([
      listeEtudiants(),
      chargerCours(true),
      listerLivres().catch(() => [] as Livre[]),
    ]);
    setEtudiants(etu);
    setListeCours(cours);
    setLivres(books);
  };

  useEffect(() => { void rechargerDonnees(); }, [version]);
  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [activeTab]);

  /* ── derived data for charts ── */
  const categoryCounts = useMemo(() => {
    const map: Record<string, number> = {};
    listeCours.forEach((c) => {
      const cat = c.categorie || "Autre";
      map[cat] = (map[cat] || 0) + 1;
    });
    return Object.entries(map).map(([label, value], i) => ({
      label,
      value,
      color: CHART_COLORS[i % CHART_COLORS.length],
    }));
  }, [listeCours]);

  const topCoursSuivis = useMemo(() => {
    const countMap: Record<number, number> = {};
    etudiants.forEach((e) => {
      e.coursSuivis.forEach((cs) => {
        countMap[cs.idCours] = (countMap[cs.idCours] || 0) + 1;
      });
    });
    return Object.entries(countMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 6)
      .map(([id, count], i) => {
        const cours = listeCours.find((c) => c.id === Number(id));
        return {
          label: cours?.titre?.slice(0, 28) || `Cours #${id}`,
          value: count,
          color: CHART_COLORS[i % CHART_COLORS.length],
        };
      });
  }, [etudiants, listeCours]);

  const tauxCompletion = useMemo(() => {
    if (etudiants.length === 0) return 0;
    const totalProg = etudiants.reduce((sum, e) => {
      const avg = e.coursSuivis.length > 0
        ? e.coursSuivis.reduce((s, cs) => s + cs.progression, 0) / e.coursSuivis.length
        : 0;
      return sum + avg;
    }, 0);
    return Math.round(totalProg / etudiants.length);
  }, [etudiants]);

  const etudiantsActifsStreak = useMemo(() => etudiants.filter((e) => (e.streak ?? 0) > 0).length, [etudiants]);

  const coursSansVideo = listeCours.filter(
    (c) => !c.chapitres?.length || c.chapitres.every((ch) => !ch.videoYoutube?.trim())
  ).length;

  // Fake sparkline data (simulated activity trends)
  const sparkEtudiants = useMemo(() => {
    const n = etudiants.length;
    return [Math.round(n * 0.3), Math.round(n * 0.5), Math.round(n * 0.65), Math.round(n * 0.8), n];
  }, [etudiants.length]);

  const sparkCours = useMemo(() => {
    const n = listeCours.length;
    return [Math.round(n * 0.4), Math.round(n * 0.55), Math.round(n * 0.7), Math.round(n * 0.85), n];
  }, [listeCours.length]);

  // Niveaux distribution
  const niveauxDistrib = useMemo(() => {
    const counts: Record<string, number> = { "Débutant": 0, "Intermédiaire": 0, "Avancé": 0 };
    etudiants.forEach((e) => { counts[e.niveauEtude] = (counts[e.niveauEtude] || 0) + 1; });
    return [
      { label: "Débutant", value: counts["Débutant"], color: "#06b6d4" },
      { label: "Intermédiaire", value: counts["Intermédiaire"], color: "#f97316" },
      { label: "Avancé", value: counts["Avancé"], color: "#6366f1" },
    ];
  }, [etudiants]);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <BarChart className="w-5 h-5" /> },
    { id: "etudiants", label: "Étudiants", icon: <GraduationCap className="w-5 h-5" /> },
    { id: "cours", label: "Cours", icon: <BookOpen className="w-5 h-5" /> },
    { id: "livres", label: "Livres", icon: <Library className="w-5 h-5" /> },
    { id: "moderation", label: "Modération", icon: <Shield className="w-5 h-5" /> },
  ];

  const activeLabel = menuItems.find((item) => item.id === activeTab)?.label ?? "Dashboard";

  const coursFiltres = listeCours.filter((c) =>
    c.titre.toLowerCase().includes(rechercheCours.toLowerCase()) ||
    c.instructeur.toLowerCase().includes(rechercheCours.toLowerCase())
  );

  const buildChapitresPayload = (rows: ChapitreForm[]): Chapitre[] =>
    rows
      .filter((ch) => ch.titre.trim() && ch.videoYoutube.trim())
      .map((ch, i) => ({
        id: i + 1,
        titre: ch.titre.trim(),
        duree: ch.duree.trim() || "30 min",
        videoYoutube: youtubeEmbed(ch.videoYoutube),
        contenu: [],
      }));

  const ouvrirEdition = (c: Cours) => {
    setCoursEnEdition(c.id);
    setEditChapitres(
      c.chapitres?.length
        ? c.chapitres.map((ch) => ({
            titre: ch.titre,
            videoYoutube: ch.videoYoutube,
            duree: ch.duree,
          }))
        : [chapitreVide()]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-gray-900 dark:text-slate-100">
      <EnteteRetour to="/" label="Accueil" titre={<span className="flex items-center gap-2"><Crown className="w-5 h-5 text-amber-500" /> Dashboard Admin — Kaay Niou Diang</span>} />

      <main className="max-w-[1400px] mx-auto px-4 md:px-6 py-8 grid lg:grid-cols-[280px,1fr] gap-6">
        {/* ═══ SIDEBAR ═══ */}
        <aside className="rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-gray-200/60 dark:border-slate-700/60 p-5 h-fit lg:sticky lg:top-6 shadow-lg">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200 dark:border-slate-700">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white text-lg font-black shadow-lg shadow-indigo-500/30">
              K
            </div>
            <div>
              <p className="font-bold text-sm text-gray-900 dark:text-white">Admin KND</p>
              <p className="text-[11px] text-gray-500 dark:text-slate-400">Kaay Niou Diang</p>
            </div>
          </div>
          <nav className="space-y-1.5">
            {menuItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-3 transition-all duration-200 ${
                  activeTab === item.id
                    ? "bg-gradient-to-r from-indigo-500/15 to-purple-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-700/40 shadow-sm"
                    : "hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-slate-400"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => { deconnexionAdmin(); navigate("/"); }}
              className="w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition flex items-center gap-2"
            >
              <LogOut className="w-5 h-5" /> Déconnexion
            </button>
          </div>
        </aside>

        {/* ═══ CONTENT ═══ */}
        <section className="space-y-6 min-w-0">
          {/* Top bar */}
          <div className="rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-gray-200/60 dark:border-slate-700/60 p-5 flex flex-wrap justify-between items-center gap-3 shadow-sm">
            <div>
              <p className="text-xl font-black text-gray-900 dark:text-white">{activeLabel}</p>
              <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">Données synchronisées avec l&apos;API NestJS + MySQL</p>
            </div>
            <button
              type="button"
              onClick={() => setVersion((v) => v + 1)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-bold hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/25 transition-all hover:-translate-y-0.5"
            >
              ↻ Actualiser
            </button>
          </div>

          {/* ═══════════════ TAB: DASHBOARD ═══════════════ */}
          {activeTab === "dashboard" && (
            <>
              {/* Stats cards grid */}
              <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <StatCardPremium label="Étudiants inscrits" value={etudiants.length} icon={<GraduationCap className="w-8 h-8 text-white" />} gradient="from-blue-600 to-cyan-500" sparkData={sparkEtudiants} />
                <StatCardPremium label="Cours disponibles" value={listeCours.length} icon={<BookOpen className="w-8 h-8 text-white" />} gradient="from-indigo-600 to-purple-600" sparkData={sparkCours} />
                <StatCardPremium label="Livres en bibliothèque" value={livres.length} icon={<Library className="w-8 h-8 text-white" />} gradient="from-emerald-600 to-teal-500" />
                <StatCardPremium label="Étudiants actifs (streak)" value={etudiantsActifsStreak} icon={<Trophy className="w-8 h-8 text-white" />} gradient="from-orange-500 to-rose-500" suffix="" />
              </div>

              {/* Row 2 — Completion + Alert */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-gray-200/60 dark:border-slate-700/60 p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-1">
                    <Trophy className="w-6 h-6 text-indigo-500" />
                    <p className="font-bold text-gray-900 dark:text-white">Taux de complétion moyen</p>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-slate-400 mb-5">Moyenne de progression des étudiants sur leurs cours</p>
                  <div className="flex justify-center">
                    <ProgressRing percent={tauxCompletion} label="Complétion globale" color="#6366f1" />
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Alert card */}
                  {coursSansVideo > 0 && (
                    <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/10 border border-amber-200 dark:border-amber-800/50 p-5 shadow-sm">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0" />
                        <div>
                          <p className="font-bold text-amber-900 dark:text-amber-200">{coursSansVideo} cours sans vidéo</p>
                          <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                            Ces cours n&apos;ont aucun lien YouTube.{" "}
                            <button type="button" className="underline font-bold" onClick={() => setActiveTab("cours")}>
                              Corriger →
                            </button>
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  {/* Niveaux */}
                  <div className="rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-gray-200/60 dark:border-slate-700/60 p-5 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <GraduationCap className="w-6 h-6 text-indigo-500" />
                      <p className="font-bold text-gray-900 dark:text-white">Niveaux des étudiants</p>
                    </div>
                    <BarChartH data={niveauxDistrib} />
                  </div>
                </div>
              </div>

              {/* Row 3 — Charts */}
              <div className="grid lg:grid-cols-2 gap-4">
                {/* Donut chart */}
                <div className="rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-gray-200/60 dark:border-slate-700/60 p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-5">
                    <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white">
                      <BarChart className="w-4 h-4" />
                    </span>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">Répartition par catégorie</p>
                      <p className="text-xs text-gray-500 dark:text-slate-400">Distribution des cours par domaine</p>
                    </div>
                  </div>
                  <DonutChart data={categoryCounts} />
                </div>

                {/* Bar chart — top cours */}
                <div className="rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-gray-200/60 dark:border-slate-700/60 p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-5">
                    <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center text-white">
                      <Medal className="w-4 h-4" />
                    </span>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">Top cours suivis</p>
                      <p className="text-xs text-gray-500 dark:text-slate-400">Cours avec le plus d&apos;inscriptions</p>
                    </div>
                  </div>
                  <BarChartH data={topCoursSuivis} />
                </div>
              </div>

              {/* Row 4 — Quick stats mini cards */}
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-gray-200/60 dark:border-slate-700/60 p-5 shadow-sm text-center">
                  <p className="text-3xl font-black text-indigo-600 dark:text-indigo-400">
                    {listeCours.reduce((s, c) => s + (c.chapitres?.length ?? 0), 0)}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Chapitres au total</p>
                </div>
                <div className="rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-gray-200/60 dark:border-slate-700/60 p-5 shadow-sm text-center">
                  <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                    {listeCours.reduce((s, c) => s + (c.chapitres?.filter(ch => ch.videoYoutube?.trim()).length ?? 0), 0)}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Vidéos YouTube</p>
                </div>
                <div className="rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-gray-200/60 dark:border-slate-700/60 p-5 shadow-sm text-center">
                  <p className="text-3xl font-black text-orange-600 dark:text-orange-400">
                    {commentaires.length}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Commentaires</p>
                </div>
              </div>
            </>
          )}

          {/* ═══════════════ TAB: ETUDIANTS ═══════════════ */}
          {activeTab === "etudiants" && (
            <section className="rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-gray-200/60 dark:border-slate-700/60 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <GraduationCap className="w-6 h-6 text-indigo-600" /> Étudiants inscrits
                  <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300">{etudiants.length}</span>
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-slate-700">
                      <th className="text-left py-3 px-4 font-bold text-gray-500 dark:text-slate-400 text-xs uppercase tracking-wider">Nom</th>
                      <th className="text-left py-3 px-4 font-bold text-gray-500 dark:text-slate-400 text-xs uppercase tracking-wider">Email</th>
                      <th className="text-left py-3 px-4 font-bold text-gray-500 dark:text-slate-400 text-xs uppercase tracking-wider">Niveau</th>
                      <th className="text-center py-3 px-4 font-bold text-gray-500 dark:text-slate-400 text-xs uppercase tracking-wider">Cours</th>
                      <th className="text-center py-3 px-4 font-bold text-gray-500 dark:text-slate-400 text-xs uppercase tracking-wider">Streak</th>
                      <th className="text-center py-3 px-4 font-bold text-gray-500 dark:text-slate-400 text-xs uppercase tracking-wider">Points</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                    {etudiants.map((e) => (
                      <tr key={e.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition">
                        <td className="py-3 px-4 font-semibold text-gray-900 dark:text-white">{e.nom}</td>
                        <td className="py-3 px-4 text-gray-600 dark:text-slate-400">{e.email}</td>
                        <td className="py-3 px-4">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                            e.niveauEtude === "Débutant" ? "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300" :
                            e.niveauEtude === "Avancé" ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300" :
                            "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
                          }`}>
                            {e.niveauEtude}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center font-bold">{e.coursSuivis.length}</td>
                        <td className="py-3 px-4 text-center">
                          {(e.streak ?? 0) > 0 ? <span className="text-orange-500 font-bold flex items-center justify-center gap-1"><Flame className="w-4 h-4" /> {e.streak}</span> : <span className="text-gray-400">—</span>}
                        </td>
                        <td className="py-3 px-4 text-center font-bold text-indigo-600 dark:text-indigo-400">{e.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {etudiants.length === 0 && <p className="text-sm text-gray-500 text-center py-8">Aucun étudiant pour le moment.</p>}
              </div>
            </section>
          )}

          {/* ═══════════════ TAB: COURS ═══════════════ */}
          {activeTab === "cours" && (
            <section className="rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-gray-200/60 dark:border-slate-700/60 p-6 space-y-6 shadow-sm">
              <div className="flex flex-wrap justify-between gap-3 items-center">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-indigo-600" /> Gestion des cours &amp; vidéos YouTube
                  <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300">{listeCours.length}</span>
                </h2>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      className="rounded-xl border border-gray-200 dark:border-slate-700 pl-10 pr-4 py-2.5 text-sm bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500/30 focus:outline-none transition w-full md:w-auto"
                      placeholder="Rechercher un cours…"
                      value={rechercheCours}
                      onChange={(e) => setRechercheCours(e.target.value)}
                    />
                  </div>
              </div>

              {/* Formulaire création */}
              <form
                className="border border-gray-200 dark:border-slate-700 rounded-2xl p-5 space-y-4 bg-gradient-to-br from-indigo-50/50 to-purple-50/30 dark:from-slate-800/50 dark:to-slate-800/30"
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!nouveauCours.titre.trim()) return;
                  const chapitres = buildChapitresPayload(chapitresForm);
                  if (chapitres.length === 0) {
                    alert("Ajoutez au moins un chapitre avec un lien YouTube.");
                    return;
                  }
                  await creerCours({
                    ...nouveauCours,
                    image: nouveauCours.image || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600",
                    chapitres,
                    quiz: [],
                  });
                  setNouveauCours({ titre: "", description: "", instructeur: "", categorie: "Programmation", niveau: "Debutant", duree: "2h 00", image: "" });
                  setChapitresForm([{ titre: "Introduction", videoYoutube: "", duree: "30 min" }]);
                  setVersion((v) => v + 1);
                }}
              >
                <p className="font-bold text-indigo-700 dark:text-indigo-300 flex items-center gap-2"><Plus className="w-5 h-5" /> Nouveau cours</p>
                <div className="grid md:grid-cols-2 gap-3">
                  <input className="rounded-xl border border-gray-200 dark:border-slate-700 px-4 py-2.5 text-sm bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500/30 focus:outline-none" placeholder="Titre du cours *" value={nouveauCours.titre} onChange={(e) => setNouveauCours({ ...nouveauCours, titre: e.target.value })} required />
                  <input className="rounded-xl border border-gray-200 dark:border-slate-700 px-4 py-2.5 text-sm bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500/30 focus:outline-none" placeholder="Instructeur" value={nouveauCours.instructeur} onChange={(e) => setNouveauCours({ ...nouveauCours, instructeur: e.target.value })} />
                  <select className="rounded-xl border border-gray-200 dark:border-slate-700 px-4 py-2.5 text-sm bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500/30 focus:outline-none" value={nouveauCours.categorie} onChange={(e) => setNouveauCours({ ...nouveauCours, categorie: e.target.value as typeof nouveauCours.categorie })}>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <select className="rounded-xl border border-gray-200 dark:border-slate-700 px-4 py-2.5 text-sm bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500/30 focus:outline-none" value={nouveauCours.niveau} onChange={(e) => setNouveauCours({ ...nouveauCours, niveau: e.target.value as typeof nouveauCours.niveau })}>
                    {NIVEAUX.map((n) => <option key={n} value={n}>{n}</option>)}
                  </select>
                  <input className="rounded-xl border border-gray-200 dark:border-slate-700 px-4 py-2.5 text-sm bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500/30 focus:outline-none" placeholder="Durée (ex: 2h 30)" value={nouveauCours.duree} onChange={(e) => setNouveauCours({ ...nouveauCours, duree: e.target.value })} />
                  <input className="rounded-xl border border-gray-200 dark:border-slate-700 px-4 py-2.5 text-sm bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500/30 focus:outline-none" placeholder="URL image (optionnel)" value={nouveauCours.image} onChange={(e) => setNouveauCours({ ...nouveauCours, image: e.target.value })} />
                  <textarea className="rounded-xl border border-gray-200 dark:border-slate-700 px-4 py-2.5 text-sm bg-white dark:bg-slate-800 md:col-span-2 focus:ring-2 focus:ring-indigo-500/30 focus:outline-none" placeholder="Description" rows={2} value={nouveauCours.description} onChange={(e) => setNouveauCours({ ...nouveauCours, description: e.target.value })} />
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-semibold">Chapitres &amp; liens YouTube *</p>
                  {chapitresForm.map((ch, idx) => (
                    <div key={idx} className="grid md:grid-cols-[1fr,2fr,auto,auto] gap-2 items-center">
                      <input className="rounded-xl border border-gray-200 dark:border-slate-700 px-3 py-2 text-sm bg-white dark:bg-slate-800" placeholder="Titre chapitre" value={ch.titre} onChange={(e) => { const n = [...chapitresForm]; n[idx] = { ...n[idx], titre: e.target.value }; setChapitresForm(n); }} />
                      <input className="rounded-xl border border-gray-200 dark:border-slate-700 px-3 py-2 text-sm bg-white dark:bg-slate-800" placeholder="Lien YouTube (watch ou embed) *" value={ch.videoYoutube} onChange={(e) => { const n = [...chapitresForm]; n[idx] = { ...n[idx], videoYoutube: e.target.value }; setChapitresForm(n); }} required={idx === 0} />
                      <input className="rounded-xl border border-gray-200 dark:border-slate-700 px-3 py-2 text-sm bg-white dark:bg-slate-800 w-24" placeholder="Durée" value={ch.duree} onChange={(e) => { const n = [...chapitresForm]; n[idx] = { ...n[idx], duree: e.target.value }; setChapitresForm(n); }} />
                      {chapitresForm.length > 1 && (
                        <button type="button" className="text-red-500 text-sm hover:text-red-700 transition" onClick={() => setChapitresForm(chapitresForm.filter((_, i) => i !== idx))}>✕</button>
                      )}
                    </div>
                  ))}
                  <button type="button" className="text-sm text-indigo-600 font-semibold hover:text-indigo-500 transition" onClick={() => setChapitresForm([...chapitresForm, chapitreVide()])}>
                    + Ajouter un chapitre
                  </button>
                </div>

                <button type="submit" className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/25 transition-all hover:-translate-y-0.5">
                  Créer le cours avec vidéos YouTube
                </button>
              </form>

              {/* Liste des cours */}
              <ul className="space-y-3 max-h-[600px] overflow-y-auto">
                {coursFiltres.map((c) => {
                  const ouvert = coursOuvert === c.id;
                  const enEdition = coursEnEdition === c.id;
                  const nbVideos = c.chapitres?.filter((ch) => ch.videoYoutube?.trim()).length ?? 0;
                  return (
                    <li key={c.id} className="border border-gray-200 dark:border-slate-700 rounded-2xl overflow-hidden hover:border-indigo-300 dark:hover:border-indigo-700 transition">
                      <div className="flex flex-wrap items-center gap-3 px-4 py-3 bg-white dark:bg-slate-900">
                        <button type="button" className="font-semibold text-left flex-1 min-w-0" onClick={() => setCoursOuvert(ouvert ? null : c.id)}>
                          #{c.id} — {c.titre}
                          <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${nbVideos > 0 ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"}`}>
                            {nbVideos} vidéo{nbVideos !== 1 ? "s" : ""}
                          </span>
                        </button>
                        <button type="button" className="text-sm text-indigo-600 font-semibold hover:text-indigo-500 transition flex items-center gap-1" onClick={() => enEdition ? setCoursEnEdition(null) : ouvrirEdition(c)}>
                          {enEdition ? "Annuler" : <><Edit className="w-4 h-4" /> Modifier</>}
                        </button>
                        <button type="button" className="text-sm text-red-600 font-semibold hover:text-red-500 transition flex items-center gap-1" onClick={async () => { if (confirm("Supprimer ce cours ?")) { await supprimerCours(c.id); setVersion((v) => v + 1); } }}>
                          <Trash2 className="w-4 h-4" /> Supprimer
                        </button>
                      </div>

                      {enEdition && (
                        <div className="px-4 pb-4 space-y-3 border-t bg-indigo-50/30 dark:bg-slate-800/50">
                          <p className="text-sm font-bold pt-3">Modifier les chapitres YouTube</p>
                          {editChapitres.map((ch, idx) => (
                            <div key={idx} className="grid md:grid-cols-[1fr,2fr,auto,auto] gap-2 items-center">
                              <input className="rounded-xl border px-3 py-2 text-sm dark:bg-slate-800" value={ch.titre} onChange={(e) => { const n = [...editChapitres]; n[idx] = { ...n[idx], titre: e.target.value }; setEditChapitres(n); }} />
                              <input className="rounded-xl border px-3 py-2 text-sm dark:bg-slate-800" placeholder="Lien YouTube" value={ch.videoYoutube} onChange={(e) => { const n = [...editChapitres]; n[idx] = { ...n[idx], videoYoutube: e.target.value }; setEditChapitres(n); }} />
                              <input className="rounded-xl border px-3 py-2 text-sm dark:bg-slate-800 w-24" value={ch.duree} onChange={(e) => { const n = [...editChapitres]; n[idx] = { ...n[idx], duree: e.target.value }; setEditChapitres(n); }} />
                              {editChapitres.length > 1 && (
                                <button type="button" className="text-red-500 text-sm" onClick={() => setEditChapitres(editChapitres.filter((_, i) => i !== idx))}>✕</button>
                              )}
                            </div>
                          ))}
                          <button type="button" className="text-sm text-indigo-600" onClick={() => setEditChapitres([...editChapitres, chapitreVide()])}>+ Chapitre</button>
                          <button
                            type="button"
                            className="block w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-2.5 shadow-lg shadow-blue-500/25 hover:-translate-y-0.5 transition-all"
                            onClick={async () => {
                              const chapitres = buildChapitresPayload(editChapitres);
                              if (!chapitres.length) { alert("Au moins un chapitre avec YouTube requis."); return; }
                              await modifierCours(c.id, { chapitres });
                              setCoursEnEdition(null);
                              setVersion((v) => v + 1);
                            }}
                          >
                            Enregistrer les vidéos
                          </button>
                        </div>
                      )}

                      {ouvert && !enEdition && (
                        <div className="px-4 pb-4 border-t space-y-2">
                          <p className="text-xs text-gray-500 pt-2">{c.description}</p>
                          {c.chapitres?.length ? c.chapitres.map((ch) => (
                            <div key={ch.id} className="flex flex-wrap items-center gap-2 text-sm rounded-xl bg-gray-50 dark:bg-slate-800 px-3 py-2">
                              <span className="font-medium">{ch.titre}</span>
                              <span className="text-gray-400">({ch.duree})</span>
                              {ch.videoYoutube ? (
                                <>
                                  <a href={ch.videoYoutube} target="_blank" rel="noreferrer" className="text-blue-600 underline text-xs truncate max-w-[200px]">
                                    {ch.videoYoutube}
                                  </a>
                                  <div className="w-full mt-1 aspect-video max-w-xs rounded-lg overflow-hidden bg-black">
                                    <iframe
                                      src={youtubeEmbed(ch.videoYoutube)}
                                      title={ch.titre}
                                      className="w-full h-full"
                                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                      allowFullScreen
                                    />
                                  </div>
                                </>
                              ) : (
                                <span className="text-red-500 text-xs flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Pas de lien YouTube</span>
                              )}
                            </div>
                          )) : (
                            <p className="text-sm text-red-500">Aucun chapitre — ajoutez des vidéos via Modifier</p>
                          )}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          {/* ═══════════════ TAB: LIVRES ═══════════════ */}
          {activeTab === "livres" && (
            <section className="rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-gray-200/60 dark:border-slate-700/60 p-6 space-y-6 shadow-sm">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Library className="w-6 h-6 text-indigo-600" /> Gestion des livres
                <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300">{livres.length}</span>
              </h2>
              <form
                className="grid md:grid-cols-2 gap-3 border border-gray-200 dark:border-slate-700 p-5 rounded-2xl bg-gradient-to-br from-emerald-50/50 to-teal-50/30 dark:from-slate-800/50 dark:to-slate-800/30"
                onSubmit={async (e) => {
                  e.preventDefault();
                  await creerLivre(nouveauLivre);
                  setNouveauLivre({ title: "", author: "", description: "", pdfUrl: "" });
                  setVersion((v) => v + 1);
                }}
              >
                <input className="rounded-xl border border-gray-200 dark:border-slate-700 px-4 py-2.5 text-sm bg-white dark:bg-slate-800 focus:ring-2 focus:ring-emerald-500/30 focus:outline-none" placeholder="Titre" value={nouveauLivre.title} onChange={(e) => setNouveauLivre({ ...nouveauLivre, title: e.target.value })} required />
                <input className="rounded-xl border border-gray-200 dark:border-slate-700 px-4 py-2.5 text-sm bg-white dark:bg-slate-800 focus:ring-2 focus:ring-emerald-500/30 focus:outline-none" placeholder="Auteur" value={nouveauLivre.author} onChange={(e) => setNouveauLivre({ ...nouveauLivre, author: e.target.value })} />
                <input className="rounded-xl border border-gray-200 dark:border-slate-700 px-4 py-2.5 text-sm bg-white dark:bg-slate-800 md:col-span-2 focus:ring-2 focus:ring-emerald-500/30 focus:outline-none" placeholder="URL PDF" value={nouveauLivre.pdfUrl} onChange={(e) => setNouveauLivre({ ...nouveauLivre, pdfUrl: e.target.value })} required />
                <textarea className="rounded-xl border border-gray-200 dark:border-slate-700 px-4 py-2.5 text-sm bg-white dark:bg-slate-800 md:col-span-2 focus:ring-2 focus:ring-emerald-500/30 focus:outline-none" placeholder="Description" value={nouveauLivre.description} onChange={(e) => setNouveauLivre({ ...nouveauLivre, description: e.target.value })} />
                <button type="submit" className="md:col-span-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-bold py-2.5 shadow-lg shadow-emerald-500/25 hover:-translate-y-0.5 transition-all">Ajouter en base</button>
              </form>
              <ul className="space-y-2 max-h-[400px] overflow-y-auto">
                {livres.map((b) => (
                  <li key={b.id} className="flex justify-between items-center border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 hover:border-emerald-300 dark:hover:border-emerald-700 transition">
                    <span>#{b.id} — <strong>{b.title}</strong> <span className="text-gray-400 text-sm">par {b.author}</span></span>
                    <button type="button" className="text-red-600 text-sm font-semibold hover:text-red-500 transition flex items-center gap-1" onClick={async () => { await supprimerLivre(b.id); setVersion((v) => v + 1); }}>
                      <Trash2 className="w-4 h-4" /> Supprimer
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* ═══════════════ TAB: MODERATION ═══════════════ */}
          {activeTab === "moderation" && (
            <section className="rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-gray-200/60 dark:border-slate-700/60 p-6 shadow-sm">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Shield className="w-6 h-6 text-indigo-600" /> Commentaires
                <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300">{commentaires.length}</span>
              </h2>
              <ul className="mt-4 space-y-2">
                {commentaires.map((c) => (
                  <li key={c.id} className="rounded-xl bg-gray-50 dark:bg-slate-800 px-4 py-3 text-sm border border-gray-100 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-gray-900 dark:text-white">{c.auteur} <span className="text-gray-400 font-normal">— Cours #{c.idCours}</span></p>
                      <button type="button" className="text-red-600 text-xs font-bold hover:text-red-500 transition flex items-center gap-1" onClick={() => { supprimerCommentaireCours(c.id); setCommentaires(listeTousCommentairesCours()); }}>
                        <Trash2 className="w-3 h-3" /> Supprimer
                      </button>
                    </div>
                    <p className="text-gray-500 dark:text-slate-400 mt-1">{c.texte}</p>
                  </li>
                ))}
                {commentaires.length === 0 && <p className="text-sm text-gray-500 text-center py-6">Aucun commentaire.</p>}
              </ul>
            </section>
          )}
        </section>
      </main>
    </div>
  );
}

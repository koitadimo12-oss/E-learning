import { useMemo, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import BarreNavigation from "../composants/BarreNavigation";
import PiedPage from "../composants/PiedPage";
import type { Etudiant } from "../services/etudiantService";
import { listeFormateurs, scoreClassementFormateur } from "../services/formateurService";

type Props = { etudiant: Etudiant | null; onDeconnexion: () => void };

const etudiantsDemo = [
  { id: "d1", nom: "Ali", ecole: "UNIPRO", points: 320, badge: "🔥" },
  { id: "d2", nom: "Awa", ecole: "ENSUP", points: 280, badge: "⭐" },
  { id: "d3", nom: "Moussa", ecole: "UCAD", points: 250, badge: "🚀" },
];

const ecolesDemo = [
  { id: "unipro", label: "UNIPRO", points: 1200, etudiants: 18 },
  { id: "ensup", label: "ENSUP", points: 1100, etudiants: 16 },
  { id: "ucad", label: "UCAD", points: 900, etudiants: 14 },
];

const projetsDemo = [
  { id: "p1", titre: "Gestion école Python", auteur: "Ali", ecole: "UNIPRO", likes: 45 },
  { id: "p2", titre: "App stock JS", auteur: "Awa", ecole: "ENSUP", likes: 33 },
  { id: "p3", titre: "Mini LMS", auteur: "Moussa", ecole: "UCAD", likes: 29 },
];

export default function ModeDemo(props: Props) {
  const { etudiant, onDeconnexion } = props;
  const navigate = useNavigate();
  const [likes, setLikes] = useState<Record<string, number>>({});
  const [joins, setJoins] = useState(0);
  const [coursEtudiants, setCoursEtudiants] = useState([
    {
      id: "c1",
      titre: "Python pour débutants",
      auteur: "Ali",
      ecole: "UNIPRO",
      inscrits: 32,
      videoType: "youtube",
      video: "https://www.youtube.com/embed/kqtD5dpn9C8",
    },
    {
      id: "c2",
      titre: "React UI rapide",
      auteur: "Awa",
      ecole: "ENSUP",
      inscrits: 21,
      videoType: "youtube",
      video: "https://www.youtube.com/embed/bMknfKXIFA8",
    },
  ]);
  const [newTitre, setNewTitre] = useState("");
  const [newAuteur, setNewAuteur] = useState("");
  const [newEcole, setNewEcole] = useState("UNIPRO");
  const [videoType, setVideoType] = useState<"youtube" | "local">("youtube");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [localVideoName, setLocalVideoName] = useState("");

  const projets = useMemo(
    () => projetsDemo.map((p) => ({ ...p, likes: p.likes + (likes[p.id] ?? 0) })),
    [likes]
  );
  const topProjet = [...projets].sort((a, b) => b.likes - a.likes)[0];
  const topEtudiant = [...etudiantsDemo].sort((a, b) => b.points - a.points)[0];
  const topEcole = [...ecolesDemo].sort((a, b) => b.points - a.points)[0];
  const topProf = [...listeFormateurs()]
    .filter((f) => f.statut === "accepte")
    .sort((a, b) => scoreClassementFormateur(b) - scoreClassementFormateur(a))[0];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100">
      <BarreNavigation etudiant={etudiant} onDeconnexion={onDeconnexion} />
      <section className="max-w-6xl mx-auto px-6 py-10 space-y-10">
        <div className="rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-700 text-white p-8">
          <p className="text-xs font-bold tracking-widest uppercase text-blue-100">MODE DEMO - KAAY NIOU DIANG</p>
          <h1 className="text-3xl md:text-4xl font-black mt-2">Bienvenue dans Kaay Niou Diang (Demo)</h1>
          <p className="mt-3 text-blue-100 max-w-3xl">
            Explorez une version simulée complete avec etudiants, ecoles, cours, challenges, projets et classements.
          </p>
          <button
            type="button"
            onClick={() => navigate("/cours")}
            className="mt-6 px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-400 font-bold"
          >
            Explorer la plateforme
          </button>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          <Stat label="Etudiants actifs" valeur="146" />
          <Stat label="Ecoles" valeur="6" />
          <Stat label="Challenges en cours" valeur="1" />
          <Stat label="Top projets" valeur="12" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card titre="Meilleure école">
            <p className="font-bold">{topEcole.label}</p>
            <p className="text-sm text-gray-600 dark:text-slate-300">{topEcole.points} points</p>
          </Card>
          <Card titre="Top étudiant">
            <p className="font-bold">{topEtudiant.nom}</p>
            <p className="text-sm text-gray-600 dark:text-slate-300">{topEtudiant.points} points</p>
          </Card>
          <Card titre="Top prof">
            <p className="font-bold">{topProf?.nom ?? "À venir"}</p>
            <p className="text-sm text-gray-600 dark:text-slate-300">
              {topProf ? `${Math.round(scoreClassementFormateur(topProf))} pts` : "Pas encore de score"}
            </p>
          </Card>
          <Card titre="Top projet">
            <p className="font-bold">{topProjet.titre}</p>
            <p className="text-sm text-gray-600 dark:text-slate-300">{topProjet.likes} likes</p>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card titre="Section etudiants (demo)">
            {etudiantsDemo.map((e) => (
              <p key={e.id} className="text-sm py-1">
                {e.nom} - {e.ecole} - {e.points} pts {e.badge}
              </p>
            ))}
          </Card>
          <Card titre="Section ecoles (demo)">
            {ecolesDemo.map((e, i) => (
              <p key={e.id} className="text-sm py-1">
                #{i + 1} {e.label} - {e.points} pts - {e.etudiants} etudiants
              </p>
            ))}
          </Card>
        </div>

        <Card titre="Challenges (demo)">
          <p className="text-sm">UNIPRO vs ENSUP - Projet: App Python gestion stock - Statut: En cours</p>
          <p className="text-sm mt-2">Participants: UNIPRO 6 | ENSUP 6</p>
          <button
            type="button"
            onClick={() => setJoins((v) => v + 1)}
            className="mt-4 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold"
          >
            Rejoindre challenge ({joins})
          </button>
        </Card>

        <Card titre="Projets etudiants (demo)">
          <div className="space-y-3">
            {projets.map((p) => (
              <div key={p.id} className="flex items-center justify-between gap-4 border-b border-gray-100 dark:border-slate-700 pb-2">
                <div className="text-sm">
                  {p.titre} - {p.auteur} ({p.ecole})
                </div>
                <button
                  type="button"
                  onClick={() => setLikes((prev) => ({ ...prev, [p.id]: (prev[p.id] ?? 0) + 1 }))}
                  className="px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-sm font-semibold"
                >
                  Voter projet ({p.likes})
                </button>
              </div>
            ))}
          </div>
        </Card>

        <Card titre="Cours créés par étudiants (demo)">
          <div className="space-y-3">
            {coursEtudiants.map((c) => (
              <div key={c.id} className="border-b border-gray-100 dark:border-slate-700 pb-3">
                <div className="flex justify-between gap-3">
                  <div className="text-sm">
                    {c.titre} - {c.auteur} ({c.ecole})
                  </div>
                  <span className="text-xs rounded-full px-2 py-1 bg-blue-100 dark:bg-blue-900/40">{c.inscrits} inscrits</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                  Vidéo: {c.videoType === "youtube" ? "YouTube" : `Locale (${c.video})`}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-4 grid sm:grid-cols-3 gap-2">
            <input
              value={newTitre}
              onChange={(e) => setNewTitre(e.target.value)}
              placeholder="Titre du cours"
              className="rounded-lg border border-gray-200 dark:border-slate-700 px-3 py-2 bg-white dark:bg-slate-950 text-sm"
            />
            <input
              value={newAuteur}
              onChange={(e) => setNewAuteur(e.target.value)}
              placeholder="Nom étudiant"
              className="rounded-lg border border-gray-200 dark:border-slate-700 px-3 py-2 bg-white dark:bg-slate-950 text-sm"
            />
            <select
              value={newEcole}
              onChange={(e) => setNewEcole(e.target.value)}
              className="rounded-lg border border-gray-200 dark:border-slate-700 px-3 py-2 bg-white dark:bg-slate-950 text-sm"
            >
              <option>UNIPRO</option>
              <option>ENSUP</option>
              <option>UCAD</option>
            </select>
          </div>
          <div className="mt-2 grid sm:grid-cols-3 gap-2">
            <select
              value={videoType}
              onChange={(e) => setVideoType(e.target.value as "youtube" | "local")}
              className="rounded-lg border border-gray-200 dark:border-slate-700 px-3 py-2 bg-white dark:bg-slate-950 text-sm"
            >
              <option value="youtube">Vidéo YouTube</option>
              <option value="local">Vidéo locale</option>
            </select>
            {videoType === "youtube" ? (
              <input
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="Lien YouTube embed"
                className="sm:col-span-2 rounded-lg border border-gray-200 dark:border-slate-700 px-3 py-2 bg-white dark:bg-slate-950 text-sm"
              />
            ) : (
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setLocalVideoName(e.target.files?.[0]?.name ?? "")}
                className="sm:col-span-2 rounded-lg border border-gray-200 dark:border-slate-700 px-3 py-2 bg-white dark:bg-slate-950 text-sm"
              />
            )}
          </div>
          <button
            type="button"
            onClick={() => {
              if (!newTitre.trim() || !newAuteur.trim()) return;
              const video = videoType === "youtube" ? youtubeUrl.trim() : localVideoName.trim();
              if (!video) return;
              setCoursEtudiants((prev) => [
                {
                  id: `c-${Date.now()}`,
                  titre: newTitre.trim(),
                  auteur: newAuteur.trim(),
                  ecole: newEcole,
                  inscrits: 0,
                  videoType,
                  video,
                },
                ...prev,
              ]);
              setNewTitre("");
              setNewAuteur("");
              setYoutubeUrl("");
              setLocalVideoName("");
            }}
            className="mt-3 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold"
          >
            Publier mon cours (demo)
          </button>
        </Card>

        <Card titre="Classement global (demo)">
          <p className="text-sm font-semibold">Top etudiants</p>
          {etudiantsDemo.map((e, i) => (
            <p key={e.id} className="text-sm py-1">
              {i + 1}. {e.nom} - {e.points} pts
            </p>
          ))}
        </Card>
      </section>
      <PiedPage />
    </div>
  );
}

function Card(props: { titre: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6">
      <h2 className="text-lg font-bold mb-4">{props.titre}</h2>
      {props.children}
    </div>
  );
}

function Stat(props: { label: string; valeur: string }) {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
      <p className="text-sm text-gray-500 dark:text-slate-400">{props.label}</p>
      <p className="text-2xl font-black mt-1">{props.valeur}</p>
    </div>
  );
}

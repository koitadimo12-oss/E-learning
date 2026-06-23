import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
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

  const menuItems = [
    { id: "dashboard", label: "📊 Dashboard" },
    { id: "etudiants", label: "👨‍🎓 Etudiants" },
    { id: "cours", label: "📚 Cours" },
    { id: "livres", label: "📖 Livres" },
    { id: "moderation", label: "🧹 Moderation" },
  ];

  const activeLabel = menuItems.find((item) => item.id === activeTab)?.label ?? "📊 Dashboard";

  const coursFiltres = listeCours.filter((c) =>
    c.titre.toLowerCase().includes(rechercheCours.toLowerCase()) ||
    c.instructeur.toLowerCase().includes(rechercheCours.toLowerCase())
  );

  const coursSansVideo = listeCours.filter(
    (c) => !c.chapitres?.length || c.chapitres.every((ch) => !ch.videoYoutube?.trim())
  ).length;

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
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-orange-50/40 to-gray-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-gray-900 dark:text-slate-100">
      <EnteteRetour to="/" label="Accueil" titre="👑 Dashboard Admin — Kaay Niou Diang" />

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 grid lg:grid-cols-[260px,1fr] gap-6">
        <aside className="rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-gray-200 dark:border-slate-700 p-4 h-fit lg:sticky lg:top-6 shadow-sm">
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`w-full text-left px-3 py-2 rounded-xl text-sm font-semibold ${
                  activeTab === item.id ? "bg-orange-100 text-orange-700 dark:bg-orange-900/40" : "hover:bg-gray-100 dark:hover:bg-slate-800"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        <section className="space-y-6">
          <div className="rounded-2xl bg-white dark:bg-slate-900 border p-4 flex flex-wrap justify-between gap-3">
            <div>
              <p className="text-lg font-bold">{activeLabel}</p>
              <p className="text-sm text-gray-500">Données synchronisées avec l&apos;API NestJS + MySQL</p>
            </div>
            <button
              type="button"
              onClick={() => setVersion((v) => v + 1)}
              className="px-4 py-2 rounded-xl bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600"
            >
              ↻ Actualiser
            </button>
          </div>

          {activeTab === "dashboard" && (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Étudiants" value={etudiants.length} icon="👨‍🎓" />
                <StatCard label="Cours" value={listeCours.length} icon="📚" />
                <StatCard label="Livres" value={livres.length} icon="📖" />
                <StatCard label="Sans vidéo YouTube" value={coursSansVideo} icon="⚠️" warn={coursSansVideo > 0} />
              </div>
              {coursSansVideo > 0 && (
                <div className="rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 text-sm">
                  <strong>{coursSansVideo} cours</strong> n&apos;ont pas de lien YouTube. Allez dans l&apos;onglet <button type="button" className="underline font-bold" onClick={() => setActiveTab("cours")}>Cours</button> pour les compléter.
                </div>
              )}
            </>
          )}

          {activeTab === "etudiants" && (
            <section className="rounded-2xl bg-white dark:bg-slate-900 border p-6">
              <h2 className="text-lg font-bold">Étudiants inscrits</h2>
              <ul className="mt-4 space-y-3">
                {etudiants.map((e) => (
                  <li key={e.id} className="rounded-xl border px-4 py-3 flex justify-between gap-4">
                    <span><strong>{e.nom}</strong> — {e.email}</span>
                    <span className="text-sm text-gray-500 shrink-0">{e.coursSuivis.length} cours suivis</span>
                  </li>
                ))}
                {etudiants.length === 0 && <p className="text-sm text-gray-500">Aucun étudiant pour le moment.</p>}
              </ul>
            </section>
          )}

          {activeTab === "cours" && (
            <section className="rounded-2xl bg-white dark:bg-slate-900 border p-6 space-y-6">
              <div className="flex flex-wrap justify-between gap-3 items-center">
                <h2 className="text-lg font-bold">Gestion des cours &amp; vidéos YouTube</h2>
                <input
                  className="rounded-lg border px-3 py-2 text-sm dark:bg-slate-800"
                  placeholder="Rechercher un cours…"
                  value={rechercheCours}
                  onChange={(e) => setRechercheCours(e.target.value)}
                />
              </div>

              {/* Formulaire création */}
              <form
                className="border rounded-2xl p-5 space-y-4 bg-gray-50/50 dark:bg-slate-800/30"
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
                <p className="font-bold text-orange-600">➕ Nouveau cours</p>
                <div className="grid md:grid-cols-2 gap-3">
                  <input className="rounded-lg border px-3 py-2 dark:bg-slate-800" placeholder="Titre du cours *" value={nouveauCours.titre} onChange={(e) => setNouveauCours({ ...nouveauCours, titre: e.target.value })} required />
                  <input className="rounded-lg border px-3 py-2 dark:bg-slate-800" placeholder="Instructeur" value={nouveauCours.instructeur} onChange={(e) => setNouveauCours({ ...nouveauCours, instructeur: e.target.value })} />
                  <select className="rounded-lg border px-3 py-2 dark:bg-slate-800" value={nouveauCours.categorie} onChange={(e) => setNouveauCours({ ...nouveauCours, categorie: e.target.value as typeof nouveauCours.categorie })}>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <select className="rounded-lg border px-3 py-2 dark:bg-slate-800" value={nouveauCours.niveau} onChange={(e) => setNouveauCours({ ...nouveauCours, niveau: e.target.value as typeof nouveauCours.niveau })}>
                    {NIVEAUX.map((n) => <option key={n} value={n}>{n}</option>)}
                  </select>
                  <input className="rounded-lg border px-3 py-2 dark:bg-slate-800" placeholder="Durée (ex: 2h 30)" value={nouveauCours.duree} onChange={(e) => setNouveauCours({ ...nouveauCours, duree: e.target.value })} />
                  <input className="rounded-lg border px-3 py-2 dark:bg-slate-800" placeholder="URL image (optionnel)" value={nouveauCours.image} onChange={(e) => setNouveauCours({ ...nouveauCours, image: e.target.value })} />
                  <textarea className="rounded-lg border px-3 py-2 dark:bg-slate-800 md:col-span-2" placeholder="Description" rows={2} value={nouveauCours.description} onChange={(e) => setNouveauCours({ ...nouveauCours, description: e.target.value })} />
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-semibold">Chapitres &amp; liens YouTube *</p>
                  {chapitresForm.map((ch, idx) => (
                    <div key={idx} className="grid md:grid-cols-[1fr,2fr,auto,auto] gap-2 items-center">
                      <input className="rounded-lg border px-3 py-2 text-sm dark:bg-slate-800" placeholder="Titre chapitre" value={ch.titre} onChange={(e) => { const n = [...chapitresForm]; n[idx] = { ...n[idx], titre: e.target.value }; setChapitresForm(n); }} />
                      <input className="rounded-lg border px-3 py-2 text-sm dark:bg-slate-800" placeholder="Lien YouTube (watch ou embed) *" value={ch.videoYoutube} onChange={(e) => { const n = [...chapitresForm]; n[idx] = { ...n[idx], videoYoutube: e.target.value }; setChapitresForm(n); }} required={idx === 0} />
                      <input className="rounded-lg border px-3 py-2 text-sm dark:bg-slate-800 w-24" placeholder="Durée" value={ch.duree} onChange={(e) => { const n = [...chapitresForm]; n[idx] = { ...n[idx], duree: e.target.value }; setChapitresForm(n); }} />
                      {chapitresForm.length > 1 && (
                        <button type="button" className="text-red-500 text-sm" onClick={() => setChapitresForm(chapitresForm.filter((_, i) => i !== idx))}>✕</button>
                      )}
                    </div>
                  ))}
                  <button type="button" className="text-sm text-orange-600 font-semibold" onClick={() => setChapitresForm([...chapitresForm, chapitreVide()])}>
                    + Ajouter un chapitre
                  </button>
                </div>

                <button type="submit" className="w-full rounded-xl bg-orange-500 text-white font-semibold py-2.5 hover:bg-orange-600">
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
                    <li key={c.id} className="border rounded-2xl overflow-hidden">
                      <div className="flex flex-wrap items-center gap-3 px-4 py-3 bg-white dark:bg-slate-900">
                        <button type="button" className="font-semibold text-left flex-1 min-w-0" onClick={() => setCoursOuvert(ouvert ? null : c.id)}>
                          #{c.id} — {c.titre}
                          <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${nbVideos > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                            {nbVideos} vidéo{nbVideos !== 1 ? "s" : ""}
                          </span>
                        </button>
                        <button type="button" className="text-sm text-blue-600 font-semibold" onClick={() => enEdition ? setCoursEnEdition(null) : ouvrirEdition(c)}>
                          {enEdition ? "Annuler" : "Modifier"}
                        </button>
                        <button type="button" className="text-sm text-red-600 font-semibold" onClick={async () => { if (confirm("Supprimer ce cours ?")) { await supprimerCours(c.id); setVersion((v) => v + 1); } }}>
                          Supprimer
                        </button>
                      </div>

                      {enEdition && (
                        <div className="px-4 pb-4 space-y-3 border-t bg-orange-50/30 dark:bg-slate-800/50">
                          <p className="text-sm font-bold pt-3">Modifier les chapitres YouTube</p>
                          {editChapitres.map((ch, idx) => (
                            <div key={idx} className="grid md:grid-cols-[1fr,2fr,auto,auto] gap-2 items-center">
                              <input className="rounded-lg border px-3 py-2 text-sm dark:bg-slate-800" value={ch.titre} onChange={(e) => { const n = [...editChapitres]; n[idx] = { ...n[idx], titre: e.target.value }; setEditChapitres(n); }} />
                              <input className="rounded-lg border px-3 py-2 text-sm dark:bg-slate-800" placeholder="Lien YouTube" value={ch.videoYoutube} onChange={(e) => { const n = [...editChapitres]; n[idx] = { ...n[idx], videoYoutube: e.target.value }; setEditChapitres(n); }} />
                              <input className="rounded-lg border px-3 py-2 text-sm dark:bg-slate-800 w-24" value={ch.duree} onChange={(e) => { const n = [...editChapitres]; n[idx] = { ...n[idx], duree: e.target.value }; setEditChapitres(n); }} />
                              {editChapitres.length > 1 && (
                                <button type="button" className="text-red-500 text-sm" onClick={() => setEditChapitres(editChapitres.filter((_, i) => i !== idx))}>✕</button>
                              )}
                            </div>
                          ))}
                          <button type="button" className="text-sm text-orange-600" onClick={() => setEditChapitres([...editChapitres, chapitreVide()])}>+ Chapitre</button>
                          <button
                            type="button"
                            className="block w-full rounded-xl bg-blue-600 text-white font-semibold py-2"
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
                                <span className="text-red-500 text-xs">⚠️ Pas de lien YouTube</span>
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

          {activeTab === "livres" && (
            <section className="rounded-2xl bg-white dark:bg-slate-900 border p-6 space-y-6">
              <h2 className="text-lg font-bold">Gestion des livres</h2>
              <form
                className="grid md:grid-cols-2 gap-3 border p-4 rounded-xl"
                onSubmit={async (e) => {
                  e.preventDefault();
                  await creerLivre(nouveauLivre);
                  setNouveauLivre({ title: "", author: "", description: "", pdfUrl: "" });
                  setVersion((v) => v + 1);
                }}
              >
                <input className="rounded-lg border px-3 py-2 dark:bg-slate-800" placeholder="Titre" value={nouveauLivre.title} onChange={(e) => setNouveauLivre({ ...nouveauLivre, title: e.target.value })} required />
                <input className="rounded-lg border px-3 py-2 dark:bg-slate-800" placeholder="Auteur" value={nouveauLivre.author} onChange={(e) => setNouveauLivre({ ...nouveauLivre, author: e.target.value })} />
                <input className="rounded-lg border px-3 py-2 dark:bg-slate-800 md:col-span-2" placeholder="URL PDF" value={nouveauLivre.pdfUrl} onChange={(e) => setNouveauLivre({ ...nouveauLivre, pdfUrl: e.target.value })} required />
                <textarea className="rounded-lg border px-3 py-2 dark:bg-slate-800 md:col-span-2" placeholder="Description" value={nouveauLivre.description} onChange={(e) => setNouveauLivre({ ...nouveauLivre, description: e.target.value })} />
                <button type="submit" className="md:col-span-2 rounded-xl bg-orange-500 text-white font-semibold py-2">Ajouter en base</button>
              </form>
              <ul className="space-y-2 max-h-[400px] overflow-y-auto">
                {livres.map((b) => (
                  <li key={b.id} className="flex justify-between border rounded-xl px-4 py-3">
                    <span>#{b.id} — {b.title} <span className="text-gray-400 text-sm">par {b.author}</span></span>
                    <button type="button" className="text-red-600" onClick={async () => { await supprimerLivre(b.id); setVersion((v) => v + 1); }}>Supprimer</button>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {activeTab === "moderation" && (
            <section className="rounded-2xl bg-white dark:bg-slate-900 border p-6">
              <h2 className="text-lg font-bold">Commentaires</h2>
              <ul className="mt-4 space-y-2">
                {commentaires.map((c) => (
                  <li key={c.id} className="rounded-lg bg-gray-50 dark:bg-slate-800 px-3 py-2 text-sm">
                    <p>{c.auteur} — Cours #{c.idCours}</p>
                    <p className="text-gray-500">{c.texte}</p>
                    <button type="button" className="text-red-600 text-xs mt-1" onClick={() => { supprimerCommentaireCours(c.id); setCommentaires(listeTousCommentairesCours()); }}>Supprimer</button>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <button type="button" onClick={() => { deconnexionAdmin(); navigate("/"); }} className="px-5 py-2.5 rounded-xl bg-gray-900 text-white font-semibold">
            Quitter l&apos;admin
          </button>
        </section>
      </main>
    </div>
  );
}

function StatCard({ label, value, icon, warn }: { label: string; value: number; icon: string; warn?: boolean }) {
  return (
    <div className={`rounded-2xl border p-5 ${warn ? "bg-amber-50 dark:bg-amber-900/20 border-amber-200" : "bg-white dark:bg-slate-900"}`}>
      <p className="text-sm text-gray-500">{icon} {label}</p>
      <p className="text-3xl font-bold mt-1">{value}</p>
    </div>
  );
}

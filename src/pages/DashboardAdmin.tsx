import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import EnteteRetour from "../composants/EnteteRetour";
import { deconnexionAdmin, estAdminConnecte } from "../services/adminService";
import { listeFormateurs, setStatutFormateur as majStatutFormateur, type StatutFormateur } from "../services/formateurService";
import { listeCours } from "../services/coursService";
import { listeEtudiants } from "../services/etudiantService";
import { challengeHebdo, formatCountdown, getChallengeStatus } from "../services/challengeService";
import { getLabelEcoleCanonique, listeEcoles } from "../services/ecoleService";
import { PROJETS_ETUDIANTS } from "../services/projetsEtudiantsService";
import { listeTousCommentairesCours, supprimerCommentaireCours } from "../services/commentairesService";

export default function DashboardAdmin() {
  const navigate = useNavigate();
  if (!estAdminConnecte()) return <Navigate to="/admin" replace />;

  const [version, setVersion] = useState(0);
  const [nowMs, setNowMs] = useState(Date.now());
  const [activeTab, setActiveTab] = useState("dashboard");
  const [gagnant, setGagnant] = useState<string | null>(null);
  const [newAliasBySchool, setNewAliasBySchool] = useState<Record<string, string>>({});
  const [hiddenCoursIds, setHiddenCoursIds] = useState<number[]>([]);
  const [hiddenProjetIds, setHiddenProjetIds] = useState<string[]>([]);
  const formateurs = useMemo(() => listeFormateurs(), [version]);
  const etudiants = listeEtudiants();
  const challengeActuel = challengeHebdo(etudiants.map((e) => e.ecoleId), nowMs);
  const challengeStatus = getChallengeStatus(nowMs, challengeActuel.dateDebut, challengeActuel.dateFin);
  const challengeMsLeft = Math.max(0, new Date(challengeActuel.dateFin).getTime() - nowMs);
  const [aliasesBySchool, setAliasesBySchool] = useState<Record<string, string[]>>(() =>
    Object.fromEntries(listeEcoles().map((e) => [e.id, [...e.alias]])),
  );
  const [commentaires, setCommentaires] = useState(() => listeTousCommentairesCours());

  useEffect(() => {
    const t = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeTab]);

  const totalChallenges = Math.max(1, Math.floor((nowMs - new Date("2026-01-05T08:00:00.000Z").getTime()) / (7 * 24 * 3600 * 1000)));
  const formateursEnAttente = formateurs.filter((f) => f.statut === "en_attente");
  const formateursAcceptes = formateurs.filter((f) => f.statut === "accepte");
  const activiteRecente = etudiants.slice(0, 6).map((e) => `${e.nom} (${getLabelEcoleCanonique(e.ecoleId)})`);
  const coursPopulaires = listeCours.slice(0, 5);

  const scoreParEcole = etudiants.reduce<Record<string, number>>((acc, e) => {
    acc[e.ecoleId] = (acc[e.ecoleId] ?? 0) + (e.points ?? 0);
    return acc;
  }, {});
  const classementEcoles = Object.entries(scoreParEcole)
    .map(([ecoleId, score]) => ({ ecoleId, score, label: getLabelEcoleCanonique(ecoleId) }))
    .sort((a, b) => b.score - a.score);

  const notifications = [
    formateursEnAttente.length > 0 ? `🔔 Nouvelle demande formateur (${formateursEnAttente.length})` : null,
    `🔔 Nouveau projet soumis (${Math.max(1, etudiants.length)})`,
    challengeStatus === "finished" ? "🔔 Fin de challenge detectee" : "🔔 Challenge en cours",
  ].filter(Boolean) as string[];
  const coursAdmin = listeCours.filter((c) => !hiddenCoursIds.includes(c.id));
  const projetsAdmin = PROJETS_ETUDIANTS.filter((p) => !hiddenProjetIds.includes(p.id));

  const appliquerStatut = (id: number, s: StatutFormateur) => {
    majStatutFormateur(id, s);
    setVersion((v) => v + 1);
  };

  const addAlias = (ecoleId: string) => {
    const raw = (newAliasBySchool[ecoleId] ?? "").trim().toLowerCase();
    if (!raw) return;
    setAliasesBySchool((prev) => {
      const aliases = prev[ecoleId] ?? [];
      if (aliases.includes(raw)) return prev;
      return { ...prev, [ecoleId]: [...aliases, raw] };
    });
    setNewAliasBySchool((prev) => ({ ...prev, [ecoleId]: "" }));
  };

  const menuItems = [
    { id: "dashboard", label: "📊 Dashboard" },
    { id: "formateurs", label: "👨‍🏫 Formateurs" },
    { id: "etudiants", label: "👨‍🎓 Etudiants" },
    { id: "cours", label: "📚 Cours" },
    { id: "challenges", label: "⚔️ Challenges" },
    { id: "classements", label: "🏆 Classements" },
    { id: "moderation", label: "🧹 Moderation" },
    { id: "ecoles", label: "🏫 Ecoles" },
    { id: "parametres", label: "⚙️ Parametres" },
  ];

  const activeLabel = menuItems.find((item) => item.id === activeTab)?.label ?? "📊 Dashboard";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-orange-50/40 to-gray-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-gray-900 dark:text-slate-100">
      <EnteteRetour to="/" label="Accueil" titre="👑 Dashboard Admin — Kaay Niou Diang" />

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 grid lg:grid-cols-[260px,1fr] gap-6">
        <aside className="rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-gray-200 dark:border-slate-700 p-4 h-fit lg:sticky lg:top-6 shadow-sm">
          <p className="text-xs uppercase tracking-wider text-gray-500 mb-3">Menu admin</p>
          <nav className="space-y-2 max-h-[72vh] overflow-y-auto pr-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`w-full text-left px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  activeTab === item.id
                    ? "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300"
                    : "hover:bg-gray-100 dark:hover:bg-slate-800"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        <section className="space-y-6 min-w-0">
          <div className="rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-gray-200 dark:border-slate-700 p-4 shadow-sm">
            <p className="text-xs uppercase tracking-widest text-gray-500">Section active</p>
            <p className="mt-1 text-lg font-bold">{activeLabel}</p>
          </div>

          {activeTab === "dashboard" && (
            <>
              <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <div className="rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 p-5">
                  <p className="text-sm text-gray-500">👨‍🎓 Etudiants</p>
                  <p className="text-3xl font-bold">{etudiants.length}</p>
                </div>
                <div className="rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 p-5">
                  <p className="text-sm text-gray-500">👨‍🏫 Formateurs</p>
                  <p className="text-3xl font-bold">{formateurs.length}</p>
                </div>
                <div className="rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 p-5">
                  <p className="text-sm text-gray-500">📚 Cours</p>
                  <p className="text-3xl font-bold">{listeCours.length}</p>
                </div>
                <div className="rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 p-5">
                  <p className="text-sm text-gray-500">⚔️ Challenges</p>
                  <p className="text-3xl font-bold">{totalChallenges}</p>
                </div>
              </div>

              <div className="grid xl:grid-cols-3 gap-4">
                <section className="xl:col-span-2 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 p-6">
                  <h2 className="text-lg font-bold">📈 Statistiques rapides</h2>
                  <ul className="mt-3 space-y-2 text-sm">
                    <li>Nouvels utilisateurs: <span className="font-semibold text-emerald-600">{Math.max(1, etudiants.length + formateurs.length)}</span></li>
                    <li>Cours populaires: <span className="font-semibold">{coursPopulaires[0]?.titre ?? "N/A"}</span></li>
                    <li>Activite recente: <span className="font-semibold">{activiteRecente[0] ?? "Aucune"}</span></li>
                  </ul>
                </section>
                <section className="rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 p-6">
                  <h2 className="text-lg font-bold">🔔 Notifications admin</h2>
                  <ul className="mt-3 space-y-2 text-sm">
                    {notifications.map((n) => (
                      <li key={n} className="rounded-lg bg-gray-50 dark:bg-slate-800 px-3 py-2">{n}</li>
                    ))}
                  </ul>
                </section>
              </div>

              <section className="rounded-2xl bg-white dark:bg-slate-900 border border-yellow-300 dark:border-yellow-700 p-6">
                <h2 className="text-lg font-bold">👨‍🏫 Demandes en attente ({formateursEnAttente.length})</h2>
                {formateursEnAttente.length === 0 ? (
                  <p className="mt-2 text-sm text-gray-500">Aucune demande en attente pour le moment.</p>
                ) : (
                  <ul className="mt-3 space-y-3">
                    {formateursEnAttente.map((f) => (
                      <li key={f.id} className="rounded-xl border border-gray-200 dark:border-slate-700 p-4 flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold">{f.nom}</p>
                          <p className="text-sm text-gray-500">{f.email} · {f.specialite}</p>
                        </div>
                        <div className="flex gap-2">
                          <button type="button" onClick={() => appliquerStatut(f.id, "accepte")} className="px-3 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold">✅ Accepter</button>
                          <button type="button" onClick={() => appliquerStatut(f.id, "refuse")} className="px-3 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold">❌ Refuser</button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </>
          )}

          {activeTab === "formateurs" && (
            <section className="rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 p-6">
              <h2 className="text-lg font-bold">👨‍🏫 Demandes formateurs</h2>
              <p className="text-sm mt-1 text-yellow-700 dark:text-yellow-400">Jaune = en attente, Vert = accepte, Rouge = refuse</p>
              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 border-b border-gray-100 dark:border-slate-800">
                      <th className="py-2 pr-4">Nom</th>
                      <th className="py-2 pr-4">Specialite</th>
                      <th className="py-2 pr-4">Statut</th>
                      <th className="py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formateurs.map((f) => (
                      <tr key={f.id} className="border-b border-gray-50 dark:border-slate-800/80">
                        <td className="py-3 pr-4 font-medium">{f.nom}</td>
                        <td className="py-3 pr-4">{f.specialite}</td>
                        <td className="py-3 pr-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            f.statut === "accepte" ? "bg-emerald-100 text-emerald-700" : f.statut === "refuse" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"
                          }`}>
                            {f.statut.replace("_", " ")}
                          </span>
                        </td>
                        <td className="py-3 space-x-2">
                          <button type="button" className="text-green-600 font-semibold" onClick={() => appliquerStatut(f.id, "accepte")}>✅ Accepter</button>
                          <button type="button" className="text-red-600 font-semibold" onClick={() => appliquerStatut(f.id, "refuse")}>❌ Refuser</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {activeTab === "etudiants" && (
            <section className="rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 p-6">
              <h2 className="text-lg font-bold">👨‍🎓 Gestion etudiants</h2>
              <ul className="mt-4 space-y-3">
                {etudiants.map((e) => (
                  <li key={e.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 dark:border-slate-700 px-4 py-3">
                    <span>{e.nom} — {e.ecoleCanonique}</span>
                    <span className="text-sm text-gray-500">Activite: {e.coursSuivis.length} cours</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {activeTab === "cours" && (
            <section className="rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 p-6">
              <h2 className="text-lg font-bold">📚 Gestion des cours</h2>
              <ul className="mt-4 space-y-2">
                {coursAdmin.slice(0, 30).map((c) => (
                  <li key={c.id} className="rounded-xl border border-gray-200 dark:border-slate-700 px-4 py-3 flex justify-between gap-3">
                    <span>{c.titre}</span>
                    <button
                      type="button"
                      className="text-red-600 font-semibold"
                      onClick={() => setHiddenCoursIds((prev) => (prev.includes(c.id) ? prev : [...prev, c.id]))}
                    >
                      Supprimer
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {activeTab === "challenges" && (
            <section className="rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 p-6 space-y-4">
              <h2 className="text-lg font-bold">⚔️ Challenge en cours</h2>
              <p className="font-semibold">{challengeActuel.titre}</p>
              <p className="text-sm">Statut: <span className="font-semibold">{challengeStatus}</span></p>
              <p className="text-sm">⏳ Temps restant: <span className="font-semibold">{formatCountdown(challengeMsLeft)}</span></p>
              <div className="grid sm:grid-cols-2 gap-3">
                {challengeActuel.ecolesIds.map((id) => (
                  <div key={id} className="rounded-xl border border-gray-200 dark:border-slate-700 p-4">
                    <p className="font-semibold">{getLabelEcoleCanonique(id)}</p>
                    <p className="text-sm text-gray-500">Score: {scoreParEcole[id] ?? 0} pts</p>
                    <button type="button" className="mt-2 text-orange-600 font-semibold" onClick={() => setGagnant(id)}>
                      🏆 Choisir gagnant
                    </button>
                  </div>
                ))}
              </div>
              {gagnant && (
                <p className="rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 px-4 py-2 text-sm font-semibold">
                  Gagnant selectionne: {getLabelEcoleCanonique(gagnant)}
                </p>
              )}
            </section>
          )}

          {activeTab === "classements" && (
            <section className="rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 p-6">
              <h2 className="text-lg font-bold">🏆 Classements</h2>
              <ol className="mt-4 space-y-2">
                {classementEcoles.map((ecole, i) => (
                  <li key={ecole.ecoleId} className="flex justify-between rounded-lg bg-gray-50 dark:bg-slate-800 px-3 py-2">
                    <span>#{i + 1} {ecole.label}</span>
                    <span className="font-semibold">{ecole.score} pts</span>
                  </li>
                ))}
              </ol>
              <p className="text-sm text-gray-500 mt-3">Top formateurs actifs: {formateursAcceptes.length}</p>
            </section>
          )}

          {activeTab === "moderation" && (
            <section className="rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 p-6">
              <h2 className="text-lg font-bold">🧹 Moderation</h2>
              <div className="mt-4 grid lg:grid-cols-2 gap-4">
                <div className="rounded-xl border border-gray-200 dark:border-slate-700 p-4">
                  <h3 className="font-semibold">Commentaires signales</h3>
                  <ul className="mt-3 space-y-2 text-sm">
                    {commentaires.slice(0, 10).map((c) => (
                      <li key={c.id} className="rounded-lg bg-gray-50 dark:bg-slate-800 px-3 py-2">
                        <p className="font-medium">{c.auteur} · Cours #{c.idCours}</p>
                        <p className="text-xs text-gray-500 mb-2">{c.texte}</p>
                        <button
                          type="button"
                          className="text-red-600 font-semibold text-xs"
                          onClick={() => {
                            supprimerCommentaireCours(c.id);
                            setCommentaires(listeTousCommentairesCours());
                          }}
                        >
                          Supprimer commentaire
                        </button>
                      </li>
                    ))}
                    {commentaires.length === 0 && <li className="text-gray-500">Aucun commentaire a moderer.</li>}
                  </ul>
                </div>
                <div className="rounded-xl border border-gray-200 dark:border-slate-700 p-4">
                  <h3 className="font-semibold">Projets etudiants</h3>
                  <ul className="mt-3 space-y-2 text-sm">
                    {projetsAdmin.map((p) => (
                      <li key={p.id} className="rounded-lg bg-gray-50 dark:bg-slate-800 px-3 py-2 flex justify-between gap-3">
                        <span>{p.titre}</span>
                        <button
                          type="button"
                          className="text-red-600 font-semibold"
                          onClick={() => setHiddenProjetIds((prev) => (prev.includes(p.id) ? prev : [...prev, p.id]))}
                        >
                          Supprimer
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          )}

          {activeTab === "ecoles" && (
            <section className="rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 p-6">
              <h2 className="text-lg font-bold">🏫 Gestion des ecoles et alias</h2>
              <div className="mt-4 space-y-4">
                {listeEcoles().map((ecole) => (
                  <div key={ecole.id} className="rounded-xl border border-gray-200 dark:border-slate-700 p-4">
                    <p className="font-semibold">{ecole.label}</p>
                    <p className="text-sm text-gray-500 mt-1">Alias: {(aliasesBySchool[ecole.id] ?? []).join(", ")}</p>
                    <div className="mt-3 flex gap-2">
                      <input
                        value={newAliasBySchool[ecole.id] ?? ""}
                        onChange={(e) => setNewAliasBySchool((prev) => ({ ...prev, [ecole.id]: e.target.value }))}
                        placeholder="ajouter un alias"
                        className="flex-1 rounded-lg border border-gray-300 dark:border-slate-600 px-3 py-2 bg-white dark:bg-slate-900"
                      />
                      <button type="button" onClick={() => addAlias(ecole.id)} className="px-3 py-2 rounded-lg bg-orange-500 text-white font-semibold">
                        Ajouter
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeTab === "parametres" && (
            <section className="rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 p-6">
              <h2 className="text-lg font-bold">⚙️ Parametres admin</h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-slate-400">
                Configuration des notifications, moderation auto et cadence des challenges (demo UI).
              </p>
            </section>
          )}

          <button
            type="button"
            onClick={() => {
              deconnexionAdmin();
              navigate("/");
            }}
            className="px-5 py-2.5 rounded-xl bg-gray-900 text-white font-semibold"
          >
            Quitter l'admin
          </button>
        </section>
      </main>
    </div>
  );
}

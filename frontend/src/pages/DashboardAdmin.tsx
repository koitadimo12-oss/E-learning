import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import EnteteRetour from "../composants/EnteteRetour";
import { deconnexionAdmin, estAdminConnecte } from "../services/adminService";
import { listeFormateurs, setStatutFormateur as majStatutFormateur, type StatutFormateur } from "../services/formateurService";
import { listeCours } from "../services/coursService";
import { listeEtudiants } from "../services/etudiantService";
import { getLabelEcoleCanonique, listeEcoles } from "../services/ecoleService";
import { listeTousCommentairesCours, supprimerCommentaireCours } from "../services/commentairesService";

export default function DashboardAdmin() {
  const navigate = useNavigate();
  if (!estAdminConnecte()) return <Navigate to="/admin" replace />;

  const [version, setVersion] = useState(0);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [hiddenCoursIds, setHiddenCoursIds] = useState<number[]>([]);
  const formateurs = useMemo(() => listeFormateurs(), [version]);
  const etudiants = listeEtudiants();
  const [commentaires, setCommentaires] = useState(() => listeTousCommentairesCours());

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeTab]);

  const formateursEnAttente = formateurs.filter((f) => f.statut === "en_attente");
  const activiteRecente = etudiants.slice(0, 6).map((e) => `${e.nom}`);
  const coursPopulaires = listeCours.slice(0, 5);

  const notifications = [
    formateursEnAttente.length > 0 ? `🔔 Nouvelle demande formateur (${formateursEnAttente.length})` : null,
    `🔔 Nouvelle activité étudiante (${Math.max(1, etudiants.length)})`,
  ].filter(Boolean) as string[];
  const coursAdmin = listeCours.filter((c) => !hiddenCoursIds.includes(c.id));

  const appliquerStatut = (id: number, s: StatutFormateur) => {
    majStatutFormateur(id, s);
    setVersion((v) => v + 1);
  };

  const menuItems = [
    { id: "dashboard", label: "📊 Dashboard" },
    { id: "formateurs", label: "👨‍🏫 Formateurs" },
    { id: "etudiants", label: "👨‍🎓 Etudiants" },
    { id: "cours", label: "📚 Cours" },
    { id: "ecoles", label: "🏫 Ecoles" },
    { id: "moderation", label: "🧹 Moderation" },
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
                    <span>{e.nom}</span>
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
          {activeTab === "ecoles" && (
            <section className="rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 p-6">
              <h2 className="text-lg font-bold">🏫 Ecoles partenaires</h2>
              <div className="mt-4 grid gap-4">
                {listeEcoles().map((ec) => (
                  <div key={ec.id} className="rounded-xl border border-gray-200 dark:border-slate-700 p-4 flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{ec.label}</p>
                      <p className="text-sm text-gray-500">{ec.domain}</p>
                    </div>
                    <div className="text-xs bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 px-2 py-1 rounded-full font-bold">
                      {etudiants.filter((e) => e.ecoleId === ec.id).length} étudiants
                    </div>
                  </div>
                ))}
              </div>
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
                  <h3 className="font-semibold">Statut système</h3>
                  <p className="mt-3 text-sm text-gray-600 dark:text-slate-400">
                    La modération est centrée sur les commentaires et le contenu de cours.
                  </p>
                </div>
              </div>
            </section>
          )}

          {activeTab === "parametres" && (
            <section className="rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 p-6">
              <h2 className="text-lg font-bold">⚙️ Parametres admin</h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-slate-400">
                Configuration des notifications et des paramètres de modération (demo UI).
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

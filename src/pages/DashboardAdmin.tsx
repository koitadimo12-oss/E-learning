import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import EnteteRetour from "../composants/EnteteRetour";
import { deconnexionAdmin, estAdminConnecte } from "../services/adminService";
import {
  listeFormateurs,
  setStatutFormateur as majStatutFormateur,
  type StatutFormateur,
} from "../services/formateurService";
import { listeCours } from "../services/coursService";
import { listeEtudiants } from "../services/etudiantService";

export default function DashboardAdmin() {
  const navigate = useNavigate();
  if (!estAdminConnecte()) return <Navigate to="/admin" replace />;

  const [version, setVersion] = useState(0);
  const [activeTab, setActiveTab] = useState("dashboard");

  const formateurs = useMemo(() => listeFormateurs(), [version]);
  const etudiants = useMemo(() => listeEtudiants(), [version]);

  const [coursState, setCoursState] = useState(listeCours);

  // =========================
  // FIX IMPORTANT : DATA SI VIDE
  // =========================
  useEffect(() => {
    if (formateurs.length === 0) {
      localStorage.setItem(
        "formateurs",
        JSON.stringify([
          {
            id: 1,
            nom: "Ali",
            specialite: "Python",
            email: "ali@test.com",
            preuve: "CV.pdf",
            statut: "en_attente",
          },
        ])
      );
      setVersion((v) => v + 1);
    }

    if (etudiants.length === 0) {
      localStorage.setItem(
        "etudiants",
        JSON.stringify([
          { id: 1, nom: "Mamadou", ecole: "UNIPRO", statut: "actif" },
          { id: 2, nom: "Fatoumata", ecole: "ENSUP", statut: "actif" },
        ])
      );
      setVersion((v) => v + 1);
    }
  }, []);

  // =========================
  // ACTIONS
  // =========================

  const appliquerStatut = (id: number, s: StatutFormateur) => {
    majStatutFormateur(id, s);
    setVersion((v) => v + 1);
  };

  const verifierCours = (id: number) => {
    alert("✅ Cours vérifié !");
  };

  const supprimerCours = (id: number) => {
    setCoursState((prev) => prev.filter((c) => c.id !== id));
  };

  const bloquerEtudiant = (id: number) => {
    const list = listeEtudiants();
    const updated = list.map((e) =>
      e.id === id ? { ...e, statut: "bloque" } : e
    );
    localStorage.setItem("etudiants", JSON.stringify(updated));
    setVersion((v) => v + 1);
  };

  const voirProfil = (nom: string) => {
    alert("👤 Profil de " + nom);
  };

  // =========================
  // PARAMÈTRES
  // =========================

  const [settings, setSettings] = useState({
    duree: 7,
    frequence: "hebdomadaire",
    scoring: "standard",
  });

  const menu = ["dashboard", "formateurs", "etudiants", "cours", "parametres"];

  // =========================
  // RENDER
  // =========================

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <EnteteRetour to="/" label="Accueil" titre="👑 Admin" />

      <div className="flex">
        {/* SIDEBAR */}
        <aside className="w-64 p-4 bg-slate-900">
          {menu.map((m) => (
            <button
              key={m}
              onClick={() => setActiveTab(m)}
              className={`block w-full text-left p-2 rounded mb-2 ${
                activeTab === m ? "bg-orange-500" : "hover:bg-slate-800"
              }`}
            >
              {m}
            </button>
          ))}
        </aside>

        {/* CONTENU */}
        <main className="flex-1 p-6 space-y-6">

          {/* DASHBOARD */}
          {activeTab === "dashboard" && (
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white text-black p-4 rounded">
                Étudiants: {etudiants.length}
              </div>
              <div className="bg-white text-black p-4 rounded">
                Formateurs: {formateurs.length}
              </div>
              <div className="bg-white text-black p-4 rounded">
                Cours: {coursState.length}
              </div>
            </div>
          )}

          {/* FORMATEURS */}
          {activeTab === "formateurs" && (
            <div>
              <h2 className="text-xl mb-4">Demandes formateurs</h2>

              {formateurs.map((f) => (
                <div
                  key={f.id}
                  className="bg-white text-black p-4 mb-3 rounded"
                >
                  <p><b>Nom:</b> {f.nom}</p>
                  <p><b>Spécialité:</b> {f.specialite}</p>
                  <p><b>Statut:</b> {f.statut}</p>

                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => appliquerStatut(f.id, "accepte")}
                      className="bg-green-600 text-white px-2"
                    >
                      ✅ Accepter
                    </button>

                    <button
                      onClick={() => appliquerStatut(f.id, "refuse")}
                      className="bg-red-600 text-white px-2"
                    >
                      ❌ Refuser
                    </button>

                    <button
                      onClick={() => voirProfil(f.nom)}
                      className="bg-blue-500 text-white px-2"
                    >
                      👁 Profil
                    </button>

                    <button
                      onClick={() => alert("📄 Preuve: " + f.preuve)}
                      className="bg-gray-700 text-white px-2"
                    >
                      📎 Preuve
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ETUDIANTS */}
          {activeTab === "etudiants" && (
            <div>
              {etudiants.map((e) => (
                <div
                  key={e.id}
                  className="bg-white text-black p-3 mb-2 rounded flex justify-between"
                >
                  <span>
                    {e.nom} - {e.ecole} ({e.statut})
                  </span>

                  <div className="flex gap-2">
                    <button
                      onClick={() => voirProfil(e.nom)}
                      className="bg-blue-500 text-white px-2"
                    >
                      Profil
                    </button>

                    <button
                      onClick={() => bloquerEtudiant(e.id)}
                      className="bg-red-500 text-white px-2"
                    >
                      Bloquer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* COURS */}
          {activeTab === "cours" && (
            <div>
              {coursState.map((c) => (
                <div
                  key={c.id}
                  className="bg-white text-black p-3 mb-2 rounded flex justify-between"
                >
                  <span>{c.titre}</span>

                  <div className="flex gap-2">
                    <button
                      onClick={() => verifierCours(c.id)}
                      className="bg-yellow-500 px-2"
                    >
                      Vérifier
                    </button>

                    <button
                      onClick={() => supprimerCours(c.id)}
                      className="bg-red-600 text-white px-2"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* PARAMETRES */}
          {activeTab === "parametres" && (
            <div className="bg-white text-black p-4 rounded space-y-3">
              <h2 className="text-lg font-bold">⚙️ Paramètres</h2>

              <label>
                Durée challenge:
                <input
                  type="number"
                  value={settings.duree}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      duree: Number(e.target.value),
                    })
                  }
                  className="ml-2 border px-2"
                />
              </label>

              <p>Fréquence: {settings.frequence}</p>
              <p>Scoring: {settings.scoring}</p>
            </div>
          )}

          {/* LOGOUT */}
          <button
            onClick={() => {
              deconnexionAdmin();
              navigate("/");
            }}
            className="bg-black px-4 py-2"
          >
            Déconnexion
          </button>
        </main>
      </div>
    </div>
  );
}
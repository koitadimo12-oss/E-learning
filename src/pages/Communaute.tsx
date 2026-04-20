import { useMemo, useState } from "react";
import BarreNavigation from "../composants/BarreNavigation";
import PiedPage from "../composants/PiedPage";
import { listeEcoles } from "../services/ecoleService";
import { listeEtudiants, type Etudiant } from "../services/etudiantService";

type Props = { etudiant: Etudiant | null; onDeconnexion: () => void };

export default function Communaute(props: Props) {
  const { etudiant, onDeconnexion } = props;
  const [ecoleFiltre, setEcoleFiltre] = useState(etudiant?.ecoleId ?? "unipro");
  const [chatAvec, setChatAvec] = useState<string | null>(null);
  const [msg, setMsg] = useState("Bonjour ! Je suis sur Kaay Niou Diang aussi.");

  const liste = useMemo(() => {
    const base = listeEtudiants()
      .filter((e) => e.id !== etudiant?.id)
      .map((e) => ({
        id: String(e.id),
        nom: e.nom,
        ecoleId: e.ecoleId,
        niveau: e.niveauEtude,
        bio: `${e.points ?? 0} pts · 🔥 ${e.streak ?? 0} jours · ${e.coursSuivis.length} cours suivis`,
      }));
    if (ecoleFiltre === "toutes") return base;
    return base.filter((p) => p.ecoleId === ecoleFiltre);
  }, [ecoleFiltre, etudiant?.id]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100">
      <BarreNavigation etudiant={etudiant} onDeconnexion={onDeconnexion} />

      <section className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold">Communauté par école</h1>
        <p className="mt-2 text-gray-600 dark:text-slate-400">
          Retrouvez les vrais profils étudiants inscrits et échangez rapidement.
        </p>

        <div className="mt-6 flex flex-wrap gap-3 items-center">
          <label className="text-sm font-semibold">Filtrer :</label>
          <select
            value={ecoleFiltre}
            onChange={(e) => setEcoleFiltre(e.target.value)}
            className="rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm"
          >
            <option value="toutes">Toutes les écoles</option>
            {listeEcoles().map((e) => (
              <option key={e.id} value={e.id}>
                {e.label}
              </option>
            ))}
          </select>
          {etudiant && (
            <span className="text-sm text-gray-500 dark:text-slate-400">
              Votre école : <strong>{etudiant.ecoleCanonique}</strong>
            </span>
          )}
        </div>

        <div className="mt-10 grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            {liste.map((p) => (
              <div
                key={p.id}
                className="rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-sm flex flex-col gap-3"
              >
                <div>
                  <p className="font-bold text-lg">{p.nom}</p>
                  <p className="text-sm text-gray-500 dark:text-slate-400">
                    {p.ecoleId.toUpperCase()} · {p.niveau}
                  </p>
                  <p className="mt-2 text-sm text-gray-700 dark:text-slate-300">{p.bio}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setChatAvec(p.nom)}
                  className="self-start px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700"
                >
                  Contacter
                </button>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 min-h-[320px] flex flex-col">
            <h2 className="font-bold text-lg">Chat rapide</h2>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
              {chatAvec ? `Conversation avec ${chatAvec}` : "Sélectionnez un profil."}
            </p>
            <div className="mt-4 flex-1 rounded-xl bg-gray-50 dark:bg-slate-800/80 p-4 text-sm border border-gray-100 dark:border-slate-700">
              {chatAvec ? (
                <div className="space-y-2">
                  <p className="text-gray-600 dark:text-slate-300">
                    <span className="font-semibold text-gray-900 dark:text-white">{chatAvec} :</span> Salut ! Ravi d’échanger
                    sur les projets.
                  </p>
                  <p className="text-gray-600 dark:text-slate-300">
                    <span className="font-semibold text-gray-900 dark:text-white">Vous :</span> {msg}
                  </p>
                </div>
              ) : (
                <p className="text-gray-400">Aucune conversation ouverte.</p>
              )}
            </div>
            <textarea
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              className="mt-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-900 p-3 text-sm min-h-[80px]"
              placeholder="Votre message…"
              style={{ colorScheme: "light dark" }}
            />
            <button
              type="button"
              disabled={!chatAvec}
              className="mt-3 py-2.5 rounded-xl bg-orange-500 text-white font-semibold disabled:opacity-40"
            >
              Envoyer
            </button>
          </div>
        </div>
      </section>

      <PiedPage />
    </div>
  );
}

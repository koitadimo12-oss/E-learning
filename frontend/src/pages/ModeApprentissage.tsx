import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  configurerApprentissageEtudiant,
  type Etudiant,
  type ModeApprentissage,
  type ParcoursGuide,
} from "../services/etudiantService";

type Props = {
  etudiant: Etudiant | null;
  setEtudiant: (e: Etudiant) => void;
};

const optionsParcours: Array<{ id: ParcoursGuide; titre: string; description: string }> = [
  { id: "developpement-web", titre: "Developpement Web", description: "Frontend, backend et projets web complets." },
  { id: "programmation", titre: "Programmation", description: "Algorithmique, JavaScript, Python et TypeScript." },
  { id: "cybersecurite", titre: "Cybersecurite", description: "Protection des applications et bonnes pratiques securite." },
  { id: "devops", titre: "DevOps", description: "CI/CD, conteneurs, supervision et automatisation." },
  { id: "data-ia", titre: "Data & IA", description: "SQL, analyse de donnees et intelligence artificielle." },
  { id: "mobile", titre: "Developpement Mobile", description: "Applications mobiles, UX mobile, publication." },
  { id: "cloud", titre: "Cloud Computing", description: "Services cloud, deploiement et architecture scalable." },
  { id: "ui-ux", titre: "UI/UX Design", description: "Interfaces lisibles, parcours utilisateur et prototypage." },
  { id: "gestion-projet", titre: "Gestion de projet", description: "Organisation, planning, agile et collaboration." },
];

export default function ModeApprentissagePage(props: Props) {
  const { etudiant, setEtudiant } = props;
  const navigate = useNavigate();
  const [mode, setMode] = useState<ModeApprentissage>("parcours-guide");
  const [parcours, setParcours] = useState<ParcoursGuide>("developpement-web");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!etudiant) navigate("/connexion");
    if (etudiant?.onboardingApprentissageTermine) navigate("/tableau-bord");
  }, [etudiant, navigate]);

  if (!etudiant) return null;

  const confirmer = async () => {
    if (mode === "parcours-guide" && !parcours) {
      setError("Choisissez un parcours guide.");
      return;
    }
    const updated = await configurerApprentissageEtudiant(
      etudiant.id,
      mode,
      mode === "parcours-guide" ? parcours : undefined,
    );
    if (!updated) {
      setError("Impossible d'enregistrer votre choix.");
      return;
    }
    setEtudiant(updated);
    navigate("/tableau-bord");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-white dark:from-slate-900 dark:to-slate-950 px-4 py-10">
      <section className="mx-auto max-w-6xl">
        <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 md:p-8 shadow-xl">
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">Choisissez votre mode d'apprentissage</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            Cette etape se fait juste apres inscription. Vous pouvez modifier ce choix plus tard.
          </p>

          <div className="mt-8 grid md:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setMode("parcours-guide")}
              className={`rounded-2xl border p-5 text-left transition ${
                mode === "parcours-guide"
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30"
                  : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              }`}
            >
              <p className="font-bold text-slate-900 dark:text-slate-100">Parcours guide</p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                Vous suivez une progression organisee (cours, quiz, projet final, certificat).
              </p>
            </button>
            <button
              type="button"
              onClick={() => setMode("cours-libre")}
              className={`rounded-2xl border p-5 text-left transition ${
                mode === "cours-libre"
                  ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30"
                  : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              }`}
            >
              <p className="font-bold text-slate-900 dark:text-slate-100">Cours simple</p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                Vous suivez les cours librement, sans ordre impose entre les lecons.
              </p>
            </button>
          </div>

          {mode === "parcours-guide" && (
            <div className="mt-8">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Choisissez un parcours guide</h2>
              <div className="mt-4 grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                {optionsParcours.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setParcours(item.id)}
                    className={`rounded-2xl border p-4 text-left hover:-translate-y-1 transition ${
                      parcours === item.id
                        ? "border-orange-400 bg-orange-50 dark:bg-orange-950/30"
                        : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                    }`}
                  >
                    <p className="font-semibold text-slate-900 dark:text-slate-100">{item.titre}</p>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{item.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={confirmer}
              className="rounded-xl bg-blue-600 px-5 py-3 text-white font-semibold hover:bg-blue-500 transition"
            >
              Continuer
            </button>
            <button
              type="button"
              onClick={() => navigate("/profil")}
              className="rounded-xl border border-slate-300 dark:border-slate-600 px-5 py-3 text-slate-700 dark:text-slate-200"
            >
              Plus tard
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

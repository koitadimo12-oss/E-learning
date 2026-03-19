import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BarreNavigation from "../composants/BarreNavigation";
import { listeCours } from "../services/coursService";
import type { Cours } from "../services/coursService";
import { mettreAJourProgression } from "../services/etudiantService";
import type { Etudiant } from "../services/etudiantService";

interface Props {
  etudiant: Etudiant;
  onDeconnexion: () => void;
}

export default function DetailCours({ etudiant, onDeconnexion }: Props) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cours, setCours] = useState<Cours | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [reponses, setReponses] = useState<{ [key: number]: string }>({});
  const [erreurQuiz, setErreurQuiz] = useState<string>("");

  useEffect(() => {
    const c = listeCours.find(c => c.id === Number(id));
    if (c) setCours(c || null);
  }, [id]);

  if (!cours) return <p className="p-10">Cours introuvable.</p>;

  const handleChangerReponse = (qIndex: number, val: string) => {
    setReponses(prev => ({ ...prev, [qIndex]: val }));
    if (erreurQuiz) setErreurQuiz("");
  };

  const handleSoumettreQuiz = () => {
    if (!cours.quiz) return;
    if (cours.quiz.some((_, idx) => !reponses[idx])) {
      setErreurQuiz("Veuillez répondre à toutes les questions avant de soumettre.");
      return;
    }
    setErreurQuiz("");

    let s = 0;
    cours.quiz.forEach((q, idx) => {
      if (reponses[idx] === q.reponse) s++;
    });
    setScore(Math.round((s / cours.quiz.length) * 100));

    // Mettre à jour la progression de l'étudiant (on met directement le score du quiz)
    mettreAJourProgression(etudiant.id, cours.id, Math.round((s / cours.quiz.length) * 100));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <BarreNavigation etudiant={etudiant} onDeconnexion={onDeconnexion} />
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-4">{cours.titre}</h1>
        <p className="text-gray-600 mb-6">{cours.description}</p>

        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Contenu du cours</h2>
          <div className="space-y-4">
            {cours.contenu?.map((p, idx) => (
              <p key={idx} className="text-gray-700">{p}</p>
            ))}
          </div>
        </div>

        {cours.quiz && cours.quiz.length > 0 && (
          <div className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">
              Quiz ({cours.quiz.length} questions)
            </h2>
            {cours.quiz.map((q, idx) => (
              <div key={idx} className="mb-4 p-4 border rounded bg-white">
                <p className="mb-2 font-medium">{idx + 1}. {q.question}</p>
                {q.options.map((opt, oidx) => (
                  <label key={oidx} className="block mb-1 cursor-pointer">
                    <input
                      type="radio"
                      name={`q${idx}`}
                      value={opt}
                      checked={reponses[idx] === opt}
                      onChange={() => handleChangerReponse(idx, opt)}
                      className="mr-2"
                    />
                    {opt}
                  </label>
                ))}
              </div>
            ))}

            {erreurQuiz && <p className="mt-2 text-red-600 font-medium">{erreurQuiz}</p>}
            <button
              onClick={handleSoumettreQuiz}
              className="mt-4 px-6 py-2 bg-green-600 text-white rounded"
            >
              Soumettre le quiz
            </button>
          </div>
        )}

        {score !== null && (
          <div className="mb-6 p-4 bg-blue-100 rounded">
            <p className="font-semibold">Votre score : {score}%</p>
          </div>
        )}

        <button
          onClick={() => navigate("/profil")}
          className="px-6 py-2 bg-gray-600 text-white rounded"
        >
          Retour au profil
        </button>
      </div>
    </div>
  );
}

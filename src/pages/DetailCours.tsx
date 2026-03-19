import { useParams } from "react-router-dom";
import BarreNavigation from "../composants/BarreNavigation";
import PiedPage from "../composants/PiedPage";
import { listeCours, type Cours } from "../services/coursService";
import type { Etudiant } from "../services/etudiantService";
import { useState } from "react";

interface Props {
  etudiant: Etudiant | null;
  onDeconnexion: () => void;
}

export default function DetailCours({ etudiant, onDeconnexion }: Props) {
  const { id } = useParams<{ id: string }>();
  const cours: Cours | undefined = listeCours.find(c => c.id === Number(id));

  const [score, setScore] = useState<number | null>(null);
  const [reponses, setReponses] = useState<{ [key: number]: string }>({});

  if (!cours) return <p>Cours introuvable</p>;

  const handleReponse = (index: number, valeur: string) => {
    setReponses(prev => ({ ...prev, [index]: valeur }));
  };

  const calculerScore = () => {
    if (!cours.quiz) return;
    let s = 0;
    cours.quiz.forEach((q, i) => {
      if (reponses[i] === q.reponse) s++;
    });
    setScore(s);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <BarreNavigation etudiant={etudiant} onDeconnexion={onDeconnexion} />

      <section className="max-w-6xl mx-auto px-6 md:px-10 py-16">
        <h1 className="text-4xl font-bold mb-6">{cours.titre}</h1>

        {cours.videoYoutube && (
          <div className="mb-6 aspect-video">
            <iframe
              width="100%"
              height="100%"
              src={cours.videoYoutube}
              title={cours.titre}
              frameBorder="0"
              allowFullScreen
            />
          </div>
        )}

        {cours.contenu && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Contenu du cours</h2>
            <ul className="list-disc list-inside">
              {cours.contenu.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {cours.quiz && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Quiz</h2>
            {cours.quiz.map((q, i) => (
              <div key={i} className="mb-4">
                <p className="font-semibold">{q.question}</p>
                <div className="flex flex-col gap-2 mt-2">
                  {q.options.map((opt, j) => (
                    <button
                      key={j}
                      className={`px-4 py-2 border rounded ${
                        reponses[i] === opt ? "bg-blue-600 text-white" : "bg-white"
                      }`}
                      onClick={() => handleReponse(i, opt)}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <button
              onClick={calculerScore}
              className="mt-4 px-6 py-2 bg-green-600 text-white rounded"
            >
              Calculer le score
            </button>

            {score !== null && <p className="mt-4">Votre score : {score}/{cours.quiz.length}</p>}
          </div>
        )}
      </section>

      <PiedPage />
    </div>
  );
}

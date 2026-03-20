import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BarreNavigation from "../composants/BarreNavigation";
import PiedPage from "../composants/PiedPage";
import { listeCours, type Cours } from "../services/coursService";
import { mettreAJourProgression, type Etudiant } from "../services/etudiantService";

interface Props {
  etudiant: Etudiant | null;
  onDeconnexion: () => void;
}

export default function DetailCours({ etudiant, onDeconnexion }: Props) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const cours: Cours | undefined = listeCours.find((c) => c.id === Number(id));

  const [score, setScore] = useState<number | null>(null);
  const [reponses, setReponses] = useState<{ [key: number]: string }>({});

  const contenuBullets = useMemo(() => {
    if (!cours) return [];
    return cours.chapitres.flatMap((ch) => ch.contenu);
  }, [cours]);

  const videoYoutube = cours?.chapitres[0]?.videoYoutube ?? "";

  if (!cours) {
    return (
      <div className="min-h-screen bg-gray-100">
        <BarreNavigation etudiant={etudiant} onDeconnexion={onDeconnexion} />
        <section className="max-w-3xl mx-auto px-6 py-16">
          <p className="text-lg font-semibold">Cours introuvable.</p>
          <button
            type="button"
            onClick={() => navigate("/cours")}
            className="mt-4 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
          >
            Retour au catalogue
          </button>
        </section>
      </div>
    );
  }

  const handleReponse = (index: number, valeur: string) => {
    setReponses((prev) => ({ ...prev, [index]: valeur }));
  };

  const calculerScore = () => {
    if (!cours.quiz) return;
    let s = 0;
    cours.quiz.forEach((q, i) => {
      if (reponses[i] === q.reponse) s++;
    });
    setScore(s);
    const progressionFinale = Math.round((s / cours.quiz.length) * 100);
    if (etudiant) mettreAJourProgression(etudiant.id, cours.id, progressionFinale);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <BarreNavigation etudiant={etudiant} onDeconnexion={onDeconnexion} />

      <section className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{cours.titre}</h1>
        <p className="text-gray-600 mt-3">{cours.description}</p>

        <div className="mt-6 aspect-video max-w-3xl mx-auto rounded-xl overflow-hidden bg-black shadow-inner">
          <iframe
            width="100%"
            height="100%"
            src={videoYoutube}
            title={cours.titre}
            allowFullScreen
            className="w-full h-full"
          />
        </div>

        <div className="mt-10">
          <h2 className="text-xl font-semibold text-gray-900">Contenu du cours</h2>
          <ul className="mt-4 list-disc pl-6 space-y-2 text-gray-700">
            {contenuBullets.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="mt-10">
          <h2 className="text-xl font-semibold text-gray-900">Quiz</h2>
          <div className="mt-6 grid md:grid-cols-2 gap-6">
            {cours.quiz.map((q, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-4">
                <p className="font-semibold text-gray-900">
                  {i + 1}. {q.question}
                </p>

                <div className="flex flex-col gap-2 mt-4">
                  {q.options.map((opt, j) => {
                    const selected = reponses[i] === opt;
                    return (
                      <button
                        key={j}
                        type="button"
                        onClick={() => handleReponse(i, opt)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-left transition ${
                          selected
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white border-gray-200 hover:border-blue-300"
                        }`}
                      >
                        <span
                          className={`w-4 h-4 rounded-full border ${
                            selected
                              ? "bg-white border-white"
                              : "bg-white border-gray-300"
                          }`}
                          aria-hidden
                        />
                        <span className="text-sm">{opt}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-7 flex justify-center">
            <button
              type="button"
              onClick={calculerScore}
              className="px-8 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 font-semibold transition shadow-md"
            >
              Valider
            </button>
          </div>

          {score !== null && (
            <p className="mt-4 text-center font-semibold text-gray-900">
              Votre score : {score}/{cours.quiz.length}
            </p>
          )}
        </div>
      </section>

      <PiedPage />
    </div>
  );
}

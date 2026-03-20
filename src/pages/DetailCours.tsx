import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BarreNavigation from "../composants/BarreNavigation";
import BarreProgression from "../composants/BarreProgression";
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
  const cours: Cours | undefined = listeCours.find(c => c.id === Number(id));

  const [score, setScore] = useState<number | null>(null);
  const [reponses, setReponses] = useState<{ [key: number]: string }>({});
  const [chapitreActif, setChapitreActif] = useState(0);
  const [chapitresTermines, setChapitresTermines] = useState<number[]>([]);

  const quizLen = cours?.quiz.length ?? 0;
  const progression = useMemo(() => {
    if (!cours) return 0;
    const partChapitres = (chapitresTermines.length / cours.chapitres.length) * 70;
    const partQuiz = score !== null && quizLen > 0 ? (score / quizLen) * 30 : 0;
    return Math.round(Math.min(100, partChapitres + partQuiz));
  }, [cours, chapitresTermines, score, quizLen]);

  if (!cours) {
    return (
      <div className="min-h-screen bg-gray-100">
        <BarreNavigation etudiant={etudiant} onDeconnexion={onDeconnexion} />
        <section className="max-w-3xl mx-auto px-6 py-16">
          <p className="text-lg font-semibold">Cours introuvable.</p>
          <button
            onClick={() => navigate("/cours")}
            className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-lg"
          >
            Retour au catalogue
          </button>
        </section>
      </div>
    );
  }

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
    const progressionQuiz = Math.round((s / cours.quiz.length) * 30);
    const progressionChapitres = Math.round((chapitresTermines.length / cours.chapitres.length) * 70);
    const progressionFinale = Math.min(100, progressionQuiz + progressionChapitres);
    if (etudiant) mettreAJourProgression(etudiant.id, cours.id, progressionFinale);
  };

  const chapitre = cours.chapitres[chapitreActif];

  const marquerChapitreTermine = () => {
    if (chapitresTermines.includes(chapitre.id)) return;
    const next = [...chapitresTermines, chapitre.id];
    setChapitresTermines(next);
    const progressionChapitres = Math.round((next.length / cours.chapitres.length) * 70);
    const progressionQuiz = score !== null ? Math.round((score / cours.quiz.length) * 30) : 0;
    if (etudiant) mettreAJourProgression(etudiant.id, cours.id, Math.min(100, progressionChapitres + progressionQuiz));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <BarreNavigation etudiant={etudiant} onDeconnexion={onDeconnexion} />

      <section className="max-w-6xl mx-auto px-6 md:px-10 py-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">{cours.titre}</h1>
            <p className="text-gray-600 mt-2">{cours.description}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-4 w-full md:w-72">
            <BarreProgression progression={progression} />
            <p className="text-xs text-gray-500 mt-2">
              Progression reelle basee sur chapitres termines + quiz.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-[300px_1fr] gap-6">
          <aside className="bg-white rounded-xl shadow p-4 h-fit">
            <h2 className="font-bold text-lg mb-3">Chapitres</h2>
            <div className="space-y-2">
              {cours.chapitres.map((ch, index) => (
                <button
                  key={ch.id}
                  onClick={() => setChapitreActif(index)}
                  className={`w-full text-left p-3 rounded-lg border ${
                    index === chapitreActif
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <p className="font-semibold text-sm">{index + 1}. {ch.titre}</p>
                  <p className="text-xs text-gray-500 mt-1">{ch.duree}</p>
                  {chapitresTermines.includes(ch.id) && (
                    <p className="text-xs text-green-600 mt-1">Termine</p>
                  )}
                </button>
              ))}
            </div>
          </aside>

          <div>
            <div className="bg-white rounded-xl shadow p-4">
              <div className="aspect-video max-w-3xl mx-auto rounded-lg overflow-hidden bg-black">
                <iframe
                  width="100%"
                  height="100%"
                  src={chapitre.videoYoutube}
                  title={chapitre.titre}
                  frameBorder="0"
                  allowFullScreen
                />
              </div>

              <div className="mt-5">
                <h2 className="text-2xl font-semibold">{chapitre.titre}</h2>
                <ul className="mt-3 list-disc list-inside space-y-1">
                  {chapitre.contenu.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  onClick={marquerChapitreTermine}
                  className="px-5 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
                >
                  Continuer
                </button>
                <button
                  onClick={() => navigate("/cours")}
                  className="px-5 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-900"
                >
                  Arreter
                </button>
              </div>
            </div>

            <div className="mt-6 bg-white rounded-xl shadow p-6">
              <h2 className="text-2xl font-semibold mb-4">Quiz final (6 questions)</h2>
              {cours.quiz.map((q, i) => (
                <div key={i} className="mb-5">
                  <p className="font-semibold">{i + 1}. {q.question}</p>
                  <div className="flex flex-col gap-2 mt-2">
                    {q.options.map((opt, j) => (
                      <button
                        key={j}
                        className={`px-4 py-2 border rounded text-left ${
                          reponses[i] === opt ? "bg-blue-600 text-white border-blue-600" : "bg-white"
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
                className="mt-2 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
              >
                Valider le quiz
              </button>

              {score !== null && (
                <p className="mt-4 font-semibold">
                  Votre score : {score}/{cours.quiz.length}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <PiedPage />
    </div>
  );
}

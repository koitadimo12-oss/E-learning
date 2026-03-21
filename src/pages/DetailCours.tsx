import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BarreNavigation from "../composants/BarreNavigation";
import PiedPage from "../composants/PiedPage";
import { listeCours, type Cours } from "../services/coursService";
import {
  getEtudiant,
  mettreAJourChapitresCompletes,
  mettreAJourProgression,
} from "../services/etudiantService";

const SEUIL_PROGRESSION_CONTENU = 0.85;
const SEUIL_REUSSITE_QUIZ = 2 / 3;

function cleChapitresInvite(idCours: number) {
  return `knd_chapitres_invite_${idCours}`;
}

export default function DetailCours(props: any) {
  const { etudiant, onDeconnexion, setEtudiant } = props;

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const cours: Cours | undefined = listeCours.find((c) => c.id === Number(id));

  const [score, setScore] = useState<number | null>(null);
  const [reponses, setReponses] = useState<{ [key: number]: string }>({});
  const [quizReussi, setQuizReussi] = useState(false);
  const [chapitresCompletes, setChapitresCompletes] = useState<number[]>([]);

  const rafraichirEtudiant = useCallback(() => {
    if (!etudiant || !setEtudiant) return;
    const frais = getEtudiant(etudiant.id);
    if (frais) setEtudiant(frais);
  }, [etudiant, setEtudiant]);

  useEffect(() => {
    if (!cours) return;
    if (etudiant) {
      const suivi = etudiant.coursSuivis.find(
        (cs: { idCours: number; chapitresCompletes?: number[] }) => cs.idCours === cours.id
      );
      setChapitresCompletes(suivi?.chapitresCompletes ?? []);
    } else {
      try {
        const brut = sessionStorage.getItem(cleChapitresInvite(cours.id));
        setChapitresCompletes(brut ? (JSON.parse(brut) as number[]) : []);
      } catch {
        setChapitresCompletes([]);
      }
    }
  }, [cours, etudiant]);

  const idsChapitresValides = useMemo(
    () => new Set((cours?.chapitres ?? []).map((ch) => ch.id)),
    [cours]
  );

  const nbChapitresLus = useMemo(
    () => chapitresCompletes.filter((idCh) => idsChapitresValides.has(idCh)).length,
    [chapitresCompletes, idsChapitresValides]
  );

  const chapitresRequisPourQuiz = useMemo(() => {
    const n = cours?.chapitres.length ?? 0;
    if (n === 0) return 0;
    return Math.max(1, Math.ceil(n * SEUIL_PROGRESSION_CONTENU));
  }, [cours]);

  const quizInteractif = nbChapitresLus >= chapitresRequisPourQuiz;

  const persisterChapitres = useCallback(
    (ids: number[]) => {
      if (!cours) return;
      if (etudiant) {
        mettreAJourChapitresCompletes(etudiant.id, cours.id, ids);
        rafraichirEtudiant();
      } else {
        sessionStorage.setItem(cleChapitresInvite(cours.id), JSON.stringify(ids));
      }
      setChapitresCompletes(ids);
    },
    [cours, etudiant, rafraichirEtudiant]
  );

  const toggleChapitreLu = (idChapitre: number) => {
    const next = chapitresCompletes.includes(idChapitre)
      ? chapitresCompletes.filter((x) => x !== idChapitre)
      : [...chapitresCompletes, idChapitre];
    persisterChapitres(next);
  };

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
    if (!quizInteractif) return;
    setReponses((prev) => ({ ...prev, [index]: valeur }));
  };

  const reprendreQuiz = () => {
    setReponses({});
    setScore(null);
    setQuizReussi(false);
  };

  const calculerScore = () => {
    if (!quizInteractif || !cours.quiz?.length) return;
    let s = 0;
    cours.quiz.forEach((q, i) => {
      if (reponses[i] === q.reponse) s++;
    });
    const ratio = s / cours.quiz.length;
    setScore(s);

    if (ratio < SEUIL_REUSSITE_QUIZ) {
      setQuizReussi(false);
      return;
    }

    setQuizReussi(true);
    if (etudiant) {
      mettreAJourProgression(etudiant.id, cours.id, 100);
      rafraichirEtudiant();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <BarreNavigation etudiant={etudiant} onDeconnexion={onDeconnexion} />

      <section className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{cours.titre}</h1>
        <p className="text-gray-600 mt-3">{cours.description}</p>

        <div className="mt-8 rounded-xl border border-blue-100 bg-blue-50/80 px-4 py-3 text-sm text-blue-900">
          <p className="font-semibold">Parcours du cours</p>
          <p className="mt-1">
            Chapitres validés : {nbChapitresLus} / {cours.chapitres.length}
            {chapitresRequisPourQuiz > 0 && (
              <>
                {" "}
                (minimum {chapitresRequisPourQuiz} pour débloquer le quiz, soit environ 85 % du cours)
              </>
            )}
          </p>
        </div>

        <div className="mt-10 space-y-12">
          {cours.chapitres.map((chapitre) => {
            const lu = chapitresCompletes.includes(chapitre.id);
            return (
              <article
                key={chapitre.id}
                className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden"
              >
                <div className="p-4 md:p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{chapitre.titre}</h2>
                    <p className="text-sm text-gray-500 mt-1">Durée indicative : {chapitre.duree}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleChapitreLu(chapitre.id)}
                    className={`shrink-0 px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                      lu
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-200"
                    }`}
                  >
                    {lu ? "Chapitre terminé ✓" : "J’ai terminé ce chapitre"}
                  </button>
                </div>
                <div className="aspect-video max-w-3xl mx-auto bg-black">
                  <iframe
                    width="100%"
                    height="100%"
                    src={chapitre.videoYoutube}
                    title={chapitre.titre}
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
                <div className="p-4 md:p-6">
                  <h3 className="text-sm font-semibold text-gray-800">Points abordés</h3>
                  <ul className="mt-3 list-disc pl-6 space-y-2 text-gray-700">
                    {chapitre.contenu.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-14 relative">
          <h2 className="text-xl font-semibold text-gray-900">Quiz</h2>
          {!quizInteractif && (
            <p className="mt-2 text-sm text-amber-800 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
              Le quiz est visible, mais les réponses restent bloquées tant que vous n’avez pas validé assez de
              chapitres (environ la fin du cours). Complétez les chapitres ci-dessus pour interagir avec le quiz.
            </p>
          )}

          <div
            className={`mt-6 relative rounded-2xl transition ${!quizInteractif ? "opacity-60" : ""}`}
            aria-disabled={!quizInteractif}
          >
            {!quizInteractif && (
              <div
                className="absolute inset-0 z-10 cursor-not-allowed rounded-2xl bg-gray-900/5"
                aria-hidden
              />
            )}

            <div className={`grid md:grid-cols-2 gap-6 ${!quizInteractif ? "pointer-events-none select-none" : ""}`}>
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
                          disabled={!quizInteractif}
                          onClick={() => handleReponse(i, opt)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-left transition ${
                            selected
                              ? "bg-blue-600 text-white border-blue-600"
                              : "bg-white border-gray-200 hover:border-blue-300"
                          } ${!quizInteractif ? "opacity-90" : ""}`}
                        >
                          <span
                            className={`w-4 h-4 rounded-full border ${
                              selected ? "bg-white border-white" : "bg-white border-gray-300"
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

            <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center items-center">
              <button
                type="button"
                disabled={!quizInteractif}
                onClick={calculerScore}
                className="px-8 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 font-semibold transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Valider
              </button>
              {score !== null && !quizReussi && (
                <button
                  type="button"
                  onClick={reprendreQuiz}
                  className="px-8 py-3 bg-gray-200 text-gray-900 rounded-xl hover:bg-gray-300 font-semibold transition"
                >
                  Reprendre le quiz
                </button>
              )}
            </div>

            {score !== null && (
              <div className="mt-4 text-center space-y-2">
                <p className="font-semibold text-gray-900">
                  Votre score : {score}/{cours.quiz.length} (minimum requis :{" "}
                  {Math.ceil(cours.quiz.length * SEUIL_REUSSITE_QUIZ)} bonnes réponses, soit au moins 2/3 du quiz)
                </p>
                {!quizReussi && (
                  <p className="text-red-700 font-medium">
                    Score insuffisant : vous devez obtenir au moins deux tiers de bonnes réponses. Reprenez le quiz
                    pour valider le cours.
                  </p>
                )}
                {quizReussi && (
                  <p className="text-green-700 font-medium">
                    Bravo ! Vous avez validé le quiz. Votre progression pour ce cours est mise à jour.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <PiedPage />
    </div>
  );
}

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BarreNavigation from "../composants/BarreNavigation";
import PiedPage from "../composants/PiedPage";
import { listeCours, type Cours } from "../services/coursService";
import { useLanguage } from "../elearn/i18n/LanguageContext";
import { getAiLesson, type AiLessonResponse } from "../services/aiLessonApi";
import {
  getEtudiant,
  mettreAJourChapitresCompletes,
  recompenserQuizReussi,
  toucherStreak,
  validerProjetFinal,
} from "../services/etudiantService";
import { getParcoursCoursIds } from "../services/parcoursService";
import {
  aDejaLike,
  estFavori,
  getCompteurLikes,
  getNotesCours,
  likerUneFois,
  setDernierCoursId,
  setNotesCours,
  toggleFavoriCours,
} from "../services/stockageLocal";
import { ajouterCommentaireCours, getCommentairesCours } from "../services/commentairesService";

const SEUIL_PROGRESSION_CONTENU = 0.85;
const SEUIL_REUSSITE_QUIZ = 0.5;
const PREVIEW_SECONDS = 30;

function youtubePreviewUrl(url: string) {
  if (!url.includes("youtube.com/embed/")) return url;
  const hasQuery = url.includes("?");
  const sep = hasQuery ? "&" : "?";
  return `${url}${sep}start=0&end=${PREVIEW_SECONDS}`;
}

function cleChapitresInvite(idCours: number) {
  return `knd_chapitres_invite_${idCours}`;
}

export default function DetailCours(props: any) {
  const { etudiant, onDeconnexion, setEtudiant } = props;

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const cours: Cours | undefined = listeCours.find((c) => c.id === Number(id));
  const visiteur = !etudiant;
  const { lang } = useLanguage();

  const [score, setScore] = useState<number | null>(null);
  const [reponses, setReponses] = useState<{ [key: number]: string }>({});
  const [quizReussi, setQuizReussi] = useState(false);
  const [chapitresCompletes, setChapitresCompletes] = useState<number[]>([]);
  const [indexChapitre, setIndexChapitre] = useState(0);
  const [notes, setNotes] = useState("");
  const [favori, setFavori] = useState(false);
  const [commentaire, setCommentaire] = useState("");
  const [commentsRev, setCommentsRev] = useState(0);
  const [likeRev, setLikeRev] = useState(0);
  const [livrableProjet, setLivrableProjet] = useState("");
  const [projetMessage, setProjetMessage] = useState("");

  const [aiLesson, setAiLesson] = useState<AiLessonResponse | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const voiceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const chapitreCourant = cours ? cours.chapitres[indexChapitre] : undefined;

  const rafraichirEtudiant = useCallback(() => {
    if (!etudiant || !setEtudiant) return;
    const frais = getEtudiant(etudiant.id);
    if (frais) setEtudiant(frais);
  }, [etudiant, setEtudiant]);

  useEffect(() => {
    if (!cours) return;
    setDernierCoursId(cours.id);
    setNotes(getNotesCours(cours.id));
    setFavori(estFavori(cours.id));
    if (etudiant) {
      toucherStreak(etudiant.id);
      const frais = getEtudiant(etudiant.id);
      if (frais && setEtudiant) setEtudiant(frais);
    }
  }, [cours?.id, etudiant?.id, setEtudiant]);

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

  useEffect(() => {
    // charge le contenu IA (étudiant only)
    if (!cours || !chapitreCourant || visiteur) return;
    const run = async () => {
      setAiLoading(true);
      setAiError(null);
      try {
        const res = await getAiLesson({
          lang,
          courseTitle: cours.titre,
          lessonTitle: chapitreCourant.titre,
          youtubeUrl: chapitreCourant.videoYoutube,
        });
        setAiLesson(res);
      } catch (e: any) {
        setAiError(e?.message ?? "Erreur IA");
      } finally {
        setAiLoading(false);
      }
    };
    void run();
  }, [cours?.id, chapitreCourant?.titre, chapitreCourant?.videoYoutube, visiteur, lang]);

  const stopVoice = () => {
    try {
      window.speechSynthesis?.cancel();
    } catch {
      // ignore
    }
  };

  const speak = (text: string) => {
    stopVoice();
    if (!("speechSynthesis" in window)) return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang === "wo" ? "fr-FR" : lang === "ar" ? "ar-SA" : lang === "en" ? "en-US" : "fr-FR";
    u.rate = 1;
    u.pitch = 1;
    voiceRef.current = u;
    window.speechSynthesis.speak(u);
  };

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

  const estParcoursGuide = etudiant?.modeApprentissage !== "cours-libre";
  const parcoursIds = getParcoursCoursIds(etudiant?.parcoursGuideChoisi);
  const positionModule = parcoursIds.findIndex((courseId) => courseId === Number(id));
  const modulesValides = parcoursIds.filter((courseId) => {
    const suivi = etudiant?.coursSuivis.find((cs: { idCours: number; progression: number }) => cs.idCours === courseId);
    return (suivi?.progression ?? 0) >= 100;
  }).length;
  const indexDebloque = Math.min(modulesValides, Math.max(0, parcoursIds.length - 1));
  const moduleBloque = estParcoursGuide && positionModule >= 0 && positionModule > indexDebloque;
  const quizInteractif = estParcoursGuide ? nbChapitresLus >= chapitresRequisPourQuiz : true;

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

  const commentaires = useMemo(() => {
    void commentsRev;
    return cours ? getCommentairesCours(cours.id) : [];
  }, [cours, commentsRev]);
  const likesLecon = useMemo(() => {
    void likeRev;
    return cours ? getCompteurLikes("cours", cours.id) : 0;
  }, [cours, likeRev]);
  const likesFormateur = useMemo(() => {
    void likeRev;
    return cours ? getCompteurLikes("formateur", cours.instructeur) : 0;
  }, [cours, likeRev]);

  if (!cours) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-slate-950">
        <BarreNavigation etudiant={etudiant} onDeconnexion={onDeconnexion} />
        <section className="max-w-3xl mx-auto px-6 py-16">
          <p className="text-lg font-semibold dark:text-white">Cours introuvable.</p>
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

  const totalCh = cours.chapitres.length;
  const chapitreDebloque = estParcoursGuide ? Math.min(chapitresCompletes.length, Math.max(0, totalCh - 1)) : totalCh - 1;

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
      recompenserQuizReussi(etudiant.id, cours.id);
      rafraichirEtudiant();
    }
  };

  const pctReussite = score !== null && cours.quiz.length ? Math.round((score / cours.quiz.length) * 100) : null;
  const suiviCours = etudiant?.coursSuivis.find((cs: { idCours: number }) => cs.idCours === cours.id);
  const projetValide = suiviCours?.projetFinalValide === true;
  const progressionCours = suiviCours?.progression ?? 0;

  if (moduleBloque) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100">
        <BarreNavigation etudiant={etudiant} onDeconnexion={onDeconnexion} />
        <section className="max-w-3xl mx-auto px-6 py-14">
          <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 p-6">
            <h2 className="text-xl font-bold text-amber-900 dark:text-amber-200">Module verrouille</h2>
            <p className="mt-2 text-sm text-amber-800 dark:text-amber-300">
              Dans le parcours guide, vous devez valider le module precedent avant d'acceder a celui-ci.
            </p>
            <button
              type="button"
              onClick={() => navigate(`/cours/${parcoursIds[indexDebloque]}`)}
              className="mt-4 rounded-xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white"
            >
              Aller au module debloque
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100">
      <BarreNavigation etudiant={etudiant} onDeconnexion={onDeconnexion} />

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col lg:flex-row lg:items-start gap-8">
          <aside className="lg:w-72 shrink-0 space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">Playlist</p>
            <ul className="rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 divide-y divide-gray-100 dark:divide-slate-800 overflow-hidden">
              {cours.chapitres.map((ch, i) => (
                <li key={ch.id}>
                  <button
                    type="button"
                    disabled={estParcoursGuide && i > chapitreDebloque}
                    onClick={() => setIndexChapitre(i)}
                    className={`w-full text-left px-4 py-3 text-sm transition ${
                      i === indexChapitre
                        ? "bg-blue-50 dark:bg-blue-950/50 font-semibold text-blue-800 dark:text-blue-200"
                        : "hover:bg-gray-50 dark:hover:bg-slate-800"
                    } ${(estParcoursGuide && i > chapitreDebloque) ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <span className="opacity-60 mr-2">{i + 1}.</span>
                    {ch.titre}
                    {chapitresCompletes.includes(ch.id) && <span className="ml-2 text-green-600">✓</span>}
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-4xl font-bold">{cours.titre}</h1>
                <p className="text-gray-600 dark:text-slate-400 mt-2">{cours.description}</p>
                <p className="text-sm text-gray-500 dark:text-slate-500 mt-2">
                  Formateur : <strong>{cours.instructeur}</strong> · Niveau : {cours.niveau}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {etudiant && (
                  <>
                    <button
                      type="button"
                      disabled={aDejaLike(etudiant.id, "cours", cours.id)}
                      onClick={() => {
                        likerUneFois(etudiant.id, "cours", cours.id);
                        setLikeRev((x) => x + 1);
                      }}
                      className="px-4 py-2 rounded-xl text-sm font-semibold border bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-600 disabled:opacity-50"
                    >
                      👍 Leçon · {likesLecon}
                    </button>
                    <button
                      type="button"
                      disabled={aDejaLike(etudiant.id, "formateur", cours.instructeur)}
                      onClick={() => {
                        likerUneFois(etudiant.id, "formateur", cours.instructeur);
                        setLikeRev((x) => x + 1);
                      }}
                      className="px-4 py-2 rounded-xl text-sm font-semibold border bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-600 disabled:opacity-50"
                    >
                      ❤️ Prof · {likesFormateur}
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => {
                    const on = toggleFavoriCours(cours.id);
                    setFavori(on);
                  }}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold border ${
                    favori
                      ? "bg-red-50 dark:bg-red-950/40 border-red-200 text-red-700"
                      : "bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-600"
                  }`}
                >
                  {favori ? "❤️ Favori" : "🤍 Favori"}
                </button>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                disabled={indexChapitre <= 0}
                onClick={() => setIndexChapitre((i) => Math.max(0, i - 1))}
                className="px-4 py-2 rounded-xl bg-gray-900 dark:bg-slate-800 text-white text-sm font-semibold disabled:opacity-40"
              >
                ← Précédent
              </button>
              <button
                type="button"
                disabled={indexChapitre >= totalCh - 1}
                onClick={() => setIndexChapitre((i) => Math.min(totalCh - 1, i + 1))}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold disabled:opacity-40"
              >
                Suivant →
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!chapitreCourant) return;
                  toggleChapitreLu(chapitreCourant.id);
                }}
                className="px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-600 text-sm font-semibold"
              >
                {chapitreCourant && chapitresCompletes.includes(chapitreCourant.id)
                  ? "Marquer non terminé"
                  : "Terminer cette leçon"}
              </button>
              {visiteur && (
                <button
                  type="button"
                  onClick={() => navigate("/inscription")}
                  className="px-4 py-2 rounded-xl bg-orange-500 text-white text-sm font-semibold"
                >
                  Débloquer l'accès complet
                </button>
              )}
              {!estParcoursGuide && (
                <button
                  type="button"
                  onClick={() => persisterChapitres(cours.chapitres.map((ch) => ch.id))}
                  className="px-4 py-2 rounded-xl border border-orange-200 text-orange-700 dark:text-orange-300 text-sm font-semibold"
                >
                  Terminer le cours (toutes les leçons)
                </button>
              )}
            </div>

            <div className="mt-6 rounded-xl border border-blue-100 dark:border-blue-900/50 bg-blue-50/80 dark:bg-slate-900/80 px-4 py-3 text-sm text-blue-900 dark:text-blue-100">
              <p className="font-semibold">Progression</p>
              <p className="mt-1">
                Leçons validées : {nbChapitresLus} / {cours.chapitres.length}
                {estParcoursGuide && chapitresRequisPourQuiz > 0 && (
                  <> — minimum {chapitresRequisPourQuiz} pour débloquer le quiz (~85 % du cours)</>
                )}
              </p>
              <p className="mt-2 text-xs text-blue-700 dark:text-blue-200">
                Mode actif: {estParcoursGuide ? "Parcours guide" : "Cours simple libre"}.
              </p>
            </div>

            {chapitreCourant && (
              <article className="mt-8 rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
                <div className="p-4 md:p-6 border-b border-gray-100 dark:border-slate-800">
                  <h2 className="text-xl font-semibold">{chapitreCourant.titre}</h2>
                  <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Durée indicative : {chapitreCourant.duree}</p>
                </div>
                <div className="aspect-video max-w-3xl mx-auto bg-black rounded-xl overflow-hidden">
                  <iframe
                    width="100%"
                    height="100%"
                    src={visiteur ? youtubePreviewUrl(chapitreCourant.videoYoutube) : chapitreCourant.videoYoutube}
                    title={chapitreCourant.titre}
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
                {!visiteur ? (
                  <div className="p-4 md:p-6 space-y-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-800 dark:text-slate-200">Texte explicatif (IA)</h3>
                        <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                          Transcript simulé + explication structurée (résumé, points clés, exemple, approfondissement).
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => (aiLesson ? speak(aiLesson.content.summary) : null)}
                          disabled={!aiLesson}
                          className="px-3 py-2 rounded-xl bg-orange-500 text-white text-sm font-semibold disabled:opacity-50"
                        >
                          ▶ Voix off (résumé)
                        </button>
                        <button
                          type="button"
                          onClick={() => (aiLesson ? speak(aiLesson.content.deepDive) : null)}
                          disabled={!aiLesson}
                          className="px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-700 text-sm font-semibold disabled:opacity-50"
                        >
                          ▶ Voix off (détails)
                        </button>
                        <button
                          type="button"
                          onClick={stopVoice}
                          className="px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-700 text-sm font-semibold"
                        >
                          ⏹ Stop
                        </button>
                      </div>
                    </div>

                    {aiError && (
                      <div className="rounded-2xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30 p-4">
                        <p className="font-semibold text-red-800 dark:text-red-200">{aiError}</p>
                      </div>
                    )}

                    {!aiError && (
                      <div className="grid lg:grid-cols-2 gap-4">
                        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 p-5">
                          <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Résumé</p>
                          <p className={`mt-2 font-semibold ${aiLoading ? "opacity-60" : ""}`}>{aiLesson?.content.summary ?? "Génération..."}</p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 p-5">
                          <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Points clés</p>
                          <ul className={`mt-2 list-disc pl-5 text-sm text-slate-700 dark:text-slate-300 space-y-1 ${aiLoading ? "opacity-60" : ""}`}>
                            {(aiLesson?.content.keyPoints ?? ["Génération...", "…"]).map((p) => (
                              <li key={p}>{p}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
                          <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Exemple</p>
                          <p className={`mt-2 text-sm text-slate-700 dark:text-slate-300 ${aiLoading ? "opacity-60" : ""}`}>
                            {aiLesson?.content.example ?? "Génération..."}
                          </p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
                          <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Explication approfondie</p>
                          <p className={`mt-2 text-sm text-slate-700 dark:text-slate-300 ${aiLoading ? "opacity-60" : ""}`}>
                            {aiLesson?.content.deepDive ?? "Génération..."}
                          </p>
                        </div>
                      </div>
                    )}

                    <details className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
                      <summary className="cursor-pointer font-semibold text-slate-900 dark:text-white">
                        Transcript (simulé)
                      </summary>
                      <p className={`mt-3 text-sm text-slate-700 dark:text-slate-300 leading-relaxed ${aiLoading ? "opacity-60" : ""}`}>
                        {aiLesson?.transcript ?? "Génération..."}
                      </p>
                    </details>
                  </div>
                ) : (
                  <div className="p-4 md:p-6">
                    <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 p-4">
                      <p className="font-semibold text-amber-900 dark:text-amber-200">
                        Mode visiteur: aperçu vidéo limité à {PREVIEW_SECONDS}s.
                      </p>
                      <p className="mt-1 text-sm text-amber-800 dark:text-amber-300">
                        Le texte complet du cours et les quiz sont réservés aux utilisateurs connectés.
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => navigate("/connexion")}
                          className="px-4 py-2 rounded-xl bg-gray-900 text-white text-sm font-semibold"
                        >
                          Se connecter
                        </button>
                        <button
                          type="button"
                          onClick={() => navigate("/inscription")}
                          className="px-4 py-2 rounded-xl bg-orange-500 text-white text-sm font-semibold"
                        >
                          Créer un compte
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </article>
            )}

            <div className="mt-10">
              {etudiant && estParcoursGuide && progressionCours >= 100 && (
                <div className="mb-8 rounded-2xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50 dark:bg-emerald-950/30 p-5">
                  <h2 className="text-lg font-semibold text-emerald-900 dark:text-emerald-200">Projet final du parcours</h2>
                  {projetValide ? (
                    <p className="mt-2 text-sm text-emerald-700 dark:text-emerald-300">
                      Projet final validé. Le certificat PDF est disponible dans votre profil.
                    </p>
                  ) : (
                    <>
                      <p className="mt-2 text-sm text-emerald-800 dark:text-emerald-300">
                        Décrivez votre livrable puis validez ce projet pour débloquer le certificat.
                      </p>
                      <textarea
                        value={livrableProjet}
                        onChange={(e) => setLivrableProjet(e.target.value)}
                        className="mt-3 w-full min-h-[100px] rounded-xl border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-slate-900 p-3 text-sm"
                        placeholder="Exemple: application React deployée, mini API Node, exercice pratique..."
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (!livrableProjet.trim()) {
                            setProjetMessage("Ajoutez d'abord une description de votre projet final.");
                            return;
                          }
                          const ok = validerProjetFinal(etudiant.id, cours.id);
                          if (!ok) {
                            setProjetMessage("Le projet ne peut pas etre valide tant que le cours n'est pas termine.");
                            return;
                          }
                          setProjetMessage("Projet final valide. Votre certificat est maintenant disponible.");
                          rafraichirEtudiant();
                        }}
                        className="mt-3 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 transition"
                      >
                        Valider mon projet final
                      </button>
                      {projetMessage && <p className="mt-2 text-sm text-emerald-800 dark:text-emerald-300">{projetMessage}</p>}
                    </>
                  )}
                </div>
              )}

              <div className="mb-8 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 text-sm">
                <p className="font-semibold text-slate-900 dark:text-slate-100">Parcours propose</p>
                <ol className="mt-2 list-decimal pl-5 space-y-1 text-slate-700 dark:text-slate-300">
                  <li>Suivre les lecons videos et valider les chapitres.</li>
                  <li>Passer le quiz de fin de cours.</li>
                  <li>Terminer le projet final pour obtenir le certificat PDF.</li>
                </ol>
              </div>

              <h2 className="text-lg font-semibold">Notes personnelles</h2>
              <p className="text-sm text-gray-500 dark:text-slate-400">Sauvegardées localement sur cet appareil.</p>
              <textarea
                value={notes}
                onChange={(e) => {
                  const valeur = e.target.value;
                  setNotes(valeur);
                  setNotesCours(cours.id, valeur);
                }}
                onBlur={() => setNotesCours(cours.id, notes)}
                className="mt-3 w-full min-h-[120px] rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-900 p-4 text-sm text-gray-900 dark:text-slate-100"
                placeholder="Vos idées, liens, définitions…"
                style={{ colorScheme: "light dark" }}
              />
            </div>

            <div className="mt-10">
              <h2 className="text-lg font-semibold">Commentaires</h2>
              <div className="mt-3 space-y-3">
                {commentaires.map((c) => (
                  <div key={c.id} className="rounded-xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 text-sm">
                    <p className="font-semibold">
                      {c.auteur}
                    </p>
                    <p className="mt-1 text-gray-700 dark:text-slate-300">{c.texte}</p>
                  </div>
                ))}
              </div>
              {etudiant ? (
                <div className="mt-4 flex flex-col gap-2">
                  <textarea
                    value={commentaire}
                    onChange={(e) => setCommentaire(e.target.value)}
                    className="rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-900 p-3 text-sm min-h-[80px]"
                    placeholder="Ajouter un commentaire…"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const t = commentaire.trim();
                      if (!t) return;
                      ajouterCommentaireCours(cours.id, etudiant.nom, t);
                      setCommentaire("");
                      setCommentsRev((x) => x + 1);
                    }}
                    className="self-start px-4 py-2 rounded-xl bg-gray-900 dark:bg-slate-800 text-white text-sm font-semibold"
                  >
                    Publier
                  </button>
                </div>
              ) : (
                <p className="mt-3 text-sm text-gray-500">Connectez-vous pour commenter.</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-14 relative max-w-4xl">
          <h2 className="text-xl font-semibold">Quiz</h2>
          {visiteur && (
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
              Connectez-vous pour accéder au quiz et valider le module (≥ 50%).
            </p>
          )}
          {!quizInteractif && (
            <p className="mt-2 text-sm text-amber-800 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900 rounded-xl px-4 py-3">
              Complétez assez de leçons pour débloquer le quiz interactif.
            </p>
          )}

          <div
            className={`mt-6 relative rounded-2xl transition ${(!quizInteractif || visiteur) ? "opacity-60" : ""}`}
            aria-disabled={!quizInteractif || visiteur}
          >
            {(!quizInteractif || visiteur) && <div className="absolute inset-0 z-10 cursor-not-allowed rounded-2xl bg-gray-900/5" aria-hidden />}

            <div className={`grid md:grid-cols-2 gap-6 ${(!quizInteractif || visiteur) ? "pointer-events-none select-none" : ""}`}>
              {cours.quiz.map((q, i) => (
                <div key={i} className="bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800 p-4">
                  <p className="font-semibold">
                    {i + 1}. {q.question}
                  </p>

                  <div className="flex flex-col gap-2 mt-4">
                    {q.options.map((opt, j) => {
                      const selected = reponses[i] === opt;
                      const showCorr = score !== null;
                      const isCorrect = opt === q.reponse;
                      return (
                        <button
                          key={j}
                          type="button"
                          disabled={!quizInteractif || visiteur}
                          onClick={() => handleReponse(i, opt)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-left transition ${
                            showCorr && isCorrect
                              ? "bg-green-600 text-white border-green-600"
                              : showCorr && selected && !isCorrect
                                ? "bg-red-500 text-white border-red-500"
                                : selected
                                  ? "bg-blue-600 text-white border-blue-600"
                                  : "bg-white dark:bg-slate-950 border-gray-200 dark:border-slate-700 hover:border-blue-300"
                          } ${!quizInteractif ? "opacity-90" : ""}`}
                        >
                          <span
                            className={`w-4 h-4 rounded-full border ${
                              selected ? "bg-white border-white" : "bg-white border-gray-300 dark:border-slate-600"
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
                disabled={!quizInteractif || visiteur}
                onClick={calculerScore}
                className="px-8 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 font-semibold transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Valider
              </button>
              {score !== null && !quizReussi && (
                <button
                  type="button"
                  onClick={reprendreQuiz}
                  className="px-8 py-3 bg-gray-200 dark:bg-slate-700 text-gray-900 dark:text-white rounded-xl hover:bg-gray-300 dark:hover:bg-slate-600 font-semibold transition"
                >
                  Recommencer le quiz
                </button>
              )}
            </div>

            {score !== null && (
              <div className="mt-4 text-center space-y-2">
                <p className="font-semibold">
                  Score : {score}/{cours.quiz.length}
                  {pctReussite !== null && ` (${pctReussite}% de réussite)`}
                </p>
                {!quizReussi && (
                  <p className="text-red-700 dark:text-red-300 font-medium">
                    Il faut au moins 50% de bonnes réponses pour valider le module.
                  </p>
                )}
                {quizReussi && (
                  <p className="text-green-700 dark:text-green-300 font-medium">
                    Bravo ! Cours validé — points et progression mis à jour sur votre profil.
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

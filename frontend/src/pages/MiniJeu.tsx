import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import EnteteRetour from "../composants/EnteteRetour";
import PiedPage from "../composants/PiedPage";
import { useLanguage } from "../elearn/i18n/LanguageContext";
import { getAiMiniGame, type AiGameResponse } from "../services/aiMiniGameApi";
import { getAiAdvice, type AiAdviceResponse } from "../services/aiServiceApi";
import { useLocation } from "react-router-dom";
import { ajouterXpMiniJeu } from "../services/etudiantService";

export default function MiniJeu(props: any) {
  const { etudiant } = props;
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const location = useLocation();
  const initialTopic = (location.state as any)?.topic || "JavaScript";

  const [topic, setTopic] = useState(initialTopic);
  const [loading, setLoading] = useState(false);
  const [game, setGame] = useState<AiGameResponse | null>(null);
  const [result, setResult] = useState<{ ok: boolean; score: number; total: number; xp: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [aiAdvice, setAiAdvice] = useState<AiAdviceResponse | null>(null);
  const [aiAdviceLoading, setAiAdviceLoading] = useState(false);
  const [_gamesPlayed, setGamesPlayed] = useState(0); // games completed in this session
  const [cooldownUntil, setCooldownUntil] = useState<number | null>(() => {
    const saved = localStorage.getItem('minijeu_cooldown');
    if (saved) {
      const ts = parseInt(saved, 10);
      return ts > Date.now() ? ts : null;
    }
    return null;
  });
  const [cooldownLeft, setCooldownLeft] = useState(0);

  // Countdown state
  const [countdown, setCountdown] = useState<number | null>(null);

  // Timed quiz state
  const [timerLeft, setTimerLeft] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const lastScore = useMemo(() => {
    const pts = Number(etudiant?.points ?? 0);
    if (pts < 50) return 40;
    if (pts < 120) return 60;
    return 85;
  }, [etudiant?.points]);

  const level = useMemo(() => {
    const pts = Number(etudiant?.points ?? 0);
    return Math.max(1, Math.min(3, Math.floor(pts / 120) + 1));
  }, [etudiant?.points]);

  // Timer effect
  useEffect(() => {
    if (!timerRunning || timerLeft <= 0) return;
    const id = setInterval(() => {
      setTimerLeft((t) => {
        if (t <= 1) {
          setTimerRunning(false);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [timerRunning, timerLeft]);

  // Auto-submit quiz when timer expires → set cooldown
  useEffect(() => {
    if (timerLeft === 0 && timerRunning === false && game?.type === "timed-quiz" && !quizSubmitted && Object.keys(quizAnswers).length > 0) {
      submitQuiz();
    }
    // Cooldown when time runs out with no answers
    if (timerLeft === 0 && timerRunning === false && game?.type === "timed-quiz" && !quizSubmitted && Object.keys(quizAnswers).length === 0) {
      const until = Date.now() + 30 * 60 * 1000; // 30 min cooldown
      setCooldownUntil(until);
      localStorage.setItem('minijeu_cooldown', String(until));
    }
  }, [timerLeft, timerRunning]);

  // Cooldown countdown
  useEffect(() => {
    if (!cooldownUntil) return;
    const tick = () => {
      const left = Math.max(0, Math.ceil((cooldownUntil - Date.now()) / 1000));
      setCooldownLeft(left);
      if (left === 0) {
        setCooldownUntil(null);
        localStorage.removeItem('minijeu_cooldown');
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [cooldownUntil]);

  const generateGame = useCallback(async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    setAiAdvice(null);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setTimerRunning(false);
    try {
      const g = await getAiMiniGame({ lang, topic: topic.trim() || "apprentissage", lastScore, level });
      setGame(g);
      
      // Start countdown before game
      setCountdown(3);
    } catch (e: any) {
      setError(e?.message ?? "Erreur mini-jeu");
      setLoading(false);
    }
  }, [lang, topic, lastScore, level]);

  // Countdown effect
  useEffect(() => {
    if (countdown === null) return;
    if (countdown > 0) {
      const id = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(id);
    } else {
      const id = setTimeout(() => {
        setCountdown(null);
        setLoading(false);
        // Start timer for timed-quiz after countdown
        if (game?.type === "timed-quiz" && game.payload?.seconds) {
          setTimerLeft(game.payload.seconds);
          setTimerRunning(true);
        }
      }, 800);
      return () => clearTimeout(id);
    }
  }, [countdown, game]);

  const fetchAiAdvice = async (score: number, total: number) => {
    setAiAdviceLoading(true);
    try {
      const pct = Math.round((score / total) * 100);
      const res = await getAiAdvice({
        lastScore: pct,
        topic: game?.title || topic,
        lang
      });
      setAiAdvice(res);
    } catch (e) {
      console.error("AI Advice error", e);
    } finally {
      setAiAdviceLoading(false);
    }
  };

  const submitQuiz = useCallback(() => {
    if (!game?.payload?.questions) return;
    setQuizSubmitted(true);
    setTimerRunning(false);
    const questions = game.payload.questions as { prompt: string; options: string[]; correctIndex: number; explanation?: string }[];
    let correct = 0;
    for (let i = 0; i < questions.length; i++) {
      if (quizAnswers[i] === questions[i].correctIndex) correct++;
    }
    const pct = Math.round((correct / questions.length) * 100);
    const xpGagne = pct >= 60 ? game.reward.xp : 0;
    
    if (xpGagne > 0 && etudiant) {
      void ajouterXpMiniJeu(etudiant.id, xpGagne);
    }

    setResult({
      ok: pct >= 60,
      score: correct,
      total: questions.length,
      xp: xpGagne
    });

    fetchAiAdvice(correct, questions.length);
    setGamesPlayed(g => g + 1);
  }, [game, quizAnswers, etudiant, lang]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white dark:from-slate-900 dark:to-slate-950 text-gray-900 dark:text-slate-100">
      <EnteteRetour to="/tableau-bord" label="Dashboard" titre="Mini-jeu adaptatif" sousTitre="Défis courts, XP rapide" />

      <section className="max-w-4xl mx-auto px-6 md:px-10 py-10">
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-black">🎮 Mini-jeu du jour</h1>
              <p className="mt-2 text-slate-600 dark:text-slate-300">
                Défis personnalisés par l'IA selon votre niveau. Langue : <strong>{lang}</strong>
              </p>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-orange-500 to-rose-500 px-5 py-3 text-white">
              <p className="text-xs font-bold uppercase tracking-widest text-orange-100">Récompense</p>
              <p className="text-lg font-black">+XP & Badges</p>
            </div>
          </div>

          <div className="mt-6 grid sm:grid-cols-[1fr_auto] gap-3">
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100"
              placeholder="Sujet (ex: SQL, React, Python)"
            />
            <button
              type="button"
              disabled={loading}
              onClick={generateGame}
              className="px-6 py-3 rounded-2xl bg-orange-500 hover:bg-orange-400 text-white font-bold disabled:opacity-60 transition"
            >
              {loading ? "⏳ Génération..." : "🎲 Générer un défi"}
            </button>
          </div>

          {error && <p className="mt-4 text-sm text-red-600 dark:text-red-300">{error}</p>}

          {game && (
            <div className="mt-8">
              {/* Game info header */}
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-500">{game.type === "timed-quiz" ? "Quiz chronométré" : game.type === "fill-code" ? "Challenge code" : "Puzzle logique"}</p>
                    <p className="mt-1 text-xl font-black">{game.title}</p>
                  </div>
                  {game.type === "timed-quiz" && timerRunning && (
                    <div
                      className={`text-2xl font-black tabular-nums transition-colors ${
                        timerLeft <= 5
                          ? "text-red-500 animate-pulse"
                          : timerLeft <= 10
                          ? "text-orange-500"
                          : "text-blue-600 dark:text-blue-400"
                      }`}
                    >
                      ⏱ {formatTime(timerLeft)}
                    </div>
                  )}
                </div>
                <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{game.rules}</p>
                <div className="mt-3 flex items-center gap-4 text-sm">
                  <span>Difficulté: <strong>{"⭐".repeat(game.difficulty)}</strong></span>
                  <span>Gain: <strong className="text-emerald-600">+{game.reward.xp} XP</strong></span>
                  {game.reward.badge && <span>Badge: <strong className="text-orange-500">{game.reward.badge}</strong></span>}
                </div>
              </div>

              {/* TIMED QUIZ — real interactive */}
              {game.type === "timed-quiz" && game.payload?.questions && (
                <div className="mt-5 space-y-4">
                  {(game.payload.questions as { prompt: string; options: string[]; correctIndex: number; explanation?: string }[]).map((q, qi) => (
                    <div key={qi} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
                      <p className="font-bold text-slate-900 dark:text-white">{qi + 1}. {q.prompt}</p>
                      <div className="mt-3 grid gap-2">
                        {q.options.map((opt, oi) => {
                          const selected = quizAnswers[qi] === oi;
                          const isCorrect = quizSubmitted && oi === q.correctIndex;
                          const isWrong = quizSubmitted && selected && oi !== q.correctIndex;
                          return (
                            <button
                              key={oi}
                              type="button"
                              disabled={quizSubmitted}
                              onClick={() => setQuizAnswers((prev) => ({ ...prev, [qi]: oi }))}
                              className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition ${
                                isCorrect
                                  ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200"
                                  : isWrong
                                  ? "border-red-400 bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200"
                                  : selected
                                  ? "border-blue-400 bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200"
                                  : "border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600"
                              }`}
                            >
                              <span className="mr-2 font-bold">{String.fromCharCode(65 + oi)}.</span> {opt}
                            </button>
                          );
                        })}
                      </div>
                      {quizSubmitted && q.explanation && (
                        <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/40 rounded-lg p-2">
                          💡 {q.explanation}
                        </p>
                      )}
                    </div>
                  ))}

                  {!quizSubmitted && (
                    <button
                      type="button"
                      onClick={submitQuiz}
                      disabled={Object.keys(quizAnswers).length === 0}
                      className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-lg transition disabled:opacity-50"
                    >
                      ✅ Valider mes réponses
                    </button>
                  )}
                </div>
              )}

              {/* FILL CODE — real interactive */}
              {game.type === "fill-code" && (
                <div className="mt-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
                  <p className="font-bold text-lg">{game.payload?.prompt ?? "Compléter le code"}</p>
                  <pre className="mt-3 rounded-xl bg-slate-950 text-green-400 p-5 overflow-auto text-sm font-mono leading-relaxed">
                    {game.payload?.snippet ?? "function add(a,b){ return __; }"}
                  </pre>
                  <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">Choisissez la bonne réponse :</p>
                  <div className="mt-3 grid sm:grid-cols-2 gap-2">
                    {(game.payload?.choices ?? []).map((c: string) => (
                      <button
                        key={c}
                        type="button"
                        disabled={!!result}
                        onClick={() => {
                          const isOk = c === game.payload?.correct;
                          const xp = isOk ? game.reward.xp : 0;
                          if (xp > 0 && etudiant) void ajouterXpMiniJeu(etudiant.id, xp);
                          setResult({ ok: isOk, score: isOk ? 1 : 0, total: 1, xp });
                          fetchAiAdvice(isOk ? 1 : 0, 1);
                        }}
                        className={`px-4 py-3 rounded-xl border text-sm font-bold transition ${
                          result
                            ? c === game.payload?.correct
                              ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-900/30"
                              : "border-slate-200 dark:border-slate-700 opacity-50"
                            : "border-slate-200 dark:border-slate-700 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* LOGIC PUZZLE — real interactive */}
              {game.type === "logic-puzzle" && (
                <div className="mt-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
                  <p className="font-bold text-lg">{game.payload?.prompt ?? "Puzzle logique"}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">{game.payload?.statement}</p>
                  <div className="mt-4 grid sm:grid-cols-2 gap-2">
                    {(game.payload?.options ?? []).map((o: string, idx: number) => (
                      <button
                        key={o}
                        type="button"
                        disabled={!!result}
                        onClick={() => {
                          const isOk = idx === game.payload?.correctIndex;
                          const xp = isOk ? game.reward.xp : 0;
                          if (xp > 0 && etudiant) void ajouterXpMiniJeu(etudiant.id, xp);
                          setResult({ ok: isOk, score: isOk ? 1 : 0, total: 1, xp });
                          fetchAiAdvice(isOk ? 1 : 0, 1);
                        }}
                        className={`px-4 py-3 rounded-xl border text-sm font-bold transition ${
                          result
                            ? idx === game.payload?.correctIndex
                              ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-900/30"
                              : "border-slate-200 dark:border-slate-700 opacity-50"
                            : "border-slate-200 dark:border-slate-700 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        }`}
                      >
                        {o}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Result */}
              {result && (
                <div
                  className={`mt-8 rounded-3xl border-2 p-8 shadow-2xl transition-all animate-in zoom-in-95 duration-500 ${
                    result.ok
                      ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40"
                      : "border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40"
                  }`}
                >
                  <div className="text-center">
                    <p className="text-6xl mb-4">{result.ok ? "🎉" : "💪"}</p>
                    <h3 className="text-3xl font-black text-slate-900 dark:text-white">
                      {result.ok ? "Magnifique !" : "Pas mal !"}
                    </h3>
                    <p className="mt-2 text-slate-600 dark:text-slate-400 font-medium">
                      Score final : <span className="font-bold text-xl">{result.score} / {result.total}</span>
                    </p>
                    {result.xp > 0 && (
                      <div className="mt-4 inline-block px-6 py-2 bg-emerald-600 text-white rounded-2xl font-black shadow-lg shadow-emerald-500/30 animate-bounce">
                        +{result.xp} XP
                      </div>
                    )}
                  </div>

                  {/* AI Feedback */}
                  <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">
                     <div className="flex items-center gap-3 mb-4">
                        <span className="text-2xl">🤖</span>
                        <h4 className="font-black text-lg uppercase tracking-wider text-slate-500">Analyse de Mistral AI</h4>
                     </div>
                     
                     {aiAdviceLoading ? (
                       <div className="flex items-center gap-3 text-blue-600 animate-pulse font-bold">
                          <div className="w-2 h-2 bg-blue-600 rounded-full animate-ping"></div>
                          Génération de votre feedback personnalisé...
                       </div>
                     ) : aiAdvice ? (
                       <div className="space-y-4">
                          <p className="text-slate-800 dark:text-slate-200 font-medium leading-relaxed italic">
                            "{aiAdvice.message}"
                          </p>
                          
                          <div className="grid md:grid-cols-2 gap-4">
                             {aiAdvice.strengths && aiAdvice.strengths.length > 0 && (
                               <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-900/30">
                                  <p className="text-xs font-black text-emerald-600 uppercase mb-2">Points forts</p>
                                  <ul className="text-sm space-y-1">
                                    {aiAdvice.strengths.map((s, i) => <li key={i}>✅ {s}</li>)}
                                  </ul>
                                </div>
                             )}
                             {aiAdvice.actions && aiAdvice.actions.length > 0 && (
                               <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                                  <p className="text-xs font-black text-blue-600 uppercase mb-2">Conseils</p>
                                  <ul className="text-sm space-y-1">
                                    {aiAdvice.actions.map((a, i) => <li key={i}>🎯 {a}</li>)}
                                  </ul>
                                </div>
                             )}
                          </div>

                          {aiAdvice.recommendedCourses && aiAdvice.recommendedCourses.length > 0 && (
                            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-900/30">
                               <p className="text-xs font-black text-indigo-600 uppercase mb-2">Prochaines étapes</p>
                               <div className="space-y-2">
                                  {aiAdvice.recommendedCourses.map((c, i) => (
                                    <div key={i}>
                                      <p className="text-sm font-bold">{c.title}</p>
                                      <p className="text-xs text-slate-500">{c.reason}</p>
                                    </div>
                                  ))}
                               </div>
                            </div>
                          )}
                       </div>
                     ) : (
                       <p className="text-sm text-slate-500 italic">Analyse indisponible pour le moment.</p>
                     )}
                  </div>

                  <div className="mt-8 flex flex-wrap gap-4 justify-center">
                    <button
                      type="button"
                      onClick={generateGame}
                      className="px-8 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black shadow-lg shadow-indigo-500/30 transition-all active:scale-95"
                    >
                      🔄 Rejouer
                    </button>
                    {game.type === "timed-quiz" && (
                      <button
                        type="button"
                        onClick={() => setQuizSubmitted(true)}
                        className="px-8 py-3 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 font-bold transition-all"
                      >
                        📖 Voir la correction
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => navigate("/tableau-bord")}
                      className="px-8 py-3 rounded-2xl bg-slate-900 text-white font-bold transition-all"
                    >
                      Continuer l'apprentissage
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Countdown Overlay */}
      {countdown !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-xl">
           <div className="text-center animate-in zoom-in-50 duration-300">
              <p className="text-9xl font-black text-white drop-shadow-2xl">
                {countdown === 0 ? "GO !" : countdown}
              </p>
           </div>
        </div>
      )}

      {/* Cooldown Overlay */}
      {cooldownUntil && cooldownLeft > 0 && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/90 backdrop-blur-2xl">
          <div className="text-center max-w-sm px-8 py-12 rounded-3xl bg-slate-900 border border-white/10 shadow-2xl">
            <p className="text-6xl mb-4">⏳</p>
            <h2 className="text-2xl font-black text-white mb-2">Temps écoulé !</h2>
            <p className="text-slate-400 mb-6">Vous n'avez pas répondu. Revenez dans :</p>
            <p className="text-5xl font-black text-orange-400 font-mono">
              {Math.floor(cooldownLeft / 60).toString().padStart(2,'0')}:{(cooldownLeft % 60).toString().padStart(2,'0')}
            </p>
            <p className="text-slate-500 text-sm mt-4">Prochain défi dans {Math.ceil(cooldownLeft / 60)} min.</p>
            <button onClick={() => navigate("/tableau-bord")}
              className="mt-8 px-8 py-3 rounded-2xl bg-white/10 text-white font-bold hover:bg-white/20 transition">
              Retour au tableau de bord
            </button>
          </div>
        </div>
      )}

      <PiedPage />
    </div>
  );
}

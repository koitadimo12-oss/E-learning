import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import EnteteRetour from "../composants/EnteteRetour";
import PiedPage from "../composants/PiedPage";
import { useLanguage } from "../elearn/i18n/LanguageContext";
import { getAiMiniGame, type AiGameResponse } from "../services/aiMiniGameApi";

export default function MiniJeu(props: any) {
  const { etudiant } = props;
  const navigate = useNavigate();
  const { lang } = useLanguage();

  const [topic, setTopic] = useState("JavaScript");
  const [loading, setLoading] = useState(false);
  const [game, setGame] = useState<AiGameResponse | null>(null);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  // Auto-submit quiz when timer expires
  useEffect(() => {
    if (timerLeft === 0 && timerRunning === false && game?.type === "timed-quiz" && !quizSubmitted && Object.keys(quizAnswers).length > 0) {
      submitQuiz();
    }
  }, [timerLeft, timerRunning]);

  const generateGame = useCallback(async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setTimerRunning(false);
    try {
      const g = await getAiMiniGame({ lang, topic: topic.trim() || "apprentissage", lastScore, level });
      setGame(g);
      // Start timer for timed-quiz
      if (g.type === "timed-quiz" && g.payload?.seconds) {
        setTimerLeft(g.payload.seconds);
        setTimerRunning(true);
      }
    } catch (e: any) {
      setError(e?.message ?? "Erreur mini-jeu");
    } finally {
      setLoading(false);
    }
  }, [lang, topic, lastScore, level]);

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
    setResult({
      ok: pct >= 60,
      message: `${correct}/${questions.length} bonnes réponses (${pct}%) — ${pct >= 60 ? `Bravo ! +${game.reward.xp} XP gagnés !` : "Réessayez pour un meilleur score !"}`,
    });
  }, [game, quizAnswers]);

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
                    <div className={`text-2xl font-black tabular-nums ${timerLeft <= 10 ? "text-red-500 animate-pulse" : "text-blue-600 dark:text-blue-400"}`}>
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
                        onClick={() =>
                          setResult({
                            ok: c === game.payload?.correct,
                            message: c === game.payload?.correct
                              ? `✅ Correct ! +${game.reward.xp} XP gagnés !`
                              : `❌ Incorrect. La bonne réponse était : ${game.payload?.correct}`,
                          })
                        }
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
                        onClick={() =>
                          setResult({
                            ok: idx === game.payload?.correctIndex,
                            message: idx === game.payload?.correctIndex
                              ? `✅ Excellent ! +${game.reward.xp} XP gagnés !`
                              : `❌ Pas tout à fait. La bonne réponse était : ${(game.payload?.options ?? [])[game.payload?.correctIndex]}`,
                          })
                        }
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
                  className={`mt-5 rounded-2xl border p-5 ${
                    result.ok
                      ? "border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30"
                      : "border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30"
                  }`}
                >
                  <p className="font-bold text-lg">{result.ok ? "🎉" : "💪"} {result.message}</p>
                  <div className="mt-4 flex gap-3">
                    <button
                      type="button"
                      onClick={generateGame}
                      className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition"
                    >
                      🔄 Nouveau défi
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate("/tableau-bord")}
                      className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold transition"
                    >
                      Retour dashboard
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <PiedPage />
    </div>
  );
}

import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import BarreNavigation from "../composants/BarreNavigation";
import PiedPage from "../composants/PiedPage";
import { challengeHebdo, formatCountdown, getChallengeStatus, getTimerColorClass, type ChallengeStatus } from "../services/challengeService";
import { listeEtudiants, type Etudiant } from "../services/etudiantService";

type Props = { etudiant: Etudiant | null; onDeconnexion: () => void };

export default function Challenges(props: Props) {
  const { etudiant, onDeconnexion } = props;
  const navigate = useNavigate();
  const [nowMs, setNowMs] = useState(Date.now());
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const previousStatusRef = useRef<ChallengeStatus | null>(null);

  useEffect(() => {
    const t = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const etudiants = useMemo(() => listeEtudiants(), []);
  const hebdo = challengeHebdo(etudiants.map((e) => e.ecoleId), nowMs);
  const status = getChallengeStatus(nowMs, hebdo.dateDebut, hebdo.dateFin);
  const msBeforeStart = Math.max(0, new Date(hebdo.dateDebut).getTime() - nowMs);
  const msBeforeEnd = Math.max(0, new Date(hebdo.dateFin).getTime() - nowMs);
  const timerValue = status === "upcoming" ? msBeforeStart : msBeforeEnd;

  useEffect(() => {
    const previous = previousStatusRef.current;
    if (previous && previous !== status) {
      if (status === "active") {
        setStatusMessage("🎉 Le challenge a commence !");
      } else if (status === "finished") {
        setStatusMessage("🏆 Challenge termine !");
      } else {
        setStatusMessage(null);
      }
    }
    previousStatusRef.current = status;
  }, [status]);

  const aggregation = etudiants.reduce<Record<string, { score: number; membres: number }>>((acc, e) => {
    if (!acc[e.ecoleId]) acc[e.ecoleId] = { score: 0, membres: 0 };
    acc[e.ecoleId].score += e.points ?? 0;
    acc[e.ecoleId].membres += 1;
    return acc;
  }, {});

  const scores = Object.entries(aggregation)
    .map(([ecoleId, v]) => ({ ecoleId, label: ecoleId.toUpperCase(), score: v.score, membres: v.membres }))
    .sort((a, b) => b.score - a.score);
  const top2 = hebdo.ecolesIds.map((id) => scores.find((s) => s.ecoleId === id)).filter(Boolean) as typeof scores;
  const titre = hebdo.titre.replace("Challenge hebdo — ", "");
  const winner = [...scores].sort((a, b) => b.score - a.score)[0];
  const timerColorClass = getTimerColorClass(timerValue);
  const alertText = timerValue <= 6 * 3600 * 1000 ? "🚨 Dernieres 6 heures !" : timerValue <= 24 * 3600 * 1000 ? "⚠️ Dernieres 24 heures !" : null;
  const timerLabel = status === "upcoming" ? "🕒 Disponible dans :" : status === "active" ? "⏳ Se termine dans :" : "🏁 Challenge termine";
  const actionLabel = status === "upcoming" ? "🔔 Me notifier" : status === "active" ? "🚀 Participer" : "📊 Voir resultats";
  const actionClick = () => {
    if (status === "active") {
      navigate("/projets-etudiants");
      return;
    }
    if (status === "finished") {
      navigate("/classements");
      return;
    }
    navigate("/tableau-bord");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100">
      <BarreNavigation etudiant={etudiant} onDeconnexion={onDeconnexion} />

      <section className="max-w-4xl mx-auto px-6 py-12">
        <p className="text-sm font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-widest">Compétition</p>
        <h1 className="text-3xl md:text-4xl font-extrabold mt-2">⚔️ {titre}</h1>
        <p className="mt-4 text-gray-600 dark:text-slate-400 leading-relaxed">
          Réalisez une mini application, publiez une démo, puis gagnez des points selon l'activité réelle des étudiants.
        </p>
        {statusMessage && (
          <p className="mt-3 rounded-xl border border-orange-200 dark:border-orange-700 bg-orange-50 dark:bg-orange-900/20 px-4 py-2 text-sm font-semibold text-orange-700 dark:text-orange-300">
            {statusMessage}
          </p>
        )}

        <div className="mt-8 grid sm:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm">
            <p className="text-sm text-gray-500 dark:text-slate-400">{timerLabel}</p>
            {status === "finished" ? (
              <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-slate-100">🏆 Gagnant : {winner?.label ?? "A definir"}</p>
            ) : (
              <p className={`text-3xl font-bold tabular-nums mt-1 transition-all duration-300 ${timerColorClass}`}>{formatCountdown(timerValue)}</p>
            )}
            {alertText && status !== "finished" && <p className="mt-3 text-sm font-semibold text-red-600 dark:text-red-400 animate-pulse">{alertText}</p>}
          </div>
          <div className="rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm">
            <p className="text-sm text-gray-500 dark:text-slate-400">Écoles participantes</p>
            <ul className="mt-2 font-semibold space-y-1">
              {top2.map((s) => (
                <li key={s.ecoleId}>
                  {s.label} ({s.membres} étudiants)
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6">
          <h2 className="text-xl font-bold">Équipes & chefs de projet</h2>
          <ul className="mt-4 space-y-3">
            {top2.map((s) => (
              <li key={s.ecoleId} className="flex justify-between gap-4 border-b border-gray-100 dark:border-slate-800 pb-3 last:border-0">
                <span className="font-medium">{s.label}</span>
                <span className="text-gray-600 dark:text-slate-400">
                  Chef : {(etudiants.find((e) => e.ecoleId === s.ecoleId)?.nom ?? "A definir")}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6">
          <h2 className="text-xl font-bold">Score écoles (réel)</h2>
          <ol className="mt-4 space-y-3">
            {scores
              .sort((a, b) => b.score - a.score)
              .map((s, i) => (
                <li key={s.ecoleId} className="flex items-center justify-between gap-4">
                  <span>
                    <span className="font-bold text-orange-600 dark:text-orange-400 mr-2">#{i + 1}</span>
                    {s.label}
                  </span>
                  <span className="font-mono font-semibold">{s.score} pts</span>
                </li>
              ))}
          </ol>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={actionClick}
            className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold transition-colors"
          >
            {actionLabel}
          </button>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="px-5 py-2.5 rounded-xl bg-gray-900 dark:bg-slate-800 text-white font-semibold"
          >
            Accueil
          </button>
          {etudiant && (
            <button
              type="button"
              onClick={() => navigate("/tableau-bord")}
              className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-slate-600 font-semibold"
            >
              Mon espace
            </button>
          )}
        </div>
      </section>

      <PiedPage />
    </div>
  );
}

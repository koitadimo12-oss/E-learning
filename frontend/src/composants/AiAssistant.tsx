import { useMemo, useState } from "react";
import { getAiAdvice } from "../services/aiServiceApi";
import { useLanguage } from "../elearn/i18n/LanguageContext";

type Props = {
  defaultTopic?: string;
  lastScore?: number;
};

export default function AiAssistant(props: Props) {
  const { defaultTopic, lastScore } = props;
  const { lang } = useLanguage();
  const [topic, setTopic] = useState(defaultTopic ?? "");
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState<import("../services/aiServiceApi").AiAdviceResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const topicLabel = useMemo(() => topic.trim() || "apprentissage", [topic]);

  return (
    <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-orange-600 dark:text-orange-300">Assistant IA</p>
          <h3 className="mt-2 text-xl font-bold text-slate-900 dark:text-white">Conseils personnalisés (même sans compte)</h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Demandez un plan d'étude rapide sur un sujet. Exemple: React, Python, SQL.
          </p>
        </div>
      </div>

      <div className="mt-5 grid sm:grid-cols-[1fr_auto] gap-3">
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Sujet (ex: JavaScript)"
          className="px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-300"
        />
        <button
          type="button"
          disabled={loading}
          onClick={async () => {
            setLoading(true);
            setError(null);
            try {
              const res = await getAiAdvice({ topic: topicLabel, lastScore, lang });
              setAnswer(res);
            } catch (e: any) {
              setError(e?.message ?? "Erreur IA");
            } finally {
              setLoading(false);
            }
          }}
          className="px-6 py-3 rounded-2xl bg-orange-500 hover:bg-orange-400 text-white font-bold transition disabled:opacity-60"
        >
          {loading ? "Analyse..." : "Obtenir un conseil"}
        </button>
      </div>

      {error && <p className="mt-4 text-sm text-red-600 dark:text-red-300">{error}</p>}

      {answer && (
        <div className="mt-8 space-y-6">
          <div className="rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-5">
            <h4 className="font-bold text-blue-900 dark:text-blue-100 flex items-center gap-2">
              <span>💡</span> Conseil de l'IA
            </h4>
            <p className="mt-2 text-blue-800 dark:text-blue-200 leading-relaxed">{answer.message}</p>
          </div>

          {answer.path && answer.path.length > 0 && (
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-3">Parcours suggéré</h4>
              <div className="space-y-3 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 dark:before:via-slate-700 before:to-transparent">
                {answer.path.map((step, i) => (
                  <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 font-bold shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                      {i + 1}
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{step}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            {answer.recommendedCourses && answer.recommendedCourses.length > 0 && (
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <span>🎓</span> Cours recommandés
                </h4>
                <div className="space-y-3">
                  {answer.recommendedCourses.map((c, i) => (
                    <div key={i} className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                      <p className="font-bold text-slate-800 dark:text-slate-200">{c.title}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{c.reason}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {answer.recommendedBooks && answer.recommendedBooks.length > 0 && (
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <span>📚</span> Livres suggérés
                </h4>
                <div className="space-y-3">
                  {answer.recommendedBooks.map((b, i) => (
                    <div key={i} className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                      <p className="font-bold text-slate-800 dark:text-slate-200">{b.title}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{b.author}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {answer.actions && answer.actions.length > 0 && (
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <span>⚡</span> Prochaines actions rapides
              </h4>
              <div className="flex flex-wrap gap-2">
                {answer.actions.map((action, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-lg bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 text-sm font-medium border border-orange-200 dark:border-orange-800/50">
                    {action}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

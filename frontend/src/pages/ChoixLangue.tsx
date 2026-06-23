import { useNavigate } from "react-router-dom";
import BarreNavigation from "../composants/BarreNavigation";
import PiedPage from "../composants/PiedPage";
import { LANG_LABEL, type Lang } from "../elearn/i18n/languages";
import { useLanguage } from "../elearn/i18n/LanguageContext";

export default function ChoixLangue(props: any) {
  const { etudiant, onDeconnexion } = props;
  const { lang, setLang } = useLanguage();
  const navigate = useNavigate();

  const langs: Lang[] = ["fr", "en", "wo", "ar"];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100">
      <BarreNavigation etudiant={etudiant} onDeconnexion={onDeconnexion} />
      <section className="max-w-4xl mx-auto px-6 md:px-10 py-12">
        <h1 className="text-3xl md:text-4xl font-black">Choisir la langue</h1>
        <p className="mt-3 text-slate-600 dark:text-slate-300">
          Visiteur: la langue est enregistrée sur cet appareil. Étudiant: elle pourra aussi être synchronisée avec le profil.
        </p>

        <div className="mt-8 grid sm:grid-cols-2 gap-4">
          {langs.map((l) => {
            const active = l === lang;
            return (
              <button
                key={l}
                type="button"
                onClick={() => setLang(l)}
                className={`rounded-2xl border p-6 text-left transition ${
                  active
                    ? "border-orange-300 bg-orange-50 dark:bg-orange-500/10"
                    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:-translate-y-0.5"
                }`}
              >
                <p className="text-sm font-bold uppercase tracking-widest text-slate-500">Langue</p>
                <p className="mt-1 text-2xl font-black">{LANG_LABEL[l]}</p>
                {l === "ar" && <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Interface en RTL</p>}
              </button>
            );
          })}
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold"
          >
            Retour
          </button>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="px-6 py-3 rounded-2xl bg-orange-500 hover:bg-orange-400 text-white font-bold"
          >
            Continuer
          </button>
        </div>
      </section>
      <PiedPage />
    </div>
  );
}


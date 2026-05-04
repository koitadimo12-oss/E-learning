import { useNavigate } from "react-router-dom";
import BarreNavigation from "../composants/BarreNavigation";
import PiedPage from "../composants/PiedPage";

export default function APropos(props: any) {
  const { etudiant, onDeconnexion } = props;
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <BarreNavigation etudiant={etudiant} onDeconnexion={onDeconnexion} />

      <section className="max-w-6xl mx-auto px-6 md:px-10 py-16">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 md:p-12 shadow-2xl">
          {/* Decorative backgrounds */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-3xl -mr-32 -mt-32 rounded-full" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/10 blur-3xl -ml-32 -mb-32 rounded-full" />

          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              À propos de <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Kaay Niou Diang</span>
            </h1>
            <p className="mt-6 text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
              Kaay Niou Diang est une plateforme d&apos;apprentissage révolutionnaire conçue pour accompagner chaque étudiant vers l&apos;excellence. 
              Nous croyons que l&apos;éducation doit être <span className="font-bold text-blue-600">accessible</span>, <span className="font-bold text-orange-500">interactive</span> et <span className="font-bold text-indigo-600">personnalisée</span>.
            </p>

            <div className="mt-16 grid md:grid-cols-3 gap-8">
              <div className="group p-8 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-2xl mb-6">🎯</div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Notre mission</h2>
                <p className="mt-3 text-slate-600 dark:text-slate-400 leading-relaxed">
                  Démocratiser le savoir en proposant des parcours structurés et des contenus de haute qualité adaptés aux défis modernes.
                </p>
              </div>

              <div className="group p-8 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center text-2xl mb-6">⚡</div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Notre méthode</h2>
                <p className="mt-3 text-slate-600 dark:text-slate-400 leading-relaxed">
                  L&apos;apprentissage par l&apos;action. Chaque leçon est suivie de quiz interactifs et de défis pratiques pour ancrer les connaissances.
                </p>
              </div>

              <div className="group p-8 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-2xl mb-6">🚀</div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Notre vision</h2>
                <p className="mt-3 text-slate-600 dark:text-slate-400 leading-relaxed">
                  Devenir le compagnon de réussite incontournable pour les étudiants, en alliant technologie IA et pédagogie de pointe.
                </p>
              </div>
            </div>

            <div className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-2xl font-bold">Prêt à commencer l&apos;aventure ?</h3>
                  <p className="text-blue-100 mt-1">Rejoignez des milliers d&apos;étudiants passionnés dès aujourd&apos;hui.</p>
                </div>
                <button 
                  onClick={() => navigate("/inscription")}
                  className="px-8 py-3 bg-white text-blue-700 font-bold rounded-2xl hover:bg-blue-50 transition-colors shadow-lg"
                >
                  S&apos;inscrire gratuitement
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PiedPage />
    </div>
  );
}

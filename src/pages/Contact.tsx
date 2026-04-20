import BarreNavigation from "../composants/BarreNavigation";
import PiedPage from "../composants/PiedPage";

export default function Contact(props: any) {
  const { etudiant, onDeconnexion } = props;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-slate-900 dark:to-slate-950 text-gray-900 dark:text-slate-100">
      <BarreNavigation etudiant={etudiant} onDeconnexion={onDeconnexion} />

      <section className="max-w-6xl mx-auto px-6 md:px-10 py-12">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow border border-gray-100 dark:border-slate-700 p-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Contact</h1>
            <p className="mt-4 text-gray-600 dark:text-slate-300">
              Besoin d&apos;aide ? Vous pouvez nous ecrire a tout moment. Notre equipe vous repond rapidement.
            </p>

            <div className="mt-8 space-y-4 text-gray-700 dark:text-slate-300">
              <p>
                <span className="font-semibold text-gray-900 dark:text-white">Email:</span> contact@kaay_niou_diang.com
              </p>
              <p>
                <span className="font-semibold text-gray-900 dark:text-white">Telephone:</span> +221 77 000 00 00
              </p>
              <p>
                <span className="font-semibold text-gray-900 dark:text-white">Adresse:</span> Dakar, Senegal
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow border border-gray-100 dark:border-slate-700 p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Formulaire rapide</h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-slate-300">
              Cette section est une presentation. Vous pouvez brancher un vrai envoi plus tard.
            </p>

            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-slate-200">Nom</label>
                <input
                  type="text"
                  placeholder="Votre nom"
                  className="mt-1 w-full border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-950 rounded-lg px-3 py-2"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-slate-200">Email</label>
                <input
                  type="email"
                  placeholder="Votre email"
                  className="mt-1 w-full border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-950 rounded-lg px-3 py-2"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-slate-200">Message</label>
                <textarea
                  placeholder="Votre message"
                  rows={4}
                  className="mt-1 w-full border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-950 rounded-lg px-3 py-2"
                  readOnly
                />
              </div>
              <button
                type="button"
                className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold"
              >
                Envoyer
              </button>
            </div>
          </div>
        </div>
      </section>

      <PiedPage />
    </div>
  );
}

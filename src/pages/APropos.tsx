import BarreNavigation from "../composants/BarreNavigation";
import PiedPage from "../composants/PiedPage";

export default function APropos(props: any) {
  const { etudiant, onDeconnexion } = props;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <BarreNavigation etudiant={etudiant} onDeconnexion={onDeconnexion} />

      <section className="max-w-6xl mx-auto px-6 md:px-10 py-12">
        <div className="bg-white rounded-2xl shadow border border-gray-100 p-8 md:p-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">A propos de Kaay Niou Diang</h1>
          <p className="mt-4 text-gray-600 leading-7">
            Kaay Niou Diang est une plateforme d&apos;apprentissage en ligne qui aide les etudiants a apprendre a
            leur rythme. Notre objectif est simple : proposer des cours clairs, des quiz utiles et un suivi de
            progression facile a comprendre.
          </p>

          <div className="mt-10 grid md:grid-cols-3 gap-6">
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-6">
              <h2 className="font-bold text-gray-900">Notre mission</h2>
              <p className="mt-2 text-sm text-gray-600">
                Rendre l&apos;apprentissage accessible avec des contenus pratiques, progressifs et modernes.
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-100 rounded-xl p-6">
              <h2 className="font-bold text-gray-900">Notre methode</h2>
              <p className="mt-2 text-sm text-gray-600">
                Chaque cours contient des chapitres structurés, puis un quiz pour verifier les acquis.
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-100 rounded-xl p-6">
              <h2 className="font-bold text-gray-900">Notre vision</h2>
              <p className="mt-2 text-sm text-gray-600">
                Construire une communaute d&apos;apprenants autonomes, confiants et capables de creer de vrais projets.
              </p>
            </div>
          </div>
        </div>
      </section>

      <PiedPage />
    </div>
  );
}

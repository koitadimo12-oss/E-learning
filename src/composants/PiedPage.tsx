import { useNavigate } from "react-router-dom";

export default function PiedPage() {
  const navigate = useNavigate();

  return (
    <footer className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 text-white mt-20 shadow-xl relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_20%,white,transparent_45%)]"
        aria-hidden
      />

      <div className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8 relative">
        <div>
          <h2 className="text-2xl font-bold mb-2">Kaay Niou Diang</h2>
          <p className="text-sm text-blue-50/90">
            Plateforme d&apos;apprentissage en ligne pour développer vos compétences.
          </p>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Liens</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <button
                type="button"
                onClick={() => navigate("/")}
                className="hover:text-orange-300 transition-colors cursor-pointer text-left"
              >
                Accueil
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => navigate("/cours")}
                className="hover:text-orange-300 transition-colors cursor-pointer text-left"
              >
                Cours
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => navigate("/connexion")}
                className="hover:text-orange-300 transition-colors cursor-pointer text-left"
              >
                Connexion
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Contact</h3>
          <p className="text-sm text-blue-50/90">contact@kaay_niou_diang.com</p>
        </div>
      </div>

      <div className="text-center py-4 bg-blue-900/50 text-sm text-blue-100/90 relative">
        © {new Date().getFullYear()} Kaay Niou Diang
      </div>
    </footer>
  );
}

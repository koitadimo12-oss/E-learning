import { useNavigate } from "react-router-dom";

export default function PiedPage() {
  const navigate = useNavigate();

  return (
    <footer className="mt-20 border-t border-slate-800 bg-slate-950 text-slate-100 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_10%,#3b82f6,transparent_40%)]" aria-hidden />
      <div className="pointer-events-none absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_80%_90%,#f97316,transparent_40%)]" aria-hidden />

      <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-8 relative">
        <div>
          <h2 className="text-2xl font-bold mb-2 text-white">Kaay Niou Diang</h2>
          <p className="text-sm text-slate-300">Plateforme d&apos;apprentissage moderne : cours, progression et réussite.</p>
        </div>

        <div>
          <h3 className="font-semibold mb-3 text-white">Navigation</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <button
                type="button"
                onClick={() => navigate("/")}
                className="hover:text-orange-300 text-slate-300 transition-colors cursor-pointer text-left"
              >
                Accueil
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => navigate("/cours")}
                className="hover:text-orange-300 text-slate-300 transition-colors cursor-pointer text-left"
              >
                Cours
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => navigate("/connexion")}
                className="hover:text-orange-300 text-slate-300 transition-colors cursor-pointer text-left"
              >
                Connexion
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => navigate("/#a-propos")}
                className="hover:text-orange-300 text-slate-300 transition-colors cursor-pointer text-left"
              >
                A propos (Accueil)
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-3 text-white">Plateforme</h3>
          <ul className="space-y-2 text-sm text-slate-300">
            <li>Parcours guidés</li>
            <li>Suivi intelligent</li>
            <li>Certificats</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-3 text-white">Contact</h3>
          <p className="text-sm text-slate-300">contact@kaaynioudiang.com</p>
          <button
            type="button"
            onClick={() => navigate("/contact")}
            className="mt-4 px-4 py-2 rounded-lg border border-slate-700 text-slate-200 hover:bg-slate-800 transition text-sm font-semibold"
          >
            Nous écrire
          </button>
        </div>
      </div>

      <div className="text-center py-4 bg-slate-900 text-sm text-slate-400 relative border-t border-slate-800">
        © {new Date().getFullYear()} Kaay Niou Diang - Tous droits reserves
      </div>
    </footer>
  );
}

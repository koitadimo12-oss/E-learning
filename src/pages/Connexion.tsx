import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { connexionEtudiant } from "../services/etudiantService";
import type { Etudiant } from "../services/etudiantService";

export default function Connexion({ setEtudiant }: { setEtudiant: (e: Etudiant) => void }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [mdp, setMdp] = useState("");
  const [erreur, setErreur] = useState("");

  const handleConnexion = () => {
    const user = connexionEtudiant(email, mdp);
    if (user) {
      setEtudiant(user);
      navigate("/profil");
    } else setErreur("Email ou mot de passe incorrect");
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-950">
      <div className="relative lg:w-1/2 min-h-[220px] lg:min-h-screen overflow-hidden">
        <img
          src="/Hero.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/85 via-blue-800/60 to-orange-600/50" />
        <div className="relative z-[1] h-full flex flex-col justify-end p-10 text-white">
          <p className="text-sm uppercase tracking-widest text-blue-100/80">Kaay Niou Diang</p>
          <h1 className="mt-2 text-3xl md:text-4xl font-bold leading-tight max-w-md">
            Reprenez vos cours où vous vous êtes arrêté.
          </h1>
          <p className="mt-3 text-blue-50/90 max-w-md text-sm md:text-base">
            Connexion sécurisée — votre progression est enregistrée sur cet appareil.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-gray-50">
        <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900">Connexion</h2>
          <p className="text-sm text-gray-500 mt-1">Accédez à votre profil et à vos cours.</p>

          <label className="block mt-6 text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            autoComplete="email"
            placeholder="vous@exemple.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
          />

          <label className="block mt-4 text-sm font-medium text-gray-700">Mot de passe</label>
          <input
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={mdp}
            onChange={(e) => setMdp(e.target.value)}
            className="mt-1 w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
            onKeyDown={(e) => e.key === "Enter" && handleConnexion()}
          />

          {erreur && <p className="text-red-600 text-sm mt-3 font-medium">{erreur}</p>}

          <button
            type="button"
            onClick={handleConnexion}
            className="mt-6 w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition shadow-md hover:shadow-lg"
          >
            Se connecter
          </button>

          <p className="text-center text-sm text-gray-500 mt-6">
            Pas encore de compte ?{" "}
            <button
              type="button"
              onClick={() => navigate("/inscription")}
              className="text-orange-600 font-semibold hover:underline"
            >
              S&apos;inscrire
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

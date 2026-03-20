import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { inscriptionEtudiant } from "../services/etudiantService";
import type { Etudiant } from "../services/etudiantService";

export default function Inscription({ setEtudiant }: { setEtudiant: (e: Etudiant) => void }) {
  const navigate = useNavigate();
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [mdp, setMdp] = useState("");

  const handleInscription = () => {
    const user = inscriptionEtudiant(nom, email, mdp);
    setEtudiant(user);
    navigate("/profil");
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-950">
      <div className="relative lg:w-1/2 min-h-[220px] lg:min-h-screen overflow-hidden order-2 lg:order-1">
        <img
          src="/Hero.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-orange-600/55 via-blue-900/75 to-blue-950/90" />
        <div className="relative z-[1] h-full flex flex-col justify-end p-10 text-white">
          <p className="text-sm uppercase tracking-widest text-orange-100/90">Bienvenue</p>
          <h1 className="mt-2 text-3xl md:text-4xl font-bold leading-tight max-w-md">
            Créez votre compte en quelques secondes.
          </h1>
          <p className="mt-3 text-blue-50/90 max-w-md text-sm md:text-base">
            Suivez vos progrès, passez les quiz et construisez votre parcours.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-gray-50 order-1 lg:order-2">
        <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900">Inscription</h2>
          <p className="text-sm text-gray-500 mt-1">Rejoignez la plateforme Kaay Niou Diang.</p>

          <label className="block mt-6 text-sm font-medium text-gray-700">Nom</label>
          <input
            type="text"
            autoComplete="name"
            placeholder="Votre nom"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            className="mt-1 w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
          />

          <label className="block mt-4 text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            autoComplete="email"
            placeholder="vous@exemple.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
          />

          <label className="block mt-4 text-sm font-medium text-gray-700">Mot de passe</label>
          <input
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            value={mdp}
            onChange={(e) => setMdp(e.target.value)}
            className="mt-1 w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
            onKeyDown={(e) => e.key === "Enter" && handleInscription()}
          />

          <button
            type="button"
            onClick={handleInscription}
            className="mt-6 w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition shadow-md hover:shadow-lg"
          >
            S&apos;inscrire
          </button>

          <p className="text-center text-sm text-gray-500 mt-6">
            Déjà inscrit ?{" "}
            <button
              type="button"
              onClick={() => navigate("/connexion")}
              className="text-blue-600 font-semibold hover:underline"
            >
              Se connecter
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

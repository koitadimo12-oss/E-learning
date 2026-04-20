import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import ChampSaisie from "../composants/ChampSaisie";
import { connexionFormateur, estFormateurValide, getSessionFormateur, setSessionFormateur } from "../services/formateurService";

export default function ConnexionFormateur() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const existingSession = getSessionFormateur();
    if (existingSession && estFormateurValide(existingSession)) {
      navigate("/formateur/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Remplissez tous les champs.");
      return;
    }
    const f = connexionFormateur(email, password);
    if (!f) {
      setError("Identifiants incorrects.");
      return;
    }
    setSessionFormateur(f);
    setError("");
    if (f.statut === "refuse") {
      navigate("/formateur/pending?state=refused");
      return;
    }
    if (estFormateurValide(f)) {
      navigate("/formateur/dashboard");
      return;
    }
    navigate("/formateur/pending");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] dark:bg-slate-950 px-4 py-10">
      <div className="w-full max-w-[1100px] min-h-[640px] rounded-2xl overflow-hidden border border-white/10 shadow-xl flex flex-col lg:flex-row">
        <div className="w-full lg:w-1/2 bg-white dark:bg-slate-900 p-8 flex items-center">
          <div className="w-full max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Connexion formateur</h1>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Espace formateur validé par admin</p>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <ChampSaisie
            label="Email"
            type="email"
            name="email"
            value={email}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          />
          <ChampSaisie
            label="Mot de passe"
            type="password"
            name="password"
            value={password}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button type="submit" className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700">
            Se connecter
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-600 dark:text-slate-400">
          Pas encore inscrit ?{" "}
          <Link to="/inscription-formateur" className="text-orange-600 font-semibold hover:underline">
            Créer un compte formateur
          </Link>
        </p>
        <p className="mt-3 text-sm text-center text-gray-600 dark:text-slate-400">
          Accès admin ?{" "}
          <Link to="/admin" className="text-blue-600 font-semibold hover:underline">
            Espace admin
          </Link>
        </p>
        <Link to="/" className="mt-6 block text-center text-sm text-gray-500 hover:text-gray-800 dark:hover:text-slate-200">
          ← Retour au site
        </Link>
          </div>
        </div>
        <div className="hidden lg:flex w-1/2 bg-[#f5e6db] dark:bg-slate-800 items-center justify-center">
          <img src="/Hero.png" alt="illustration" className="w-full h-full object-contain" />
        </div>
      </div>
    </div>
  );
}

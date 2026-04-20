import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import ChampSaisie from "../composants/ChampSaisie";
import { inscriptionFormateur, setSessionFormateur } from "../services/formateurService";
import { ADMIN_EMAIL } from "../services/adminService";

export default function InscriptionFormateur() {
  const navigate = useNavigate();
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [specialite, setSpecialite] = useState("");
  const [experience, setExperience] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");
  const [cvFileName, setCvFileName] = useState("");
  const [preuve, setPreuve] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!nom || !email || !password || !specialite || !experience || !portfolio || !linkedin || !github || !cvFileName) {
      setError("Tous les champs sont requis.");
      return;
    }
    const isUrl = (v: string) => /^https?:\/\//i.test(v);
    if (!isUrl(portfolio) || !isUrl(linkedin) || !isUrl(github)) {
      setError("Portfolio, LinkedIn et GitHub doivent être des liens valides (http/https).");
      return;
    }
    const f = inscriptionFormateur({
      nom,
      email,
      motDePasse: password,
      specialite,
      experience,
      portfolio,
      linkedin,
      github,
      cvFileName,
      preuve,
    });
    const sujet = encodeURIComponent(`[Demande formateur] ${nom}`);
    const corps = encodeURIComponent(
      `Nouvelle demande formateur\n\nNom: ${nom}\nEmail: ${email}\nSpecialite: ${specialite}\nExperience: ${experience}\nPortfolio: ${portfolio}\nLinkedIn: ${linkedin}\nGitHub: ${github}\nCV: ${cvFileName}\nPreuve: ${preuve || "N/A"}\n\nAction admin:\n- Accepter\n- Refuser`
    );
    window.location.href = `mailto:${ADMIN_EMAIL}?subject=${sujet}&body=${corps}`;
    setSessionFormateur(f);
    setError("");
    navigate("/formateur/pending");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-950 px-4 py-10">
      <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 shadow-xl p-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Inscription formateur</h1>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
          Votre compte sera <strong>en attente de validation</strong> par un administrateur.
        </p>
        <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
          À l’envoi, un email prérempli est ouvert pour transmettre la demande à l’admin.
        </p>
        <form className="mt-6 space-y-3" onSubmit={handleSubmit}>
          <ChampSaisie label="Nom" type="text" name="nom" value={nom} onChange={(e: ChangeEvent<HTMLInputElement>) => setNom(e.target.value)} />
          <ChampSaisie label="Email" type="email" name="email" value={email} onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} />
          <ChampSaisie
            label="Mot de passe"
            type="password"
            name="password"
            value={password}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          />
          <ChampSaisie
            label="Spécialité"
            type="text"
            name="specialite"
            value={specialite}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setSpecialite(e.target.value)}
          />
          <ChampSaisie
            label="Expérience"
            type="text"
            name="experience"
            value={experience}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setExperience(e.target.value)}
          />
          <ChampSaisie label="Portfolio (URL)" type="text" name="portfolio" value={portfolio} onChange={(e: ChangeEvent<HTMLInputElement>) => setPortfolio(e.target.value)} />
          <ChampSaisie label="LinkedIn (URL)" type="text" name="linkedin" value={linkedin} onChange={(e: ChangeEvent<HTMLInputElement>) => setLinkedin(e.target.value)} />
          <ChampSaisie label="GitHub (URL)" type="text" name="github" value={github} onChange={(e: ChangeEvent<HTMLInputElement>) => setGithub(e.target.value)} />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">CV (PDF)</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setCvFileName(e.target.files?.[0]?.name ?? "")}
              className="w-full p-2.5 border border-gray-300 dark:border-slate-600 rounded-xl text-sm bg-white dark:bg-slate-900"
            />
            {cvFileName && <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Fichier: {cvFileName}</p>}
          </div>
          <ChampSaisie
            label="Preuve complémentaire (certificat, lien)"
            type="text"
            name="preuve"
            value={preuve}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setPreuve(e.target.value)}
          />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button type="submit" className="w-full py-3 rounded-xl bg-orange-500 text-white font-semibold hover:bg-orange-600">
            Envoyer la demande
          </button>
        </form>
        <p className="mt-4 text-sm text-center">
          <Link to="/connexion-formateur" className="text-blue-600 font-semibold hover:underline">
            Déjà un compte ?
          </Link>
        </p>
        <Link to="/" className="mt-4 block text-center text-sm text-gray-500 hover:underline">
          ← Retour au site
        </Link>
      </div>
    </div>
  );
}

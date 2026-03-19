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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-xl shadow w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Connexion</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={mdp}
          onChange={(e) => setMdp(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        />
        {erreur && <p className="text-red-500 mb-2">{erreur}</p>}
        <button onClick={handleConnexion} className="w-full bg-blue-600 text-white py-2 rounded">
          Se connecter
        </button>
      </div>
    </div>
  );
}

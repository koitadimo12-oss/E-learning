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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-xl shadow w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Inscription</h2>
        <input type="text" placeholder="Nom" value={nom} onChange={(e) => setNom(e.target.value)} className="w-full mb-4 p-2 border rounded" />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full mb-4 p-2 border rounded" />
        <input type="password" placeholder="Mot de passe" value={mdp} onChange={(e) => setMdp(e.target.value)} className="w-full mb-4 p-2 border rounded" />
        <button onClick={handleInscription} className="w-full bg-green-600 text-white py-2 rounded">S'inscrire</button>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import ChampSaisie from "../composants/ChampSaisie";
import { connexionAdmin, estAdminConnecte } from "../services/adminService";

export default function AdminConnexion() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (estAdminConnecte()) navigate("/admin/dashboard", { replace: true });
  }, [navigate]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (connexionAdmin(password)) {
      setError("");
      navigate("/admin/dashboard");
    } else {
      setError("Mot de passe incorrect.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-700 p-8">
        <h1 className="text-xl font-bold text-white">Admin Kaay Niou Diang</h1>
        <p className="text-sm text-slate-400 mt-1">Accès réservé</p>
        <div className="mt-6">
          <ChampSaisie
            label="Mot de passe admin"
            type="password"
            name="pwd"
            value={password}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          />
        </div>
        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
        <button type="submit" className="mt-6 w-full py-3 rounded-xl bg-orange-500 text-white font-semibold hover:bg-orange-600">
          Entrer
        </button>
        <p className="text-xs text-slate-500 mt-4 text-center">Indice démo : AdminKND2026!</p>
      </form>
    </div>
  );
}

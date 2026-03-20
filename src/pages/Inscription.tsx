import { useState } from "react";
import type { FormEvent } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import ChampSaisie from "../composants/ChampSaisie";
import { inscriptionEtudiant } from "../services/etudiantService";
import type { Etudiant } from "../services/etudiantService";

export default function Inscription({
  setEtudiant,
}: {
  setEtudiant: (e: Etudiant) => void;
}) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    password: "",
    confirmPassword: "",
    profil: "Etudiant",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");

  const validatePassword = (password: string) => {
    const lettre = /[a-zA-Z]/.test(password);
    const chiffre = /[0-9]/.test(password);
    const special = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < 10 || password.length > 15 || !lettre || !chiffre || !special) {
      return "Mot de passe invalide";
    }
    return "";
  };

  const handleSubmit = (e?: FormEvent) => {
    if (e) e.preventDefault();

    const { nom, prenom, email, password, confirmPassword, profil } = formData;
    if (!nom || !prenom || !email || !password || !confirmPassword) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (profil !== "Etudiant") {
      setError("Seuls les étudiants sont autorisés");
      return;
    }

    const user = inscriptionEtudiant(
      `${formData.nom} ${formData.prenom}`.trim(),
      formData.email,
      formData.password
    );
    setError("");
    setEtudiant(user);
    navigate("/profil");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] px-3 py-6">
      <div className="w-full max-w-[1100px] min-h-[680px] rounded-2xl overflow-hidden shadow-2xl flex flex-col lg:flex-row">
        <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-6">
          <div className="w-full max-w-[340px]">
            <div className="flex justify-center mb-4">
              <img
                src="/logo2.png"
                alt="logo"
                className="h-10 drop-shadow-md"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>

            <h2 className="text-xl font-bold text-center mb-1">Inscription</h2>
            <p className="text-gray-500 text-sm text-center mb-4">Créer votre compte</p>

            <form
              className="space-y-2"
              onSubmit={handleSubmit}
            >
              <ChampSaisie
                label="Nom"
                type="text"
                name="nom"
                value={formData.nom}
                onChange={(e) => setFormData((prev) => ({ ...prev, nom: e.target.value }))}
              />

              <ChampSaisie
                label="Prénom"
                type="text"
                name="prenom"
                value={formData.prenom}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, prenom: e.target.value }))
                }
              />

              <ChampSaisie
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
              />

              <div className="relative">
                <ChampSaisie
                  label="Mot de passe"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={(e) => {
                    const next = e.target.value;
                    setFormData((prev) => ({ ...prev, password: next }));
                    setError("");
                  }}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 cursor-pointer text-gray-400 hover:text-gray-600"
                  aria-hidden
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </span>
              </div>

              <div className="relative">
                <ChampSaisie
                  label="Confirmer mot de passe"
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }));
                    setError("");
                  }}
                />
                <span
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-9 cursor-pointer text-gray-400 hover:text-gray-600"
                  aria-hidden
                >
                  {showConfirm ? <FiEyeOff /> : <FiEye />}
                </span>
              </div>

              <select
                name="profil"
                value={formData.profil}
                onChange={(e) => setFormData((prev) => ({ ...prev, profil: e.target.value }))}
                className="w-full p-2 mt-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              >
                <option value="Etudiant">Étudiant</option>
                <option value="Personnel">Personnel</option>
                <option value="Tuteur">Tuteur</option>
              </select>

              {error && <p className="text-red-500 text-xs mt-2">{error}</p>}

              <button
                type="submit"
                onClick={() => {}}
                className="w-full mt-6 py-3 rounded-full bg-orange-500 text-white font-semibold shadow-md hover:bg-orange-600 transition text-center cursor-pointer"
              >
                S’inscrire
              </button>
            </form>
          </div>
        </div>

        <div className="hidden lg:flex w-1/2 bg-[#f5e6db] items-center justify-center">
          <img
            src="/Hero.png"
            alt="illustration"
            className="w-full h-full object-contain"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>
      </div>
    </div>
  );
}

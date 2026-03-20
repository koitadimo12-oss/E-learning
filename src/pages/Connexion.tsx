import { useState } from "react";
import type { FormEvent } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";

import type { Etudiant } from "../services/etudiantService";
import { connexionEtudiant } from "../services/etudiantService";
import ChampSaisie from "../composants/ChampSaisie";

export default function Connexion({
  setEtudiant,
}: {
  setEtudiant: (e: Etudiant) => void;
}) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [profil, setProfil] = useState("Etudiant");
  const [resetError, setResetError] = useState("");

  const validatePassword = (password: string) => {
    const lettre = /[a-zA-Z]/.test(password);
    const chiffre = /[0-9]/.test(password);
    const special = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < 10 || password.length > 15) {
      return "Le mot de passe doit contenir entre 10 et 15 caractères.";
    }
    if (!lettre || !chiffre || !special) {
      return "Le mot de passe doit contenir lettres, chiffres et caractères spéciaux.";
    }
    return "";
  };

  const handleSubmit = (e?: FormEvent) => {
    if (e) e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    const user = connexionEtudiant(formData.email, formData.password);
    if (!user) {
      setError("Aucun compte trouve. Inscrivez-vous d'abord.");
      return;
    }

    setError("");
    setEtudiant(user);
    navigate("/profil");
  };

  const handleReset = () => {
    if (profil !== "Etudiant") {
      setResetError("Seuls les étudiants peuvent réinitialiser leur mot de passe.");
      return;
    }
    setResetError("");
    alert(`Réinitialisation pour ${resetEmail} réussie`);
    setShowModal(false);
    setResetEmail("");
    setProfil("Etudiant");
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-[#0a1b3a] px-3 py-6">
      <div className="w-full max-w-[1200px] min-h-[700px] flex flex-col lg:flex-row rounded-2xl overflow-hidden shadow-2xl">
        <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-6 sm:p-10">
          <div className="w-full max-w-[420px]">
            <div className="mb-4 flex justify-center">
              <img
                src="/logo2.png"
                alt="Logo"
                className="h-12 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>

            <p className="text-sm text-gray-500">Bienvenue !!!</p>
            <h1 className="text-3xl font-bold mb-6">Connexion</h1>

            <form onSubmit={handleSubmit}>
              <ChampSaisie
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                placeholder="adresse email institutionnel"
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
              />

              <div className="relative mt-3">
                <ChampSaisie
                  label="Mot de passe"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  placeholder="********"
                  onChange={(e) => {
                    const next = e.target.value;
                    setFormData((prev) => ({ ...prev, password: next }));
                    const passwordError = validatePassword(next);
                    setError(passwordError ? passwordError : "");
                  }}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 cursor-pointer text-gray-400 hover:text-gray-600 text-xl"
                  aria-hidden
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </span>
              </div>

              {error && <p className="text-red-500 text-xs mt-1">{error}</p>}

              <div className="flex justify-between items-center text-sm mt-3">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    name="remember"
                    checked={formData.remember}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, remember: e.target.checked }))
                    }
                  />
                  Se souvenir de moi
                </label>

                <button
                  type="button"
                  onClick={() => {
                    setResetError("");
                    setShowModal(true);
                  }}
                  className="text-blue-500 hover:underline cursor-pointer"
                >
                  Mot de passe oublié ?
                </button>
              </div>

              <button
                type="submit"
                className="w-full mt-5 py-3 rounded-full bg-orange-500 text-white font-bold hover:bg-orange-600 transition text-center cursor-pointer"
              >
                Se connecter
              </button>

              <div className="flex justify-center items-center text-sm text-gray-500 mt-4 gap-2">
                <span>Pas encore de compte ?</span>
                <Link to="/inscription" className="text-orange-500 font-semibold hover:underline">
                  S’inscrire
                </Link>
              </div>
            </form>
          </div>
        </div>

        <div className="hidden lg:flex w-1/2 bg-[#f5e6db] items-center justify-center">
          <img
            src="/Hero.png"
            alt="illustration"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl w-[380px]">
            <h3 className="text-lg font-semibold mb-3">Réinitialisation</h3>

            <label className="block text-sm font-medium text-gray-700 mb-1">Profil :</label>
            <select
              name="profil"
              value={profil}
              onChange={(e) => setProfil(e.target.value)}
              className="w-full p-2 border rounded mt-1 mb-3"
            >
              <option value="Etudiant">Étudiant</option>
              <option value="Personnel">Personnel</option>
              <option value="Tuteur">Tuteur</option>
            </select>

            <ChampSaisie
              label="Email institutionnel"
              type="email"
              name="resetEmail"
              value={resetEmail}
              placeholder="votre email"
              onChange={(e) => setResetEmail(e.target.value)}
            />

            {resetError && <p className="text-red-500 text-xs mt-2">{resetError}</p>}

            <div className="flex justify-end mt-4 gap-2">
              <button type="button" onClick={() => setShowModal(false)}>
                Annuler
              </button>
              <button type="button" onClick={handleReset} className="px-4 py-2 bg-blue-500 text-white rounded">
                Valider
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState } from "react";
import ChampSaisie from "../composants/ChampSaisie";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Link } from "react-router-dom"; // pour la navigation vers inscription

const Connexion: React.FC = () => {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target;
    if (target instanceof HTMLInputElement) {
      const { name, value, type, checked } = target;
      if (name === "resetEmail") {
        setResetEmail(value);
      } else {
        setFormData({
          ...formData,
          [name]: type === "checkbox" ? checked : value,
        });
      }
    } else if (target instanceof HTMLSelectElement) {
      setProfil(target.value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }
    setError("");
    alert("Connexion réussie !");
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
    <div className="min-h-screen flex justify-center items-center bg-[#0a1b3a]">
      <div className="w-[95%] max-w-[1200px] min-h-[700px] flex rounded-2xl overflow-hidden shadow-2xl">

        {/* GAUCHE FORMULAIRE */}
        <div className="w-1/2 flex items-center justify-center bg-white p-10">
          <div className="w-[420px]">
            {/* Logo */}
            <div className="mb-4 flex justify-center">
              <img src="/images/logo2.png" alt="Logo" className="h-12 object-contain" />
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
                onChange={handleChange}
              />

              <div className="relative mt-3">
                <ChampSaisie
                  label="Mot de passe"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  placeholder="********"
                  onChange={handleChange}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 cursor-pointer text-gray-400 hover:text-gray-600 text-xl"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </span>
              </div>

              {error && <p className="text-red-500 text-xs mt-1">{error}</p>}

              {/* Se souvenir / Mot de passe oublié */}
              <div className="flex justify-between items-center text-sm mt-3">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="remember"
                    checked={formData.remember}
                    onChange={handleChange}
                  />
                  Se souvenir de moi
                </label>

                <button
                  type="button"
                  onClick={() => setShowModal(true)}
                  className="text-blue-500 hover:underline"
                >
                  Mot de passe oublié ?
                </button>
              </div>

              {/* Bouton Se connecter */}
              <button
                type="submit"
                className="w-full mt-5 py-3 rounded-full bg-orange-500 text-white font-bold hover:bg-orange-600 transition"
              >
                Se connecter
              </button>

              {/* Pas encore de compte ? S’inscrire */}
              <div className="flex justify-center items-center text-sm text-gray-500 mt-4 gap-2">
                <span>Pas encore de compte ?</span>
                <Link
                  to="/inscription"
                  className="text-orange-500 font-semibold hover:underline"
                >
                  S’inscrire
                </Link>
              </div>
            </form>
          </div>
        </div>

        {/* DROITE IMAGE */}
        <div className="w-1/2 bg-[#f5e6db] flex items-center justify-center">
          <img src="/images/Hero.png" alt="illustration" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* MODAL de réinitialisation */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl w-[380px]">
            <h3 className="text-lg font-semibold mb-3">Réinitialisation</h3>

            <label>Profil :</label>
            <select
              name="profil"
              value={profil}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-2 mb-3"
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
              onChange={handleChange}
            />

            {resetError && <p className="text-red-500 text-xs mt-2">{resetError}</p>}

            <div className="flex justify-end mt-4 gap-2">
              <button onClick={() => setShowModal(false)}>Annuler</button>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Valider
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Connexion;
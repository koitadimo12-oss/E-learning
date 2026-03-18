import React, { useState } from "react";
import ChampSaisie from "../composants/ChampSaisie";
import { FiEye, FiEyeOff } from "react-icons/fi";

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target;

    if (target instanceof HTMLInputElement) {
      const { name, value, type, checked } = target;

      if (name === "resetEmail") {
        setResetEmail(value);
      } else {
        const updatedForm = {
          ...formData,
          [name]: type === "checkbox" ? checked : value,
        };
        setFormData(updatedForm);

        if (name === "password") {
          const password = value;

          const lettre = /[a-zA-Z]/.test(password);
          const chiffre = /[0-9]/.test(password);
          const special = /[!@#$%^&*(),.?":{}|<>]/.test(password);

          if (
            password.length >= 10 &&
            password.length <= 15 &&
            lettre &&
            chiffre &&
            special
          ) {
            setError("");
          }
        }
      }
    } else if (target instanceof HTMLSelectElement) {
      const value = target.value;
      setProfil(value);

      if (value === "Etudiant") {
        setResetError("");
      } else {
        setResetError(
          "Seuls les étudiants peuvent réinitialiser leur mot de passe via cette plateforme."
        );
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const password = formData.password;

    if (password.length < 10 || password.length > 15) {
      setError("Le mot de passe doit contenir entre 10 et 15 caractères.");
      return;
    }

    const lettre = /[a-zA-Z]/.test(password);
    const chiffre = /[0-9]/.test(password);
    const special = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!lettre || !chiffre || !special) {
      setError(
        "Le mot de passe doit contenir au moins une lettre, un chiffre et un caractère spécial."
      );
      return;
    }

    setError("");
    alert("Connexion réussie !");
  };

  const handleReset = () => {
    if (profil === "Etudiant") {
      setResetError("");
      alert(`Réinitialisation du mot de passe pour ${resetEmail} réussie`);
      setShowModal(false);
      setResetEmail("");
      setProfil("Etudiant");
    } else {
      setResetError(
        "Seuls les étudiants peuvent réinitialiser leur mot de passe via cette plateforme."
      );
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center relative bg-[#0a1b3a]">
      {/* Arrière-plan bleu nuit derrière tout */}
      <div className="absolute inset-0 -z-10 bg-[#0a1b3a]"></div>

      {/* CONTENEUR CENTRAL */}
      <div className="w-[95%] max-w-[1200px] min-h-[700px] flex rounded-2xl overflow-hidden shadow-2xl">

        {/* GAUCHE FORMULAIRE */}
        <div className="w-1/2 flex items-center justify-center bg-white p-10">
          <div className="w-[420px]">
            {/* LOGO */}
            <div className="mb-4">
              <img src="/logo2.png" alt="Logo" className="h-12 object-contain" />
            </div>
            <p className="text-sm text-gray-500">Bienvenue!!!</p>
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

                {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
              </div>

              {/* OPTIONS INLINE */}
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
                  className="text-blue-500 hover:underline text-sm"
                >
                  Mot de passe oublié ?
                </button>
              </div>

              {/* BOUTON SE CONNECTER ORANGE */}
              <div className="mt-5">
                <button
                  type="submit"
                  className="w-full py-3 rounded-full bg-orange-500 text-white font-bold hover:bg-orange-600 transition"
                >
                  Se connecter
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* DROITE IMAGE */}
        <div className="w-1/2 bg-[#f5e6db] flex items-center justify-center p-4">
          <img
            src="/Hero.png"
            alt="illustration"
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* MODALE */}
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

            {resetError && (
              <p className="text-red-500 text-xs mt-2">{resetError}</p>
            )}

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
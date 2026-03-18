import React, { useState } from "react";
import ChampSaisie from "../composants/ChampSaisie";
import { FiEye, FiEyeOff } from "react-icons/fi";

const Inscription: React.FC = () => {
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    // ✅ enlève erreur dès que l'utilisateur modifie
    setError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const { nom, prenom, email, password, confirmPassword, profil } = formData;

    // ✅ Vérifie champs vides
    if (!nom || !prenom || !email || !password || !confirmPassword) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    // ✅ Vérifie mot de passe
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    const lettre = /[a-zA-Z]/.test(password);
    const chiffre = /[0-9]/.test(password);
    const special = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (
      password.length < 10 ||
      password.length > 15 ||
      !lettre ||
      !chiffre ||
      !special
    ) {
      setError("Mot de passe invalide");
      return;
    }

    // ✅ Vérifie le profil
    if (profil !== "Etudiant") {
      setError("Seuls les étudiants sont autorisés");
      return;
    }

    // ✅ SUCCESS → supprimer erreur
    setError("");
    alert("Compte étudiant créé !");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
      
      <div className="w-[95%] max-w-[1100px] min-h-[680px] rounded-2xl overflow-hidden shadow-2xl flex">
        
        {/* GAUCHE */}
        <div className="w-1/2 bg-white flex items-center justify-center transition-all duration-300 hover:shadow-inner">
          
          <div className="w-[320px]">

            {/* LOGO */}
            <div className="flex justify-center mb-4">
              <img src="/logo2.png" alt="logo" className="h-10 drop-shadow-md" />
            </div>

            <h2 className="text-xl font-bold text-center mb-1">
              Inscription
            </h2>

            <p className="text-gray-500 text-sm text-center mb-4">
              Créer votre compte
            </p>

            <form onSubmit={handleSubmit} className="space-y-2">

              <div className="hover:scale-[1.01] transition">
                <ChampSaisie
                  label="Nom"
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                />
              </div>

              <div className="hover:scale-[1.01] transition">
                <ChampSaisie
                  label="Prénom"
                  type="text"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleChange}
                />
              </div>

              <div className="hover:scale-[1.01] transition">
                <ChampSaisie
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              {/* PASSWORD */}
              <div className="relative hover:scale-[1.01] transition">
                <ChampSaisie
                  label="Mot de passe"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />

                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 cursor-pointer text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </span>
              </div>

              {/* CONFIRM PASSWORD */}
              <div className="relative hover:scale-[1.01] transition">
                <ChampSaisie
                  label="Confirmer mot de passe"
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />

                <span
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-9 cursor-pointer text-gray-400 hover:text-gray-600"
                >
                  {showConfirm ? <FiEyeOff /> : <FiEye />}
                </span>
              </div>

              {/* PROFIL */}
              <select
                name="profil"
                value={formData.profil}
                onChange={handleChange}
                className="w-full p-2 mt-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 hover:shadow-sm transition"
              >
                <option value="Etudiant">Étudiant</option>
                <option value="Personnel">Personnel</option>
                <option value="Tuteur">Tuteur</option>
              </select>

              {error && (
                <p className="text-red-500 text-xs mt-2">{error}</p>
              )}

              {/* BUTTON */}
              <button
                type="submit"
                className="w-full mt-6 py-3 rounded-full bg-orange-500 text-white font-semibold shadow-md hover:bg-orange-600 hover:scale-105 transition"
              >
                S’inscrire
              </button>
            </form>
          </div>
        </div>

        {/* DROITE */}
        <div className="w-1/2 bg-[#f5e6db] flex items-center justify-center p-4">
          <img
            src="/Hero.png"
            alt="illustration"
            className="w-full h-full object-contain"
          />
        </div>

      </div>
    </div>
  );
};

export default Inscription;
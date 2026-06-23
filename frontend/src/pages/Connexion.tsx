import { useState } from "react";
import type { ChangeEvent, FormEvent, SyntheticEvent } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { connexionEtudiant } from "../services/etudiantService";
import { authApi } from "../services/authApi";
import ChampSaisie from "../composants/ChampSaisie";

export default function Connexion(props: any) {
  const { setEtudiant } = props;
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = (location.state as { redirect?: string } | null)?.redirect ?? "/";
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetPassword, setResetPassword] = useState("");
  const [resetConfirm, setResetConfirm] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState("");
  const [resetError, setResetError] = useState("");

  const handleSubmit = async (e?: FormEvent) => {
    if (e) e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    setLoading(true);
    try {
      const user = await connexionEtudiant(formData.email, formData.password);
      if (!user) {
        setError("Aucun compte trouve. Inscrivez-vous d'abord.");
        return;
      }
      setError("");
      setEtudiant(user);
      navigate(redirectTo);
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message ?? "Connexion impossible.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    setResetError("");
    setResetSuccess("");
    if (!resetEmail.trim()) {
      setResetError("Indiquez votre adresse email.");
      return;
    }
    if (!resetPassword || resetPassword.length < 6) {
      setResetError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }
    if (resetPassword !== resetConfirm) {
      setResetError("Les mots de passe ne correspondent pas.");
      return;
    }
    setResetLoading(true);
    try {
      const res = await authApi.resetPassword(resetEmail.trim(), resetPassword);
      setResetSuccess(res.message);
      setFormData((prev) => ({ ...prev, email: resetEmail.trim() }));
      setResetPassword("");
      setResetConfirm("");
      setTimeout(() => {
        setShowModal(false);
        setResetSuccess("");
        setResetEmail("");
      }, 2500);
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message ?? "Réinitialisation impossible.";
      setResetError(msg);
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-[#0f172a] dark:bg-slate-950 px-3 py-6">
      <div className="w-full max-w-[1100px] min-h-[680px] flex flex-col lg:flex-row rounded-2xl overflow-hidden shadow-2xl border border-white/10">
        <div className="w-full lg:w-1/2 flex items-center justify-center bg-white dark:bg-slate-900 p-6 sm:p-10">
          <div className="w-full max-w-[420px]">
            <div className="mb-4 flex justify-center">
              <img
                src="/logo2.png"
                alt="Logo"
                className="h-16 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>

            <p className="text-sm text-gray-500 dark:text-slate-400">Bienvenue</p>
            <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Connexion étudiant</h1>

            <form onSubmit={handleSubmit}>
              <ChampSaisie
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                placeholder="adresse email"
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
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
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    const next = e.target.value;
                    setFormData((prev) => ({ ...prev, password: next }));
                    setError("");
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
                <label className="flex items-center gap-2 cursor-pointer select-none text-gray-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    name="remember"
                    checked={formData.remember}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
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
                {loading ? "Connexion..." : "Se connecter"}
              </button>

              <div className="flex flex-col items-center text-sm text-gray-500 dark:text-slate-400 mt-4 gap-2">
                <div className="flex items-center gap-2">
                  <span>Pas encore de compte ?</span>
                  <Link to="/inscription" className="text-orange-500 font-semibold hover:underline">
                    S’inscrire
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className="hidden lg:flex w-1/2 bg-[#f5e6db] dark:bg-slate-800 items-center justify-center">
          <img
            src="/Hero.png"
            alt="illustration"
            className="w-full h-full object-contain"
            onError={(e: SyntheticEvent<HTMLImageElement>) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[10000] bg-black/60 flex justify-center items-center p-4">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl w-full max-w-[400px] border border-gray-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold mb-1">Mot de passe oublié</h3>
            <p className="text-sm text-gray-500 dark:text-slate-400 mb-4">
              Entrez l&apos;email de votre compte et choisissez un nouveau mot de passe.
            </p>

            <ChampSaisie
              label="Email du compte"
              type="email"
              name="resetEmail"
              value={resetEmail}
              placeholder="votre email"
              onChange={(e: ChangeEvent<HTMLInputElement>) => setResetEmail(e.target.value)}
            />

            <div className="mt-3">
              <ChampSaisie
                label="Nouveau mot de passe"
                type="password"
                name="resetPassword"
                value={resetPassword}
                placeholder="6 caractères minimum"
                onChange={(e: ChangeEvent<HTMLInputElement>) => setResetPassword(e.target.value)}
              />
            </div>

            <div className="mt-3">
              <ChampSaisie
                label="Confirmer le mot de passe"
                type="password"
                name="resetConfirm"
                value={resetConfirm}
                placeholder="Répétez le mot de passe"
                onChange={(e: ChangeEvent<HTMLInputElement>) => setResetConfirm(e.target.value)}
              />
            </div>

            {resetError && <p className="text-red-500 text-xs mt-2">{resetError}</p>}
            {resetSuccess && <p className="text-green-600 text-sm mt-2 font-medium">{resetSuccess}</p>}

            <div className="flex justify-end mt-5 gap-2">
              <button
                type="button"
                onClick={() => { setShowModal(false); setResetError(""); setResetSuccess(""); }}
                className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:hover:bg-slate-800"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => void handleReset()}
                disabled={resetLoading}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 disabled:opacity-60"
              >
                {resetLoading ? "Mise à jour…" : "Réinitialiser"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

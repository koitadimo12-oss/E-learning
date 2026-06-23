import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authService } from "../services/authService";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      const u = await authService.currentUser();
      if (u?.role === "admin") navigate("/admin/dashboard");
      else if (u?.role === "formateur") navigate("/formateur/dashboard");
      else navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de connexion");
    }
  };

  return (
    <form className="mx-auto max-w-md space-y-3" onSubmit={submit}>
      <h2 className="text-2xl font-bold">Connexion</h2>
      {error && <p className="text-rose-500">{error}</p>}
      <input className="w-full rounded border p-2 text-black" placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input className="w-full rounded border p-2 text-black" placeholder="Mot de passe" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <button className="w-full rounded bg-indigo-600 px-4 py-2 text-white" type="submit">
        Se connecter
      </button>
      <div className="text-sm">
        Comptes demo: admin/admin123, formateur/trainer123, etudiant/student123
        <br />
        <code>admin@elearn.local</code> | <code>formateur@elearn.local</code> | <code>etudiant@elearn.local</code>
      </div>
    </form>
  );
}

export function RegisterPage() {
  const { registerStudent, registerTrainer } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState<"etudiant" | "formateur">("etudiant");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    try {
      if (role === "etudiant") {
        registerStudent(name, email, password);
        navigate("/dashboard");
      } else {
        registerTrainer(name, email, password);
        navigate("/login");
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Erreur");
    }
  };

  return (
    <form className="mx-auto max-w-md space-y-3" onSubmit={submit}>
      <h2 className="text-2xl font-bold">Inscription</h2>
      {message && <p>{message}</p>}
      <input className="w-full rounded border p-2 text-black" placeholder="Nom" value={name} onChange={(e) => setName(e.target.value)} required />
      <input className="w-full rounded border p-2 text-black" placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input className="w-full rounded border p-2 text-black" placeholder="Mot de passe" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <div className="flex gap-3">
        <label>
          <input type="radio" checked={role === "etudiant"} onChange={() => setRole("etudiant")} /> Etudiant
        </label>
        <label>
          <input type="radio" checked={role === "formateur"} onChange={() => setRole("formateur")} /> Formateur
        </label>
      </div>
      <button className="w-full rounded bg-emerald-600 px-4 py-2 text-white" type="submit">
        S'inscrire
      </button>
      <Link className="text-sm underline" to="/login">
        Deja un compte ? Connexion
      </Link>
    </form>
  );
}

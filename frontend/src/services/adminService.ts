
import { authApi } from "./authApi";
import { getAuthToken } from "./apiClient";

/** Connexion admin : même route que les étudiants, mais on vérifie role === "admin" */
export async function connexionAdmin(email: string, motDePasse: string): Promise<boolean> {
  try {
    const res = await authApi.login(email, motDePasse);
    if (res.user.role !== "admin") {
      authApi.logout();
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

/** Vérifie si un token JWT est présent (session admin ou étudiant) */
export function estAdminConnecte(): boolean {
  return !!getAuthToken();
}

export function deconnexionAdmin() {
  authApi.logout();
}

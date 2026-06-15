const SESSION_KEY = "knd_session_admin";
export const ADMIN_EMAIL = "admin@kaaynioudiang.com";

export function connexionAdmin(motDePasse: string): boolean {
  if (motDePasse === "AdminKND2026!") {
    sessionStorage.setItem(SESSION_KEY, "1");
    return true;
  }
  return false;
}

export function estAdminConnecte(): boolean {
  return sessionStorage.getItem(SESSION_KEY) === "1";
}

export function deconnexionAdmin() {
  sessionStorage.removeItem(SESSION_KEY);
}

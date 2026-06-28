import { apiGet, apiPatch, apiPost, setAuthToken } from "./apiClient";

export type ApiUser = {
  id: string;
  nom: string;
  email: string;
  role: string;
  modeApprentissage?: string;
  niveauEtude?: string;
  parcoursGuideChoisi?: string;
  onboardingApprentissageTermine?: boolean;
  xp?: number;
  niveau?: number;
  streak?: number;
  lastStreakDate?: string;
  badges?: string[];
};

export type AuthResponse = {
  accessToken: string; // token JWT renvoyé par le backend
  user: ApiUser;
};

export const authApi = {
  /** Inscription — crée l'utilisateur en BDD et stocke le token */
  async register(payload: {
    nom: string;
    email: string;
    motDePasse: string;
    role?: string;
    niveauEtude?: string;
  }): Promise<AuthResponse> {
    const res = await apiPost<AuthResponse>("/auth/register", payload);
    setAuthToken(res.accessToken);
    return res;
  },

  /** Connexion — vérifie email/mot de passe en BDD, reçoit un token JWT */
  async login(email: string, motDePasse: string): Promise<AuthResponse> {
    const res = await apiPost<AuthResponse>("/auth/login", { email, motDePasse });
    setAuthToken(res.accessToken);
    return res;
  },

  /** Réinitialise le mot de passe si l'email existe en base */
  async resetPassword(email: string, motDePasse: string): Promise<{ message: string }> {
    return apiPost<{ message: string }>("/auth/reset-password", { email, motDePasse });
  },

  /** Déconnexion — supprime le token du sessionStorage */
  logout() {
    setAuthToken(null);
  },

  /** Profil de l'utilisateur connecté (nécessite le token JWT) */
  async me(): Promise<ApiUser> {
    return apiGet<ApiUser>("/auth/me");
  },

  /** Met à jour le profil (xp, badges, mode apprentissage…) */
  async updateProfile(patch: Partial<ApiUser>): Promise<ApiUser> {
    return apiPatch<ApiUser>("/users/me", patch);
  },

  /** Liste tous les utilisateurs — réservé à l'admin */
  async listUsers(): Promise<ApiUser[]> {
    return apiGet<ApiUser[]>("/users");
  },
};

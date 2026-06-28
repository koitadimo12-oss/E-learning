import { authApi, type ApiUser } from "./authApi";
import { apiGet, apiPatch, getAuthToken } from "./apiClient";

/**
 * ═══════════════════════════════════════════════════════════════
 *  ÉTUDIANT — logique métier + appels API
 * ═══════════════════════════════════════════════════════════════
 *
 *  Ce service fait le pont entre les pages React et le backend :
 *
 *  Inscription.tsx       → inscriptionEtudiant()  → POST /auth/register
 *  Connexion.tsx         → connexionEtudiant()    → POST /auth/login
 *  App.tsx               → getSessionEtudiant()   → GET  /auth/me + GET /progress
 *  DetailCours.tsx       → mettreAJourProgression → PATCH /progress/:courseId
 *  DashboardAdmin        → listeEtudiants()       → GET  /users
 *
 *  Les données utilisateur sont en BDD — seul le token JWT est en sessionStorage.
 */

export type NiveauEtude = "Débutant" | "Intermédiaire" | "Avancé";
export type ModeApprentissage = "parcours-guide" | "cours-libre";
export type ParcoursGuide =
  | "developpement-web"
  | "programmation"
  | "cybersecurite"
  | "devops"
  | "data-ia"
  | "mobile"
  | "cloud"
  | "ui-ux"
  | "gestion-projet";

export interface Etudiant {
  id: string;
  nom: string;
  email: string;
  niveauEtude: NiveauEtude;
  modeApprentissage: ModeApprentissage;
  parcoursGuideChoisi?: ParcoursGuide;
  onboardingApprentissageTermine?: boolean;
  projetParcoursValide?: boolean;
  dateValidationParcours?: string;
  coursSuivis: {
    idCours: number;
    progression: number;
    chapitresCompletes?: number[];
    projetFinalValide?: boolean;
    dateValidationProjet?: string;
  }[];
  points: number;
  badges: string[];
  streak: number;
  lastStreakDate?: string;
}

type ApiProgress = {
  id: string;
  pourcentage: number;
  leconsValidees?: string[];
  estTermine?: boolean;
  termineLe?: string | null;
  cours?: { id: number };
};

function mapModeFromApi(mode?: string): ModeApprentissage {
  return mode === "guide" ? "parcours-guide" : "cours-libre";
}

function mapModeToApi(mode: ModeApprentissage): string {
  return mode === "parcours-guide" ? "guide" : "libre";
}

function normaliserNiveau(value?: string): NiveauEtude {
  if (value === "Débutant" || value === "Intermédiaire" || value === "Avancé") return value;
  return "Intermédiaire";
}

function mapProgressions(rows: ApiProgress[]) {
  return rows
    .filter((p) => p.cours?.id != null)
    .map((p) => ({
      idCours: p.cours!.id,
      progression: p.pourcentage ?? 0,
      chapitresCompletes: (p.leconsValidees ?? []).map(Number).filter((n) => !Number.isNaN(n)),
      projetFinalValide: p.estTermine === true,
      dateValidationProjet: p.termineLe ?? undefined,
    }));
}

async function fetchProgressions(): Promise<ApiProgress[]> {
  if (!getAuthToken()) return [];
  try {
    // GET /progress — backend/src/progress/progress.controller.ts
    return await apiGet<ApiProgress[]>("/progress");
  } catch {
    return [];
  }
}

export function mapApiUserToEtudiant(user: ApiUser, progressions: ApiProgress[] = []): Etudiant {
  return {
    id: user.id,
    nom: user.nom,
    email: user.email,
    niveauEtude: normaliserNiveau(user.niveauEtude),
    modeApprentissage: mapModeFromApi(user.modeApprentissage),
    parcoursGuideChoisi: user.parcoursGuideChoisi as ParcoursGuide | undefined,
    onboardingApprentissageTermine: user.onboardingApprentissageTermine === true,
    projetParcoursValide: false,
    coursSuivis: mapProgressions(progressions),
    points: user.xp ?? 0,
    badges: user.badges ?? [],
    streak: user.streak ?? 0,
    lastStreakDate: user.lastStreakDate,
  };
}

async function buildEtudiantFromSession(): Promise<Etudiant | null> {
  if (!getAuthToken()) return null;
  try {
    const user = await authApi.me();
    if (user.role === "admin") return null;

    // --- Vérification et mise à jour automatique du Streak (24h) ---
    const today = new Date().toDateString();
    let updatedStreak = user.streak ?? 0;
    let updatedLastStreak = user.lastStreakDate;

    if (user.lastStreakDate !== today) {
      const y = new Date();
      y.setDate(y.getDate() - 1);
      const hier = y.toDateString();
      // Si la dernière connexion était hier, on augmente. Sinon, on remet à 1.
      updatedStreak = user.lastStreakDate === hier ? (user.streak ?? 0) + 1 : 1;
      updatedLastStreak = today;
      // Mise à jour en arrière-plan
      authApi.updateProfile({ streak: updatedStreak, lastStreakDate: updatedLastStreak }).catch(console.error);
    }
    // ---------------------------------------------------------------

    const progressions = await fetchProgressions();
    return mapApiUserToEtudiant({ ...user, streak: updatedStreak, lastStreakDate: updatedLastStreak }, progressions);
  } catch {
    authApi.logout();
    return null;
  }
}

export async function listeEtudiants(): Promise<Etudiant[]> {
  try {
    const users = await authApi.listUsers();
    return users
      .filter((u) => u.role === "etudiant")
      .map((u) => mapApiUserToEtudiant(u));
  } catch {
    return [];
  }
}

export async function inscriptionEtudiant(
  nom: string,
  email: string,
  motDePasse: string,
  niveauEtude: NiveauEtude,
): Promise<Etudiant> {
  // Envoie les données au backend → enregistrement en table "user"
  const res = await authApi.register({
    nom,
    email,
    motDePasse,
    role: "etudiant",
    niveauEtude,
  });
  return mapApiUserToEtudiant(res.user);
}

export async function configurerApprentissageEtudiant(
  idEtudiant: string,
  modeApprentissage: ModeApprentissage,
  parcoursGuideChoisi?: ParcoursGuide,
): Promise<Etudiant | null> {
  const user = await authApi.updateProfile({
    modeApprentissage: mapModeToApi(modeApprentissage),
    parcoursGuideChoisi: modeApprentissage === "parcours-guide" ? parcoursGuideChoisi : undefined,
    onboardingApprentissageTermine: true,
  });
  if (user.id !== idEtudiant) return null;
  const progressions = await fetchProgressions();
  return mapApiUserToEtudiant(user, progressions);
}

export async function connexionEtudiant(email: string, motDePasse: string): Promise<Etudiant | null> {
  const res = await authApi.login(email, motDePasse);
  if (res.user.role === "admin") {
    authApi.logout();
    return null;
  }
  const progressions = await fetchProgressions();
  return mapApiUserToEtudiant(res.user, progressions);
}

export async function getEtudiant(_id: string): Promise<Etudiant | undefined> {
  const etudiant = await buildEtudiantFromSession();
  return etudiant ?? undefined;
}

async function patchProgress(
  idCours: number,
  patch: { pourcentage?: number; leconsValidees?: string[]; estTermine?: boolean; scoreQuiz?: number },
) {
  // PATCH /progress/:courseId — met à jour la progression en BDD
  await apiPatch(`/progress/${idCours}`, patch);
}

export async function mettreAJourProgression(_idEtudiant: string, idCours: number, progression: number) {
  if (!getAuthToken()) return;
  const progressionSecurisee = Math.max(0, Math.min(100, progression));
  await patchProgress(idCours, { pourcentage: progressionSecurisee });
}

export async function mettreAJourChapitresCompletes(
  _idEtudiant: string,
  idCours: number,
  idsChapitres: number[],
) {
  if (!getAuthToken()) return;
  const uniques = [...new Set(idsChapitres)].sort((a, b) => a - b);
  const leconsValidees = uniques.map(String);
  const pourcentage = Math.min(100, Math.round((uniques.length / Math.max(1, uniques.length)) * 100));
  await patchProgress(idCours, { leconsValidees, pourcentage });
}

async function attribuerPointsApi(xp: number, badges?: string[]) {
  const user = await authApi.me();
  const nextXp = (user.xp ?? 0) + xp;
  const nextNiveau = Math.max(1, Math.floor(nextXp / 100) + 1);
  const nextBadges = [...(user.badges ?? [])];
  if (badges) badges.forEach((b) => { if (!nextBadges.includes(b)) nextBadges.push(b); });
  if (nextNiveau >= 3 && !nextBadges.includes("🏆 Niveau 3")) nextBadges.push("🏆 Niveau 3");
  if (nextNiveau >= 5 && !nextBadges.includes("🌟 Niveau 5")) nextBadges.push("🌟 Niveau 5");
  if (nextXp >= 80 && !nextBadges.includes("Quiz master")) nextBadges.push("Quiz master");
  if (nextXp >= 200 && !nextBadges.includes("Explorateur")) nextBadges.push("Explorateur");
  await authApi.updateProfile({ xp: nextXp, niveau: nextNiveau, badges: nextBadges });
}

export async function recompenserQuizReussi(_idEtudiant: string, idCours: number) {
  if (!getAuthToken()) return;
  await patchProgress(idCours, { pourcentage: 100, estTermine: false, scoreQuiz: 100 });
  await attribuerPointsApi(25, ["Quiz master"]);
}

export async function ajouterXpMiniJeu(_idEtudiant: string, xp: number) {
  if (!getAuthToken() || xp <= 0) return;
  await attribuerPointsApi(xp);
}

export async function validerProjetFinal(_idEtudiant: string, idCours: number): Promise<boolean> {
  if (!getAuthToken()) return false;
  const rows = await fetchProgressions();
  const suivi = rows.find((p) => p.cours?.id === idCours);
  if (!suivi || (suivi.pourcentage ?? 0) < 100) return false;
  await patchProgress(idCours, { estTermine: true, pourcentage: 100 });
  await attribuerPointsApi(40);
  return true;
}

export async function validerProjetParcours(_idEtudiant: string): Promise<boolean> {
  if (!getAuthToken()) return false;
  await attribuerPointsApi(100);
  return true;
}

// (Ancienne fonction toucherStreak supprimée car désormais intégrée dans buildEtudiantFromSession)
export function setSessionEtudiant(_etudiant: Etudiant | null) {
  // Session gérée par le token JWT — pas de données en localStorage
}

export async function getSessionEtudiant(): Promise<Etudiant | null> {
  return buildEtudiantFromSession();
}

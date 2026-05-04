import { getLabelEcoleCanonique } from "./ecoleService";

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

function normaliserNiveauEtude(value: unknown): NiveauEtude {
  if (value === "Débutant" || value === "Intermédiaire" || value === "Avancé") return value;
  if (value === "Lycée") return "Débutant";
  if (value === "Université") return "Intermédiaire";
  if (value === "Autre") return "Avancé";
  return "Intermédiaire";
}

export interface Etudiant {
  id: number;
  nom: string;
  email: string;
  motDePasse: string;
  /** id canonique (liste contrôlée) */
  ecoleId: string;
  ecoleCanonique: string;
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

const ETUDIANTS_KEY = "knd_etudiants";
const SESSION_KEY = "knd_session_etudiant";

function normaliserEtudiantBrut(e: unknown): Etudiant | null {
  if (!e || typeof e !== "object") return null;
  const o = e as Record<string, unknown>;
  if (typeof o.id !== "number" || typeof o.nom !== "string" || typeof o.email !== "string" || typeof o.motDePasse !== "string")
    return null;

  const coursSuivis = Array.isArray(o.coursSuivis) ? o.coursSuivis : [];
  const modeApprentissage: ModeApprentissage =
    o.modeApprentissage === "cours-libre" ? "cours-libre" : "parcours-guide";
  const parcoursGuideChoisi =
    typeof o.parcoursGuideChoisi === "string" ? (o.parcoursGuideChoisi as ParcoursGuide) : undefined;

  return {
    id: o.id,
    nom: o.nom,
    email: o.email,
    motDePasse: o.motDePasse,
    ecoleId: typeof o.ecoleId === "string" ? o.ecoleId : "unipro",
    ecoleCanonique: typeof o.ecoleCanonique === "string" ? o.ecoleCanonique : "Unipro",
    niveauEtude: normaliserNiveauEtude(o.niveauEtude),
    modeApprentissage,
    parcoursGuideChoisi,
    onboardingApprentissageTermine: o.onboardingApprentissageTermine === true,
    projetParcoursValide: o.projetParcoursValide === true,
    dateValidationParcours: typeof o.dateValidationParcours === "string" ? o.dateValidationParcours : undefined,
    coursSuivis: coursSuivis
      .filter((item) => item && typeof item === "object")
      .map((item) => {
        const suivi = item as Record<string, unknown>;
        const idCours = typeof suivi.idCours === "number" ? suivi.idCours : 0;
        const progression = typeof suivi.progression === "number" ? suivi.progression : 0;
        const chapitresCompletes = Array.isArray(suivi.chapitresCompletes)
          ? (suivi.chapitresCompletes as number[])
          : [];
        return {
          idCours,
          progression,
          chapitresCompletes,
          projetFinalValide: suivi.projetFinalValide === true,
          dateValidationProjet:
            typeof suivi.dateValidationProjet === "string" ? suivi.dateValidationProjet : undefined,
        };
      }),
    points: typeof o.points === "number" ? o.points : 0,
    badges: Array.isArray(o.badges) ? (o.badges as string[]) : [],
    streak: typeof o.streak === "number" ? o.streak : 0,
    lastStreakDate: typeof o.lastStreakDate === "string" ? o.lastStreakDate : undefined,
  };
}

const etudiantsParDefaut: Etudiant[] = [
  {
    id: 1,
    nom: "Mamadou",
    email: "mamadou@example.com",
    motDePasse: "123456",
    ecoleId: "unipro",
    ecoleCanonique: "Unipro",
    niveauEtude: "Intermédiaire",
    modeApprentissage: "parcours-guide",
    parcoursGuideChoisi: "developpement-web",
    onboardingApprentissageTermine: true,
    projetParcoursValide: false,
    coursSuivis: [
      { idCours: 1, progression: 60, projetFinalValide: false },
      { idCours: 2, progression: 0, projetFinalValide: false },
      { idCours: 3, progression: 0, projetFinalValide: false },
      { idCours: 4, progression: 0, projetFinalValide: false },
    ],
    points: 120,
    badges: ["Premier pas"],
    streak: 3,
    lastStreakDate: new Date().toDateString(),
  },
];

function chargerEtudiants(): Etudiant[] {
  if (typeof window === "undefined") return etudiantsParDefaut;
  const brut = localStorage.getItem(ETUDIANTS_KEY);
  if (!brut) return etudiantsParDefaut;
  try {
    const donnees = JSON.parse(brut) as unknown[];
    if (!Array.isArray(donnees)) return etudiantsParDefaut;
    const out: Etudiant[] = [];
    for (const item of donnees) {
      const n = normaliserEtudiantBrut(item);
      if (n) out.push(n);
    }
    return out.length ? out : etudiantsParDefaut;
  } catch {
    return etudiantsParDefaut;
  }
}

function sauvegarderEtudiants(etudiants: Etudiant[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(ETUDIANTS_KEY, JSON.stringify(etudiants));
}

let etudiants: Etudiant[] = chargerEtudiants();

export function listeEtudiants(): Etudiant[] {
  etudiants = chargerEtudiants();
  return [...etudiants];
}

export function inscriptionEtudiant(
  nom: string,
  email: string,
  motDePasse: string,
  ecoleId: string,
  niveauEtude: NiveauEtude
): Etudiant {
  etudiants = chargerEtudiants();
  const existant = etudiants.find((e) => e.email.toLowerCase() === email.toLowerCase());
  if (existant) return existant;

  const newEtudiant: Etudiant = {
    id: Date.now(),
    nom,
    email,
    motDePasse,
    ecoleId,
    ecoleCanonique: getLabelEcoleCanonique(ecoleId),
    niveauEtude,
    modeApprentissage: "cours-libre",
    onboardingApprentissageTermine: false,
    projetParcoursValide: false,
    coursSuivis: [],
    points: 0,
    badges: [],
    streak: 0,
  };
  etudiants.push(newEtudiant);
  sauvegarderEtudiants(etudiants);
  return newEtudiant;
}

export function configurerApprentissageEtudiant(
  idEtudiant: number,
  modeApprentissage: ModeApprentissage,
  parcoursGuideChoisi?: ParcoursGuide
) {
  etudiants = chargerEtudiants();
  const etudiant = etudiants.find((e) => e.id === idEtudiant);
  if (!etudiant) return null;
  etudiant.modeApprentissage = modeApprentissage;
  etudiant.parcoursGuideChoisi = modeApprentissage === "parcours-guide" ? parcoursGuideChoisi : undefined;
  etudiant.onboardingApprentissageTermine = true;
  sauvegarderEtudiants(etudiants);
  return etudiant;
}

export function connexionEtudiant(email: string, motDePasse: string): Etudiant | null {
  etudiants = chargerEtudiants();
  return etudiants.find((e) => e.email === email && e.motDePasse === motDePasse) ?? null;
}

export function getEtudiant(id: number): Etudiant | undefined {
  etudiants = chargerEtudiants();
  return etudiants.find((e) => e.id === id);
}

export function mettreAJourProgression(idEtudiant: number, idCours: number, progression: number) {
  etudiants = chargerEtudiants();
  const etudiant = etudiants.find((e) => e.id === idEtudiant);
  if (!etudiant) return;
  const coursSuivi = etudiant.coursSuivis.find((cs) => cs.idCours === idCours);
  const progressionSecurisee = Math.max(0, Math.min(100, progression));

  if (coursSuivi) coursSuivi.progression = Math.max(coursSuivi.progression, progressionSecurisee);
  else
    etudiant.coursSuivis.push({
      idCours,
      progression: progressionSecurisee,
      chapitresCompletes: [],
      projetFinalValide: false,
    });

  sauvegarderEtudiants(etudiants);
}

export function mettreAJourChapitresCompletes(idEtudiant: number, idCours: number, idsChapitres: number[]) {
  etudiants = chargerEtudiants();
  const etudiant = etudiants.find((e) => e.id === idEtudiant);
  if (!etudiant) return;
  const uniques = [...new Set(idsChapitres)].sort((a, b) => a - b);
  let suivi = etudiant.coursSuivis.find((cs) => cs.idCours === idCours);
  if (!suivi) {
    suivi = { idCours, progression: 0, chapitresCompletes: uniques, projetFinalValide: false };
    etudiant.coursSuivis.push(suivi);
  } else {
    suivi.chapitresCompletes = uniques;
  }
  sauvegarderEtudiants(etudiants);
}

function attribuerPoints(etudiant: Etudiant, pts: number, raison: string) {
  etudiant.points = (etudiant.points ?? 0) + pts;
  if (raison === "quiz_reussi") {
    if (!etudiant.badges.includes("Quiz master") && etudiant.points >= 80) {
      etudiant.badges.push("Quiz master");
    }
  }
  if (etudiant.points >= 200 && !etudiant.badges.includes("Explorateur")) {
    etudiant.badges.push("Explorateur");
  }
}

/** Appelé quand le quiz est validé (≥ 2/3). */
export function recompenserQuizReussi(idEtudiant: number, idCours: number) {
  etudiants = chargerEtudiants();
  const etudiant = etudiants.find((e) => e.id === idEtudiant);
  if (!etudiant) return;
  attribuerPoints(etudiant, 25, "quiz_reussi");
  const coursSuivi = etudiant.coursSuivis.find((cs) => cs.idCours === idCours);
  if (coursSuivi) coursSuivi.progression = 100;
  else etudiant.coursSuivis.push({ idCours, progression: 100, chapitresCompletes: [], projetFinalValide: false });
  sauvegarderEtudiants(etudiants);
}

export function validerProjetFinal(idEtudiant: number, idCours: number) {
  etudiants = chargerEtudiants();
  const etudiant = etudiants.find((e) => e.id === idEtudiant);
  if (!etudiant) return false;

  const coursSuivi = etudiant.coursSuivis.find((cs) => cs.idCours === idCours);
  if (!coursSuivi || coursSuivi.progression < 100) return false;

  coursSuivi.projetFinalValide = true;
  coursSuivi.dateValidationProjet = new Date().toISOString();
  attribuerPoints(etudiant, 40, "projet_final");
  sauvegarderEtudiants(etudiants);
  return true;
}

export function validerProjetParcours(idEtudiant: number) {
  etudiants = chargerEtudiants();
  const etudiant = etudiants.find((e) => e.id === idEtudiant);
  if (!etudiant) return false;
  etudiant.projetParcoursValide = true;
  etudiant.dateValidationParcours = new Date().toISOString();
  attribuerPoints(etudiant, 100, "projet_parcours");
  sauvegarderEtudiants(etudiants);
  return true;
}

export function toucherStreak(idEtudiant: number) {
  etudiants = chargerEtudiants();
  const e = etudiants.find((x) => x.id === idEtudiant);
  if (!e) return;
  const today = new Date().toDateString();
  const last = e.lastStreakDate;
  if (last === today) {
    sauvegarderEtudiants(etudiants);
    return;
  }
  const y = new Date();
  y.setDate(y.getDate() - 1);
  const hier = y.toDateString();
  if (last === hier) {
    e.streak = (e.streak ?? 0) + 1;
  } else {
    e.streak = 1;
  }
  e.lastStreakDate = today;
  sauvegarderEtudiants(etudiants);
}

export function setSessionEtudiant(etudiant: Etudiant | null) {
  if (typeof window === "undefined") return;
  if (!etudiant) {
    localStorage.removeItem(SESSION_KEY);
    return;
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify(etudiant));
}

export function getSessionEtudiant(): Etudiant | null {
  if (typeof window === "undefined") return null;
  const brut = localStorage.getItem(SESSION_KEY);
  if (!brut) return null;
  try {
    const session = JSON.parse(brut) as unknown;
    const parsed = normaliserEtudiantBrut(session);
    if (!parsed) return null;
    etudiants = chargerEtudiants();
    const frais = etudiants.find((e) => e.id === parsed.id);
    return frais ?? parsed;
  } catch {
    return null;
  }
}

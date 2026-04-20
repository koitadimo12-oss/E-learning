import { getLabelEcoleCanonique, resoudreEcoleId } from "./ecoleService";

export type NiveauEtude = "Lycée" | "Université" | "Autre";

export interface Etudiant {
  id: number;
  nom: string;
  email: string;
  motDePasse: string;
  /** id canonique (liste contrôlée) */
  ecoleId: string;
  ecoleCanonique: string;
  niveauEtude: NiveauEtude;
  coursSuivis: {
    idCours: number;
    progression: number;
    chapitresCompletes?: number[];
  }[];
  points: number;
  badges: string[];
  streak: number;
  lastStreakDate?: string;
  challengesGagnes: number;
}

const ETUDIANTS_KEY = "knd_etudiants";
const SESSION_KEY = "knd_session_etudiant";

function normaliserEtudiantBrut(e: unknown): Etudiant | null {
  if (!e || typeof e !== "object") return null;
  const o = e as Record<string, unknown>;
  if (typeof o.id !== "number" || typeof o.nom !== "string" || typeof o.email !== "string" || typeof o.motDePasse !== "string")
    return null;

  const idEcole = typeof o.ecoleId === "string" ? o.ecoleId : "unipro";
  const resolu = resoudreEcoleId(idEcole) ?? idEcole;

  const coursSuivis = Array.isArray(o.coursSuivis) ? o.coursSuivis : [];

  return {
    id: o.id,
    nom: o.nom,
    email: o.email,
    motDePasse: o.motDePasse,
    ecoleId: resolu,
    ecoleCanonique: typeof o.ecoleCanonique === "string" ? o.ecoleCanonique : getLabelEcoleCanonique(resolu),
    niveauEtude: (o.niveauEtude as NiveauEtude) ?? "Université",
    coursSuivis: coursSuivis as Etudiant["coursSuivis"],
    points: typeof o.points === "number" ? o.points : 0,
    badges: Array.isArray(o.badges) ? (o.badges as string[]) : [],
    streak: typeof o.streak === "number" ? o.streak : 0,
    lastStreakDate: typeof o.lastStreakDate === "string" ? o.lastStreakDate : undefined,
    challengesGagnes: typeof o.challengesGagnes === "number" ? o.challengesGagnes : 0,
  };
}

const etudiantsParDefaut: Etudiant[] = [
  {
    id: 1,
    nom: "Mamadou",
    email: "mamadou@example.com",
    motDePasse: "123456",
    ecoleId: "unipro",
    ecoleCanonique: "UNIPRO",
    niveauEtude: "Université",
    coursSuivis: [
      { idCours: 1, progression: 60 },
      { idCours: 2, progression: 0 },
      { idCours: 3, progression: 0 },
      { idCours: 4, progression: 0 },
    ],
    points: 120,
    badges: ["Premier pas"],
    streak: 3,
    lastStreakDate: new Date().toDateString(),
    challengesGagnes: 0,
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

  const idCanon = resoudreEcoleId(ecoleId) ?? ecoleId;

  const newEtudiant: Etudiant = {
    id: Date.now(),
    nom,
    email,
    motDePasse,
    ecoleId: idCanon,
    ecoleCanonique: getLabelEcoleCanonique(idCanon),
    niveauEtude,
    coursSuivis: [],
    points: 0,
    badges: [],
    streak: 0,
    challengesGagnes: 0,
  };
  etudiants.push(newEtudiant);
  sauvegarderEtudiants(etudiants);
  return newEtudiant;
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
  else etudiant.coursSuivis.push({ idCours, progression: progressionSecurisee, chapitresCompletes: [] });

  sauvegarderEtudiants(etudiants);
}

export function mettreAJourChapitresCompletes(idEtudiant: number, idCours: number, idsChapitres: number[]) {
  etudiants = chargerEtudiants();
  const etudiant = etudiants.find((e) => e.id === idEtudiant);
  if (!etudiant) return;
  const uniques = [...new Set(idsChapitres)].sort((a, b) => a - b);
  let suivi = etudiant.coursSuivis.find((cs) => cs.idCours === idCours);
  if (!suivi) {
    suivi = { idCours, progression: 0, chapitresCompletes: uniques };
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
  else etudiant.coursSuivis.push({ idCours, progression: 100, chapitresCompletes: [] });
  sauvegarderEtudiants(etudiants);
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

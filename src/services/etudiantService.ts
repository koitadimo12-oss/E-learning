export interface Etudiant {
  id: number;
  nom: string;
  email: string;
  motDePasse: string;
  coursSuivis: {
    idCours: number;
    progression: number;
    /** IDs des chapitres marqués comme lus (débloque le quiz quand assez de chapitres sont faits). */
    chapitresCompletes?: number[];
  }[];
}

const ETUDIANTS_KEY = "knd_etudiants";
const SESSION_KEY = "knd_session_etudiant";

const etudiantsParDefaut: Etudiant[] = [
  {
    id: 1,
    nom: "Mamadou",
    email: "mamadou@example.com",
    motDePasse: "123456",
    coursSuivis: [
      { idCours: 1, progression: 60 },
      { idCours: 2, progression: 0 },
      { idCours: 3, progression: 0 },
      { idCours: 4, progression: 0 },
    ],
  },
];

function chargerEtudiants(): Etudiant[] {
  if (typeof window === "undefined") return etudiantsParDefaut;
  const brut = localStorage.getItem(ETUDIANTS_KEY);
  if (!brut) return etudiantsParDefaut;
  try {
    const donnees = JSON.parse(brut) as Etudiant[];
    return Array.isArray(donnees) ? donnees : etudiantsParDefaut;
  } catch {
    return etudiantsParDefaut;
  }
}

function sauvegarderEtudiants(etudiants: Etudiant[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(ETUDIANTS_KEY, JSON.stringify(etudiants));
}

let etudiants: Etudiant[] = chargerEtudiants();

export function inscriptionEtudiant(nom: string, email: string, motDePasse: string): Etudiant {
  const existant = etudiants.find((e) => e.email.toLowerCase() === email.toLowerCase());
  if (existant) return existant;

  const newEtudiant: Etudiant = {
    id: Date.now(),
    nom,
    email,
    motDePasse,
    coursSuivis: [],
  };
  etudiants.push(newEtudiant);
  sauvegarderEtudiants(etudiants);
  return newEtudiant;
}

export function connexionEtudiant(email: string, motDePasse: string): Etudiant | null {
  return etudiants.find(e => e.email === email && e.motDePasse === motDePasse) || null;
}

export function getEtudiant(id: number): Etudiant | undefined {
  return etudiants.find(e => e.id === id);
}

export function mettreAJourProgression(idEtudiant: number, idCours: number, progression: number) {
  const etudiant = etudiants.find(e => e.id === idEtudiant);
  if (!etudiant) return;
  const coursSuivi = etudiant.coursSuivis.find(cs => cs.idCours === idCours);
  const progressionSecurisee = Math.max(0, Math.min(100, progression));

  if (coursSuivi) coursSuivi.progression = Math.max(coursSuivi.progression, progressionSecurisee);
  else etudiant.coursSuivis.push({ idCours, progression: progressionSecurisee, chapitresCompletes: [] });

  sauvegarderEtudiants(etudiants);
}

/** Met à jour la liste des chapitres lus pour un cours (IDs de chapitres). */
export function mettreAJourChapitresCompletes(idEtudiant: number, idCours: number, idsChapitres: number[]) {
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
    const session = JSON.parse(brut) as Etudiant;
    const frais = etudiants.find((e) => e.id === session.id);
    return frais ?? session;
  } catch {
    return null;
  }
}

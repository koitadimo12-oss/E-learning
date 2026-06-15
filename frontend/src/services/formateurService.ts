export type StatutFormateur = "en_attente" | "accepte" | "refuse";
export type RoleFormateur = "candidat_formateur" | "formateur";

export interface Formateur {
  id: number;
  nom: string;
  email: string;
  motDePasse: string;
  specialite: string;
  experience: string;
  portfolio: string;
  linkedin: string;
  github: string;
  cvFileName?: string;
  preuve: string;
  statut: StatutFormateur;
  role: RoleFormateur;
  coursPublies: number;
  etudiantsInscrits: number;
  noteMoyenne: number;
  tauxReussiteQuiz: number;
  likesCours: number;
}

const KEY = "knd_formateurs";
const SESSION_KEY = "knd_session_formateur";

function charger(): Formateur[] {
  if (typeof window === "undefined") return [];
  try {
    const b = localStorage.getItem(KEY);
    if (!b) return [];
    const d = JSON.parse(b) as Array<Partial<Formateur>>;
    if (!Array.isArray(d)) return [];
    return d.map((raw) => ({
      id: Number(raw.id ?? Date.now()),
      nom: raw.nom ?? "",
      email: raw.email ?? "",
      motDePasse: raw.motDePasse ?? "",
      specialite: raw.specialite ?? "",
      experience: raw.experience ?? "",
      portfolio: raw.portfolio ?? "",
      linkedin: raw.linkedin ?? "",
      github: raw.github ?? "",
      cvFileName: raw.cvFileName,
      preuve: raw.preuve ?? "",
      statut: (raw.statut as StatutFormateur) ?? "en_attente",
      role: (raw.role as RoleFormateur) ?? ((raw.statut as StatutFormateur) === "accepte" ? "formateur" : "candidat_formateur"),
      coursPublies: Number(raw.coursPublies ?? 0),
      etudiantsInscrits: Number(raw.etudiantsInscrits ?? 0),
      noteMoyenne: Number(raw.noteMoyenne ?? 0),
      tauxReussiteQuiz: Number(raw.tauxReussiteQuiz ?? 0),
      likesCours: Number(raw.likesCours ?? 0),
    }));
  } catch {
    return [];
  }
}

function sauver(list: Formateur[]) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

let cache = charger();

export function inscriptionFormateur(
  data: Omit<Formateur, "id" | "statut" | "role" | "coursPublies" | "etudiantsInscrits" | "noteMoyenne" | "tauxReussiteQuiz" | "likesCours">
): Formateur {
  const exist = cache.find((f) => f.email.toLowerCase() === data.email.toLowerCase());
  if (exist) return exist;

  const f: Formateur = {
    ...data,
    id: Date.now(),
    statut: "en_attente",
    role: "candidat_formateur",
    coursPublies: 0,
    etudiantsInscrits: 0,
    noteMoyenne: 0,
    tauxReussiteQuiz: 0,
    likesCours: 0,
  };
  cache.push(f);
  sauver(cache);
  return f;
}

export function connexionFormateur(email: string, motDePasse: string): Formateur | null {
  cache = charger();
  return cache.find((f) => f.email === email && f.motDePasse === motDePasse) ?? null;
}

export function getFormateur(id: number): Formateur | undefined {
  cache = charger();
  return cache.find((f) => f.id === id);
}

export function listeFormateurs(): Formateur[] {
  cache = charger();
  return [...cache];
}

export function setStatutFormateur(id: number, statut: StatutFormateur) {
  cache = charger();
  const f = cache.find((x) => x.id === id);
  if (f) {
    f.statut = statut;
    f.role = statut === "accepte" ? "formateur" : "candidat_formateur";
    sauver(cache);
  }
}

export function estFormateurValide(f: Formateur): boolean {
  return f.role === "formateur" && f.statut === "accepte";
}

export function scoreClassementFormateur(f: Formateur): number {
  if (f.statut !== "accepte") return 0;
  return (
    f.coursPublies * 20 +
    f.etudiantsInscrits * 1 +
    f.noteMoyenne * 10 +
    f.tauxReussiteQuiz * 30 +
    f.likesCours * 1
  );
}

export function setSessionFormateur(f: Formateur | null) {
  if (!f) {
    localStorage.removeItem(SESSION_KEY);
    return;
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify(f));
}

export function getSessionFormateur(): Formateur | null {
  try {
    const b = localStorage.getItem(SESSION_KEY);
    if (!b) return null;
    const s = JSON.parse(b) as Formateur;
    const frais = getFormateur(s.id);
    return frais ?? s;
  } catch {
    return null;
  }
}

/** Graine de démo pour l'admin */
export function graineFormateursDemo() {
  if (charger().length > 0) return;
  const demo: Formateur[] = [
    {
      id: 9001,
      nom: "M. Cheikh Fall",
      email: "formateur@demo.com",
      motDePasse: "Demo123!@#",
      specialite: "Développement web",
      experience: "8 ans",
      portfolio: "https://example.com",
      linkedin: "https://linkedin.com/in/cheikh-fall",
      github: "https://github.com/cheikh-fall",
      cvFileName: "cv-cheikh-fall.pdf",
      preuve: "Lien CV",
      statut: "accepte",
      role: "formateur",
      coursPublies: 4,
      etudiantsInscrits: 120,
      noteMoyenne: 4.6,
      tauxReussiteQuiz: 0.72,
      likesCours: 340,
    },
  ];
  cache = demo;
  sauver(cache);
}

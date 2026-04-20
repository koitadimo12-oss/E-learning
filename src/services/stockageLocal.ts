const PREFIX = "knd_";

export function getFavorisCoursIds(): number[] {
  try {
    const b = localStorage.getItem(`${PREFIX}favoris_cours`);
    if (!b) return [];
    const arr = JSON.parse(b) as unknown;
    return Array.isArray(arr) ? arr.map(Number).filter((n) => !Number.isNaN(n)) : [];
  } catch {
    return [];
  }
}

export function setFavorisCoursIds(ids: number[]) {
  localStorage.setItem(`${PREFIX}favoris_cours`, JSON.stringify([...new Set(ids)]));
}

export function toggleFavoriCours(idCours: number): boolean {
  const cur = getFavorisCoursIds();
  const has = cur.includes(idCours);
  const next = has ? cur.filter((x) => x !== idCours) : [...cur, idCours];
  setFavorisCoursIds(next);
  return !has;
}

export function estFavori(idCours: number): boolean {
  return getFavorisCoursIds().includes(idCours);
}

export function getNotesCours(idCours: number): string {
  try {
    return localStorage.getItem(`${PREFIX}notes_cours_${idCours}`) ?? "";
  } catch {
    return "";
  }
}

export function setNotesCours(idCours: number, texte: string) {
  localStorage.setItem(`${PREFIX}notes_cours_${idCours}`, texte);
}

export function getDernierCoursId(): number | null {
  try {
    const v = localStorage.getItem(`${PREFIX}dernier_cours_id`);
    if (!v) return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
}

export function setDernierCoursId(idCours: number) {
  localStorage.setItem(`${PREFIX}dernier_cours_id`, String(idCours));
}

export function getObjectifDuJour(): string {
  const defauts = [
    "Regarder une leçon et noter 3 idées clés",
    "Valider un chapitre et faire 5 questions du quiz",
    "Partager un projet avec votre école sur la communauté",
  ];
  const key = `${PREFIX}objectif_jour_${new Date().toDateString()}`;
  try {
    const ex = localStorage.getItem(key);
    if (ex) return ex;
    const pick = defauts[Math.floor(Math.random() * defauts.length)];
    localStorage.setItem(key, pick);
    return pick;
  } catch {
    return defauts[0];
  }
}

export type NotificationItem = { id: string; titre: string; message: string; lu: boolean; date: string };

export function getNotificationsDemo(): NotificationItem[] {
  const key = `${PREFIX}notifications`;
  try {
    const b = localStorage.getItem(key);
    if (b) return JSON.parse(b) as NotificationItem[];
  } catch {
    /* ignore */
  }
  const base: NotificationItem[] = [
    {
      id: "n1",
      titre: "Fin de parcours",
      message: "Terminez un cours aujourd'hui pour gagner des points bonus.",
      lu: false,
      date: new Date().toISOString(),
    },
    {
      id: "n2",
      titre: "Challenge inter-écoles",
      message: "La phase de soumission se termine bientôt — consultez l'espace Challenge.",
      lu: false,
      date: new Date().toISOString(),
    },
  ];
  localStorage.setItem(key, JSON.stringify(base));
  return base;
}

export function getThemePref(): "light" | "dark" {
  try {
    const t = localStorage.getItem(`${PREFIX}theme`);
    return t === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
}

export function setThemePref(t: "light" | "dark") {
  localStorage.setItem(`${PREFIX}theme`, t);
}

type TypeLike = "projet" | "cours" | "formateur";

function keyLike(type: TypeLike, targetId: string | number) {
  return `${PREFIX}likes_${type}_${String(targetId)}`;
}

function keyVoteEtudiant(idEtudiant: number, type: TypeLike, targetId: string | number) {
  return `${PREFIX}vote_${idEtudiant}_${type}_${String(targetId)}`;
}

export function getCompteurLikes(type: TypeLike, targetId: string | number): number {
  try {
    const brut = localStorage.getItem(keyLike(type, targetId));
    if (!brut) return 0;
    const n = Number(brut);
    return Number.isFinite(n) ? n : 0;
  } catch {
    return 0;
  }
}

export function aDejaLike(idEtudiant: number, type: TypeLike, targetId: string | number): boolean {
  try {
    return localStorage.getItem(keyVoteEtudiant(idEtudiant, type, targetId)) === "1";
  } catch {
    return false;
  }
}

export function likerUneFois(idEtudiant: number, type: TypeLike, targetId: string | number): boolean {
  if (aDejaLike(idEtudiant, type, targetId)) return false;
  try {
    const total = getCompteurLikes(type, targetId);
    localStorage.setItem(keyLike(type, targetId), String(total + 1));
    localStorage.setItem(keyVoteEtudiant(idEtudiant, type, targetId), "1");
    return true;
  } catch {
    return false;
  }
}

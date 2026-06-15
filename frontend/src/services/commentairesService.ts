export type CommentaireCours = {
  id: string;
  idCours: number;
  auteur: string;
  texte: string;
  date: string;
};

const KEY = "knd_commentaires_cours";

function lire(): CommentaireCours[] {
  try {
    const b = localStorage.getItem(KEY);
    if (!b) return [];
    const d = JSON.parse(b) as CommentaireCours[];
    return Array.isArray(d) ? d : [];
  } catch {
    return [];
  }
}

function ecrire(list: CommentaireCours[]) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function listeTousCommentairesCours(): CommentaireCours[] {
  return lire().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getCommentairesCours(idCours: number): CommentaireCours[] {
  return lire()
    .filter((c) => c.idCours === idCours)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function ajouterCommentaireCours(
  idCours: number,
  auteur: string,
  texte: string
): CommentaireCours {
  const c: CommentaireCours = {
    id: `${Date.now()}`,
    idCours,
    auteur,
    texte: texte.trim(),
    date: new Date().toISOString(),
  };
  const list = lire();
  list.push(c);
  ecrire(list);
  return c;
}

export function supprimerCommentaireCours(idCommentaire: string): void {
  const next = lire().filter((c) => c.id !== idCommentaire);
  ecrire(next);
}

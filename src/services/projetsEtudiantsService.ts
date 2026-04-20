/** Catalogue projets étudiants local. */

import { getCompteurLikes, likerUneFois } from "./stockageLocal";

export type ProjetEtudiant = {
  id: string;
  titre: string;
  ecoleId: string;
  auteur: string;
  stack: string;
  youtubeEmbed: string;
  likes: number;
};

export const PROJETS_ETUDIANTS: ProjetEtudiant[] = [
  {
    id: "p1",
    titre: "API REST Python + Flask — gestion de notes",
    ecoleId: "unipro",
    auteur: "Fatou N.",
    stack: "Python",
    youtubeEmbed: "https://www.youtube.com/embed/GMppyAPbLYk",
    likes: 128,
  },
  {
    id: "p2",
    titre: "Dashboard React — suivi carbone",
    ecoleId: "ensup",
    auteur: "Moussa T.",
    stack: "JavaScript",
    youtubeEmbed: "https://www.youtube.com/embed/bMknfKXIFA8",
    likes: 96,
  },
  {
    id: "p3",
    titre: "Mini jeu JS — Canvas 2D",
    ecoleId: "ucad",
    auteur: "Awa S.",
    stack: "JavaScript",
    youtubeEmbed: "https://www.youtube.com/embed/W6NZfCO5SIk",
    likes: 210,
  },
];

export function getLikesProjet(id: string): number {
  const base = PROJETS_ETUDIANTS.find((p) => p.id === id)?.likes ?? 0;
  return base + getCompteurLikes("projet", id);
}

export function incrementerLikeProjet(id: string, idEtudiant: number): number {
  likerUneFois(idEtudiant, "projet", id);
  return getLikesProjet(id);
}

export function topProjets(): ProjetEtudiant[] {
  return [...PROJETS_ETUDIANTS].sort((a, b) => getLikesProjet(b.id) - getLikesProjet(a.id));
}

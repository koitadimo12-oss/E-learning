/** Profils publics démo — filtrage par école. */

export type ProfilPublic = {
  id: string;
  nom: string;
  ecoleId: string;
  niveau: string;
  bio: string;
};

export const PROFILS_DEMO: ProfilPublic[] = [
  { id: "u1", nom: "Aminata K.", ecoleId: "unipro", niveau: "Université", bio: "Full-stack & data viz." },
  { id: "u2", nom: "Ibrahima D.", ecoleId: "ensup", niveau: "Université", bio: "Cybersécurité, CTF." },
  { id: "u3", nom: "Fatou N.", ecoleId: "unipro", niveau: "Lycée", bio: "Python, maths appliquées." },
  { id: "u4", nom: "Moussa T.", ecoleId: "ensup", niveau: "Autre", bio: "UI/UX, Figma." },
  { id: "u5", nom: "Awa S.", ecoleId: "ucad", niveau: "Université", bio: "React, accessibilité." },
];

export function profilsParEcole(ecoleId: string): ProfilPublic[] {
  return PROFILS_DEMO.filter((p) => p.ecoleId === ecoleId);
}

import { getCoursCache } from "./coursApi";
import type { ParcoursGuide } from "./etudiantService";

const parcoursMeta: Record<ParcoursGuide, { titre: string; motsCles: string[] }> = {
  "developpement-web": { titre: "Parcours Developpement Web", motsCles: ["Web", "Backend", "Design"] },
  programmation: { titre: "Parcours Programmation", motsCles: ["Programmation", "Outils"] },
  cybersecurite: { titre: "Parcours Cybersecurite", motsCles: ["Securite", "Science"] },
  devops: { titre: "Parcours DevOps", motsCles: ["DevOps", "Cloud", "Backend"] },
  "data-ia": { titre: "Parcours Data & IA", motsCles: ["Data", "Sciences"] },
  mobile: { titre: "Parcours Mobile", motsCles: ["Mobile", "Design", "Programmation"] },
  cloud: { titre: "Parcours Cloud", motsCles: ["Cloud", "Backend", "Data"] },
  "ui-ux": { titre: "Parcours UI/UX", motsCles: ["Design", "Communication"] },
  "gestion-projet": { titre: "Parcours Gestion de projet", motsCles: ["Leadership", "Organisation", "Communication"] },
};

export function getParcoursMeta(id: ParcoursGuide) {
  return parcoursMeta[id];
}

export function getParcoursCoursIds(id?: ParcoursGuide) {
  if (!id) return [];
  const config = parcoursMeta[id];
  const listeCours = getCoursCache();
  const prioritaire = listeCours
    .filter((c) => config.motsCles.some((k) => (c.badge ?? "").toLowerCase().includes(k.toLowerCase())))
    .map((c) => c.id);
  const fallback = listeCours.map((c) => c.id);
  return [...new Set([...prioritaire, ...fallback])].slice(0, 8);
}

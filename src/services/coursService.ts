export interface Cours {
  id: number;
  titre: string;
  description: string;
  categorie: string;
  image: string;
  progression: number;
  contenu: string;
  duree: string;
  instructeur: string;
}

export const listeCours: Cours[] = [
  {
    id: 1,
    titre: "Introduction à React",
    description: "Apprenez les bases de React avec des exemples pratiques.",
    categorie: "Développement Web",
    image: "https://placehold.co/400x200?text=React",
    progression: 60,
    contenu: "Ce cours couvre les composants, les hooks, et le state management avec React.",
    duree: "8h",
    instructeur: "Saliou Gueye",
  },
  {
    id: 2,
    titre: "TypeScript pour débutants",
    description: "Maîtrisez TypeScript et améliorez votre code JavaScript.",
    categorie: "Programmation",
    image: "https://placehold.co/400x200?text=TypeScript",
    progression: 30,
    contenu: "Types, interfaces, génériques et intégration avec React.",
    duree: "6h",
    instructeur: "Saliou Gueye",
  },
  {
    id: 3,
    titre: "Tailwind CSS",
    description: "Créez des interfaces modernes rapidement avec Tailwind.",
    categorie: "Design",
    image: "https://placehold.co/400x200?text=Tailwind",
    progression: 80,
    contenu: "Utility classes, responsive design, dark mode et personnalisation.",
    duree: "4h",
    instructeur: "Saliou Gueye",
  },
  {
    id: 4,
    titre: "Node.js & Express",
    description: "Construisez des APIs REST avec Node.js et Express.",
    categorie: "Backend",
    image: "https://placehold.co/400x200?text=NodeJS",
    progression: 10,
    contenu: "Routing, middleware, authentification et connexion à une base de données.",
    duree: "10h",
    instructeur: "Saliou Gueye",
  },
];

export function getCours(id: number): Cours | undefined {
  return listeCours.find((c) => c.id === id);
}

export function getCategories(): string[] {
  return ["Toutes", ...Array.from(new Set(listeCours.map((c) => c.categorie)))];
}

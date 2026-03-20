export interface Quiz {
  question: string;
  options: string[];
  reponse: string;
}

export interface Chapitre {
  id: number;
  titre: string;
  contenu: string[];
  videoYoutube: string;
  duree: string;
}

export interface Cours {
  id: number;
  titre: string;
  description: string;
  image: string;
  instructeur: string;
  categorie: "Developpement Web" | "Programmation" | "Data" | "Science" | "Soft Skills";
  niveau: "Debutant" | "Intermediaire";
  duree: string;
  progression?: number;
  // Petit badge affiché sur les cartes (ex: "Programmation", "Sciences", "Communication")
  badge?: string;
  // Affiche un label "Nouveau" sur certaines cartes
  nouveau?: boolean;
  chapitres: Chapitre[];
  quiz: Quiz[];
}

const quizStandard: Quiz[] = [
  {
    question: "A quoi sert le quiz final ?",
    options: ["Mesurer les acquis", "Remplacer le cours", "Ignorer la pratique", "Vérifier la connexion"],
    reponse: "Mesurer les acquis",
  },
  {
    question: "Quel rythme est recommandé ?",
    options: ["Progressif et constant", "Aléatoire", "Une seule session longue", "Aucun planning"],
    reponse: "Progressif et constant",
  },
  {
    question: "Que faire après une erreur ?",
    options: ["Analyser et corriger", "Supprimer le projet", "Changer de langage", "Arrêter"],
    reponse: "Analyser et corriger",
  },
  {
    question: "Comment consolider l'apprentissage ?",
    options: ["Faire un mini-projet", "Lire uniquement", "Copier-coller", "Sauter les révisions"],
    reponse: "Faire un mini-projet",
  },
];

const quizJavascriptDebutants: Quiz[] = [
  {
    question: "Quelle instruction affiche un message dans la console ?",
    options: ["console.log()", "print()", "pint()", "alert()"],
    reponse: "console.log()",
  },
  {
    question:
      "Quel type de boucle permet de répéter un bloc un nombre d'itérations fixé à l'avance ?",
    options: ["for", "while", "do...while", "Tu es les suppresses"],
    reponse: "for",
  },
  ...quizStandard.slice(0, 4),
  {
    question: "A quoi sert `return` dans une fonction ?",
    options: ["Retourner une valeur", "Tout effacer", "Changer le type", "Aucun rôle"],
    reponse: "Retourner une valeur",
  },
];

export const listeCours: Cours[] = [
  {
    id: 1,
    titre: "React JS : Développez des applis modernes",
    description:
      "Créez des applications web dynamiques en utilisant React JS et les hooks.",
    image: "/cours/react.png",
    instructeur: "M. Cheikh Fall",
    categorie: "Developpement Web",
    badge: "Programmation",
    niveau: "Debutant",
    duree: "6h 20",
    chapitres: [
      {
        id: 1,
        titre: "Démarrer avec React",
        duree: "1h 10",
        videoYoutube: "https://www.youtube.com/embed/bMknfKXIFA8",
        contenu: ["JSX et composants", "Props et structure", "Organisation du projet"],
      },
      {
        id: 2,
        titre: "Etat & interactions",
        duree: "1h 40",
        videoYoutube: "https://www.youtube.com/embed/O6P86uwfdR0",
        contenu: ["useState", "Events", "Formulaires"],
      },
      {
        id: 3,
        titre: "Routing",
        duree: "1h 30",
        videoYoutube: "https://www.youtube.com/embed/Ul3y1LXxzdU",
        contenu: ["Routes", "Navigation", "Layouts"],
      },
    ],
    quiz: quizStandard,
  },
  {
    id: 2,
    titre: "Mathématiques pour Lycéens",
    description:
      "Maîtrisez les concepts des maths du lycée : algèbre, géométrie, trigonométrie et prob...",
    image: "/cours/math.png",
    instructeur: "Mme Ndour",
    categorie: "Science",
    badge: "Sciences",
    niveau: "Debutant",
    duree: "5h 00",
    chapitres: [
      {
        id: 1,
        titre: "Algèbre de base",
        duree: "1h 30",
        videoYoutube: "https://www.youtube.com/embed/OmJ-4B-mS-Y",
        contenu: ["Équations", "Fractions", "Systèmes simples"],
      },
      {
        id: 2,
        titre: "Fonctions et graphiques",
        duree: "1h 20",
        videoYoutube: "https://www.youtube.com/embed/26QPDBe-NB8",
        contenu: ["Lecture de courbe", "Applications", "Graphiques"],
      },
    ],
    quiz: quizStandard,
  },
  {
    id: 3,
    titre: "JavaScript pour Débutants",
    description:
      "Apprenez JavaScript depuis zéro : variables, fonctions, boucles et manipulation du DOM.",
    image: "/cours/python.png",
    instructeur: "M. Cheikh Fall",
    categorie: "Programmation",
    badge: "Programmation",
    niveau: "Debutant",
    duree: "4h 15",
    nouveau: true,
    chapitres: [
      {
        id: 1,
        titre: "Introduction à JavaScript",
        duree: "2h 10",
        videoYoutube: "https://www.youtube.com/embed/JPQ9V2x8b3o",
        contenu: [
          "Introduction à JavaScript et son rôle dans le web moderne.",
          "Variables et types de données : string, number, boolean, array, object.",
          "Structures conditionnelles : if, else, switch.",
          "Boucles : for, while, do...while.",
          "Fonctions : déclarations, paramètres, valeurs de retour.",
          "Manipulation du DOM : sélectionner et modifier les éléments.",
          "Événements : click, input, submit, etc.",
          "Exercices pratiques pour consolider les connaissances.",
        ],
      },
    ],
    quiz: quizJavascriptDebutants,
  },
  {
    id: 4,
    titre: "Sciences de la Communication",
    description:
      "Maîtrisez les bases pour communiquer clairement : structurer, convaincre et s'exprimer.",
    image: "/cours/science.png",
    instructeur: "Mme Ndour",
    categorie: "Soft Skills",
    badge: "Communication",
    niveau: "Intermediaire",
    duree: "3h 50",
    chapitres: [
      {
        id: 1,
        titre: "Structurer son message",
        duree: "1h 00",
        videoYoutube: "https://www.youtube.com/embed/HAnw168huqA",
        contenu: ["Objectif", "Argumentaire", "Conclusion claire"],
      },
      {
        id: 2,
        titre: "Communication orale",
        duree: "1h 10",
        videoYoutube: "https://www.youtube.com/embed/UfA_jAK6D9g",
        contenu: ["Voix", "Posture", "Gestion du stress"],
      },
    ],
    quiz: quizStandard,
  },
];

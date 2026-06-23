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

type CategorieCours = Cours["categorie"];
type NiveauCours = Cours["niveau"];

function creerQuizParCours(theme: string, notion1: string, notion2: string): Quiz[] {
  return [
    {
      question: `Dans le cours ${theme}, quel est l'objectif principal ?`,
      options: [
        `Comprendre ${theme} étape par étape`,
        "Apprendre uniquement par coeur",
        "Ignorer la pratique",
        "Supprimer les exercices",
      ],
      reponse: `Comprendre ${theme} étape par étape`,
    },
    {
      question: `Quelle notion est vue dans ce cours ${theme} ?`,
      options: [notion1, "Cuisine", "Sport", "Musique"],
      reponse: notion1,
    },
    {
      question: `Quelle autre notion importante du cours ${theme} ?`,
      options: [notion2, "Aucune", "Décoration", "Marketing papier"],
      reponse: notion2,
    },
    {
      question: `Pour progresser dans ${theme}, que faut-il faire ?`,
      options: ["Pratiquer avec des mini-exercices", "Tout éviter", "Ne jamais tester", "Sauter les chapitres"],
      reponse: "Pratiquer avec des mini-exercices",
    },
    {
      question: `Quand corriger ses erreurs dans ${theme} ?`,
      options: ["Dès qu'on les trouve", "Jamais", "Après 1 an", "Seulement en examen"],
      reponse: "Dès qu'on les trouve",
    },
    {
      question: `Le quiz de ${theme} sert surtout a :`,
      options: ["Verifier les acquis", "Remplacer le cours", "Supprimer le suivi", "Noter la vitesse internet"],
      reponse: "Verifier les acquis",
    },
  ];
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
    options: ["Analyser et corriger", "Supprimer l'exercice", "Changer de langage", "Arrêter"],
    reponse: "Analyser et corriger",
  },
  {
    question: "Comment consolider l'apprentissage ?",
    options: ["Faire un mini-exercice", "Lire uniquement", "Copier-coller", "Sauter les révisions"],
    reponse: "Faire un mini-exercice",
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
    options: ["for", "while", "do...while", "switch"],
    reponse: "for",
  },
  ...quizStandard.slice(0, 4),
  {
    question: "A quoi sert `return` dans une fonction ?",
    options: ["Retourner une valeur", "Tout effacer", "Changer le type", "Aucun rôle"],
    reponse: "Retourner une valeur",
  },
];

export const coursBase: Cours[] = [
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
        contenu: ["JSX et composants", "Props et structure", "Organisation du code"],
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
      {
        id: 4,
        titre: "Projet React complet",
        duree: "1h 20",
        videoYoutube: "https://www.youtube.com/embed/a_7Z7C_JCyo",
        contenu: ["Architecture", "Composants reutilisables", "Mise en production"],
      },
    ],
    quiz: creerQuizParCours("React JS", "Composants", "useState"),
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
      {
        id: 3,
        titre: "Exercices corriges",
        duree: "1h 10",
        videoYoutube: "https://www.youtube.com/embed/6dTyOl1fmDo",
        contenu: ["Methodes rapides", "Corrections pas a pas", "Astuces d'examen"],
      },
    ],
    quiz: creerQuizParCours("Mathematiques", "Algebre", "Fonctions"),
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
        videoYoutube: "https://www.youtube.com/embed/W6NZfCO5SIk",
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
      {
        id: 2,
        titre: "Mini projet JavaScript",
        duree: "1h 15",
        videoYoutube: "https://www.youtube.com/embed/jS4aFq5-91M",
        contenu: ["Manipulation DOM", "Validation formulaire", "Publication du projet"],
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
        videoYoutube: "https://www.youtube.com/embed/Ks-_Mh1QhMc",
        contenu: ["Voix", "Posture", "Gestion du stress"],
      },
    ],
    quiz: creerQuizParCours("Communication", "Message clair", "Communication orale"),
  },
  {
    id: 5,
    titre: "HTML & CSS : Créer des pages web",
    description: "Apprenez a structurer une page en HTML et la styliser avec CSS.",
    image: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=600&auto=format&fit=crop",
    instructeur: "Mme Diallo",
    categorie: "Developpement Web",
    badge: "Web",
    niveau: "Debutant",
    duree: "4h 30",
    chapitres: [
      {
        id: 1,
        titre: "Balises HTML de base",
        duree: "1h 30",
        videoYoutube: "https://www.youtube.com/embed/pQN-pnXPaVg",
        contenu: ["Titres", "Paragraphes", "Liens et images"],
      },
      {
        id: 2,
        titre: "Mise en forme CSS",
        duree: "1h 40",
        videoYoutube: "https://www.youtube.com/embed/1PnVor36_40",
        contenu: ["Couleurs", "Marges", "Flexbox"],
      },
    ],
    quiz: creerQuizParCours("HTML et CSS", "Balises HTML", "Mise en page CSS"),
  },
  {
    id: 6,
    titre: "Git & GitHub pour Débutants",
    description: "Versionnez votre code et collaborez facilement sur vos travaux.",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop",
    instructeur: "M. Sarr",
    categorie: "Programmation",
    badge: "Outils",
    niveau: "Debutant",
    duree: "3h 45",
    chapitres: [
      {
        id: 1,
        titre: "Commandes Git essentielles",
        duree: "1h 20",
        videoYoutube: "https://www.youtube.com/embed/RGOj5yH7evk",
        contenu: ["init", "add", "commit"],
      },
      {
        id: 2,
        titre: "Travailler avec GitHub",
        duree: "1h 10",
        videoYoutube: "https://www.youtube.com/embed/w3jLJU7DT5E",
        contenu: ["push", "pull", "pull request"],
      },
    ],
    quiz: creerQuizParCours("Git et GitHub", "Commit", "Pull request"),
  },
  {
    id: 7,
    titre: "Python : Les fondamentaux",
    description: "Demarrez en Python avec la syntaxe, les fonctions et les listes.",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop",
    instructeur: "Mme Ndiaye",
    categorie: "Programmation",
    badge: "Programmation",
    niveau: "Debutant",
    duree: "5h 10",
    chapitres: [
      {
        id: 1,
        titre: "Variables et types",
        duree: "1h 40",
        videoYoutube: "https://www.youtube.com/embed/kqtD5dpn9C8",
        contenu: ["Variables", "if", "boucles"],
      },
      {
        id: 2,
        titre: "Fonctions et listes",
        duree: "1h 30",
        videoYoutube: "https://www.youtube.com/embed/rfscVS0vtbw",
        contenu: ["def", "listes", "dictionnaires"],
      },
    ],
    quiz: creerQuizParCours("Python", "Fonctions", "Listes"),
  },
  {
    id: 8,
    titre: "TypeScript : coder avec des types",
    description: "Rendez votre JavaScript plus robuste avec TypeScript.",
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&auto=format&fit=crop",
    instructeur: "M. Diop",
    categorie: "Programmation",
    badge: "Programmation",
    niveau: "Intermediaire",
    duree: "4h 20",
    chapitres: [
      {
        id: 1,
        titre: "Types de base",
        duree: "1h 20",
        videoYoutube: "https://www.youtube.com/embed/30LWjhZzg50",
        contenu: ["string", "number", "boolean"],
      },
      {
        id: 2,
        titre: "Interfaces et fonctions",
        duree: "1h 40",
        videoYoutube: "https://www.youtube.com/embed/d56mG7DezGs",
        contenu: ["interface", "types", "retours de fonction"],
      },
    ],
    quiz: creerQuizParCours("TypeScript", "Interfaces", "Typage statique"),
  },
  {
    id: 9,
    titre: "Node.js & Express API",
    description: "Construisez une API REST simple avec Node.js et Express.",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop",
    instructeur: "M. Faye",
    categorie: "Developpement Web",
    badge: "Backend",
    niveau: "Intermediaire",
    duree: "5h 40",
    chapitres: [
      {
        id: 1,
        titre: "Serveur Express",
        duree: "1h 50",
        videoYoutube: "https://www.youtube.com/embed/L72fhGm1tfE",
        contenu: ["Routes", "Middleware", "JSON"],
      },
      {
        id: 2,
        titre: "CRUD API",
        duree: "1h 30",
        videoYoutube: "https://www.youtube.com/embed/pKd0Rpw7O48",
        contenu: ["GET", "POST", "DELETE"],
      },
    ],
    quiz: creerQuizParCours("Node.js et Express", "Routes", "Middleware"),
  },
  {
    id: 10,
    titre: "SQL : Bases de données",
    description: "Apprenez a lire et ecrire des requetes SQL utiles.",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop",
    instructeur: "Mme Sow",
    categorie: "Data",
    badge: "Data",
    niveau: "Debutant",
    duree: "4h 00",
    chapitres: [
      {
        id: 1,
        titre: "SELECT et WHERE",
        duree: "1h 10",
        videoYoutube: "https://www.youtube.com/embed/HXV3zeQKqGY",
        contenu: ["SELECT", "WHERE", "ORDER BY"],
      },
      {
        id: 2,
        titre: "Jointures simples",
        duree: "1h 20",
        videoYoutube: "https://www.youtube.com/embed/9Pzj7Aj25lw",
        contenu: ["INNER JOIN", "LEFT JOIN", "GROUP BY"],
      },
    ],
    quiz: creerQuizParCours("SQL", "SELECT", "JOIN"),
  },
  {
    id: 11,
    titre: "Power BI : Tableaux de bord",
    description: "Creez des visualisations claires pour vos donnees.",
    image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=600&auto=format&fit=crop",
    instructeur: "M. Mbaye",
    categorie: "Data",
    badge: "Data",
    niveau: "Intermediaire",
    duree: "3h 50",
    chapitres: [
      {
        id: 1,
        titre: "Importer des donnees",
        duree: "1h 00",
        videoYoutube: "https://www.youtube.com/embed/AGrl-H87pRU",
        contenu: ["Excel", "Nettoyage", "Modeles"],
      },
      {
        id: 2,
        titre: "Creer un dashboard",
        duree: "1h 20",
        videoYoutube: "https://www.youtube.com/embed/TmhQCQr_DCA",
        contenu: ["Graphiques", "Filtres", "KPI"],
      },
    ],
    quiz: creerQuizParCours("Power BI", "Visualisations", "KPI"),
  },
  {
    id: 12,
    titre: "Excel pour l'analyse de donnees",
    description: "Utilisez Excel pour nettoyer, analyser et presenter des donnees.",
    image: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=600&auto=format&fit=crop",
    instructeur: "Mme Kane",
    categorie: "Data",
    badge: "Data",
    niveau: "Debutant",
    duree: "3h 30",
    chapitres: [
      {
        id: 1,
        titre: "Formules utiles",
        duree: "1h 00",
        videoYoutube: "https://www.youtube.com/embed/Vl0H-qTclOg",
        contenu: ["SOMME", "MOYENNE", "SI"],
      },
      {
        id: 2,
        titre: "Tableaux croises",
        duree: "1h 10",
        videoYoutube: "https://www.youtube.com/embed/pCJ15nGFgVg",
        contenu: ["Croiser des donnees", "Filtres", "Graphiques"],
      },
    ],
    quiz: creerQuizParCours("Excel", "Formules", "Tableaux croises"),
  },
  {
    id: 13,
    titre: "Introduction a l'IA",
    description: "Comprenez les bases de l'intelligence artificielle simplement.",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop",
    instructeur: "M. Ba",
    categorie: "Science",
    badge: "Sciences",
    niveau: "Debutant",
    duree: "3h 15",
    chapitres: [
      {
        id: 1,
        titre: "IA, machine learning et deep learning",
        duree: "1h 10",
        videoYoutube: "https://www.youtube.com/embed/2ePf9rue1Ao",
        contenu: ["Definitions", "Exemples", "Cas d'usage"],
      },
      {
        id: 2,
        titre: "Donnees et modeles",
        duree: "1h 00",
        videoYoutube: "https://www.youtube.com/embed/GwIo3gDZCVQ",
        contenu: ["Donnees", "Entrainement", "Prediction"],
      },
    ],
    quiz: creerQuizParCours("Intelligence Artificielle", "Machine learning", "Donnees"),
  },
  {
    id: 14,
    titre: "Algebre avancee",
    description: "Renforcez votre niveau en algebre pour le lycee et les concours.",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop",
    instructeur: "Mme Ndour",
    categorie: "Science",
    badge: "Sciences",
    niveau: "Intermediaire",
    duree: "4h 40",
    chapitres: [
      {
        id: 1,
        titre: "Polynomes",
        duree: "1h 30",
        videoYoutube: "https://www.youtube.com/embed/NybHckSEQBI",
        contenu: ["Degre", "Factorisation", "Racines"],
      },
      {
        id: 2,
        titre: "Suites numeriques",
        duree: "1h 10",
        videoYoutube: "https://www.youtube.com/embed/V6yixyiJcos",
        contenu: ["Arithmetique", "Geometrique", "Limites"],
      },
    ],
    quiz: creerQuizParCours("Algebre", "Polynomes", "Suites"),
  },
  {
    id: 15,
    titre: "Physique mecanique",
    description: "Etudiez les forces, les mouvements et les lois de Newton.",
    image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=600&auto=format&fit=crop",
    instructeur: "M. Gueye",
    categorie: "Science",
    badge: "Sciences",
    niveau: "Debutant",
    duree: "4h 10",
    chapitres: [
      {
        id: 1,
        titre: "Mouvement et vitesse",
        duree: "1h 20",
        videoYoutube: "https://www.youtube.com/embed/b1t41Q3xRM8",
        contenu: ["Trajectoire", "Vitesse", "Acceleration"],
      },
      {
        id: 2,
        titre: "Forces",
        duree: "1h 10",
        videoYoutube: "https://www.youtube.com/embed/kKKM8Y-u7ds",
        contenu: ["Poids", "Frottement", "Resultante"],
      },
    ],
    quiz: creerQuizParCours("Physique mecanique", "Forces", "Vitesse"),
  },
  {
    id: 16,
    titre: "Chimie generale",
    description: "Apprenez les notions de base en atomes, molecules et reactions.",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop",
    instructeur: "Mme Ly",
    categorie: "Science",
    badge: "Sciences",
    niveau: "Debutant",
    duree: "3h 55",
    chapitres: [
      {
        id: 1,
        titre: "Atomes et molecules",
        duree: "1h 15",
        videoYoutube: "https://www.youtube.com/embed/FSyAehMdpyI",
        contenu: ["Atome", "Ions", "Molecule"],
      },
      {
        id: 2,
        titre: "Reactions chimiques",
        duree: "1h 05",
        videoYoutube: "https://www.youtube.com/embed/ANi709MYnWg",
        contenu: ["Equation", "Reactifs", "Produits"],
      },
    ],
    quiz: creerQuizParCours("Chimie", "Atomes", "Reactions"),
  },
  {
    id: 17,
    titre: "Communication professionnelle",
    description: "Ameliorez vos messages a l'ecrit et a l'oral en entreprise.",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop",
    instructeur: "Mme Tall",
    categorie: "Soft Skills",
    badge: "Communication",
    niveau: "Intermediaire",
    duree: "3h 20",
    chapitres: [
      {
        id: 1,
        titre: "Ecrire un mail efficace",
        duree: "1h 00",
        videoYoutube: "https://www.youtube.com/embed/5MgBikgcWnY",
        contenu: ["Objet", "Structure", "Ton professionnel"],
      },
      {
        id: 2,
        titre: "Parler en reunion",
        duree: "1h 00",
        videoYoutube: "https://www.youtube.com/embed/1Evwgu369Jw",
        contenu: ["Clarte", "Ecoute", "Synthese"],
      },
    ],
    quiz: creerQuizParCours("Communication professionnelle", "Mail clair", "Ecoute active"),
  },
  {
    id: 18,
    titre: "Gestion du temps",
    description: "Organisez vos journees et gagnez en efficacite.",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&auto=format&fit=crop",
    instructeur: "M. Cisse",
    categorie: "Soft Skills",
    badge: "Organisation",
    niveau: "Debutant",
    duree: "2h 50",
    chapitres: [
      {
        id: 1,
        titre: "Prioriser les taches",
        duree: "1h 00",
        videoYoutube: "https://www.youtube.com/embed/iONDebHX9qk",
        contenu: ["Urgent/important", "Planning", "Objectifs"],
      },
      {
        id: 2,
        titre: "Techniques anti-procrastination",
        duree: "0h 50",
        videoYoutube: "https://www.youtube.com/embed/arj7oStGLkU",
        contenu: ["Pomodoro", "Decoupage", "Suivi journalier"],
      },
    ],
    quiz: creerQuizParCours("Gestion du temps", "Priorites", "Planning"),
  },
  {
    id: 19,
    titre: "Leadership debutant",
    description: "Developpez les reflexes essentiels pour mener une equipe.",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop",
    instructeur: "Mme Seck",
    categorie: "Soft Skills",
    badge: "Leadership",
    niveau: "Intermediaire",
    duree: "3h 10",
    chapitres: [
      {
        id: 1,
        titre: "Roles du leader",
        duree: "1h 00",
        videoYoutube: "https://www.youtube.com/embed/TQMbvJNRpLE",
        contenu: ["Vision", "Decision", "Communication"],
      },
      {
        id: 2,
        titre: "Motiver une equipe",
        duree: "1h 00",
        videoYoutube: "https://www.youtube.com/embed/u6XAPnuFjJc",
        contenu: ["Feedback", "Reconnaissance", "Delegation"],
      },
    ],
    quiz: creerQuizParCours("Leadership", "Vision", "Delegation"),
  },
  {
    id: 20,
    titre: "Design UI debutant",
    description: "Concevez des interfaces lisibles et agreables.",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop",
    instructeur: "M. Ndao",
    categorie: "Developpement Web",
    badge: "Design",
    niveau: "Debutant",
    duree: "3h 40",
    chapitres: [
      {
        id: 1,
        titre: "Principes visuels",
        duree: "1h 20",
        videoYoutube: "https://www.youtube.com/embed/c9Wg6Cb_YlU",
        contenu: ["Contraste", "Espace", "Hierarchie"],
      },
      {
        id: 2,
        titre: "Composants UI",
        duree: "1h 00",
        videoYoutube: "https://www.youtube.com/embed/4W4LvJnNegA",
        contenu: ["Boutons", "Formulaires", "Cartes"],
      },
    ],
    quiz: creerQuizParCours("Design UI", "Contraste", "Composants"),
  },
  {
    id: 21,
    titre: "UX : Experience utilisateur",
    description: "Comprenez les besoins utilisateurs et ameliorez les parcours.",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop",
    instructeur: "Mme Fofana",
    categorie: "Developpement Web",
    badge: "Design",
    niveau: "Intermediaire",
    duree: "3h 35",
    chapitres: [
      {
        id: 1,
        titre: "Recherche utilisateur",
        duree: "1h 05",
        videoYoutube: "https://www.youtube.com/embed/Ovj4hFxko7c",
        contenu: ["Personas", "Interviews", "Besoins"],
      },
      {
        id: 2,
        titre: "Parcours et tests",
        duree: "1h 10",
        videoYoutube: "https://www.youtube.com/embed/4W4LvJnNegA",
        contenu: ["Wireframes", "Tests", "Iterations"],
      },
    ],
    quiz: creerQuizParCours("UX", "Personas", "Tests utilisateur"),
  },
  {
    id: 22,
    titre: "Algorithmique facile",
    description: "Apprenez a resoudre des problemes avec une methode simple.",
    image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=600&auto=format&fit=crop",
    instructeur: "M. Sy",
    categorie: "Programmation",
    badge: "Programmation",
    niveau: "Debutant",
    duree: "4h 25",
    chapitres: [
      {
        id: 1,
        titre: "Notion d'algorithme",
        duree: "1h 30",
        videoYoutube: "https://www.youtube.com/embed/8hly31xKli0",
        contenu: ["Etapes", "Pseudo-code", "Complexite simple"],
      },
      {
        id: 2,
        titre: "Tableaux et tri",
        duree: "1h 20",
        videoYoutube: "https://www.youtube.com/embed/RBSGKlAvoiM",
        contenu: ["Recherche", "Tri", "Comparaison"],
      },
    ],
    quiz: creerQuizParCours("Algorithmique", "Pseudo-code", "Tri"),
  },
  {
    id: 23,
    titre: "Cybersecurite de base",
    description: "Protegez vos comptes et vos applications contre les risques courants.",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&auto=format&fit=crop",
    instructeur: "Mme Camara",
    categorie: "Science",
    badge: "Securite",
    niveau: "Debutant",
    duree: "3h 05",
    chapitres: [
      {
        id: 1,
        titre: "Mots de passe et phishing",
        duree: "1h 00",
        videoYoutube: "https://www.youtube.com/embed/inWWhr5tnEA",
        contenu: ["Mots de passe forts", "Phishing", "Bonnes pratiques"],
      },
      {
        id: 2,
        titre: "Securite web",
        duree: "1h 00",
        videoYoutube: "https://www.youtube.com/embed/3Kq1MIfTWCE",
        contenu: ["HTTPS", "Sessions", "Permissions"],
      },
    ],
    quiz: creerQuizParCours("Cybersecurite", "Phishing", "HTTPS"),
  },
  {
    id: 24,
    titre: "Initiation a la robotique",
    description: "Découvrez les bases de la robotique et des capteurs intelligents.",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop",
    instructeur: "M. Toure",
    categorie: "Science",
    badge: "Sciences",
    niveau: "Intermediaire",
    duree: "4h 05",
    chapitres: [
      {
        id: 1,
        titre: "Composants d'un robot",
        duree: "1h 20",
        videoYoutube: "https://www.youtube.com/embed/b1t41Q3xRM8",
        contenu: ["Capteurs", "Moteurs", "Controleur"],
      },
      {
        id: 2,
        titre: "Programmation simple",
        duree: "1h 15",
        videoYoutube: "https://www.youtube.com/embed/rfscVS0vtbw",
        contenu: ["Conditions", "Boucles", "Actions"],
      },
    ],
    quiz: creerQuizParCours("Robotique", "Capteurs", "Moteurs"),
  },
  {
    id: 901,
    titre: "Harvard CS50: Introduction to Computer Science",
    description: "Le célèbre cours de Harvard sur l'informatique. (Anglais avec sous-titres)",
    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&auto=format&fit=crop",
    instructeur: "David J. Malan (Harvard)",
    categorie: "Programmation",
    badge: "Université",
    niveau: "Debutant",
    duree: "20h 00",
    chapitres: [
      {
        id: 1,
        titre: "Lecture 0: Scratch",
        duree: "1h 45",
        videoYoutube: "https://www.youtube.com/embed/z-OXz6423SY",
        contenu: ["Computational thinking", "Scratch", "Algorithms"],
      },
      {
        id: 2,
        titre: "Lecture 1: C",
        duree: "2h 10",
        videoYoutube: "https://www.youtube.com/embed/ZqQAveIG7OU",
        contenu: ["C", "Syntax", "Variables"],
      }
    ],
    quiz: creerQuizParCours("Harvard CS50", "Algorithmes", "C Language"),
  },
  {
    id: 902,
    titre: "MIT 6.0001: Intro to CS and Programming in Python",
    description: "Le cours d'introduction du MIT en Python.",
    image: "https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=600&auto=format&fit=crop",
    instructeur: "Dr. Ana Bell (MIT)",
    categorie: "Programmation",
    badge: "Université",
    niveau: "Debutant",
    duree: "15h 00",
    chapitres: [
      {
        id: 1,
        titre: "Lecture 1: What is computation?",
        duree: "0h 45",
        videoYoutube: "https://www.youtube.com/embed/nykOeWgQcHM",
        contenu: ["Computation", "Python basics"],
      }
    ],
    quiz: creerQuizParCours("MIT Python", "Variables", "Types"),
  },
  {
    id: 903,
    titre: "Stanford CS229: Machine Learning",
    description: "Cours mythique sur le Machine Learning de Stanford par Andrew Ng.",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop",
    instructeur: "Andrew Ng (Stanford)",
    categorie: "Data",
    badge: "Université",
    niveau: "Intermediaire",
    duree: "25h 00",
    chapitres: [
      {
        id: 1,
        titre: "Lecture 1: Introduction",
        duree: "1h 15",
        videoYoutube: "https://www.youtube.com/embed/jGwO_UgTS7I",
        contenu: ["Supervised Learning", "Linear Regression"],
      }
    ],
    quiz: creerQuizParCours("Stanford ML", "Linear Regression", "Supervised Learning"),
  },
  {
    id: 904,
    titre: "Oxford Mathematics: Introduction to Complex Numbers",
    description: "Leçon d'introduction aux nombres complexes de l'Université d'Oxford.",
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&auto=format&fit=crop",
    instructeur: "Dr. Richard Earl (Oxford)",
    categorie: "Science",
    badge: "Université",
    niveau: "Intermediaire",
    duree: "5h 00",
    chapitres: [
      {
        id: 1,
        titre: "Lecture 1: Complex Numbers",
        duree: "0h 50",
        videoYoutube: "https://www.youtube.com/embed/5PcpBv5t_Zg",
        contenu: ["Imaginary Numbers", "Algebra"],
      }
    ],
    quiz: creerQuizParCours("Oxford Maths", "Imaginary unit", "Equations"),
  },

  {
    id: 905,
    titre: "Harvard: Web Programming with Python and JavaScript",
    description: "Plongez dans le développement web moderne.",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop",
    instructeur: "Brian Yu (Harvard)",
    categorie: "Developpement Web",
    badge: "Université",
    niveau: "Intermediaire",
    duree: "15h 00",
    chapitres: [{ id: 1, titre: "HTML & CSS", duree: "1h 30", videoYoutube: "https://www.youtube.com/embed/bMknfKXIFA8", contenu: ["HTML", "CSS"] }],
    quiz: creerQuizParCours("Harvard Web", "HTML", "CSS")
  },
  {
    id: 906,
    titre: "Harvard: Data Science Fundamentals",
    description: "Les bases de la Data Science.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop",
    instructeur: "Rafael Irizarry (Harvard)",
    categorie: "Data",
    badge: "Université",
    niveau: "Debutant",
    duree: "10h 00",
    chapitres: [{ id: 1, titre: "R Basics", duree: "1h 30", videoYoutube: "https://www.youtube.com/embed/TmhQCQr_DCA", contenu: ["R", "Vectors"] }],
    quiz: creerQuizParCours("Harvard Data", "R", "Vectors")
  },
  {
    id: 907,
    titre: "Harvard: Entrepreneurship in Emerging Economies",
    description: "Comprendre le business dans les marchés émergents.",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop",
    instructeur: "Tarun Khanna (Harvard)",
    categorie: "Soft Skills",
    badge: "Université",
    niveau: "Intermediaire",
    duree: "8h 00",
    chapitres: [{ id: 1, titre: "Contextualizing", duree: "1h 30", videoYoutube: "https://www.youtube.com/embed/TQMbvJNRpLE", contenu: ["Markets", "Business"] }],
    quiz: creerQuizParCours("Harvard Business", "Markets", "Strategy")
  },
  {
    id: 908,
    titre: "Harvard: Quantitative Methods for Biology",
    description: "Les mathématiques appliquées à la biologie.",
    image: "https://images.unsplash.com/photo-1532153975070-2e9ab71f1b14?w=600&auto=format&fit=crop",
    instructeur: "Michael Brenner (Harvard)",
    categorie: "Science",
    badge: "Université",
    niveau: "Intermediaire",
    duree: "12h 00",
    chapitres: [{ id: 1, titre: "Introduction", duree: "1h 30", videoYoutube: "https://www.youtube.com/embed/FSyAehMdpyI", contenu: ["Maths", "Biology"] }],
    quiz: creerQuizParCours("Harvard Bio", "Maths", "Biology")
  },
  {
    id: 909,
    titre: "Harvard: AI with Python",
    description: "Introduction à l'IA avec Python.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop",
    instructeur: "David J. Malan (Harvard)",
    categorie: "Programmation",
    badge: "Université",
    niveau: "Intermediaire",
    duree: "14h 00",
    chapitres: [{ id: 1, titre: "Search", duree: "1h 30", videoYoutube: "https://www.youtube.com/embed/W6NZfCO5SIk", contenu: ["Search", "DFS", "BFS"] }],
    quiz: creerQuizParCours("Harvard AI", "Search", "DFS")
  },
  {
    id: 910,
    titre: "MIT: Introduction to Deep Learning",
    description: "Le fameux cours 6.S191 sur le Deep Learning.",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop",
    instructeur: "Alexander Amini (MIT)",
    categorie: "Data",
    badge: "Université",
    niveau: "Intermediaire",
    duree: "20h 00",
    chapitres: [{ id: 1, titre: "Intro to Deep Learning", duree: "1h 30", videoYoutube: "https://www.youtube.com/embed/2ePf9rue1Ao", contenu: ["Neural Networks", "Deep Learning"] }],
    quiz: creerQuizParCours("MIT DL", "Neural Networks", "Deep Learning")
  },
  {
    id: 911,
    titre: "MIT: Circuits and Electronics",
    description: "Apprenez les bases de l'ingénierie électronique.",
    image: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=600&auto=format&fit=crop",
    instructeur: "Anant Agarwal (MIT)",
    categorie: "Science",
    badge: "Université",
    niveau: "Debutant",
    duree: "18h 00",
    chapitres: [{ id: 1, titre: "Basic Circuit Analysis", duree: "1h 30", videoYoutube: "https://www.youtube.com/embed/b1t41Q3xRM8", contenu: ["Circuits", "KCL", "KVL"] }],
    quiz: creerQuizParCours("MIT Circuits", "KCL", "KVL")
  },
  {
    id: 912,
    titre: "Stanford: Algorithms: Design and Analysis",
    description: "Conception et analyse d'algorithmes.",
    image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=600&auto=format&fit=crop",
    instructeur: "Tim Roughgarden (Stanford)",
    categorie: "Programmation",
    badge: "Université",
    niveau: "Intermediaire",
    duree: "22h 00",
    chapitres: [{ id: 1, titre: "Divide and Conquer", duree: "1h 30", videoYoutube: "https://www.youtube.com/embed/RBSGKlAvoiM", contenu: ["Divide and Conquer", "Sorting"] }],
    quiz: creerQuizParCours("Stanford Algo", "Divide", "Conquer")
  },
  {
    id: 913,
    titre: "Stanford: Databases",
    description: "Les bases de données relationnelles et SQL.",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop",
    instructeur: "Jennifer Widom (Stanford)",
    categorie: "Data",
    badge: "Université",
    niveau: "Debutant",
    duree: "16h 00",
    chapitres: [{ id: 1, titre: "Relational Databases", duree: "1h 30", videoYoutube: "https://www.youtube.com/embed/HXV3zeQKqGY", contenu: ["SQL", "Relational Algebra"] }],
    quiz: creerQuizParCours("Stanford DB", "SQL", "Relations")
  },
  {
    id: 914,
    titre: "Oxford: Quantum Mechanics",
    description: "Introduction à la mécanique quantique.",
    image: "https://images.unsplash.com/photo-1464802686167-b939a6910659?w=600&auto=format&fit=crop",
    instructeur: "James Binney (Oxford)",
    categorie: "Science",
    badge: "Université",
    niveau: "Intermediaire",
    duree: "15h 00",
    chapitres: [{ id: 1, titre: "Introduction to Quantum", duree: "1h 30", videoYoutube: "https://www.youtube.com/embed/kKKM8Y-u7ds", contenu: ["Quantum", "Mechanics"] }],
    quiz: creerQuizParCours("Oxford QM", "Quantum", "Mechanics")
  },
  {
    id: 915,
    titre: "Oxford: Critical Reasoning",
    description: "Développez votre esprit critique.",
    image: "https://images.unsplash.com/photo-1456406644174-8ddd4cd52a06?w=600&auto=format&fit=crop",
    instructeur: "Marianne Talbot (Oxford)",
    categorie: "Soft Skills",
    badge: "Université",
    niveau: "Debutant",
    duree: "10h 00",
    chapitres: [{ id: 1, titre: "Arguments", duree: "1h 30", videoYoutube: "https://www.youtube.com/embed/HAnw168huqA", contenu: ["Logic", "Reasoning"] }],
    quiz: creerQuizParCours("Oxford Reasoning", "Logic", "Arguments")
  }

];

function genererCoursSupplementaires(debutId: number, totalFinal: number): Cours[] {
  const titres = [
    "Developpement Frontend avance",
    "Backend moderne avec API",
    "Securite offensive et defensive",
    "Automatisation DevOps",
    "Data engineering pratique",
    "Machine learning applique",
    "Cloud AWS fundamentals",
    "Cloud Azure administration",
    "Kubernetes pratique",
    "Docker et conteneurisation",
    "Flutter mobile",
    "React Native mobile",
    "System design pour debutants",
    "Tests automatises en JavaScript",
    "Architecture microservices",
    "UI design system",
    "UX research appliquee",
    "Bases reseaux et protocols",
    "Linux administration",
    "Gestion de projet agile",
  ];
  const instructeurs = ["M. Diallo", "Mme Faye", "M. Ndiaye", "Mme Sarr", "M. Ba", "Mme Fall", "M. Seck", "Mme Diop"];
  const categories: CategorieCours[] = ["Developpement Web", "Programmation", "Data", "Science", "Soft Skills"];
  const badges = ["Web", "DevOps", "Cyber", "Data", "Cloud", "Mobile", "Programmation", "Leadership"];
  const videos = [
    "https://www.youtube.com/embed/W6NZfCO5SIk",
    "https://www.youtube.com/embed/bMknfKXIFA8",
    "https://www.youtube.com/embed/rfscVS0vtbw",
    "https://www.youtube.com/embed/RGOj5yH7evk",
    "https://www.youtube.com/embed/3Kq1MIfTWCE",
    "https://www.youtube.com/embed/HXV3zeQKqGY",
  ];

  const supplements: Cours[] = [];
  const count = totalFinal - coursBase.length;

  for (let i = 0; i < count; i += 1) {
    const id = debutId + i;
    const theme = titres[i % titres.length];
    const categorie = categories[i % categories.length];
    const niveau: NiveauCours = i % 3 === 0 ? "Intermediaire" : "Debutant";
    const notionA = i % 2 === 0 ? "Pratique guidee" : "Concepts cles";
    const notionB = i % 2 === 0 ? "Projet final" : "Revision active";

    supplements.push({
      id,
      titre: `${theme} ${id}`,
      description: `Cours ${theme.toLowerCase()} avec progression, quiz et exercices pratiques.`,
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&auto=format&fit=crop",
      instructeur: instructeurs[i % instructeurs.length],
      categorie,
      badge: badges[i % badges.length],
      niveau,
      duree: `${3 + (i % 4)}h ${10 + ((i * 7) % 50)}`,
      nouveau: i % 5 === 0,
      chapitres: [
        {
          id: 1,
          titre: "Fondamentaux",
          duree: "1h 10",
          videoYoutube: videos[i % videos.length],
          contenu: ["Notions de base", "Mise en pratique", "Bonnes pratiques"],
        },
        {
          id: 2,
          titre: "Atelier pratique",
          duree: "1h 20",
          videoYoutube: videos[(i + 1) % videos.length],
          contenu: ["Exercices diriges", "Corrections", "Mini projet"],
        },
        {
          id: 3,
          titre: "Consolidation",
          duree: "0h 55",
          videoYoutube: videos[(i + 2) % videos.length],
          contenu: ["Revision", "Evaluation", "Plan de progression"],
        },
      ],
      quiz: creerQuizParCours(`${theme} ${id}`, notionA, notionB),
    });
  }

  return supplements;
}

export const listeCours: Cours[] = [...coursBase, ...genererCoursSupplementaires(25, 115)];

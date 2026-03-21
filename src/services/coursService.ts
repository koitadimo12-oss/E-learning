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
      options: ["Pratiquer avec des mini-projets", "Tout éviter", "Ne jamais tester", "Sauter les chapitres"],
      reponse: "Pratiquer avec des mini-projets",
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
    image: "",
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
    description: "Versionnez votre code et collaborez facilement sur des projets.",
    image: "",
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
    image: "",
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
    image: "",
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
    image: "",
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
    image: "",
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
    image: "",
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
    image: "",
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
    image: "",
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
    image: "",
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
    image: "",
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
    image: "",
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
    image: "",
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
    image: "",
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
    image: "",
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
    image: "",
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
    image: "",
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
    image: "",
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
    image: "",
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
    image: "",
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
];

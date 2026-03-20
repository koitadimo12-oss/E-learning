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
  chapitres: Chapitre[];
  quiz: Quiz[];
}

const quizStandard: Quiz[] = [
  {
    question: "Quelle est la meilleure approche pour progresser rapidement ?",
    options: ["Pratiquer regulierement", "Regarder sans coder", "Tout memoriser", "Eviter les exercices"],
    reponse: "Pratiquer regulierement",
  },
  {
    question: "Quand faut-il revoir un chapitre ?",
    options: ["Quand un point n'est pas clair", "Jamais", "Seulement en examen", "Apres 1 an"],
    reponse: "Quand un point n'est pas clair",
  },
  {
    question: "Quel rythme est recommande ?",
    options: ["Progressif et constant", "Aleatoire", "Une seule session longue", "Aucun planning"],
    reponse: "Progressif et constant",
  },
  {
    question: "A quoi sert le quiz final ?",
    options: ["Mesurer les acquis", "Remplacer le cours", "Ignorer la pratique", "Verifier la connexion internet"],
    reponse: "Mesurer les acquis",
  },
  {
    question: "Que faire apres une erreur ?",
    options: ["Analyser et corriger", "Supprimer le projet", "Changer de langage", "Arreter"],
    reponse: "Analyser et corriger",
  },
  {
    question: "Comment consolider l'apprentissage ?",
    options: ["Faire un mini-projet", "Lire uniquement", "Copier coller", "Sauter les revisions"],
    reponse: "Faire un mini-projet",
  },
];

export const listeCours: Cours[] = [
  {
    id: 1,
    titre: "React Frontend Pro",
    description: "Construisez des interfaces modernes, composables et performantes avec React.",
    image: "/cours/react.png",
    instructeur: "A. Ndiaye",
    categorie: "Developpement Web",
    niveau: "Debutant",
    duree: "6h 20",
    chapitres: [
      {
        id: 1,
        titre: "Demarrer avec React",
        duree: "1h 10",
        videoYoutube: "https://www.youtube.com/embed/bMknfKXIFA8",
        contenu: ["JSX et composants", "Props et structure", "Organisation du projet"],
      },
      {
        id: 2,
        titre: "Etat et interactions",
        duree: "1h 40",
        videoYoutube: "https://www.youtube.com/embed/O6P86uwfdR0",
        contenu: ["useState", "Events", "Formulaires"],
      },
      {
        id: 3,
        titre: "Routing et pages",
        duree: "1h 30",
        videoYoutube: "https://www.youtube.com/embed/Ul3y1LXxzdU",
        contenu: ["Routes", "Navigation", "Layouts"],
      },
    ],
    quiz: quizStandard,
  },
  {
    id: 2,
    titre: "Python Essentiel",
    description: "Apprenez Python de zero: syntaxe, fonctions, structures et scripts utiles.",
    image: "/cours/python.png",
    instructeur: "M. Ba",
    categorie: "Programmation",
    niveau: "Debutant",
    duree: "5h 30",
    chapitres: [
      {
        id: 1,
        titre: "Bases du langage Python",
        duree: "1h 20",
        videoYoutube: "https://www.youtube.com/embed/rfscVS0vtbw",
        contenu: ["Variables", "Types", "Conditions"],
      },
      {
        id: 2,
        titre: "Fonctions et modules",
        duree: "1h 40",
        videoYoutube: "https://www.youtube.com/embed/kqtD5dpn9C8",
        contenu: ["Fonctions", "Import", "Packages"],
      },
      {
        id: 3,
        titre: "Mini projet script",
        duree: "1h 10",
        videoYoutube: "https://www.youtube.com/embed/_uQrJ0TkZlc",
        contenu: ["Lecture ecriture", "Boucles", "Validation"],
      },
    ],
    quiz: quizStandard,
  },
  {
    id: 3,
    titre: "Data Analyse avec Excel",
    description: "Transformez vos donnees en informations utiles avec Excel.",
    image: "/cours/data-excel.png",
    instructeur: "F. Ka",
    categorie: "Data",
    niveau: "Debutant",
    duree: "4h 45",
    chapitres: [
      {
        id: 1,
        titre: "Nettoyage des donnees",
        duree: "1h 10",
        videoYoutube: "https://www.youtube.com/embed/opJgMj1IUrc",
        contenu: ["Suppression doublons", "Formats", "Tri filtre"],
      },
      {
        id: 2,
        titre: "Tableaux croises",
        duree: "1h 20",
        videoYoutube: "https://www.youtube.com/embed/qu-AK0Hv0b4",
        contenu: ["Creation TCD", "Segments", "Synthese"],
      },
      {
        id: 3,
        titre: "Visualisation",
        duree: "1h 00",
        videoYoutube: "https://www.youtube.com/embed/DAU0qqh_I-A",
        contenu: ["Graphiques", "Mise en page", "Dashboard simple"],
      },
    ],
    quiz: quizStandard,
  },
  {
    id: 4,
    titre: "Maths Appliquees",
    description: "Consolidez vos bases mathematiques pour les etudes et le travail.",
    image: "/cours/math.png",
    instructeur: "S. Sarr",
    categorie: "Science",
    niveau: "Debutant",
    duree: "5h 00",
    chapitres: [
      {
        id: 1,
        titre: "Algebre de base",
        duree: "1h 30",
        videoYoutube: "https://www.youtube.com/embed/OmJ-4B-mS-Y",
        contenu: ["Equations", "Fractions", "Systemes simples"],
      },
      {
        id: 2,
        titre: "Fonctions et graphiques",
        duree: "1h 20",
        videoYoutube: "https://www.youtube.com/embed/26QPDBe-NB8",
        contenu: ["Fonctions lineaires", "Lecture de courbe", "Applications"],
      },
      {
        id: 3,
        titre: "Problemes pratiques",
        duree: "1h 00",
        videoYoutube: "https://www.youtube.com/embed/tB9Yj5M4f4Q",
        contenu: ["Modelisation", "Resolution", "Verification"],
      },
    ],
    quiz: quizStandard,
  },
  {
    id: 5,
    titre: "Science Generale",
    description: "Comprenez les fondamentaux de la science et la methode experimentale.",
    image: "/cours/science.png",
    instructeur: "K. Diop",
    categorie: "Science",
    niveau: "Debutant",
    duree: "4h 20",
    chapitres: [
      {
        id: 1,
        titre: "Methode scientifique",
        duree: "1h 00",
        videoYoutube: "https://www.youtube.com/embed/2ePf9rue1Ao",
        contenu: ["Observation", "Hypothese", "Experimentation"],
      },
      {
        id: 2,
        titre: "Energie et matiere",
        duree: "1h 15",
        videoYoutube: "https://www.youtube.com/embed/1V6XfI-H3zM",
        contenu: ["Transformations", "Conservation", "Applications"],
      },
      {
        id: 3,
        titre: "Sciences du vivant",
        duree: "1h 10",
        videoYoutube: "https://www.youtube.com/embed/RKQ1L_M3YpY",
        contenu: ["Cellule", "Organes", "Ecosysteme"],
      },
    ],
    quiz: quizStandard,
  },
  {
    id: 6,
    titre: "Communication Professionnelle",
    description: "Developpez une communication claire, efficace et convaincante.",
    image: "/cours/communication.png",
    instructeur: "R. Fall",
    categorie: "Soft Skills",
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
      {
        id: 3,
        titre: "Communication ecrite",
        duree: "1h 00",
        videoYoutube: "https://www.youtube.com/embed/6g6g2mvItp4",
        contenu: ["Emails", "Compte rendu", "Clarte"],
      },
    ],
    quiz: quizStandard,
  },
];

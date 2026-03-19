export interface Quiz {
  question: string;
  options: string[];
  reponse: string;
}

export interface Cours {
  id: number;
  titre: string;
  description: string;
  image: string;
  instructeur: string;
  progression?: number;
  contenu?: string[];
  quiz?: Quiz[];
  videoYoutube?: string; // ✅ ajout pour la vidéo
}

export const listeCours: Cours[] = [
  // Ton cours existant 1, 2, etc. ...

  // === Nouveau cours complet avec vidéo ===
  {
    id: 3,
    titre: "JavaScript pour Débutants",
    description: "Apprenez JavaScript depuis zéro : variables, fonctions, boucles et manipulation du DOM",
    image: "/cours/javascript.png",
    instructeur: "M. Cheikh Fall",
    progression: 0,
    videoYoutube: "https://www.youtube.com/embed/W6NZfCO5SIk", // lien YouTube intégré
    contenu: [
      "Introduction à JavaScript et son rôle dans le web moderne.",
      "Variables et types de données : string, number, boolean, array, object.",
      "Structures conditionnelles : if, else, switch.",
      "Boucles : for, while, do...while.",
      "Fonctions : déclaration, paramètres, valeurs de retour.",
      "Manipulation du DOM : sélectionner et modifier les éléments.",
      "Événements : click, input, submit, etc.",
      "Exercices pratiques pour consolider les connaissances."
    ],
    quiz: [
      {
        question: "Quelle instruction affiche un message dans la console ?",
        options: ["console.log()", "print()", "alert()", "write()"],
        reponse: "console.log()"
      },
      {
        question: "Comment déclare-t-on une variable moderne en JavaScript ?",
        options: ["var x;", "let x;", "const x;", "Toutes les réponses"],
        reponse: "Toutes les réponses"
      },
      {
        question: "Quel type de boucle est utilisé lorsque le nombre d’itérations est connu ?",
        options: ["for", "while", "do...while", "if"],
        reponse: "for"
      },
      {
        question: "Comment sélectionne-t-on un élément par son ID dans le DOM ?",
        options: ["document.getElementById()", "document.querySelector()", "document.getElementsByClassName()", "Toutes les réponses"],
        reponse: "document.getElementById()"
      },
      {
        question: "Quel événement se déclenche lorsqu’un bouton est cliqué ?",
        options: ["click", "submit", "change", "hover"],
        reponse: "click"
      }
    ]
  }
];

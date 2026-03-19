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
}

export const listeCours: Cours[] = [
  {
    id: 1,
    titre: "Mathématiques de base",
    description:
      "Renforcez vos bases : opérations, fractions, équations simples et réflexes de calcul.",
    image: "/cours/math.png",
    instructeur: "Mme Ndiaye",
    contenu: [
      "Introduction aux nombres et opérations de base.",
      "Fractions, décimaux et conversions essentielles.",
      "Expressions simples et équations du premier degré.",
      "Propriétés utiles : distributivité, ordre des opérations.",
      "Exercices guidés pour automatiser les calculs."
    ],
    quiz: [
      {
        question: "Combien font 2 + 2 ?",
        options: ["2", "3", "4", "5"],
        reponse: "4",
      },
      {
        question: "Calcule : 10 ÷ 2 = ?",
        options: ["2", "3", "5", "8"],
        reponse: "5",
      },
      {
        question: "Quel décimal correspond à la fraction 1/4 ?",
        options: ["0.25", "0.4", "0.5", "0.75"],
        reponse: "0.25",
      },
      {
        question: "Résoudre : 2x = 6. Valeur de x = ?",
        options: ["1", "2", "3", "4"],
        reponse: "3",
      },
      {
        question: "Quel est un nombre premier ?",
        options: ["9", "12", "15", "11"],
        reponse: "11",
      },
      {
        question: "Convertir : 0.5 = ? (fraction)",
        options: ["1/3", "1/2", "2/3", "3/4"],
        reponse: "1/2",
      },
    ]
  },
  {
    id: 2,
    titre: "Python pour débutants",
    description:
      "Comprendre les bases de Python : variables, conditions, boucles, fonctions, et premiers scripts.",
    image: "/cours/python.png",
    instructeur: "M. Diop",
    contenu: [
      "Variables et types de base.",
      "Structures conditionnelles.",
      "Boucles pour répéter efficacement.",
      "Fonctions pour organiser votre code.",
      "Petits exercices pour pratiquer."
    ],
    quiz: [
      {
        question: "Quel mot-clé est utilisé pour définir une fonction en Python ?",
        options: ["def", "func", "function", "lambda"],
        reponse: "def",
      },
      {
        question: "Quel symbole définit un littéral de liste en Python ?",
        options: ["{}", "[]", "()", "<>"],
        reponse: "[]",
      },
      {
        question: "Quelle instruction affiche du texte dans la console ?",
        options: ["print()", "show()", "echo()", "write()"],
        reponse: "print()",
      },
      {
        question: "Quel mot-clé sert à exécuter un bloc si une condition est vraie ?",
        options: ["if", "for", "while", "switch"],
        reponse: "if",
      },
      {
        question: "Quelle boucle est utilisée pour itérer sur une séquence (ex: une liste) ?",
        options: ["while", "for", "do-while", "repeat"],
        reponse: "for",
      },
      {
        question: "Que fait l’expression 5 % 2 ?",
        options: ["2", "3", "0", "1"],
        reponse: "1",
      },
    ],
  },
  {
    id: 3,
    titre: "React pour débutants",
    description:
      "Construisez des interfaces modernes avec composants, props, états et hooks essentiels.",
    image: "/cours/react.png",
    instructeur: "Mme Sarr",
    contenu: [
      "Comprendre les composants et le JSX.",
      "Props : passer des données aux composants.",
      "State : gérer les changements avec `useState`.",
      "Effets : synchroniser avec `useEffect`.",
      "Bonnes pratiques : clés dans les listes et composition."
    ],
    quiz: [
      {
        question: "Dans JSX, quel attribut remplace `class` ?",
        options: ["className", "class", "styleClass", "htmlClass"],
        reponse: "className",
      },
      {
        question: "Quel hook est utilisé pour gérer l’état local dans un composant fonctionnel ?",
        options: ["useState", "useEffect", "useMemo", "useRef"],
        reponse: "useState",
      },
      {
        question: "Les `props` servent principalement à :",
        options: ["stocker un état local", "passer des données d’un parent vers un enfant", "créer des styles", "gérer le routing"],
        reponse: "passer des données d’un parent vers un enfant",
      },
      {
        question: "Quand vous affichez une liste avec `map`, pourquoi fournir une `key` ?",
        options: ["pour optimiser le rendu et éviter des erreurs", "pour afficher une bordure", "pour activer le CSS", "pour gérer les formulaires"],
        reponse: "pour optimiser le rendu et éviter des erreurs",
      },
      {
        question: "À quoi sert `useEffect` ?",
        options: ["Créer un style CSS", "Exécuter du code après le rendu / lors de changements", "Définir un composant", "Remplacer useState"],
        reponse: "Exécuter du code après le rendu / lors de changements",
      },
      {
        question: "Un composant React doit :",
        options: ["toujours être une classe", "retourner du JSX (ou `null`) dans sa fonction", "ne jamais utiliser de fonctions", "ne jamais utiliser de props"],
        reponse: "retourner du JSX (ou `null`) dans sa fonction",
      },
    ],
  },
  {
    id: 4,
    titre: "Science & Méthode (niveau débutant)",
    description:
      "Approchez les sciences avec une méthode simple : hypothèses, observations et compréhension des concepts clés.",
    image: "/cours/science.png",
    instructeur: "Dr Ndiaga",
    contenu: [
      "Comprendre la démarche scientifique (observer, proposer, tester).",
      "Notions clés : cellule, énergie et reproduction des êtres vivants.",
      "Écosystèmes : interactions entre êtres vivants et milieu.",
      "Cycles et phénomènes naturels.",
      "Mini-quiz et exercices pour s’entraîner."
    ],
    quiz: [
      {
        question: "Quelle est la cellule ?",
        options: ["Une unité du vivant", "Une forme de nuage", "Un instrument de mesure", "Un type de sol"],
        reponse: "Une unité du vivant",
      },
      {
        question: "La photosynthèse permet aux plantes de :",
        options: ["fabriquer du glucose grâce à la lumière", "produire de la rouille", "transformer l’eau en neige", "arrêter toute respiration"],
        reponse: "fabriquer du glucose grâce à la lumière",
      },
      {
        question: "Dans un écosystème, on distingue :",
        options: ["uniquement les animaux", "uniquement les plantes", "les facteurs vivants et non vivants", "seulement la météo"],
        reponse: "les facteurs vivants et non vivants",
      },
      {
        question: "L’ADN contient :",
        options: ["des informations génétiques", "de la vitesse", "des sons", "uniquement de l’air"],
        reponse: "des informations génétiques",
      },
      {
        question: "La respiration cellulaire sert principalement à :",
        options: ["libérer de l’énergie (ATP) à partir du glucose", "transformer le ciel en eau", "changer la couleur des étoiles", "créer des montagnes"],
        reponse: "libérer de l’énergie (ATP) à partir du glucose",
      },
      {
        question: "Le cycle de l’eau correspond à :",
        options: ["l’évaporation, la condensation et la pluie", "un seul type de sol", "une forme de roche", "un mouvement uniquement dans l’air"],
        reponse: "l’évaporation, la condensation et la pluie",
      },
    ],
  },
];

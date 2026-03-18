export interface Quiz {
  question: string;
  options: string[];
  reponse: number;
}

export interface Section {
  titre: string;
  contenu: string;
}

export interface Commentaire {
  auteur: string;
  avatar: string;
  note: number;
  texte: string;
}

export interface Cours {
  id: number;
  titre: string;
  description: string;
  categorie: string;
  image: string;
  images: string[];
  youtubeUrl: string;
  progression: number;
  contenu: string;
  sections: Section[];
  quiz: Quiz[];
  duree: string;
  instructeur: string;
  commentaires: Commentaire[];
}

export const listeCours: Cours[] = [
  {
    id: 1,
    titre: "Introduction à React",
    description: "Apprenez les bases de React avec des exemples pratiques et concrets.",
    categorie: "Développement Web",
    image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
    images: [
      "https://placehold.co/600x340/61DAFB/000000?text=Introduction+React",
      "https://placehold.co/600x340/20232A/61DAFB?text=Composants+%26+Props",
      "https://placehold.co/600x340/087EA4/ffffff?text=Hooks+%26+State",
    ],
    youtubeUrl: "https://www.youtube.com/watch?v=Ke90Tje7VS0",
    progression: 60,
    duree: "8h",
    instructeur: "Abdou Wahab",
    contenu: "Ce cours couvre les composants, les hooks, et le state management avec React.",
    commentaires: [
      { auteur: "Moussa Diallo", avatar: "MD", note: 5, texte: "Cours exceptionnel ! Abdou Wahab explique chaque concept avec une clarté remarquable. J'ai enfin compris les hooks après des semaines de confusion." },
      { auteur: "Fatou Ndiaye", avatar: "FN", note: 5, texte: "Le meilleur cours React que j'ai suivi. Les exemples pratiques sont très bien choisis et le rythme est parfait pour les débutants." },
      { auteur: "Ibrahima Sow", avatar: "IS", note: 4, texte: "Très bon contenu, bien structuré. J'ai pu créer ma première application React en moins d'une semaine grâce à ce cours." },
    ],
    sections: [
      {
        titre: "1. Qu'est-ce que React ?",
        contenu: "React est une bibliothèque JavaScript développée par Meta pour construire des interfaces utilisateur. Elle repose sur le concept de composants réutilisables. Chaque composant est une fonction ou une classe qui retourne du JSX — une syntaxe proche du HTML mais écrite en JavaScript. React utilise un DOM virtuel pour optimiser les mises à jour de l'interface, ce qui le rend très performant."
      },
      {
        titre: "2. Les Composants",
        contenu: "Un composant React est une fonction JavaScript qui retourne du JSX. Exemple :\n\nfunction Bonjour({ nom }) {\n  return <h1>Bonjour, {nom} !</h1>;\n}\n\nLes composants peuvent recevoir des données via les props et gérer leur propre état avec useState. On distingue les composants fonctionnels (recommandés) des composants de classe (ancienne syntaxe)."
      },
      {
        titre: "3. Les Hooks essentiels",
        contenu: "Les hooks permettent d'utiliser l'état et d'autres fonctionnalités React dans les composants fonctionnels.\n\n• useState : gère un état local. Ex: const [count, setCount] = useState(0);\n• useEffect : exécute du code après le rendu (appels API, abonnements). Ex: useEffect(() => { fetchData(); }, []);\n• useContext : accède à un contexte global sans prop drilling.\n• useRef : référence un élément DOM ou une valeur persistante sans re-rendu."
      },
      {
        titre: "4. Le State Management",
        contenu: "Pour les applications complexes, on utilise des solutions de state management comme Redux, Zustand ou le Context API natif de React. Le Context API permet de partager des données entre composants sans passer les props manuellement à chaque niveau. Pour des besoins plus avancés, Redux Toolkit offre une gestion centralisée et prévisible de l'état global."
      }
    ],
    quiz: [
      {
        question: "Quel hook React permet de gérer un état local dans un composant fonctionnel ?",
        options: ["useEffect", "useState", "useContext", "useRef"],
        reponse: 1
      },
      {
        question: "Que signifie JSX ?",
        options: ["JavaScript XML", "Java Syntax Extension", "JSON XML", "JavaScript Extra"],
        reponse: 0
      },
      {
        question: "Quel hook s'exécute après chaque rendu du composant ?",
        options: ["useState", "useRef", "useEffect", "useMemo"],
        reponse: 2
      },
      {
        question: "Comment passe-t-on des données d'un composant parent à un enfant ?",
        options: ["Via le state", "Via les props", "Via useContext uniquement", "Via localStorage"],
        reponse: 1
      }
    ]
  },
  {
    id: 2,
    titre: "TypeScript pour débutants",
    description: "Maîtrisez TypeScript et améliorez la qualité de votre code JavaScript.",
    categorie: "Programmation",
    image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
    images: [
      "https://placehold.co/600x340/3178C6/ffffff?text=Introduction+TypeScript",
      "https://placehold.co/600x340/235A97/ffffff?text=Types+%26+Interfaces",
      "https://placehold.co/600x340/1a3f6f/ffffff?text=G%C3%A9n%C3%A9riques",
    ],
    youtubeUrl: "https://www.youtube.com/watch?v=BwuLxPH8IDs",
    progression: 30,
    duree: "6h",
    instructeur: "Almami",
    contenu: "Types, interfaces, génériques et intégration avec React.",
    commentaires: [
      { auteur: "Aissatou Barry", avatar: "AB", note: 5, texte: "Almami est un excellent pédagogue. Ce cours m'a permis de passer de JavaScript à TypeScript sans douleur. Chaque notion est bien expliquée avec des exemples concrets." },
      { auteur: "Cheikh Tall", avatar: "CT", note: 5, texte: "Enfin un cours TypeScript en français de qualité ! Les exercices pratiques sont très utiles et les explications sur les génériques sont claires." },
      { auteur: "Mariama Bah", avatar: "MB", note: 4, texte: "Très bon cours, j'ai beaucoup appris sur les interfaces et les types. Je recommande à tous ceux qui veulent améliorer leur code JavaScript." },
    ],
    sections: [
      {
        titre: "1. Pourquoi TypeScript ?",
        contenu: "TypeScript est un sur-ensemble de JavaScript qui ajoute le typage statique. Il permet de détecter les erreurs à la compilation plutôt qu'à l'exécution. Développé par Microsoft, il est aujourd'hui adopté par la majorité des grandes équipes de développement. TypeScript se compile en JavaScript standard, compatible avec tous les navigateurs."
      },
      {
        titre: "2. Les Types de base",
        contenu: "TypeScript propose plusieurs types primitifs :\n\n• string : chaîne de caractères. Ex: let nom: string = 'Almami';\n• number : nombre entier ou décimal. Ex: let age: number = 25;\n• boolean : vrai ou faux. Ex: let actif: boolean = true;\n• any : désactive le typage (à éviter).\n• unknown : type inconnu mais sûr.\n• void : pour les fonctions sans retour.\n• never : pour les fonctions qui ne retournent jamais (erreurs, boucles infinies)."
      },
      {
        titre: "3. Interfaces et Types",
        contenu: "Les interfaces définissent la forme d'un objet :\n\ninterface Utilisateur {\n  id: number;\n  nom: string;\n  email: string;\n  actif?: boolean; // optionnel\n}\n\nLes types (type aliases) sont similaires mais plus flexibles :\n\ntype Statut = 'actif' | 'inactif' | 'suspendu';\n\nEn général, on préfère les interfaces pour les objets et les types pour les unions/intersections."
      },
      {
        titre: "4. Génériques",
        contenu: "Les génériques permettent d'écrire du code réutilisable avec différents types :\n\nfunction identite<T>(valeur: T): T {\n  return valeur;\n}\n\nidentite<string>('bonjour'); // retourne string\nidentite<number>(42); // retourne number\n\nTrès utilisés avec les tableaux, les promesses et les composants React : React.FC<Props>."
      }
    ],
    quiz: [
      {
        question: "Quel est le type TypeScript pour une valeur qui peut être n'importe quoi mais de façon sécurisée ?",
        options: ["any", "void", "unknown", "never"],
        reponse: 2
      },
      {
        question: "Comment déclare-t-on une propriété optionnelle dans une interface TypeScript ?",
        options: ["prop: optional string", "prop?: string", "prop: string | null", "optional prop: string"],
        reponse: 1
      },
      {
        question: "TypeScript est développé par :",
        options: ["Google", "Facebook", "Microsoft", "Amazon"],
        reponse: 2
      },
      {
        question: "Que retourne une fonction avec le type de retour 'void' ?",
        options: ["null", "undefined", "0", "Rien, elle ne retourne pas"],
        reponse: 3
      }
    ]
  },
  {
    id: 3,
    titre: "Tailwind CSS",
    description: "Créez des interfaces modernes et responsives rapidement avec Tailwind.",
    categorie: "Design",
    image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg",
    images: [
      "https://placehold.co/600x340/06B6D4/ffffff?text=Introduction+Tailwind",
      "https://placehold.co/600x340/0891B2/ffffff?text=Utility+Classes",
      "https://placehold.co/600x340/0E7490/ffffff?text=Responsive+Design",
    ],
    youtubeUrl: "https://www.youtube.com/watch?v=dFgzHOX84xQ",
    progression: 80,
    duree: "4h",
    instructeur: "Diarra Dabo",
    contenu: "Utility classes, responsive design, dark mode et personnalisation.",
    commentaires: [
      { auteur: "Oumar Kouyaté", avatar: "OK", note: 5, texte: "Diarra Dabo rend Tailwind tellement accessible ! Avant ce cours je passais des heures sur le CSS, maintenant je crée des interfaces en quelques minutes." },
      { auteur: "Kadiatou Camara", avatar: "KC", note: 5, texte: "Cours très pratique et bien rythmé. La partie sur le responsive design est particulièrement bien expliquée. Merci Diarra !" },
      { auteur: "Seydou Koné", avatar: "SK", note: 5, texte: "Excellent ! J'ai refait tout le design de mon projet avec Tailwind après ce cours. Le résultat est bluffant et le code est beaucoup plus propre." },
    ],
    sections: [
      {
        titre: "1. Introduction à Tailwind CSS",
        contenu: "Tailwind CSS est un framework CSS utilitaire. Contrairement à Bootstrap qui fournit des composants pré-stylés, Tailwind fournit des classes utilitaires de bas niveau que vous combinez pour créer vos designs. Exemple : au lieu d'écrire du CSS personnalisé, vous écrivez directement dans le HTML : <div class='flex items-center justify-between p-4 bg-white shadow-md rounded-xl'>."
      },
      {
        titre: "2. Les classes utilitaires essentielles",
        contenu: "Tailwind couvre tous les aspects du CSS :\n\n• Flexbox : flex, flex-col, items-center, justify-between, gap-4\n• Grid : grid, grid-cols-3, col-span-2\n• Espacement : p-4 (padding), m-2 (margin), px-6 (padding horizontal)\n• Typographie : text-xl, font-bold, text-gray-600, leading-relaxed\n• Couleurs : bg-blue-500, text-white, border-orange-300\n• Bordures : rounded-xl, border, border-gray-200\n• Ombres : shadow-sm, shadow-lg"
      },
      {
        titre: "3. Responsive Design",
        contenu: "Tailwind utilise des préfixes pour le responsive :\n\n• sm: (640px+)\n• md: (768px+)\n• lg: (1024px+)\n• xl: (1280px+)\n\nExemple : <div class='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>\n\nCela crée une grille à 1 colonne sur mobile, 2 sur tablette, 3 sur desktop. Pas besoin de media queries manuelles !"
      },
      {
        titre: "4. Dark Mode et personnalisation",
        contenu: "Tailwind supporte le dark mode avec le préfixe dark: :\n\n<div class='bg-white dark:bg-gray-900 text-black dark:text-white'>\n\nPour personnaliser Tailwind, on modifie tailwind.config.js :\n\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: {\n        primaire: '#FF6B35',\n      },\n      fontFamily: {\n        sans: ['Inter', 'sans-serif'],\n      }\n    }\n  }\n}"
      }
    ],
    quiz: [
      {
        question: "Quelle classe Tailwind permet de centrer les éléments horizontalement dans un flex container ?",
        options: ["items-center", "justify-center", "text-center", "align-center"],
        reponse: 1
      },
      {
        question: "Quel préfixe Tailwind cible les écrans de 768px et plus ?",
        options: ["sm:", "md:", "lg:", "xl:"],
        reponse: 1
      },
      {
        question: "Comment ajouter un padding de 4 unités sur tous les côtés en Tailwind ?",
        options: ["padding-4", "p-4", "pad-4", "all-p-4"],
        reponse: 1
      },
      {
        question: "Quel fichier configure les thèmes personnalisés dans Tailwind ?",
        options: ["tailwind.css", "theme.config.js", "tailwind.config.js", "style.config.ts"],
        reponse: 2
      }
    ]
  },
  {
    id: 4,
    titre: "Node.js & Express",
    description: "Construisez des APIs REST robustes avec Node.js et Express.",
    categorie: "Backend",
    image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
    images: [
      "https://placehold.co/600x340/339933/ffffff?text=Introduction+Node.js",
      "https://placehold.co/600x340/2d7a2d/ffffff?text=Express+%26+Routing",
      "https://placehold.co/600x340/1a4d1a/ffffff?text=JWT+Auth",
    ],
    youtubeUrl: "https://www.youtube.com/watch?v=Oe421EPjeBE",
    progression: 10,
    duree: "10h",
    instructeur: "Saliou Gueye",
    contenu: "Routing, middleware, authentification et connexion à une base de données.",
    commentaires: [
      { auteur: "Lamine Traoré", avatar: "LT", note: 5, texte: "Ce cours m'a ouvert les portes du développement backend. Saliou explique Node.js et Express de façon très progressive. Les exemples d'API sont directement réutilisables." },
      { auteur: "Aminata Diallo", avatar: "AD", note: 4, texte: "Très complet ! La partie sur l'authentification JWT est particulièrement bien détaillée. J'ai pu sécuriser mon API en suivant exactement les étapes du cours." },
      { auteur: "Boubacar Sidibé", avatar: "BS", note: 5, texte: "Saliou Gueye est un vrai expert. Le cours est dense mais chaque heure vaut la peine. Je me sens maintenant capable de construire une API complète." },
    ],
    sections: [
      {
        titre: "1. Introduction à Node.js",
        contenu: "Node.js est un environnement d'exécution JavaScript côté serveur basé sur le moteur V8 de Chrome. Il permet d'écrire du code serveur en JavaScript. Node.js est non-bloquant et orienté événements, ce qui le rend très efficace pour les applications I/O intensives comme les APIs, les chats en temps réel, ou les services de streaming."
      },
      {
        titre: "2. Express.js et le Routing",
        contenu: "Express est le framework web le plus populaire pour Node.js. Il simplifie la création de serveurs HTTP :\n\nconst express = require('express');\nconst app = express();\n\napp.get('/api/cours', (req, res) => {\n  res.json({ cours: [] });\n});\n\napp.post('/api/cours', (req, res) => {\n  const nouveau = req.body;\n  res.status(201).json(nouveau);\n});\n\napp.listen(3000, () => console.log('Serveur démarré'));"
      },
      {
        titre: "3. Middleware",
        contenu: "Les middlewares sont des fonctions qui s'exécutent entre la requête et la réponse. Exemples courants :\n\n• express.json() : parse le body JSON\n• cors() : gère les requêtes cross-origin\n• morgan : logging des requêtes\n• helmet : sécurité HTTP\n• Middleware personnalisé :\n\nfunction verifierToken(req, res, next) {\n  const token = req.headers.authorization;\n  if (!token) return res.status(401).json({ erreur: 'Non autorisé' });\n  next();\n}"
      },
      {
        titre: "4. Authentification JWT",
        contenu: "JWT (JSON Web Token) est le standard pour l'authentification stateless :\n\n1. L'utilisateur se connecte avec email/mot de passe\n2. Le serveur vérifie et génère un token JWT signé\n3. Le client stocke le token (localStorage ou cookie)\n4. Chaque requête protégée envoie le token dans le header Authorization\n\nconst jwt = require('jsonwebtoken');\nconst token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });"
      }
    ],
    quiz: [
      {
        question: "Sur quel moteur JavaScript est basé Node.js ?",
        options: ["SpiderMonkey", "JavaScriptCore", "V8", "Chakra"],
        reponse: 2
      },
      {
        question: "Quelle méthode Express gère les requêtes HTTP GET ?",
        options: ["app.post()", "app.get()", "app.fetch()", "app.request()"],
        reponse: 1
      },
      {
        question: "Que signifie JWT ?",
        options: ["Java Web Token", "JSON Web Token", "JavaScript Web Transfer", "JSON Web Transfer"],
        reponse: 1
      },
      {
        question: "Quel middleware Express permet de parser le body en JSON ?",
        options: ["express.text()", "express.urlencoded()", "express.json()", "express.parse()"],
        reponse: 2
      }
    ]
  },
  {
    id: 5,
    titre: "Python pour la Data Science",
    description: "Analysez et visualisez des données avec Python, Pandas et Matplotlib.",
    categorie: "Data Science",
    image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
    images: [
      "https://placehold.co/600x340/3776AB/ffffff?text=Python+Data+Science",
      "https://placehold.co/600x340/2b5f8a/ffffff?text=Pandas+%26+NumPy",
      "https://placehold.co/600x340/1a3d5c/ffffff?text=Matplotlib+%26+ML",
    ],
    youtubeUrl: "https://www.youtube.com/watch?v=LHBE6Q9XlzI",
    progression: 0,
    duree: "12h",
    instructeur: "Abdou Wahab",
    contenu: "NumPy, Pandas, Matplotlib, analyse exploratoire et machine learning de base.",
    commentaires: [
      { auteur: "Rokhaya Faye", avatar: "RF", note: 5, texte: "Abdou Wahab rend la data science accessible à tous. Ce cours est une vraie mine d'or. Les exercices avec Pandas sont très bien conçus et les visualisations sont magnifiques." },
      { auteur: "Mamadou Balde", avatar: "MB", note: 5, texte: "Cours incroyable ! J'ai commencé sans aucune connaissance en data science et maintenant je suis capable d'analyser des datasets réels. Merci infiniment !" },
      { auteur: "Ndeye Sarr", avatar: "NS", note: 4, texte: "Très bon cours, bien structuré. La progression est idéale, on monte en compétence progressivement. La partie machine learning est une excellente introduction." },
    ],
    sections: [
      {
        titre: "1. Python et l'écosystème Data Science",
        contenu: "Python est le langage de référence pour la data science grâce à son écosystème riche. Les bibliothèques essentielles sont :\n\n• NumPy : calcul numérique et tableaux multidimensionnels\n• Pandas : manipulation et analyse de données tabulaires\n• Matplotlib / Seaborn : visualisation de données\n• Scikit-learn : machine learning\n• Jupyter Notebook : environnement interactif pour l'exploration\n\nInstallation : pip install numpy pandas matplotlib scikit-learn jupyter"
      },
      {
        titre: "2. Pandas - Manipulation de données",
        contenu: "Pandas est la bibliothèque centrale pour manipuler des données :\n\nimport pandas as pd\n\n# Charger un fichier CSV\ndf = pd.read_csv('etudiants.csv')\n\n# Aperçu des données\ndf.head()        # 5 premières lignes\ndf.info()        # types et valeurs manquantes\ndf.describe()    # statistiques descriptives\n\n# Filtrer\ndf[df['note'] > 15]  # étudiants avec note > 15\n\n# Grouper\ndf.groupby('classe')['note'].mean()"
      },
      {
        titre: "3. Visualisation avec Matplotlib",
        contenu: "Matplotlib permet de créer des graphiques professionnels :\n\nimport matplotlib.pyplot as plt\n\n# Graphique en barres\nplt.bar(['Maths', 'Physique', 'Info'], [14.5, 12.3, 17.8])\nplt.title('Moyennes par matière')\nplt.ylabel('Note /20')\nplt.show()\n\n# Histogramme\nplt.hist(df['note'], bins=10, color='steelblue')\n\n# Nuage de points\nplt.scatter(df['heures_etude'], df['note'])\nplt.xlabel('Heures d\\'étude')\nplt.ylabel('Note')"
      },
      {
        titre: "4. Introduction au Machine Learning",
        contenu: "Scikit-learn simplifie l'application des algorithmes ML :\n\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.linear_model import LinearRegression\nfrom sklearn.metrics import mean_squared_error\n\n# Préparer les données\nX = df[['heures_etude', 'absences']]\ny = df['note']\n\n# Diviser en train/test\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)\n\n# Entraîner le modèle\nmodele = LinearRegression()\nmodele.fit(X_train, y_train)\n\n# Évaluer\npredictions = modele.predict(X_test)\nprint(mean_squared_error(y_test, predictions))"
      }
    ],
    quiz: [
      {
        question: "Quelle bibliothèque Python est utilisée pour la manipulation de données tabulaires ?",
        options: ["NumPy", "Matplotlib", "Pandas", "Scikit-learn"],
        reponse: 2
      },
      {
        question: "Quelle méthode Pandas affiche les 5 premières lignes d'un DataFrame ?",
        options: ["df.first()", "df.top()", "df.head()", "df.show()"],
        reponse: 2
      },
      {
        question: "Quelle bibliothèque est utilisée pour le machine learning en Python ?",
        options: ["TensorFlow uniquement", "Scikit-learn", "Pandas", "Matplotlib"],
        reponse: 1
      },
      {
        question: "Comment installer Pandas via pip ?",
        options: ["pip install panda", "pip install pandas", "pip get pandas", "install pandas"],
        reponse: 1
      }
    ]
  },
  {
    id: 6,
    titre: "Git & GitHub - Collaboration",
    description: "Maîtrisez le versioning et la collaboration en équipe avec Git et GitHub.",
    categorie: "Outils Dev",
    image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
    images: [
      "https://placehold.co/600x340/F05032/ffffff?text=Introduction+Git",
      "https://placehold.co/600x340/c73e1d/ffffff?text=Branches+%26+Merge",
      "https://placehold.co/600x340/24292E/ffffff?text=Pull+Requests+GitHub",
    ],
    youtubeUrl: "https://www.youtube.com/watch?v=RGOj5yH7evk",
    progression: 45,
    duree: "5h",
    instructeur: "Diarra Dabo",
    contenu: "Commandes Git essentielles, branches, pull requests et workflows d'équipe.",
    commentaires: [
      { auteur: "Thierno Diallo", avatar: "TD", note: 5, texte: "Ce cours a complètement changé ma façon de travailler. Diarra explique Git de façon très claire et pratique. La partie sur les Pull Requests est particulièrement utile pour le travail en équipe." },
      { auteur: "Coumba Mbaye", avatar: "CM", note: 5, texte: "Enfin je comprends Git ! J'avais peur des conflits de merge mais après ce cours tout est clair. Diarra Dabo est une excellente formatrice." },
      { auteur: "Alioune Badara", avatar: "AB", note: 5, texte: "Cours essentiel pour tout développeur. Le workflow GitHub est expliqué étape par étape. Je l'ai recommandé à toute mon équipe et tout le monde est ravi." },
    ],
    sections: [
      {
        titre: "1. Les bases de Git",
        contenu: "Git est un système de contrôle de version distribué créé par Linus Torvalds. Il permet de suivre l'historique des modifications, de collaborer et de revenir en arrière en cas d'erreur.\n\nCommandes de base :\n\ngit init                    # initialiser un dépôt\ngit add .                   # ajouter tous les fichiers\ngit commit -m 'message'     # sauvegarder les changements\ngit status                  # voir l'état du dépôt\ngit log --oneline           # historique des commits"
      },
      {
        titre: "2. Les Branches",
        contenu: "Les branches permettent de travailler sur des fonctionnalités en parallèle sans affecter le code principal :\n\ngit branch                  # lister les branches\ngit branch feature/login    # créer une branche\ngit checkout feature/login  # basculer sur la branche\ngit checkout -b feature/login  # créer et basculer\n\ngit merge feature/login     # fusionner dans main\ngit branch -d feature/login # supprimer la branche\n\nBonne pratique : une branche par fonctionnalité ou correction de bug."
      },
      {
        titre: "3. GitHub et les Pull Requests",
        contenu: "GitHub est une plateforme d'hébergement de dépôts Git. Le workflow typique en équipe :\n\n1. Fork ou clone du dépôt\n2. Créer une branche : git checkout -b feature/ma-fonctionnalite\n3. Développer et committer\n4. Pousser : git push origin feature/ma-fonctionnalite\n5. Ouvrir une Pull Request sur GitHub\n6. Code review par les collègues\n7. Merge dans main après approbation\n\nLes PR permettent la revue de code et maintiennent la qualité du projet."
      },
      {
        titre: "4. Résolution de conflits",
        contenu: "Les conflits surviennent quand deux branches modifient la même ligne. Git les marque ainsi :\n\n<<<<<<< HEAD\nconst message = 'Bonjour';\n=======\nconst message = 'Salut';\n>>>>>>> feature/salutation\n\nPour résoudre :\n1. Ouvrir le fichier en conflit\n2. Choisir la bonne version (ou combiner)\n3. Supprimer les marqueurs Git\n4. git add . puis git commit\n\nOutils visuels : VS Code, GitKraken, ou git mergetool facilitent la résolution."
      }
    ],
    quiz: [
      {
        question: "Quelle commande Git permet de créer et basculer sur une nouvelle branche en une seule commande ?",
        options: ["git branch -new", "git checkout -b", "git switch --create", "git branch --switch"],
        reponse: 1
      },
      {
        question: "Que fait la commande 'git add .' ?",
        options: ["Crée un nouveau commit", "Ajoute tous les fichiers modifiés à la zone de staging", "Pousse les changements sur GitHub", "Fusionne les branches"],
        reponse: 1
      },
      {
        question: "Qu'est-ce qu'une Pull Request sur GitHub ?",
        options: ["Une commande pour récupérer du code", "Une demande de fusion de branche avec revue de code", "Un type de commit spécial", "Une sauvegarde automatique"],
        reponse: 1
      },
      {
        question: "Qui a créé Git ?",
        options: ["Bill Gates", "Mark Zuckerberg", "Linus Torvalds", "Guido van Rossum"],
        reponse: 2
      }
    ]
  },
];

export function getCours(id: number): Cours | undefined {
  return listeCours.find((c) => c.id === id);
}

export function getCategories(): string[] {
  return ["Toutes", ...Array.from(new Set(listeCours.map((c) => c.categorie)))];
}

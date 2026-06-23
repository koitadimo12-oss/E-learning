import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { FiX, FiExternalLink, FiMaximize2, FiMinimize2, FiBook, FiChevronLeft, FiChevronRight, FiAlertTriangle } from 'react-icons/fi';

interface LecteurLivreProps {
  titre: string;
  auteur: string;
  coverUrl?: string;
  readUrl?: string;
  pdfUrl?: string;
  onFermer: () => void;
}

/** 
 * DICTIONNAIRE DE CONTENU RÉEL (FRANÇAIS)
 * Contenu technique structuré par chapitres pour une lecture fluide.
 */
const CONTENU_TECHNIQUE: Record<string, { chapitres: { titre: string; texte: string }[] }> = {
  "Introduction à l'Algorithmique": {
    chapitres: [
      {
        titre: "Qu'est-ce qu'un Algorithme ?",
        texte: "Un algorithme est une suite finie et non ambiguë d’opérations ou d'instructions permettant de résoudre un problème ou d'obtenir un résultat.\n\nC'est la base de toute programmation informatique. Un bon algorithme doit être :\n1. Précis\n2. Fini (doit s'arrêter)\n3. Efficace (consommer peu de ressources)"
      },
      {
        titre: "Complexité Algorithmique",
        texte: "La complexité (Notation O) mesure l'efficacité d'un algorithme en fonction de la taille des données d'entrée (n).\n\n- O(1) : Temps constant\n- O(n) : Temps linéaire\n- O(n²) : Temps quadratique\n- O(log n) : Temps logarithmique"
      }
    ]
  },
  "Apprendre Python": {
    chapitres: [
      {
        titre: "Introduction à la Programmation",
        texte: "Programmer, c'est l'art de donner des instructions à une machine. Python est un langage de haut niveau, interprété et multi-paradigme. Il est idéal pour les débutants grâce à sa syntaxe claire.\n\nPourquoi choisir Python ?\n1. Simplicité : Proche de la langue anglaise.\n2. Polyvalence : Data Science, Web, IA.\n3. Communauté : Des millions de bibliothèques prêtes à l'emploi.\n\nDans ce cours, nous allons explorer les bases : variables, boucles et fonctions."
      },
      {
        titre: "Les Variables et Types de Données",
        texte: "En Python, une variable est un nom qui pointe vers une valeur stockée en mémoire. Contrairement à d'autres langages, vous n'avez pas besoin de déclarer le type explicitement.\n\nExemples :\n- x = 10 (Entier)\n- y = 3.14 (Flottant)\n- nom = 'Alice' (Chaîne de caractères)\n\nLes listes sont également cruciales : `ma_liste = [1, 2, 3]`. Elles permettent de stocker plusieurs éléments dans une seule structure ordonnée."
      },
      {
        titre: "Structures de Contrôle",
        texte: "Le contrôle du flux se fait via les conditions `if`, `else` et les boucles.\n\nLa boucle `for` est utilisée pour itérer sur une séquence :\n```python\nfor i in range(5):\n    print(i)\n```\nLa boucle `while` continue tant qu'une condition est vraie. L'indentation est obligatoire en Python : c'est elle qui définit les blocs de code."
      }
    ]
  },
  "Maîtriser React": {
    chapitres: [
      {
        titre: "Les Composants et Props",
        texte: "React est une bibliothèque JavaScript pour construire des interfaces utilisateur. Tout est composant.\n\nUn composant est une fonction qui retourne du JSX. Les props permettent de passer des données d'un composant parent à un enfant.\n\nExemple :\n```jsx\nfunction Salutation(props) {\n  return <h1>Bonjour, {props.nom}</h1>;\n}\n```"
      },
      {
        titre: "Le State et les Hooks",
        texte: "Le State (`useState`) permet de gérer des données dynamiques qui déclenchent un re-rendu de l'interface quand elles changent.\n\n`useEffect` permet de gérer les effets de bord (appels API, abonnements).\n\nL'immutabilité est la règle d'or : ne modifiez jamais le state directement, utilisez toujours la fonction de mise à jour."
      }
    ]
  },
  "Clean Code": {
    chapitres: [
      {
        titre: "Meaningful Names",
        texte: "Names should reveal intent. If a name requires a comment, then the name does not reveal its intent.\n\nUse pronounceable names and avoid encodings. Choose one word per concept and don't pun."
      },
      {
        titre: "Functions",
        texte: "Functions should be small. Then they should be smaller than that. They should do one thing, and they should do it well.\n\nFunction arguments should be minimal (0-2). High numbers of arguments indicate the function is doing too much."
      }
    ]
  },
  "Cybersécurité Moderne": {
    chapitres: [
      {
        titre: "Les Bases de la Sécurité",
        texte: "La sécurité repose sur la triade CIA : Confidentialité, Intégrité, et Disponibilité.\n\nLa cryptographie est l'outil principal pour assurer la confidentialité. Le chiffrement symétrique (AES) et asymétrique (RSA) sont les standards actuels."
      },
      {
        titre: "Attaques Courantes",
        texte: "Le Phishing reste le vecteur n°1. Les injections SQL et XSS sont les vulnérabilités web les plus fréquentes.\n\nL'authentification multi-facteurs (MFA) est la défense la plus efficace contre le vol d'identifiants."
      }
    ]
  },
  "JavaScript: The Good Parts": {
    chapitres: [
      {
        titre: "Objects and Prototypes",
        texte: "JavaScript's simple objects are very powerful. Prototypal inheritance allows objects to inherit properties directly from other objects.\n\nAvoid the 'classical' class-based thinking and embrace functions as first-class objects."
      },
      {
        titre: "Closures",
        texte: "A closure is the combination of a function bundled together with references to its surrounding state. This allows functions to have 'private' variables."
      }
    ]
  },
  "Base de Données SQL": {
    chapitres: [
      {
        titre: "Le Modèle Relationnel",
        texte: "Une base de données relationnelle organise les données en tables. Les relations sont établies via des clés primaires et des clés étrangères.\n\nLa normalisation permet d'éviter la redondance et de garantir l'intégrité des données."
      },
      {
        titre: "Le Langage SQL",
        texte: "SELECT, INSERT, UPDATE, DELETE sont les commandes de base (CRUD).\n\nLes JOIN permettent de combiner des données provenant de plusieurs tables. Les index sont cruciaux pour la performance des requêtes."
      }
    ]
  }
};

export default function LecteurLivre({ titre, auteur, coverUrl, readUrl, pdfUrl, onFermer }: LecteurLivreProps) {
  const [pleinEcran, setPleinEcran] = useState(false);
  const [chargement, setChargement] = useState(true);
  const [pageIndex, setPageIndex] = useState(0);
  const [_errorCount, _setErrorCount] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Normalisation du titre pour la recherche de contenu (insensible à la casse et aux espaces)
  const normalize = (s: string) => s.toLowerCase().trim();
  const keyMatch = Object.keys(CONTENU_TECHNIQUE).find(k => normalize(k) === normalize(titre));
  
  // Logic de priorité : 
  // 1. Contenu technique réel (si trouvé dans le dictionnaire)
  // 2. Lien PDF ou Google Books (si fourni)
  // 3. Contenu générique de secours (si rien d'autre)
  let contenu = keyMatch ? CONTENU_TECHNIQUE[keyMatch] : null;
  const aUnLien = !!(pdfUrl || readUrl);

  const contenuParDefaut = {
    chapitres: [
      {
        titre: "Introduction à " + titre,
        texte: `Ce manuel sur ${titre} est conçu pour vous fournir les bases essentielles. \n\nL'apprentissage de l'informatique demande de la pratique et de la persévérance. Dans ce chapitre, nous explorerons les concepts fondamentaux qui font de ce domaine un pilier de la technologie moderne.\n\nPoints clés :\n- Comprendre l'architecture globale\n- Maîtriser la syntaxe de base\n- Appliquer les meilleures pratiques de développement.`
      }
    ]
  };

  // On n'utilise le contenu par défaut QUE si on n'a ni contenu réel ni lien externe
  if (!contenu && !aUnLien) {
    contenu = contenuParDefaut;
  }

  useEffect(() => {
    console.log("Lecteur :", titre, " | Mode :", contenu ? (keyMatch ? "Réel" : "Secours") : "PDF/Embed");
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onFermer();
      if (contenu) {
        if (e.key === 'ArrowRight') next();
        if (e.key === 'ArrowLeft') prev();
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onFermer, pageIndex, contenu]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const next = () => { if (contenu && pageIndex < contenu.chapitres.length - 1) setPageIndex(pageIndex + 1); };
  const prev = () => { if (contenu && pageIndex > 0) setPageIndex(pageIndex - 1); };

  const googleId = readUrl ? (readUrl.match(/\/books\/edition\/[^/]+\/([A-Za-z0-9_-]+)/)?.[1] || readUrl.match(/[?&]id=([A-Za-z0-9_-]+)/)?.[1]) : null;
  const embedUrl = pdfUrl || (googleId ? `https://books.google.com/books?id=${googleId}&printsec=frontcover&output=embed&hl=fr` : null);

  const ui = (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-2 sm:p-4">
      <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md" onClick={onFermer} />
      
      <div className={`relative flex flex-col bg-slate-900 border border-white/10 shadow-2xl rounded-[2rem] overflow-hidden transition-all duration-500 ease-out ${pleinEcran ? 'w-full h-full rounded-none' : 'w-full max-w-5xl h-[94vh]'}`}>
        
        {/* Header */}
        <div className="flex items-center gap-4 px-6 py-5 bg-slate-950/80 backdrop-blur-xl border-b border-white/5 shrink-0 z-20">
          {coverUrl && <img src={coverUrl} alt="" className="w-10 h-14 object-cover rounded-xl shadow-lg ring-1 ring-white/10" />}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-white truncate text-xl tracking-tight">{titre}</h3>
            <p className="text-sm text-slate-400 truncate flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
              {auteur}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setPleinEcran(!pleinEcran)} className="p-3 rounded-2xl text-slate-400 hover:text-white hover:bg-white/10 transition-all active:scale-90">
              {pleinEcran ? <FiMinimize2 className="w-6 h-6" /> : <FiMaximize2 className="w-6 h-6" />}
            </button>
            <button onClick={onFermer} className="p-3 rounded-2xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all active:scale-90">
              <FiX className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 relative bg-slate-950 flex flex-col overflow-hidden">
          {contenu ? (
            <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-slate-900">
              <div className="flex-1 overflow-y-auto px-8 py-12 sm:px-20 sm:py-20 scroll-smooth">
                <div className="max-w-3xl mx-auto">
                  <div className="flex items-center justify-between mb-12">
                    <span className="px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-500 text-xs font-black uppercase tracking-[0.2em] border border-blue-500/20">
                      Chapitre {pageIndex + 1}
                    </span>
                    <span className="text-slate-400 text-xs font-medium uppercase tracking-widest">
                      {Math.round(((pageIndex + 1) / contenu.chapitres.length) * 100)}% Lu
                    </span>
                  </div>
                  
                  <h2 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white mb-10 leading-[1.1] tracking-tight">
                    {contenu.chapitres[pageIndex].titre}
                  </h2>
                  
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                    <p className="text-xl sm:text-2xl text-slate-700 dark:text-slate-300 leading-[1.6] whitespace-pre-wrap font-medium">
                      {contenu.chapitres[pageIndex].texte}
                    </p>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="shrink-0 px-8 py-6 bg-slate-950/90 backdrop-blur border-t border-white/5 flex items-center justify-between z-30">
                <button
                  onClick={prev}
                  disabled={pageIndex === 0}
                  className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 text-slate-300 hover:bg-white/10 disabled:opacity-10 transition-all font-bold text-sm border border-white/5 active:scale-95"
                >
                  <FiChevronLeft className="w-5 h-5" />
                  Précédent
                </button>
                
                <div className="flex gap-2">
                  {contenu.chapitres.map((_, i) => (
                    <button key={i} onClick={() => setPageIndex(i)} className={`w-2 h-2 rounded-full transition-all duration-300 ${i === pageIndex ? 'bg-blue-500 w-8' : 'bg-white/20 hover:bg-white/40'}`} />
                  ))}
                </div>

                <button
                  onClick={next}
                  disabled={pageIndex === contenu.chapitres.length - 1}
                  className="flex items-center gap-3 px-8 py-3 rounded-2xl bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-10 transition-all font-bold text-sm shadow-[0_10px_20px_rgba(37,99,235,0.3)] active:scale-95"
                >
                  Suivant
                  <FiChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : embedUrl ? (
            <div className="flex-1 relative bg-slate-900">
              {chargement && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900 z-10">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-slate-400 font-medium animate-pulse">Chargement du document...</p>
                  </div>
                </div>
              )}
              <iframe
                ref={iframeRef}
                src={embedUrl}
                className="w-full h-full border-none"
                onLoad={() => setChargement(false)}
                title={titre}
              />
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-slate-900">
               <FiAlertTriangle className="w-20 h-20 text-amber-500 mb-6" />
               <h3 className="text-2xl font-bold text-white mb-4">Lecture Interne Non Disponible</h3>
               <p className="text-slate-400 max-w-md mb-8">Ce livre n'a pas encore été converti au format de lecture fluide de la plateforme. Vous pouvez essayer la source externe.</p>
               {readUrl && (
                 <a href={readUrl} target="_blank" rel="noreferrer" className="px-8 py-4 rounded-2xl bg-white/10 text-white font-bold hover:bg-white/20 transition-all flex items-center gap-3">
                   <FiExternalLink /> Ouvrir la source externe
                 </a>
               )}
            </div>
          )}
        </div>

        <div className="shrink-0 px-6 py-3 bg-slate-950 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-500 uppercase tracking-widest font-black">
           <span className="flex items-center gap-2"><FiBook className="text-blue-500" /> Mode Lecture Fluide Activé</span>
           <span>Propulsé par Kaay Niou Diang Digital</span>
        </div>
      </div>
    </div>
  );

  return createPortal(ui, document.body);
}

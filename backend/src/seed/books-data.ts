/** Génère la liste complète des livres pour le seed (objectif : 115+) */
const TITRES = [
  'Introduction à l\'Algorithmique', 'Apprendre Python 3', 'Git Pro (Français)', 'Maîtriser React',
  'Bases de Données', 'Cybersécurité Moderne', 'Intelligence Artificielle', 'Deep Learning',
  'Linux : Le système', 'Clean Code', 'Eloquent JavaScript', 'Think Python 2e',
  'OS: Three Easy Pieces', 'The Clean Coder', 'SICP', 'JavaScript: The Good Parts',
  'Réseaux TCP/IP', 'Architecture Cloud', 'Docker & Kubernetes', 'DevOps Pratique',
  'UML et modélisation', 'Tests unitaires', 'Design Patterns', 'Microservices',
  'Blockchain fondamentaux', 'Big Data Hadoop', 'Spark pour l\'analyse', 'NoSQL expliqué',
  'Sécurité OWASP', 'Pentest éthique', 'Forensique numérique', 'RGPD et conformité',
];

const AUTEURS = [
  'Robert C. Martin', 'Eric Matthes', 'Scott Chacon', 'Dan Abramov', 'Ian Goodfellow',
  'Bruce Schneier', 'Stuart Russell', 'Linus Torvalds', 'C. J. Date', 'Thomas H. Cormen',
  'M. Diallo', 'Mme Faye', 'M. Ndiaye', 'Mme Sarr', 'M. Ba',
];

const CATEGORIES = [
  'Développement', 'Cybersécurité', 'IA & Data', 'Réseaux', 'Systèmes',
  'Base de données', 'Mathématiques',
];

/** PDF libres de droits — contenu réel lisible dans le lecteur */
export const PDF_SOURCES = [
  'https://greenteapress.com/thinkpython/thinkpython.pdf',
  'https://eloquentjavascript.net/Eloquent_JavaScript.pdf',
  'https://www.cs.cmu.edu/~dst/ATG/thinkpython/thinkpython.pdf',
  'https://www.openintro.org/stat/textbook/stat/textbook.pdf',
  'https://www.w3.org/WAI/WCAG21/Techniques/pdf/img/table-word.pdf',
  'https://www.africau.edu/images/default/sample.pdf',
  'https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf',
  'https://www.learningcontainer.com/wp-content/uploads/2019/09/sample-pdf-file.pdf',
  'https://unec.edu.az/application/uploads/2014/12/pdf-sample.pdf',
  'https://www.orimi.com/pdf-test.pdf',
];

const COVERS = [
  'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&auto=format&fit=crop',
];

export type LivreSeed = {
  title: string;
  author: string;
  description: string;
  pdfUrl: string;
  category: string;
  coverUrl: string;
};

/** 115 livres uniques pour la bibliothèque */
export function getLivresPourSeed(total = 115): LivreSeed[] {
  const livres: LivreSeed[] = [];

  for (let i = 0; i < total; i++) {
    const theme = TITRES[i % TITRES.length];
    const suffix = i >= TITRES.length ? ` — Vol. ${Math.floor(i / TITRES.length) + 1}` : '';
    livres.push({
      title: `${theme}${suffix}`,
      author: AUTEURS[i % AUTEURS.length],
      description: `Ouvrage de référence sur ${theme.toLowerCase()} : théorie, pratique et exercices.`,
      pdfUrl: PDF_SOURCES[i % PDF_SOURCES.length],
      category: CATEGORIES[i % CATEGORIES.length],
      coverUrl: COVERS[i % COVERS.length],
    });
  }

  return livres;
}

export const livresBase = getLivresPourSeed(10);

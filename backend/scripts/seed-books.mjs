/** Insère les livres de démo si la table book est vide */
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';

const livres = [
  ["Introduction à l'Algorithmique", 'Thomas H. Cormen', 'Fondamentaux des algorithmes.', 'text-mode', 'Mathématiques'],
  ['Apprendre Python 3', 'Eric Matthes', 'Python pour débutants.', 'text-mode', 'Développement'],
  ['Git Pro (Français)', 'Scott Chacon', 'Maîtrisez Git.', 'text-mode', 'Développement'],
  ['Maîtriser React', 'Dan Abramov', 'Composants et hooks React.', 'text-mode', 'Développement'],
  ['Bases de Données', 'C. J. Date', 'SQL et modèle relationnel.', 'text-mode', 'Base de données'],
  ['Cybersécurité Moderne', 'Bruce Schneier', 'Sécurité informatique.', 'text-mode', 'Cybersécurité'],
  ['Intelligence Artificielle', 'Stuart Russell', 'Introduction à l\'IA.', 'text-mode', 'IA & Data'],
  ['Deep Learning', 'Ian Goodfellow', 'Réseaux de neurones.', 'text-mode', 'IA & Data'],
  ['Linux : Le système', 'Linus Torvalds', 'Administration Linux.', 'text-mode', 'Systèmes'],
  ['Clean Code', 'Robert C. Martin', 'Code propre et maintenable.', 'text-mode', 'Développement'],
];

const __dirname = dirname(fileURLToPath(import.meta.url));
const env = Object.fromEntries(
  readFileSync(resolve(__dirname, '../.env'), 'utf8')
    .split(/\r?\n/)
    .filter((l) => l.trim() && !l.startsWith('#'))
    .map((l) => {
      const i = l.indexOf('=');
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    }),
);

const conn = await mysql.createConnection({
  host: env.DB_HOST,
  port: Number(env.DB_PORT),
  user: env.DB_USERNAME,
  password: env.DB_PASSWORD ?? '',
  database: env.DB_DATABASE,
});

const [count] = await conn.query('SELECT COUNT(*) as n FROM book');
if (count[0].n > 0) {
  console.log(`Déjà ${count[0].n} livre(s) en base — rien à faire.`);
} else {
  for (const [title, author, description, pdfUrl, category] of livres) {
    await conn.query(
      'INSERT INTO book (title, author, description, pdfUrl, category) VALUES (?, ?, ?, ?, ?)',
      [title, author, description, pdfUrl, category],
    );
  }
  console.log(`✅ ${livres.length} livres insérés.`);
}

await conn.end();

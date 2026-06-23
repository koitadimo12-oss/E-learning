/** Met à jour les pdfUrl des livres existants (text-mode → vrais PDF) */
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';

const PDF_SOURCES = [
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

const [rows] = await conn.query('SELECT id, pdfUrl FROM book ORDER BY id');
let updated = 0;
for (let i = 0; i < rows.length; i++) {
  const row = rows[i];
  if (row.pdfUrl && row.pdfUrl !== 'text-mode') continue;
  const pdfUrl = PDF_SOURCES[i % PDF_SOURCES.length];
  await conn.query('UPDATE book SET pdfUrl = ? WHERE id = ?', [pdfUrl, row.id]);
  updated++;
}

console.log(`✅ ${updated} livre(s) mis à jour avec de vrais PDF.`);
await conn.end();

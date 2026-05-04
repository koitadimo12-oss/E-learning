import { useState, useEffect } from 'react';
import styles from './Bibliotheque.module.css';
import BarreNavigation from '../composants/BarreNavigation';
import PiedPage from '../composants/PiedPage';
import { useLanguage } from '../elearn/i18n/LanguageContext';

interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  category: string;
  coverUrl?: string;
  pdfUrl?: string;
  readUrl?: string;
}

export default function Bibliotheque({ etudiant, onDeconnexion }: any) {
  const [books, setBooks] = useState<Book[]>([]);
  const [category, setCategory] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const { lang } = useLanguage();

  useEffect(() => {
    fetchBooks(category);
  }, [category]);

  const fetchBooks = async (cat: string) => {
    try {
      const url = cat ? `http://localhost:3001/books?category=${cat}` : 'http://localhost:3001/books';
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setBooks(data);
      }
    } catch (e) {
      console.error('Failed to fetch books', e);
    }
  };

  const categories = ['', 'Informatique', 'Génie civil', 'Développement personnel', 'Business', 'Sciences'];

  const filtered = books.filter(b =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.author.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <BarreNavigation etudiant={etudiant} onDeconnexion={onDeconnexion} />
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>📚 Bibliothèque Intelligente</h1>
            <p className={styles.subtitle}>Explorez notre collection de livres et demandez des recommandations à l'IA.</p>
          </div>

          {/* Layout: Books */}
          <div className="w-full">
            {/* Filters + Search */}
            <div className="flex flex-wrap gap-3 items-center mb-6">
              {categories.map((cat, idx) => (
                <button
                  key={idx}
                  className={`${styles.filterBtn} ${category === cat ? styles.filterBtnActive : ''}`}
                  onClick={() => setCategory(cat)}
                >
                  {cat === '' ? 'Tous' : cat}
                </button>
              ))}
            </div>
            <div className="mb-8">
              <input
                type="text"
                placeholder="🔍 Rechercher un livre ou un auteur..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none transition shadow-sm text-base"
              />
            </div>

            {/* Books Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map(book => (
                <div key={book.id} className={styles.card}>
                  <img
                    src={book.coverUrl || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600'}
                    alt={book.title}
                    className={styles.cover}
                  />
                  <div className={styles.content}>
                    <span className={styles.category}>{book.category}</span>
                    <h3 className={styles.bookTitle}>{book.title}</h3>
                    <p className={styles.author}>Par {book.author}</p>
                    <p className={styles.description}>{book.description}</p>
                    {(book.readUrl || book.pdfUrl) ? (
                      <a href={book.readUrl || book.pdfUrl} target="_blank" rel="noreferrer" className={styles.action}>📖 Lire le livre</a>
                    ) : (
                      <button className={styles.action} disabled style={{ opacity: 0.5 }}>📖 Bientôt disponible</button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="py-20 text-center text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800">
                <p className="text-xl font-medium">Aucun livre trouvé.</p>
                <button onClick={() => { setSearch(''); setCategory(''); }} className="mt-4 text-blue-600 dark:text-blue-400 font-bold hover:underline">
                  Réinitialiser tous les filtres
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <PiedPage />
    </>
  );
}

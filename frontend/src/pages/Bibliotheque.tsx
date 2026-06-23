import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import BarreNavigation from '../composants/BarreNavigation';
import PiedPage from '../composants/PiedPage';
import LecteurPDFPremium from '../composants/LecteurPDFPremium';
import Chatbot from '../composants/Chatbot';
import { FiSearch, FiBookOpen, FiStar, FiFilter, FiLock } from 'react-icons/fi';
import { listerLivres, type Livre } from '../services/livresApi';
import { getAuthToken } from '../services/apiClient';

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

function mapLivreToBook(l: Livre): Book {
  return {
    id: String(l.id),
    title: l.title,
    author: l.author,
    description: l.description,
    category: l.category ?? 'Développement',
    pdfUrl: l.pdfUrl,
    coverUrl: l.coverUrl,
  };
}

const CATEGORIES = ['Tous', 'Développement', 'Cybersécurité', 'IA & Data', 'Réseaux', 'Systèmes', 'Base de données', 'Mathématiques'];

const CATEGORY_COLORS: Record<string, string> = {
  'Développement':  'from-blue-600 to-indigo-600',
  'Cybersécurité':  'from-red-600 to-rose-600',
  'IA & Data':      'from-violet-600 to-purple-600',
  'Réseaux':        'from-cyan-600 to-teal-600',
  'Systèmes':       'from-orange-600 to-amber-600',
  'Base de données':'from-emerald-600 to-green-600',
  'Mathématiques':  'from-pink-600 to-fuchsia-600',
  'default':        'from-slate-600 to-slate-700',
};

const CATEGORY_ICONS: Record<string, string> = {
  'Développement':  '💻',
  'Cybersécurité':  '🔐',
  'IA & Data':      '🤖',
  'Réseaux':        '🌐',
  'Systèmes':       '⚙️',
  'Base de données':'🗄️',
  'Mathématiques':  '📐',
};

export default function Bibliotheque({ etudiant, onDeconnexion }: any) {
  const navigate = useNavigate();
  const connecte = !!etudiant || !!getAuthToken();
  const [books, setBooks] = useState<Book[]>([]);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [livreOuvert, setLivreOuvert] = useState<Book | null>(null);
  const [lectureCtx, setLectureCtx] = useState<{ page: string; contenuPage?: string } | null>(null);
  const [erreur, setErreur] = useState('');
  const [vue, setVue] = useState<'grille' | 'liste'>('grille');

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    listerLivres()
      .then((rows) => setBooks(rows.map(mapLivreToBook)))
      .catch(() => setErreur('Impossible de charger les livres depuis la base de données.'));
  }, []);

  useEffect(() => {
    if (livreOuvert) {
      document.body.style.overflow = 'hidden';
      window.scrollTo(0, 0);
      return () => { document.body.style.overflow = ''; };
    }
  }, [livreOuvert]);

  const ouvrirLivre = (book: Book) => {
    if (!connecte) {
      navigate('/connexion', { state: { redirect: '/bibliotheque' } });
      return;
    }
    setLivreOuvert(book);
    setLectureCtx(null);
  };

  const filtered = useMemo(() =>
    books.filter(b =>
      (category === '' || b.category === category) &&
      (
        b.title.toLowerCase().includes(search.toLowerCase()) ||
        b.author.toLowerCase().includes(search.toLowerCase()) ||
        b.description.toLowerCase().includes(search.toLowerCase())
      )
    ),
    [books, category, search]
  );

  const gradient = category ? (CATEGORY_COLORS[category] ?? CATEGORY_COLORS.default) : CATEGORY_COLORS.default;

  const handleNextBook = () => {
    if (!livreOuvert) return;
    const currentIndex = filtered.findIndex(b => b.id === livreOuvert.id);
    if (currentIndex < filtered.length - 1) {
      setLivreOuvert(filtered[currentIndex + 1]);
    }
  };

  const handlePrevBook = () => {
    if (!livreOuvert) return;
    const currentIndex = filtered.findIndex(b => b.id === livreOuvert.id);
    if (currentIndex > 0) {
      setLivreOuvert(filtered[currentIndex - 1]);
    }
  };

  return (
    <>
      <BarreNavigation etudiant={etudiant} onDeconnexion={onDeconnexion} />

      <div className="knd-page-enter min-h-screen bg-gray-50 dark:bg-slate-950">

        {/* ── Hero ── */}
        <section className={`relative bg-gradient-to-br ${gradient} text-white overflow-hidden`}>
          {/* Decorative blobs */}
          <div className="pointer-events-none absolute top-0 right-0 w-80 h-80 rounded-full bg-white/5 blur-3xl" aria-hidden />
          <div className="pointer-events-none absolute bottom-0 left-0 w-64 h-64 rounded-full bg-black/10 blur-2xl" aria-hidden />

          <div className="relative max-w-6xl mx-auto px-6 md:px-10 pt-28 pb-16">
            <div className="knd-slide-up flex flex-col items-center text-center gap-5">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur text-xs font-bold uppercase tracking-widest">
                📚 Bibliothèque numérique
              </span>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-tight">
                Lisez directement<br />
                <span className="text-white/80">sur la plateforme</span>
              </h1>
              <p className="text-white/80 max-w-xl text-lg leading-relaxed">
                Parcourez notre collection. <strong>Connectez-vous</strong> pour lire les PDF et utiliser l&apos;assistant IA.
              </p>
              {!connecte && (
                <p className="text-sm text-amber-200/90 bg-white/10 inline-block px-4 py-2 rounded-full">
                  🔒 Lecture réservée aux membres inscrits
                </p>
              )}
              {erreur && (
                <span className="text-xs text-red-200 bg-red-900/40 px-3 py-1 rounded-full">{erreur}</span>
              )}
            </div>
          </div>
        </section>

        {/* ── Stats band ── */}
        <div className="bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800">
          <div className="max-w-6xl mx-auto px-6 md:px-10 py-4 flex flex-wrap gap-6 items-center justify-between">
            <div className="flex gap-6 text-sm text-slate-600 dark:text-slate-400">
              <span><strong className="text-slate-900 dark:text-white">{filtered.length}</strong> livres affichés</span>
              <span><strong className="text-slate-900 dark:text-white">{CATEGORIES.length - 1}</strong> catégories</span>
            </div>
            {/* View toggle */}
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-slate-800 rounded-xl p-1">
              {(['grille', 'liste'] as const).map(v => (
                <button
                  key={v}
                  onClick={() => setVue(v)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition ${vue === v ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
                >
                  {v === 'grille' ? '⊞ Grille' : '☰ Liste'}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 md:px-10 py-10">

          {/* ── Search ── */}
          <div className="relative mb-6">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
            <input
              type="text"
              placeholder="Rechercher un livre, un auteur…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-12 pr-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 outline-none transition shadow-sm text-base"
            />
          </div>

          {/* ── Category chips ── */}
          <div className="flex flex-wrap gap-2 mb-8 items-center">
            <FiFilter className="text-slate-400 w-4 h-4 shrink-0" />
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat === 'Tous' ? '' : cat)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  (cat === 'Tous' ? category === '' : category === cat)
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 scale-105'
                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-400 hover:text-blue-600'
                }`}
              >
                {CATEGORY_ICONS[cat] && <span className="mr-1">{CATEGORY_ICONS[cat]}</span>}
                {cat}
              </button>
            ))}
          </div>

          {/* ── Books Grid / List ── */}
          {filtered.length === 0 ? (
            <div className="py-24 text-center text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800">
              <p className="text-5xl mb-4">📭</p>
              <p className="text-xl font-bold text-slate-700 dark:text-slate-200">Aucun livre trouvé</p>
              <p className="text-sm mt-2 mb-6">Essayez une autre catégorie ou un autre mot-clé.</p>
              <button
                onClick={() => { setSearch(''); setCategory(''); }}
                className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : vue === 'grille' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map(book => (
                <CarteBook key={book.id} book={book} connecte={connecte} onLire={() => ouvrirLivre(book)} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {filtered.map(book => (
                <LigneBook key={book.id} book={book} connecte={connecte} onLire={() => ouvrirLivre(book)} />
              ))}
            </div>
          )}
        </div>
      </div>

      <PiedPage />

      {/* IA — un seul chatbot, toujours visible si connecté */}
      {connecte && (
        <Chatbot
          portal
          contexte={
            livreOuvert
              ? {
                  type: 'bibliotheque',
                  livre: livreOuvert.title,
                  auteur: livreOuvert.author,
                  page: lectureCtx?.page,
                  contenuPage: lectureCtx?.contenuPage,
                }
              : { type: 'bibliotheque', page: 'Catalogue — parcours des livres' }
          }
        />
      )}

      {livreOuvert && connecte && (
        <LecteurPDFPremium
          bookId={Number(livreOuvert.id)}
          titre={livreOuvert.title}
          auteur={livreOuvert.author}
          onLectureContext={setLectureCtx}
          onClose={() => { setLivreOuvert(null); setLectureCtx(null); }}
          onNextBook={filtered.findIndex(b => b.id === livreOuvert.id) < filtered.length - 1 ? handleNextBook : undefined}
          onPrevBook={filtered.findIndex(b => b.id === livreOuvert.id) > 0 ? handlePrevBook : undefined}
        />
      )}
    </>
  );
}

/* ─── Card (Grid view) ─── */
function CarteBook({ book, connecte, onLire }: { book: Book; connecte: boolean; onLire: () => void }) {
  const gradient = CATEGORY_COLORS[book.category] ?? CATEGORY_COLORS.default;
  return (
    <article 
      onClick={onLire}
      className="group cursor-pointer flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      {/* Cover */}
      <div className="relative h-52 overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
        <img
          src={book.coverUrl || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop'}
          onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop'; }}
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Category badge */}
        <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold text-white bg-gradient-to-r ${gradient}`}>
          {CATEGORY_ICONS[book.category] ?? '📚'} {book.category}
        </span>
        {/* Hover read overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="px-5 py-2.5 rounded-xl bg-white text-slate-900 font-bold text-sm hover:bg-orange-400 hover:text-white transition flex items-center gap-2">
            {connecte ? <FiBookOpen className="w-4 h-4" /> : <FiLock className="w-4 h-4" />}
            {connecte ? 'Lire maintenant' : 'Se connecter pour lire'}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 gap-2">
        <h3 className="font-bold text-slate-900 dark:text-white text-base leading-snug line-clamp-2">{book.title}</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">par {book.author}</p>
        <div className="flex items-center gap-1 mt-0.5">
          {[1,2,3,4,5].map(s => <FiStar key={s} className="w-3 h-3 text-amber-400 fill-amber-400" />)}
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3 flex-1 mt-1">{book.description}</p>
        <div className={`mt-3 w-full py-2.5 rounded-xl bg-gradient-to-r ${gradient} text-white font-bold text-sm hover:opacity-90 transition flex items-center justify-center gap-2`}>
          {connecte ? <FiBookOpen className="w-4 h-4" /> : <FiLock className="w-4 h-4" />}
          {connecte ? 'Lire sur la plateforme' : 'Connexion requise'}
        </div>
      </div>
    </article>
  );
}

/* ─── Row (List view) ─── */
function LigneBook({ book, connecte, onLire }: { book: Book; connecte: boolean; onLire: () => void }) {
  const gradient = CATEGORY_COLORS[book.category] ?? CATEGORY_COLORS.default;
  return (
    <article 
      onClick={onLire}
      className="flex gap-5 cursor-pointer bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all group"
    >
      <div className="shrink-0 w-20 h-28 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={book.coverUrl || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop'}
          onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop'; }}
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      </div>
      <div className="flex flex-col flex-1 min-w-0 gap-1">
        <span className={`self-start px-2 py-0.5 rounded-full text-[10px] font-bold text-white bg-gradient-to-r ${gradient}`}>
          {CATEGORY_ICONS[book.category]} {book.category}
        </span>
        <h3 className="font-bold text-slate-900 dark:text-white text-base leading-snug">{book.title}</h3>
        <p className="text-xs text-slate-500">par {book.author}</p>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">{book.description}</p>
      </div>
      <div className="shrink-0 flex items-center">
        <div className={`px-5 py-2.5 rounded-xl bg-gradient-to-r ${gradient} text-white font-bold text-sm hover:opacity-90 transition flex items-center gap-2`}>
          {connecte ? <FiBookOpen className="w-4 h-4" /> : <FiLock className="w-4 h-4" />}
          {connecte ? 'Lire' : 'Connexion'}
        </div>
      </div>
    </article>
  );
}

import { useState, useEffect, useRef, useMemo } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { getContenuLivre } from '../data/contenuLivres';
import { API_URL, getAuthToken } from '../services/apiClient';
import {
  ChevronLeft, ChevronRight, ZoomIn, ZoomOut,
  X, Maximize2, Minimize2, Loader2, BookOpen, AlertTriangle,
} from 'lucide-react';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface Props {
  bookId: number;
  titre: string;
  auteur?: string;
  onClose: () => void;
  onNextBook?: () => void;
  onPrevBook?: () => void;
  /** Remonte page/chapitre courant vers le chatbot parent */
  onLectureContext?: (ctx: { page: string; contenuPage?: string }) => void;
}

type ReadMode = 'react-pdf' | 'text';

export default function LecteurPDFPremium({
  bookId,
  titre,
  auteur: _auteur,
  onClose,
  onNextBook: _onNextBook,
  onPrevBook: _onPrevBook,
  onLectureContext,
}: Props) {
  const [mode, setMode] = useState<ReadMode>('react-pdf');
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.2);
  const [pdfLoading, setPdfLoading] = useState(true);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [chapterIdx, setChapterIdx] = useState(0);
  const pdfScrollRef = useRef<HTMLDivElement>(null);
  const textContent = getContenuLivre(titre);

  /** PDF servi par le backend — JWT requis */
  const pdfFile = useMemo(() => {
    const token = getAuthToken();
    return {
      url: `${API_URL}/books/${bookId}/pdf`,
      httpHeaders: token ? { Authorization: `Bearer ${token}` } : {},
    };
  }, [bookId]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem(`pdf_page_${encodeURIComponent(titre)}`);
    if (saved) setPageNumber(parseInt(saved, 10));
    setPdfLoading(true);
    setPdfError(null);
  }, [bookId, titre]);

  useEffect(() => {
    if (!onLectureContext) return;
    onLectureContext({
      page: mode === 'text'
        ? `Chapitre ${chapterIdx + 1} : ${textContent.chapitres[chapterIdx]?.titre ?? ''}`
        : `Page ${pageNumber} sur ${numPages ?? '?'}`,
      contenuPage: mode === 'text' ? textContent.chapitres[chapterIdx]?.texte : undefined,
    });
  }, [onLectureContext, mode, chapterIdx, pageNumber, numPages, textContent, titre]);

  useEffect(() => {
    localStorage.setItem(`pdf_page_${encodeURIComponent(titre)}`, pageNumber.toString());
  }, [pageNumber, titre]);

  function onDocumentLoadSuccess({ numPages: n }: { numPages: number }) {
    setNumPages(n);
    setPdfLoading(false);
    setPdfError(null);
    pdfScrollRef.current?.scrollTo({ top: 0, behavior: 'auto' });
  }

  function onDocumentLoadError() {
    setPdfError('Le PDF ne peut pas être affiché. Essayez le mode texte ou réessayez plus tard.');
    setPdfLoading(false);
  }

  const goToPrev = () => setPageNumber(p => Math.max(p - 1, 1));
  const goToNext = () => setPageNumber(p => Math.min(p + 1, numPages || 1));

  const containerCls = fullscreen
    ? 'fixed inset-0 z-[200] bg-[#0a0a0c] flex flex-col font-sans text-white'
    : 'fixed inset-0 z-[100] bg-[#0a0a0c] flex flex-col font-sans text-white';

  return (
    <div className={containerCls}>
      <header className="h-16 border-b border-white/10 bg-[#121214] flex items-center justify-between px-4 lg:px-6 z-20 shadow-xl shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="p-2 bg-white/5 hover:bg-red-500 rounded-lg transition-all">
            <X size={20} />
          </button>
          <div className="hidden sm:block">
            <h1 className="font-semibold text-sm lg:text-base line-clamp-1">{titre}</h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold flex items-center gap-2">
              <BookOpen size={10} />
              {mode === 'react-pdf' ? `Page ${pageNumber} / ${numPages ?? '...'}` : 'Lecture structurée'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-1 bg-white/5 rounded-lg border border-white/10 p-0.5">
            <button
              onClick={() => { setMode('react-pdf'); setPdfLoading(true); setPdfError(null); }}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${mode === 'react-pdf' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              PDF
            </button>
            <button
              onClick={() => { setMode('text'); setPdfLoading(false); }}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${mode === 'text' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Résumé
            </button>
          </div>

          {mode === 'react-pdf' && (
            <div className="flex items-center gap-2 bg-white/5 rounded-2xl px-3 py-1.5 border border-white/10">
              <button onClick={goToPrev} disabled={pageNumber <= 1} className="p-1 hover:bg-white/10 rounded-lg disabled:opacity-20">
                <ChevronLeft size={18} />
              </button>
              <span className="text-xs font-mono font-bold text-indigo-400 min-w-[60px] text-center">
                {pageNumber} / {numPages ?? '…'}
              </span>
              <button onClick={goToNext} disabled={!numPages || pageNumber >= numPages} className="p-1 hover:bg-white/10 rounded-lg disabled:opacity-20">
                <ChevronRight size={18} />
              </button>
              <div className="w-px h-4 bg-white/10 mx-1" />
              <button onClick={() => setScale(s => Math.max(s - 0.2, 0.6))} className="p-1 hover:bg-white/10 rounded-lg"><ZoomOut size={16} /></button>
              <span className="text-xs font-bold text-slate-400">{Math.round(scale * 100)}%</span>
              <button onClick={() => setScale(s => Math.min(s + 0.2, 2.5))} className="p-1 hover:bg-white/10 rounded-lg"><ZoomIn size={16} /></button>
            </div>
          )}

          <button onClick={() => setFullscreen(f => !f)} className="p-2 hover:bg-white/10 rounded-lg transition text-slate-400 hover:text-white">
            {fullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-hidden relative bg-[#0f0f11]">
        {pdfLoading && mode === 'react-pdf' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0f0f11] z-10">
            <Loader2 className="animate-spin text-indigo-500 mb-4" size={48} />
            <p className="text-slate-400 animate-pulse font-medium">Chargement du PDF…</p>
          </div>
        )}

        {mode === 'react-pdf' && !pdfError && (
          <div ref={pdfScrollRef} className="h-full overflow-auto flex justify-center p-4 lg:p-10 custom-scrollbar">
            <div className="relative inline-block shadow-2xl rounded-lg overflow-hidden h-fit">
              <Document
                file={pdfFile}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
                loading={null}
              >
                <Page
                  pageNumber={pageNumber}
                  scale={scale}
                  renderAnnotationLayer
                  renderTextLayer
                  className="bg-white"
                />
              </Document>
            </div>
          </div>
        )}

        {mode === 'react-pdf' && pdfError && !pdfLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center z-20">
            <AlertTriangle className="text-red-400 mb-6" size={56} />
            <h2 className="text-2xl font-black text-white mb-3">Erreur de chargement</h2>
            <p className="text-slate-400 mb-8 max-w-md">{pdfError}</p>
            <button
              onClick={() => { setMode('text'); setPdfLoading(false); }}
              className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-2xl font-black text-white transition-all flex items-center gap-2"
            >
              <BookOpen size={16} /> Lire le résumé structuré
            </button>
          </div>
        )}

        {mode === 'text' && (
          <div className="h-full flex flex-col bg-white dark:bg-slate-900 overflow-hidden">
            <div className="flex-1 overflow-y-auto px-8 py-12 sm:px-20">
              <div className="max-w-3xl mx-auto">
                <span className="px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-black uppercase tracking-widest border border-emerald-500/20">
                  Chapitre {chapterIdx + 1} / {textContent.chapitres.length}
                </span>
                <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-8 mt-6 leading-tight">
                  {textContent.chapitres[chapterIdx].titre}
                </h2>
                <p className="text-xl text-slate-700 dark:text-slate-300 leading-[1.8] whitespace-pre-wrap font-medium">
                  {textContent.chapitres[chapterIdx].texte}
                </p>
              </div>
            </div>
            <div className="shrink-0 px-8 py-5 bg-slate-950/90 border-t border-white/5 flex items-center justify-between">
              <button onClick={() => setChapterIdx(i => Math.max(i - 1, 0))} disabled={chapterIdx === 0}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 text-slate-300 hover:bg-white/10 disabled:opacity-20 transition font-bold text-sm">
                <ChevronLeft size={18} /> Précédent
              </button>
              <button
                onClick={() => setChapterIdx(i => Math.min(i + 1, textContent.chapitres.length - 1))}
                disabled={chapterIdx === textContent.chapitres.length - 1}
                className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-emerald-600 text-white hover:bg-emerald-500 disabled:opacity-20 transition font-bold text-sm">
                Suivant <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="shrink-0 h-8 bg-[#0a0a0c] border-t border-white/5 flex items-center justify-between px-6 text-[10px] text-slate-600 uppercase tracking-widest font-black">
        <span className="flex items-center gap-2">
          <BookOpen size={10} className="text-indigo-500" />
          Kaay Niou Diang — Lecteur PDF
        </span>
        <span className="text-slate-700">{mode === 'react-pdf' ? 'Document PDF' : 'Résumé'}</span>
      </footer>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .react-pdf__Page__canvas { margin: 0 auto; display: block !important; }
      `}</style>
    </div>
  );
}

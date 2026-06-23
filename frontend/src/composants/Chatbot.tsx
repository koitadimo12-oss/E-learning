import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { apiPost } from '../services/apiClient';
import { IoSend, IoClose, IoPerson } from 'react-icons/io5';
import { Maximize2, Minimize2 } from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

interface ChatbotProps {
  /** Contexte optionnel : livre ouvert, page courante, etc. */
  contexte?: {
    type?: 'bibliotheque' | 'cours' | 'general';
    livre?: string;
    auteur?: string;
    chapitre?: string;
    /** Page courante (mode PDF) ou chapitre courant (mode texte) */
    page?: string;
    /** Texte du chapitre actuellement affiché en mode lecture structurée */
    contenuPage?: string;
  };
  /** Affiche au-dessus des lecteurs plein écran (bibliothèque, PDF…) */
  portal?: boolean;
}

function contextStorageKey(ctx?: ChatbotProps['contexte']) {
  if (ctx?.type === 'bibliotheque' && ctx.livre) {
    return `chat_bib_${ctx.livre}`;
  }
  if (ctx?.type === 'bibliotheque') return 'chat_bib_catalogue';
  if (ctx?.type === 'cours' && ctx.livre) return `chat_cours_${ctx.livre}`;
  return 'chat_general';
}

function buildWelcomeText(ctx?: ChatbotProps['contexte']) {
  const pageInfo = ctx?.page ? ` — ${ctx.page}` : '';
  if (ctx?.type === 'bibliotheque' && ctx.livre) {
    const auteurInfo = ctx.auteur ? ` de ${ctx.auteur}` : '';
    return `Je suis dans la bibliothèque et je sais que vous lisez « ${ctx.livre} »${auteurInfo}${pageInfo}. Demandez-moi d'expliquer, résumer ou approfondir ce livre !`;
  }
  if (ctx?.type === 'bibliotheque') {
    return "Je sais que vous êtes dans la bibliothèque de Kaay Niou Diang. Parcourez les livres et ouvrez-en un pour que je puisse vous aider sur son contenu. Sinon, demandez-moi une recommandation !";
  }
  if (ctx?.type === 'cours' && ctx.livre) {
    return `Je vois que vous suivez le cours « ${ctx.livre} »${ctx.chapitre ? ` — chapitre : ${ctx.chapitre}` : ''}. Posez vos questions !`;
  }
  return "Bonjour ! Je suis IA Kaay Niou Diang. Je peux vous expliquer des concepts, résumer vos cours ou vous donner des conseils d'apprentissage. Comment puis-je vous aider ?";
}

export default function Chatbot({ contexte, portal = false }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const storageKey = contextStorageKey(contexte);
  const welcomeText = buildWelcomeText(contexte);

  useEffect(() => {
    const saved = sessionStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setMessages(parsed.map((m: { id: string; sender: 'user' | 'ai'; text: string; timestamp: string }) => ({
          ...m,
          timestamp: new Date(m.timestamp),
        })));
        return;
      } catch { /* ignore */ }
    }
    setMessages([{ id: 'welcome', sender: 'ai', text: welcomeText, timestamp: new Date() }]);
  }, [storageKey]);

  // Met à jour l'accueil quand le livre ou la page change (sans effacer l'historique utilisateur)
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 0) {
        return [{ id: 'welcome', sender: 'ai', text: welcomeText, timestamp: new Date() }];
      }
      const hasUserMsg = prev.some((m) => m.sender === 'user');
      if (hasUserMsg) return prev;
      return [{ id: `welcome-${storageKey}`, sender: 'ai', text: welcomeText, timestamp: new Date() }];
    });
  }, [welcomeText, storageKey]);

  useEffect(() => {
    sessionStorage.setItem(storageKey, JSON.stringify(messages));
    if (!isOpen) return;
    const el = messagesContainerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, isOpen, storageKey]);

  const buildSystemContext = () => {
    if (!contexte) return '';
    const parts: string[] = [];

    if (contexte.type === 'bibliotheque') {
      parts.push(`L'étudiant est actuellement dans la BIBLIOTHÈQUE de la plateforme Kaay Niou Diang.`);
      if (contexte.livre) {
        parts.push(`Il lit le livre : "${contexte.livre}"${contexte.auteur ? ` de ${contexte.auteur}` : ''}.`);
      } else {
        parts.push(`Il parcourt le catalogue des livres (aucun livre ouvert pour le moment).`);
      }
    }

    if (contexte.page) {
      parts.push(`Position actuelle dans le livre : ${contexte.page}.`);
    }

    if (contexte.contenuPage) {
      parts.push(`Voici le contenu exact du chapitre actuellement affiché :\n\n"${contexte.contenuPage.slice(0, 1200)}"`);
      parts.push(`Si l'étudiant demande d'expliquer, de résumer ou de détailler, utilise CE contenu comme base.`);
    }

    if (contexte.chapitre) {
      parts.push(`Il étudie le chapitre : "${contexte.chapitre}" du cours "${contexte.livre}".`);
    }

    if (parts.length === 0) return '';

    return ` [CONTEXTE SYSTÈME - NE PAS MENTIONNER : ${parts.join(' ')} Réponds en tenant compte de ce contexte. Si l'étudiant pose une question sans préciser le livre ou la page, tu sais déjà de quoi il s'agit.]`;
  };

  const sendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputValue.trim(),
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);
    setError(null);

    try {
      const messageWithContext = userMsg.text + buildSystemContext();
      // Appel API Mistral via le backend : POST /ai/chat → ai.controller.ts → ai.service.ts
      const data = await apiPost<{ response: string }>("/ai/chat", {
        message: messageWithContext,
        lang: "fr",
      });
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: data.response || "Désolé, je n'ai pas pu répondre.",
        timestamp: new Date(),
      }]);
    } catch {
      setError("Oups ! Une erreur s'est produite. Vérifiez votre connexion.");
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions =
    contexte?.type === 'bibliotheque' && contexte.livre
      ? [
          { label: '📝 Explique cette page', msg: 'Explique-moi ce que je suis en train de lire.' },
          { label: '📚 Résume ce livre', msg: 'Résume-moi ce livre en 5 points clés.' },
          { label: '💡 Concepts clés', msg: 'Quels sont les concepts les plus importants de ce livre ?' },
        ]
      : contexte?.type === 'bibliotheque'
        ? [
            { label: '📖 Recommande un livre', msg: 'Quel livre me recommandes-tu pour débuter ?' },
            { label: '🔍 Par catégorie', msg: 'Quels livres as-tu en cybersécurité ou en IA ?' },
            { label: '💡 Conseil lecture', msg: 'Comment lire efficacement un livre technique ?' },
          ]
        : [
            { label: '📚 Expliquer un cours', msg: "Peux-tu expliquer un concept que je n'ai pas compris ?" },
            { label: '💡 Conseil d\'apprentissage', msg: 'Donne-moi des conseils pour apprendre plus efficacement.' },
          ];

  // Window dimensions for fullscreen
  const windowCls = isFullscreen
    ? 'fixed inset-0 z-[10001] rounded-none shadow-none'
    : 'w-[92vw] sm:w-[400px] rounded-3xl shadow-2xl';

  const ui = (
    <div className={`fixed bottom-4 right-4 z-[10000] flex flex-col items-end font-sans pointer-events-none ${portal ? '' : ''}`}>
      {/* Chat Window */}
      <div
        className={`transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] transform origin-bottom-right mb-1 ${
          isOpen ? 'scale-100 opacity-100 translate-y-0 pointer-events-auto' : 'scale-95 opacity-0 translate-y-10 pointer-events-none'
        } bg-white dark:bg-slate-900 overflow-hidden flex flex-col border border-slate-200/60 dark:border-slate-800/60 backdrop-blur-xl ${windowCls}`}
        style={{ height: isFullscreen ? '100vh' : '520px', maxHeight: isFullscreen ? '100vh' : '70vh' }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 p-4 text-white flex justify-between items-center relative overflow-hidden shrink-0">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-[-50%] left-[-20%] w-full h-[200%] bg-white rotate-12 blur-3xl" />
          </div>
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 text-xl">🤖</div>
            <div>
              <h3 className="font-bold text-base tracking-tight">IA Kaay Niou Diang</h3>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                {contexte?.type === 'bibliotheque' && contexte.livre ? (
                  <p className="text-[11px] text-blue-50 font-medium">
                    📚 Bibliothèque — {contexte.livre.slice(0, 20)}{contexte.livre.length > 20 ? '…' : ''}
                    {contexte.page ? ` (${contexte.page})` : ''}
                  </p>
                ) : contexte?.type === 'bibliotheque' ? (
                  <p className="text-[11px] text-blue-50 font-medium">📚 Bibliothèque — catalogue</p>
                ) : (
                  <p className="text-[11px] text-blue-50 font-medium">En ligne • IA Mistral</p>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 relative z-10">
            <button
              onClick={() => setIsFullscreen(f => !f)}
              className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-xl transition-all"
              title={isFullscreen ? 'Réduire' : 'Plein écran'}
            >
              {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>
            <button onClick={() => { setIsOpen(false); setIsFullscreen(false); }}
              className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-xl transition-all">
              <IoClose size={22} />
            </button>
          </div>
        </div>

        {/* Quick actions */}
        {messages.length <= 1 && (
          <div className="px-4 pt-3 flex flex-wrap gap-2 shrink-0">
            {quickActions.map(a => (
              <button key={a.label} onClick={() => { setInputValue(a.msg); }}
                className="px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-semibold border border-indigo-200 dark:border-indigo-700 hover:bg-indigo-100 dark:hover:bg-indigo-800/50 transition">
                {a.label}
              </button>
            ))}
          </div>
        )}

        {/* Messages */}
        <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-5 bg-slate-50/50 dark:bg-slate-950/50">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'} items-end gap-2 max-w-[88%]`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  msg.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
                }`}>
                  {msg.sender === 'user' ? <IoPerson size={14} /> : <span className="text-sm">🤖</span>}
                </div>
                <div className={`rounded-2xl px-4 py-3 shadow-sm text-[13.5px] leading-relaxed whitespace-pre-wrap font-medium ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-none'
                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/50 dark:border-slate-700/50 rounded-bl-none'
                }`}>
                  {msg.text}
                  <span className={`text-[9px] mt-1.5 block font-bold uppercase tracking-wider ${msg.sender === 'user' ? 'text-indigo-200' : 'text-slate-400'}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-bl-none px-4 py-3 flex gap-1.5 items-center">
                {[0, 150, 300].map(d => (
                  <div key={d} className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
                ))}
              </div>
            </div>
          )}
          {error && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 text-xs text-center">
              {error}
              <button onClick={() => sendMessage()} className="ml-2 underline font-bold">Réessayer</button>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 shrink-0">
          <form onSubmit={sendMessage} className="flex items-center gap-2">
            <textarea
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              placeholder={
                contexte?.type === 'bibliotheque' && contexte.livre
                  ? `Question sur « ${contexte.livre} »…`
                  : contexte?.type === 'bibliotheque'
                    ? 'Question sur la bibliothèque…'
                    : 'Posez votre question…'
              }
              className="flex-1 max-h-32 min-h-[48px] bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none border-none placeholder-slate-400 transition-all"
              rows={1}
            />
            <button type="submit" disabled={!inputValue.trim() || isLoading}
              className="w-12 h-12 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white rounded-2xl transition-all flex items-center justify-center shrink-0 active:scale-95">
              <IoSend size={18} />
            </button>
          </form>
          <p className="text-center mt-2 text-[10px] text-slate-400 font-medium">
            L'IA peut faire des erreurs. Vérifiez les concepts importants.
          </p>
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`pointer-events-auto group relative flex items-center justify-center gap-1 min-w-[4rem] h-16 px-3 rounded-3xl transition-all duration-300 shadow-2xl border-2 border-white/30 ${
          isOpen ? 'bg-slate-800 rotate-90 scale-90' : 'bg-gradient-to-tr from-indigo-600 to-blue-600 hover:scale-110 hover:shadow-indigo-300/50 animate-pulse'
        } text-white`}
        aria-label="Ouvrir le chat avec l'IA"
      >
        {isOpen ? <IoClose size={32} /> : (
          <>
            <span className="text-2xl">🤖</span>
            <span className="text-xs font-black tracking-wide hidden sm:inline">IA</span>
          </>
        )}
        {!isOpen && <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full border-2 border-white dark:border-slate-900" />}
      </button>
    </div>
  );

  if (portal && typeof document !== 'undefined') {
    return createPortal(ui, document.body);
  }
  return ui;
}

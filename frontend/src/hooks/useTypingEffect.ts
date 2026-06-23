import { useEffect, useMemo, useState } from "react";

export function useTypingEffect(words: string[], opts?: { typeMs?: number; pauseMs?: number }) {
  const typeMs = opts?.typeMs ?? 28;
  const pauseMs = opts?.pauseMs ?? 900;

  const safeWords = useMemo(() => (words.length ? words : [""]), [words]);
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  const currentWord = safeWords[wordIndex] ?? "";
  const text = currentWord.slice(0, charIndex);

  useEffect(() => {
    const atEnd = charIndex >= currentWord.length;
    const atStart = charIndex <= 0;

    const delay = deleting ? Math.max(14, Math.floor(typeMs * 0.7)) : typeMs;

    const id = window.setTimeout(() => {
      if (!deleting && atEnd) {
        window.setTimeout(() => setDeleting(true), pauseMs);
        return;
      }
      if (deleting && atStart) {
        setDeleting(false);
        setWordIndex((i) => (i + 1) % safeWords.length);
        return;
      }
      setCharIndex((c) => c + (deleting ? -1 : 1));
    }, delay);

    return () => window.clearTimeout(id);
  }, [charIndex, currentWord, deleting, pauseMs, safeWords.length, typeMs]);

  return { text, wordIndex, deleting };
}


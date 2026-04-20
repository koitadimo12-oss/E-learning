import { useEffect, useMemo, useRef, useState } from "react";
import { listeEcoles, rechercherEcoles, type EcoleEntry } from "../services/ecoleService";

type Props = {
  valueId: string;
  onChange: (ecole: EcoleEntry) => void;
  idHtml?: string;
};

export default function SelectEcole(props: Props) {
  const { valueId, onChange, idHtml = "ecole" } = props;
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapRef = useRef<HTMLDivElement>(null);

  const selection = useMemo(() => listeEcoles().find((e) => e.id === valueId) ?? listeEcoles()[0], [valueId]);

  const filtrees = useMemo(() => {
    const q = query.trim();
    return q ? rechercherEcoles(q) : listeEcoles();
  }, [query]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div ref={wrapRef} className="relative w-full">
      <label htmlFor={idHtml} className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
        École <span className="text-red-500">*</span>
      </label>
      <p className="text-xs text-gray-500 dark:text-slate-400 mb-2">
        Choisissez dans la liste — saisie libre désactivée. Recherche par nom ou alias.
      </p>
      <button
        type="button"
        id={idHtml}
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-2 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2.5 text-left text-sm font-medium text-gray-900 dark:text-slate-100"
      >
        <span className="truncate">{selection.label}</span>
        <span className="text-gray-400 shrink-0" aria-hidden>
          ▾
        </span>
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-900 shadow-xl max-h-72 overflow-hidden flex flex-col">
          <input
            type="search"
            autoComplete="off"
            placeholder="Rechercher une école…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-3 py-2 text-sm border-b border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 outline-none"
          />
          <ul className="overflow-y-auto max-h-56">
            {filtrees.map((e) => (
              <li key={e.id}>
                <button
                  type="button"
                  className={`w-full text-left px-3 py-2.5 text-sm hover:bg-blue-50 dark:hover:bg-slate-800 ${
                    e.id === valueId ? "bg-blue-50 dark:bg-slate-800 font-semibold" : ""
                  }`}
                  onClick={() => {
                    onChange(e);
                    setQuery("");
                    setOpen(false);
                  }}
                >
                  {e.label}
                </button>
              </li>
            ))}
            {filtrees.length === 0 && (
              <li className="px-3 py-4 text-sm text-gray-500">Aucune école ne correspond.</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

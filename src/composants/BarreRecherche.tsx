interface Props {
  valeur: string;
  onChange: (val: string) => void;
}

export default function BarreRecherche({ valeur, onChange }: Props) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
      <input
        type="text"
        placeholder="Rechercher un cours..."
        value={valeur}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-200 bg-white rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 shadow-sm transition"
      />
    </div>
  );
}

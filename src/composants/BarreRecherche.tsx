interface Props {
  valeur: string;
  onChange: (val: string) => void;
}

export default function BarreRecherche({ valeur, onChange }: Props) {
  return (
    <input
      type="text"
      placeholder="Rechercher..."
      value={valeur}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border border-gray-200 bg-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300 shadow-sm transition"
    />
  );
}

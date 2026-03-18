interface Props {
  valeur: string;
  onChange: (val: string) => void;
}

export default function BarreRecherche({ valeur, onChange }: Props) {
  return (
    <input
      type="text"
      placeholder="Rechercher un cours..."
      value={valeur}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border-2 border-blue-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
    />
  );
}

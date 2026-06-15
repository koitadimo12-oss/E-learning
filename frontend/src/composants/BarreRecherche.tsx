export default function BarreRecherche(props: any) {
  const { valeur, onChange } = props;
  return (
    <input
      type="text"
      placeholder="Rechercher..."
      value={valeur}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300 shadow-sm transition placeholder:text-gray-400 dark:placeholder:text-slate-500"
    />
  );
}

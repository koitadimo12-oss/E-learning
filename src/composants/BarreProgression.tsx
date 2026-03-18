interface Props {
  progression: number;
}

export default function BarreProgression({ progression }: Props) {
  return (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className="bg-orange-400 h-2 rounded-full transition-all"
        style={{ width: `${progression}%` }}
      />
      <p className="text-xs text-blue-600 mt-1 font-medium">{progression}% complété</p>
    </div>
  );
}

export default function BarreProgression(props: any) {
  const { progression } = props;
  const couleur =
    progression >= 80 ? "bg-green-400" :
    progression >= 40 ? "bg-orange-400" :
    "bg-blue-400";

  return (
    <div>
      <div className="text-xs text-gray-500 mb-1">
        <span className="font-semibold text-gray-700">{progression}% Complété</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2.5">
        <div
          className={`${couleur} h-2.5 rounded-full transition-all duration-500`}
          style={{ width: `${progression}%` }}
        />
      </div>
    </div>
  );
}

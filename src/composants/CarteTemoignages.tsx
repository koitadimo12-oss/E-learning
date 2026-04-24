export default function CarteTemoignage(props: any) {
  const { image, nom, texte } = props;
  const initials = nom
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p: string) => p[0]?.toUpperCase())
    .join("");

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-lg rounded-xl p-6 text-center transform transition duration-500 hover:scale-105 hover:shadow-2xl hover:-translate-y-1">
      
      <div className="overflow-hidden w-20 h-20 mx-auto mb-4 rounded-full transition-transform duration-500 hover:scale-110">
        {image ? (
          <img src={image} alt={nom} className="w-full h-full object-cover rounded-full" />
        ) : (
          <div className="w-full h-full bg-orange-500 text-white flex items-center justify-center font-bold text-xl">
            {initials}
          </div>
        )}
      </div>

      <p className="italic text-gray-700 dark:text-slate-200 transition-all duration-500 hover:text-gray-900 dark:hover:text-white">
        "{texte}"
      </p>

      <h4 className="font-bold mt-4 text-orange-600 dark:text-orange-300 transition-colors duration-500 hover:text-orange-700 dark:hover:text-orange-200">
        {nom}
      </h4>

    </div>
  );
}

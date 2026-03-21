export default function CarteTemoignage(props: any) {
  const { image, nom, texte } = props;
  const initials = nom
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p: string) => p[0]?.toUpperCase())
    .join("");

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 text-center transform transition duration-500 hover:scale-105 hover:shadow-2xl hover:-translate-y-1">
      
      <div className="overflow-hidden w-20 h-20 mx-auto mb-4 rounded-full transition-transform duration-500 hover:scale-110">
        {image ? (
          <img src={image} alt={nom} className="w-full h-full object-cover rounded-full" />
        ) : (
          <div className="w-full h-full bg-orange-500 text-white flex items-center justify-center font-bold text-xl">
            {initials}
          </div>
        )}
      </div>

      <p className="italic text-gray-600 transition-all duration-500 hover:text-gray-800">
        "{texte}"
      </p>

      <h4 className="font-bold mt-4 text-orange-500 transition-colors duration-500 hover:text-orange-600">
        {nom}
      </h4>

    </div>
  );
}

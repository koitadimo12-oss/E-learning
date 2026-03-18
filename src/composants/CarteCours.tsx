type Props = {
  image: string;
  titre: string;
  auteur: string;
  duree: string;
};

export default function CarteCours({ image, titre, auteur, duree }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-500 hover:scale-105 hover:shadow-2xl hover:-translate-y-1">
      
      <div className="overflow-hidden">
        <img
          src={image}
          className="w-full h-44 object-cover rounded-t-xl transition-transform duration-500 hover:scale-110"
          alt={titre}
        />
      </div>

      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-800">{titre}</h3>
        <p className="text-gray-500 text-sm mt-1">{auteur}</p>
        <p className="text-blue-600 text-sm mt-2">{duree}</p>

        <button
          className="mt-4 w-full py-2 rounded-lg font-medium shadow-md transition-all duration-300 hover:shadow-xl hover:scale-105"
          style={{ backgroundColor: "#FFA500", color: "white" }}
        >
          Voir le cours
        </button>
      </div>

    </div>
  );
}

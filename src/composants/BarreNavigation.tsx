import { useNavigate } from "react-router-dom";
export default function BarreNavigation(props: any) {
  const { etudiant, onDeconnexion } = props;
  const navigate = useNavigate();

  const handleProfileClick = () => {
    if (!etudiant) navigate("/connexion");
    else navigate("/profil");
  };

  return (
    <nav className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img
            src="/logo2.png"
            alt="Logo Kaay Niou Diang"
            className="w-16 h-16 object-contain"
            onError={(e) => {
              // fallback visuel: si le fichier image n'existe pas, on garde un espace via la taille
              const img = e.currentTarget;
              img.style.display = "none";
            }}
          />
          <h1 className="font-bold text-xl sm:text-2xl text-blue-600">Kaay Niou Diang</h1>
        </div>

        <div className="flex items-center gap-4 justify-between">
          <ul className="hidden sm:flex flex-wrap gap-6 font-medium items-center text-sm sm:text-base">
            <li className="hover:text-blue-600 cursor-pointer" onClick={() => navigate("/")}>
              Accueil
            </li>
            <li className="hover:text-blue-600 cursor-pointer" onClick={() => navigate("/cours")}>
              Cours
            </li>
            <li
              className="hover:text-blue-600 cursor-pointer"
              onClick={() => navigate("/#a-propos")}
              aria-label="À propos"
            >
              À propos
            </li>
          </ul>

          {!etudiant ? (
            <button
              type="button"
              onClick={() => navigate("/connexion")}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer transition font-semibold"
            >
              Connexion
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleProfileClick}
                className="flex items-center gap-2 text-sm sm:text-base hover:text-blue-600 transition cursor-pointer"
              >
                <span className="text-gray-800 font-medium">Bonjour, {etudiant.nom}</span>
                <span
                  className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-700 font-bold"
                  aria-hidden
                >
                  {etudiant.nom.split(" ").filter(Boolean).slice(0, 2).map((p: string) => p[0]).join("")}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onDeconnexion();
                  navigate("/");
                }}
                className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 cursor-pointer transition font-semibold"
              >
                Déconnexion
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

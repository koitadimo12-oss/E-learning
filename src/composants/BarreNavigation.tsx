import { useNavigate } from "react-router-dom";
import type { Etudiant } from "../services/etudiantService";

type Props = {
  etudiant: Etudiant | null;
  onDeconnexion: () => void;
};

export default function BarreNavigation({ etudiant, onDeconnexion }: Props) {
  const navigate = useNavigate();

  const handleProfilClick = () => {
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
          <img src="/logo2.png" alt="Logo Kaay Niou Diang" className="w-12 h-12 object-contain" />
          <h1 className="font-bold text-xl sm:text-2xl text-blue-600">Kaay Niou Diang</h1>
        </div>

        <ul className="flex flex-wrap gap-3 sm:gap-6 font-medium items-center text-sm sm:text-base">
          <li className="hover:text-blue-600 cursor-pointer" onClick={() => navigate("/")}>
            Accueil
          </li>
          <li className="hover:text-blue-600 cursor-pointer" onClick={() => navigate("/cours")}>
            Cours
          </li>
          <li className="hover:text-blue-600 cursor-pointer" onClick={handleProfilClick}>
            Profil
          </li>
          {!etudiant ? (
            <>
              <li
                className="hover:text-blue-600 cursor-pointer"
                onClick={() => navigate("/inscription")}
              >
                Inscription
              </li>
              <li
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer"
                onClick={() => navigate("/connexion")}
              >
                Connexion
              </li>
            </>
          ) : (
            <>
              <li
                className="hover:text-blue-600 cursor-pointer"
                onClick={() => navigate("/tableau-bord")}
              >
                Tableau de bord
              </li>
              <li
                className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 cursor-pointer"
                onClick={() => {
                  onDeconnexion();
                  navigate("/");
                }}
              >
                Deconnexion
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

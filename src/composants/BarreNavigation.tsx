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

  const handleTableauBordClick = () => {
    if (!etudiant) navigate("/connexion");
    else navigate("/tableau-bord");
  };

  return (
    <nav className="flex justify-between items-center px-10 py-4 bg-white shadow">

      {/* LOGO */}
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
        <img src="/logo2.png" className="w-20" />
        <h1 className="font-bold text-2xl text-blue-600">Kaay Niou Diang</h1>
      </div>

      {/* MENU */}
      <ul className="flex gap-8 font-medium items-center">
        <li className="hover:text-blue-600 cursor-pointer" onClick={() => navigate("/")}>Accueil</li>
        <li className="hover:text-blue-600 cursor-pointer" onClick={() => navigate("/cours")}>Cours</li>
        {etudiant ? (
          <li className="hover:text-blue-600 cursor-pointer" onClick={handleTableauBordClick}>
            Tableau de bord
          </li>
        ) : null}

        <li className="hover:text-blue-600 cursor-pointer" onClick={handleProfilClick}>Profil</li>

        {!etudiant ? (
          <>
            <li className="hover:text-blue-600 cursor-pointer" onClick={() => navigate("/connexion")}>Connexion</li>
            <li
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer"
              onClick={() => navigate("/inscription")}
            >
              Inscription
            </li>
          </>
        ) : (
          <li
            className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 cursor-pointer"
            onClick={() => {
              onDeconnexion();
              navigate("/");
            }}
          >
            Déconnexion
          </li>
        )}
      </ul>
    </nav>
  );
}

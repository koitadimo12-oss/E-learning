export default function BarreNavigation() {
  return (
    <nav className="flex justify-between items-center px-10 py-4 bg-white shadow">

      {/* LOGO */}
      <div className="flex items-center gap-3">
        <img 
          src="/logo2.png" 
          className="w-20"
        />
        <h1 className="font-bold text-2xl text-blue-600">
          Kaay Niou Diang
        </h1>
      </div>

      {/* MENU */}
      <ul className="flex gap-8 font-medium items-center">

        <li className="hover:text-blue-600 cursor-pointer">
          Accueil
        </li>

        <li className="hover:text-blue-600 cursor-pointer">
          Cours
        </li>

        <li className="hover:text-blue-600 cursor-pointer">
          Connexion
        </li>

        <li className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer">
          Inscription
        </li>

      </ul>

    </nav>
  );
}

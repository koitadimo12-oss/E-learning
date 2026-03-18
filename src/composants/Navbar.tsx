import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-orange-100">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">EL</span>
          </div>
          <span className="text-blue-800 font-bold text-xl">E-Learn</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="text-blue-700 hover:text-orange-500 font-medium text-sm transition"
          >
            Cours
          </button>
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition">
            S'inscrire
          </button>
        </div>
      </div>
    </nav>
  );
}

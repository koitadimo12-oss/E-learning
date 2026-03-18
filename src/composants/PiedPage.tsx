export default function PiedPage() {
  return (
    <footer className="bg-linear-to-r from-blue-600 to-blue-500 text-white mt-20 shadow-lg">
      
      <div className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8">
        
        <div>
          <h2 className="text-2xl font-bold mb-2">
            Kaay Niou Diang
          </h2>
          <p className="text-sm text-gray-200">
            Plateforme d'apprentissage en ligne pour développer vos compétences.
          </p>
        </div>
        
        <div>
          <h3 className="font-semibold mb-3">Liens</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-orange-400 transition-colors cursor-pointer">Accueil</li>
            <li className="hover:text-orange-400 transition-colors cursor-pointer">Cours</li>
            <li className="hover:text-orange-400 transition-colors cursor-pointer">Connexion</li>
          </ul>
        </div>
        
        <div>
          <h3 className="font-semibold mb-3">Contact</h3>
          <p className="text-sm text-gray-200">contact@kaay_niou_diang.com</p>
        </div>

      </div>

      <div className="text-center py-4 bg-blue-700 text-sm text-gray-200">
        © 2026 Kaay Niou Diang
      </div>

    </footer>
  );
}

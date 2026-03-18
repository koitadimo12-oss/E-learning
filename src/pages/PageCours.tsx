import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCours } from "../services/coursService";
import BarreProgression from "../composants/BarreProgression";
import Navbar from "../composants/Navbar";

export default function PageCours() {
  const { id } = useParams();
  const navigate = useNavigate();
  const cours = getCours(Number(id));

  const [reponsesChoisies, setReponsesChoisies] = useState<Record<number, number>>({});
  const [quizSoumis, setQuizSoumis] = useState(false);
  const [imgActive, setImgActive] = useState(0);

  if (!cours) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-6xl mb-4">😕</p>
          <p className="text-gray-500 text-lg">Cours introuvable.</p>
          <button onClick={() => navigate("/")} className="mt-4 text-orange-500 hover:underline text-sm">
            Retour aux cours
          </button>
        </div>
      </div>
    );
  }

  const score = cours.quiz.reduce((acc, q, i) => acc + (reponsesChoisies[i] === q.reponse ? 1 : 0), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-orange-500 mb-6 transition">
          ← Retour
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

          {/* Image principale */}
          <img src={cours.image} alt={cours.titre} className="w-full h-60 object-cover" />

          <div className="p-6">
            <span className="text-xs bg-orange-100 text-orange-600 px-3 py-1 rounded-full font-semibold">
              {cours.categorie}
            </span>
            <h1 className="text-2xl font-extrabold text-blue-900 mt-3 mb-1">{cours.titre}</h1>
            <div className="flex gap-4 text-sm text-gray-400 mb-4">
              <span>👤 {cours.instructeur}</span>
              <span>🕐 {cours.duree}</span>
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed">{cours.description}</p>

            {/* Galerie d'images */}
            <div className="mb-6">
              <h2 className="text-base font-bold text-blue-900 mb-3">🖼️ Aperçu du cours</h2>
              <div className="rounded-xl overflow-hidden border border-gray-100 mb-3">
                <img
                  src={cours.images[imgActive]}
                  alt={`Aperçu ${imgActive + 1}`}
                  className="w-full h-52 object-contain bg-gray-50"
                />
              </div>
              <div className="flex gap-2">
                {cours.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setImgActive(i)}
                    className={`flex-1 rounded-lg overflow-hidden border-2 transition ${imgActive === i ? "border-blue-500" : "border-transparent"}`}
                  >
                    <img src={img} alt={`thumb ${i}`} className="w-full h-14 object-contain bg-gray-100" />
                  </button>
                ))}
              </div>
            </div>

            {/* Lien YouTube */}
            <a
              href={cours.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-6 hover:bg-red-100 transition group"
            >
              <span className="text-2xl">▶️</span>
              <div>
                <p className="text-sm font-bold text-red-700 group-hover:underline">Regarder le cours sur YouTube</p>
                <p className="text-xs text-red-400">Cliquez pour ouvrir la vidéo complète</p>
              </div>
            </a>

            {/* Sections du cours */}
            <div className="mb-6">
              <h2 className="text-lg font-bold text-blue-900 mb-4">📚 Contenu du cours</h2>
              <div className="space-y-4">
                {cours.sections.map((section, i) => (
                  <div key={i} className="bg-blue-50 rounded-xl p-4 border-l-4 border-blue-400">
                    <h3 className="text-base font-bold text-blue-800 mb-2">{section.titre}</h3>
                    <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{section.contenu}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Progression */}
            <div className="bg-orange-50 rounded-xl p-4 border-l-4 border-orange-400 mb-6">
              <h2 className="text-base font-bold text-blue-800 mb-3">📈 Votre progression</h2>
              <BarreProgression progression={cours.progression} />
            </div>

            {/* Quiz */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
              <h2 className="text-lg font-bold text-blue-900 mb-1">🧠 Quiz - Testez vos connaissances</h2>
              <p className="text-sm text-gray-400 mb-5">{cours.quiz.length} questions sur ce cours</p>
              <div className="space-y-6">
                {cours.quiz.map((q, qi) => (
                  <div key={qi}>
                    <p className="font-semibold text-gray-800 mb-3">{qi + 1}. {q.question}</p>
                    <div className="space-y-2">
                      {q.options.map((opt, oi) => {
                        const choisi = reponsesChoisies[qi] === oi;
                        const correct = q.reponse === oi;
                        let style = "border border-gray-200 text-gray-700 hover:border-blue-400 hover:bg-blue-50";
                        if (quizSoumis) {
                          if (correct) style = "border-2 border-green-500 bg-green-50 text-green-800 font-semibold";
                          else if (choisi) style = "border-2 border-red-400 bg-red-50 text-red-700";
                          else style = "border border-gray-200 text-gray-400";
                        } else if (choisi) {
                          style = "border-2 border-blue-500 bg-blue-50 text-blue-800 font-semibold";
                        }
                        return (
                          <button
                            key={oi}
                            disabled={quizSoumis}
                            onClick={() => setReponsesChoisies((prev) => ({ ...prev, [qi]: oi }))}
                            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm transition ${style}`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              {!quizSoumis ? (
                <button
                  onClick={() => setQuizSoumis(true)}
                  disabled={Object.keys(reponsesChoisies).length < cours.quiz.length}
                  className="mt-6 w-full bg-blue-900 text-white py-3 rounded-xl font-semibold hover:bg-blue-800 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Soumettre le quiz
                </button>
              ) : (
                <div className={`mt-6 p-4 rounded-xl text-center font-bold text-lg ${score === cours.quiz.length ? "bg-green-100 text-green-700" : score >= cours.quiz.length / 2 ? "bg-orange-100 text-orange-700" : "bg-red-100 text-red-700"}`}>
                  {score === cours.quiz.length ? "🎉 Parfait !" : score >= cours.quiz.length / 2 ? "👍 Bien joué !" : "💪 Continuez à réviser !"}
                  <p className="text-base font-normal mt-1">Score : {score} / {cours.quiz.length}</p>
                  <button
                    onClick={() => { setQuizSoumis(false); setReponsesChoisies({}); }}
                    className="mt-3 text-sm underline font-normal opacity-70 hover:opacity-100"
                  >
                    Recommencer le quiz
                  </button>
                </div>
              )}
            </div>

            {/* Commentaires */}
            <div>
              <h2 className="text-lg font-bold text-blue-900 mb-4">💬 Avis des apprenants</h2>
              <div className="space-y-4">
                {cours.commentaires.map((c, i) => (
                  <div key={i} className="flex gap-4 bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <div className="w-10 h-10 rounded-full bg-blue-900 text-white flex items-center justify-center text-sm font-bold shrink-0">
                      {c.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-gray-800 text-sm">{c.auteur}</span>
                        <span className="text-yellow-400 text-sm">{"★".repeat(c.note)}{"☆".repeat(5 - c.note)}</span>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">{c.texte}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

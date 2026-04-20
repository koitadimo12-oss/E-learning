import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { listeCours, type Cours } from "../services/coursService";
import type { Etudiant } from "../services/etudiantService";

type CoursSuivi = Etudiant["coursSuivis"][number];
import EnteteRetour from "../composants/EnteteRetour";
import BarreProgression from "../composants/BarreProgression";
import PiedPage from "../composants/PiedPage";

type SectionTableauBord =
  | "overview"
  | "mes-cours"
  | "recommandations"
  | "historique"
  | "profil"
  | "quiz"
  | "contenu";

function MenuButton(props: any) {
  const { label, onClick, active = false } = props;
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left rounded-lg px-3 py-2 text-sm transition ${
        active ? "bg-gray-100 font-semibold text-gray-900" : "text-gray-700 hover:bg-gray-50"
      }`}
    >
      {label}
    </button>
  );
}

type ImageOuBadgeProps = {
  cours: Cours;
};

function ImageOuBadge(props: ImageOuBadgeProps) {
  const { cours } = props;
  if (!cours.image) {
    return (
      <div className="w-16 h-16 rounded-lg bg-gradient-to-r from-blue-700 to-indigo-600 text-white flex items-center justify-center text-xs font-bold text-center px-2">
        {cours.badge ?? cours.categorie}
      </div>
    );
  }

  return <img src={cours.image} alt={cours.titre} className="w-16 h-16 object-cover rounded-lg" />;
}

export default function TableauBord(props: any) {
  const { etudiant, onDeconnexion } = props;
  const navigate = useNavigate();
  const [sectionActive, setSectionActive] = useState<SectionTableauBord>("overview");
  const [coursSelectionne, setCoursSelectionne] = useState<Cours | null>(null);

  const coursSuivis: Cours[] = [];
  for (const suivi of etudiant.coursSuivis) {
    const coursTrouve = listeCours.find((item) => item.id === suivi.idCours);
    if (coursTrouve) {
      coursSuivis.push({ ...coursTrouve, progression: suivi.progression });
    }
  }

  const idsCoursSuivis = new Set<number>();
  for (const suivi of etudiant.coursSuivis) {
    idsCoursSuivis.add(suivi.idCours);
  }

  const nonCommences: Cours[] = [];
  for (const cours of listeCours) {
    if (!idsCoursSuivis.has(cours.id)) {
      nonCommences.push(cours);
    }
  }

  const recommendations: Array<{ cours: Cours; progression: number }> = [];
  for (const suivi of etudiant.coursSuivis) {
    if (suivi.progression < 40) {
      const coursTrouve = listeCours.find((item) => item.id === suivi.idCours);
      if (coursTrouve) {
        recommendations.push({ cours: coursTrouve, progression: suivi.progression });
      }
    }
  }

  for (const cours of nonCommences.slice(0, 3)) {
    recommendations.push({ cours, progression: 0 });
  }

  const recommendationsSansDoublon: Array<{ cours: Cours; progression: number }> = [];
  const idsRecommandes = new Set<number>();
  for (const item of recommendations) {
    if (!idsRecommandes.has(item.cours.id)) {
      idsRecommandes.add(item.cours.id);
      recommendationsSansDoublon.push(item);
    }
  }

  const totalCoursSuivis = etudiant.coursSuivis.length;
  const totalCoursPlateforme = listeCours.length;
  const moyenne = Math.round(
    etudiant.coursSuivis.reduce((acc: number, cs: CoursSuivi) => acc + cs.progression, 0) / Math.max(1, totalCoursPlateforme)
  );

  function ouvrirContenuCours(cours: Cours) {
    setCoursSelectionne(cours);
    setSectionActive("contenu");
  }

  function renderOverview() {
    return (
      <>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Bonjour, {etudiant.nom}</h1>
            <p className="text-gray-600 mt-2 max-w-xl">
              Voici votre tableau de bord : progression, recommandations et historique.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setSectionActive("profil")}
            className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 w-full md:w-80 text-left hover:shadow-lg transition"
          >
            <p className="text-sm text-gray-500 font-semibold">Progression moyenne</p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-4xl font-bold text-blue-700">{moyenne}%</span>
              <span className="text-gray-500">sur {totalCoursPlateforme} cours</span>
            </div>
            <div className="mt-4">
              <BarreProgression progression={moyenne} />
            </div>
          </button>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Progression des cours</h2>
          {coursSuivis.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {coursSuivis.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => ouvrirContenuCours(c)}
                  className="bg-white rounded-xl shadow p-6 text-left hover:shadow-lg transition"
                >
                  <div className="flex items-center gap-4">
                    <ImageOuBadge cours={c} />
                    <div>
                      <h3 className="font-bold">{c.titre}</h3>
                      <p className="text-sm text-gray-500">{c.instructeur}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <BarreProgression progression={c.progression ?? 0} />
                  </div>
                  <div className="mt-4 w-full bg-orange-500 text-white py-2 rounded-lg text-center font-semibold">
                    Continuer
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow p-8">
              <p className="text-gray-700 font-semibold">
                Vous n’avez encore suivi aucun cours. Lancez votre premier apprentissage !
              </p>
              <button
                onClick={() => navigate("/cours")}
                className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Explorer les cours
              </button>
            </div>
          )}
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Recommandations</h2>
          {recommendationsSansDoublon.length > 0 ? (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
              {recommendationsSansDoublon.slice(0, 6).map(({ cours, progression }) => (
                <button
                  key={cours.id}
                  type="button"
                  onClick={() => ouvrirContenuCours(cours)}
                  className="bg-white rounded-xl shadow p-5 w-full text-left hover:shadow-lg transition"
                >
                  <div className="flex items-center gap-3">
                    <ImageOuBadge cours={cours} />
                    <div>
                      <h3 className="font-bold">{cours.titre}</h3>
                      <p className="text-sm text-gray-500">{cours.instructeur}</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <BarreProgression progression={progression} />
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 bg-white rounded-xl shadow p-6">
              Rien à recommander pour le moment. Continuez comme ça !
            </p>
          )}
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Historique des cours</h2>
          {coursSuivis.length > 0 ? (
            <div className="bg-white rounded-xl shadow overflow-hidden">
              <div className="grid grid-cols-5 gap-4 bg-gray-50 px-6 py-3 text-sm font-semibold text-gray-700">
                <div>Nom</div>
                <div>Instructeur</div>
                <div className="col-span-2">Progression</div>
                <div>Action</div>
              </div>
              <div className="divide-y">
                {coursSuivis.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => ouvrirContenuCours(c)}
                    className="w-full text-left px-6 py-4 grid grid-cols-5 gap-4 items-center hover:bg-gray-50 transition"
                  >
                    <div className="font-medium">{c.titre}</div>
                    <div className="text-gray-600 text-sm">{c.instructeur}</div>
                    <div className="col-span-2">
                      <BarreProgression progression={c.progression ?? 0} />
                    </div>
                    <div className="text-right">
                      <span className="inline-block bg-gray-900 text-white px-4 py-2 rounded-lg">Voir</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow p-8 text-gray-700 font-semibold">
              Votre historique apparaîtra ici après le quiz.
            </div>
          )}
        </div>
      </>
    );
  }

  function renderMesCours() {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Mes cours</h2>
        {coursSuivis.length === 0 ? (
          <p className="bg-white p-6 rounded-xl shadow text-gray-600">
            Vous n’avez pas encore de cours suivis.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {coursSuivis.map((cours) => (
              <button
                key={cours.id}
                type="button"
                onClick={() => ouvrirContenuCours(cours)}
                className="bg-white rounded-xl shadow p-6 text-left hover:shadow-lg transition"
              >
                <div className="flex items-center gap-4">
                  <ImageOuBadge cours={cours} />
                  <div>
                    <p className="font-bold">{cours.titre}</p>
                    <p className="text-sm text-gray-500">{cours.instructeur}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <BarreProgression progression={cours.progression ?? 0} />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  function renderRecommandations() {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Recommandations</h2>
        <div className="space-y-4">
          {recommendationsSansDoublon.slice(0, 6).map(({ cours, progression }) => (
            <button
              key={cours.id}
              type="button"
              onClick={() => ouvrirContenuCours(cours)}
              className="bg-white rounded-xl shadow p-6 text-left w-full hover:shadow-lg transition"
            >
              <div className="flex items-center gap-4">
                <ImageOuBadge cours={cours} />
                <div>
                  <p className="font-bold">{cours.titre}</p>
                  <p className="text-sm text-gray-500">{cours.instructeur}</p>
                </div>
              </div>
              <div className="mt-4">
                <BarreProgression progression={progression} />
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  function renderHistorique() {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Historique des cours</h2>
        {coursSuivis.length === 0 ? (
          <p className="bg-white p-6 rounded-xl shadow text-gray-600">Aucun historique pour le moment.</p>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="grid grid-cols-5 gap-4 bg-gray-50 px-6 py-3 text-sm font-semibold text-gray-700">
              <div>Nom</div>
              <div>Instructeur</div>
              <div className="col-span-2">Progression</div>
              <div>Action</div>
            </div>
            <div className="divide-y">
              {coursSuivis.map((cours) => (
                <button
                  key={cours.id}
                  type="button"
                  onClick={() => ouvrirContenuCours(cours)}
                  className="w-full text-left px-6 py-4 grid grid-cols-5 gap-4 items-center hover:bg-gray-50 transition"
                >
                  <div>{cours.titre}</div>
                  <div className="text-sm text-gray-600">{cours.instructeur}</div>
                  <div className="col-span-2">
                    <BarreProgression progression={cours.progression ?? 0} />
                  </div>
                  <div className="text-right">
                    <span className="inline-block bg-gray-900 text-white px-4 py-2 rounded-lg">Voir</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  function renderProfil() {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Profil étudiant</h2>
        <div className="bg-white rounded-xl shadow border border-gray-100 p-6">
          <p className="text-sm text-gray-500">Nom</p>
          <p className="font-semibold text-gray-900">{etudiant.nom}</p>
          <p className="text-sm text-gray-500 mt-4">Email</p>
          <p className="font-semibold text-gray-900">{etudiant.email}</p>
          <p className="text-sm text-gray-500 mt-4">Cours suivis</p>
          <p className="font-semibold text-gray-900">{totalCoursSuivis}</p>
          <button
            type="button"
            onClick={() => navigate("/profil")}
            className="mt-6 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Ouvrir la page profil complète
          </button>
        </div>
      </div>
    );
  }

  function renderQuiz() {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Quiz</h2>
        {!coursSelectionne ? (
          <p className="bg-white p-6 rounded-xl shadow text-gray-600">
            Choisissez un cours dans "Mes cours" pour voir ses questions de quiz.
          </p>
        ) : (
          <div className="bg-white rounded-xl shadow p-6">
            <p className="font-bold text-gray-900">{coursSelectionne.titre}</p>
            <div className="mt-4 space-y-3">
              {coursSelectionne.quiz.map((q, index) => (
                <div key={index} className="border border-gray-100 rounded-lg p-4">
                  <p className="font-semibold">
                    {index + 1}. {q.question}
                  </p>
                  <ul className="mt-2 list-disc pl-5 text-sm text-gray-600">
                    {q.options.map((option, optionIndex) => (
                      <li key={optionIndex}>{option}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  function renderContenuCours() {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Contenu du cours</h2>
        {!coursSelectionne ? (
          <p className="bg-white p-6 rounded-xl shadow text-gray-600">
            Cliquez sur un cours pour afficher son contenu ici.
          </p>
        ) : (
          <div className="bg-white rounded-xl shadow border border-gray-100 p-6">
            <div className="flex items-center gap-4">
              <ImageOuBadge cours={coursSelectionne} />
              <div>
                <p className="font-bold text-lg text-gray-900">{coursSelectionne.titre}</p>
                <p className="text-sm text-gray-600">{coursSelectionne.description}</p>
              </div>
            </div>

            <div className="mt-5">
              <p className="font-semibold text-gray-900">Chapitres</p>
              <ul className="mt-2 list-disc pl-6 text-gray-700 space-y-1">
                {coursSelectionne.chapitres.map((chapitre) => (
                  <li key={chapitre.id}>
                    {chapitre.titre} ({chapitre.duree})
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-5">
              <p className="font-semibold text-gray-900">Quiz du cours</p>
              <p className="text-sm text-gray-600 mt-1">{coursSelectionne.quiz.length} questions disponibles</p>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setSectionActive("quiz")}
                className="bg-orange-500 text-white px-5 py-2 rounded-lg hover:bg-orange-600 transition"
              >
                Voir les questions quiz
              </button>
              <button
                type="button"
                onClick={() => navigate(`/cours/${coursSelectionne.id}`)}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Ouvrir le cours complet
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  function renderSectionActive() {
    if (sectionActive === "overview") return renderOverview();
    if (sectionActive === "mes-cours") return renderMesCours();
    if (sectionActive === "recommandations") return renderRecommandations();
    if (sectionActive === "historique") return renderHistorique();
    if (sectionActive === "profil") return renderProfil();
    if (sectionActive === "quiz") return renderQuiz();
    return renderContenuCours();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white dark:from-slate-900 dark:to-slate-950 text-gray-900 dark:text-slate-100">
      <EnteteRetour to="/" label="Accueil" titre="Tableau de bord" sousTitre={etudiant.email} />

      <section className="max-w-7xl mx-auto px-6 md:px-10 py-12">
        <div className="grid lg:grid-cols-[280px_1fr] gap-8 items-start">
          <aside className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-700 shadow p-5 sticky top-16">
            <button
              type="button"
              onClick={() => setSectionActive("profil")}
              className="w-full text-left p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition"
            >
              <p className="font-bold text-gray-900">{etudiant.nom}</p>
              <p className="text-sm text-gray-500">{etudiant.email}</p>
              <p className="text-xs text-blue-700 mt-2 font-semibold">Voir mon profil etudiant</p>
            </button>

            <div className="mt-5">
              <p className="text-xs font-semibold text-gray-400 uppercase">Favorites</p>
              <div className="mt-2 space-y-2">
                <MenuButton
                  label="Overview"
                  onClick={() => setSectionActive("overview")}
                  active={sectionActive === "overview"}
                />
                <MenuButton
                  label="Contenu cours"
                  onClick={() => setSectionActive("contenu")}
                  active={sectionActive === "contenu"}
                />
              </div>
            </div>

            <div className="mt-5">
              <p className="text-xs font-semibold text-gray-400 uppercase">Pages</p>
              <div className="mt-2 space-y-2">
                <MenuButton
                  label="Mes cours"
                  onClick={() => setSectionActive("mes-cours")}
                  active={sectionActive === "mes-cours"}
                />
                <MenuButton
                  label="Recommandations"
                  onClick={() => setSectionActive("recommandations")}
                  active={sectionActive === "recommandations"}
                />
                <MenuButton
                  label="Historique"
                  onClick={() => setSectionActive("historique")}
                  active={sectionActive === "historique"}
                />
                <MenuButton
                  label="Quiz"
                  onClick={() => setSectionActive("quiz")}
                  active={sectionActive === "quiz"}
                />
                <MenuButton
                  label="Profil"
                  onClick={() => setSectionActive("profil")}
                  active={sectionActive === "profil"}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate("/cours")}
              className="mt-6 w-full bg-gray-900 dark:bg-slate-800 text-white py-2 rounded-xl hover:bg-gray-800 dark:hover:bg-slate-700 transition font-semibold"
            >
              Aller au catalogue
            </button>
            <button
              type="button"
              onClick={() => {
                onDeconnexion();
                navigate("/");
              }}
              className="mt-3 w-full border border-gray-200 dark:border-slate-600 text-gray-800 dark:text-slate-200 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition font-semibold text-sm"
            >
              Déconnexion
            </button>
          </aside>

          <div>{renderSectionActive()}</div>
        </div>
      </section>

      <PiedPage />
    </div>
  );
}


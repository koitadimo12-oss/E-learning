import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";

import type { Etudiant } from "./services/etudiantService";
import Accueil from "./pages/Acceuil";
import ListeCours from "./pages/ListeCours";
import DetailCours from "./pages/DetailCours";
import Connexion from "./pages/Connexion";
import Inscription from "./pages/Inscription";
import Profil from "./pages/Profil";
import TableauBord from "./pages/TableauBord";
import Contact from "./pages/Contact";
import AdminConnexion from "./pages/AdminConnexion";
import DashboardAdmin from "./pages/DashboardAdmin";
import Favoris from "./pages/Favoris";
import ModeApprentissagePage from "./pages/ModeApprentissage";
import ChoixLangue from "./pages/ChoixLangue";
import MiniJeu from "./pages/MiniJeu";
import Bibliotheque from "./pages/Bibliotheque";
import { getSessionEtudiant } from "./services/etudiantService";
import { chargerCours } from "./services/coursApi";
import { getThemePref } from "./services/stockageLocal";
import Chatbot from "./composants/Chatbot";
import PageTransition from "./composants/PageTransition";
import { getAuthToken } from "./services/apiClient";


export default function App(_props: any) {
  const [etudiant, setEtudiant] = useState<Etudiant | null>(null);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", getThemePref() === "dark");
    Promise.all([getSessionEtudiant(), chargerCours()])
      .then(([session]) => { if (session) setEtudiant(session); })
      .finally(() => setChargement(false));
  }, []);

  const handleDeconnexion = () => {
    setEtudiant(null);
    import("./services/authApi").then(({ authApi }) => authApi.logout());
  };

  const shell = { etudiant, onDeconnexion: handleDeconnexion, chargement };

  if (chargement) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        Chargement...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <ScrollToTop />
      <PageTransition>
      <Routes>
        <Route path="/" element={<Accueil {...shell} />} />
        <Route path="/langue" element={<ChoixLangue {...shell} />} />
        <Route path="/cours" element={<ListeCours {...shell} />} />
        <Route
          path="/cours/:id"
          element={
            <DetailCours
              etudiant={etudiant}
              onDeconnexion={handleDeconnexion}
              setEtudiant={(e: Etudiant) => setEtudiant(e)}
            />
          }
        />
        <Route path="/connexion" element={<Connexion setEtudiant={(e: Etudiant) => setEtudiant(e)} />} />
        <Route path="/inscription" element={<Inscription setEtudiant={(e: Etudiant) => setEtudiant(e)} />} />
        <Route
          path="/mode-apprentissage"
          element={etudiant ? <ModeApprentissagePage etudiant={etudiant} setEtudiant={(e: Etudiant) => setEtudiant(e)} /> : <Navigate to="/connexion" replace />}
        />
        <Route
          path="/profil"
          element={
            etudiant ? (
              etudiant.onboardingApprentissageTermine ? (
                <Profil etudiant={etudiant} onDeconnexion={handleDeconnexion} />
              ) : (
                <Navigate to="/mode-apprentissage" replace />
              )
            ) : (
              <Navigate to="/connexion" replace />
            )
          }
        />
        <Route
          path="/tableau-bord"
          element={
            etudiant ? (
              etudiant.onboardingApprentissageTermine ? (
                <TableauBord etudiant={etudiant} onDeconnexion={handleDeconnexion} setEtudiant={(e: Etudiant) => setEtudiant(e)} />
              ) : (
                <Navigate to="/mode-apprentissage" replace />
              )
            ) : (
              <Navigate to="/connexion" replace />
            )
          }
        />
        <Route path="/mini-jeu" element={etudiant ? <MiniJeu etudiant={etudiant} onDeconnexion={handleDeconnexion} setEtudiant={(e: Etudiant) => setEtudiant(e)} /> : <Navigate to="/connexion" replace />} />
        <Route path="/bibliotheque" element={<Bibliotheque etudiant={etudiant} onDeconnexion={handleDeconnexion} />} />
        <Route path="/favoris" element={<Favoris {...shell} />} />
        <Route path="/admin" element={<AdminConnexion />} />
        <Route path="/admin/dashboard" element={<DashboardAdmin />} />
        <Route path="/a-propos" element={<Navigate to="/#a-propos" replace />} />
        <Route path="/contact" element={<Contact {...shell} />} />
      </Routes>
      </PageTransition>
      <GlobalChatbot />
    </BrowserRouter>
  );
}

/** Chatbot global — visible partout sauf admin et bibliothèque.
 *  Si l'utilisateur n'est pas connecté, le chatbot affiche un message
 *  invitant à se connecter au lieu de répondre via l'IA. */
function GlobalChatbot() {
  const { pathname } = useLocation();
  // Masqué sur la bibliothèque (elle a son propre chatbot) et le dashboard admin
  if (pathname === "/bibliotheque" || pathname.startsWith("/admin")) return null;
  return <Chatbot isAuthenticated={!!getAuthToken()} />;
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, left: 0, behavior: "auto" }); }, [pathname]);
  return null;
}

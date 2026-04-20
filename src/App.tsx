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
import Challenges from "./pages/Challenges";
import Communaute from "./pages/Communaute";
import ProjetsEtudiants from "./pages/ProjetsEtudiants";
import Classements from "./pages/Classements";
import ModeDemo from "./pages/ModeDemo";
import ConnexionFormateur from "./pages/ConnexionFormateur";
import InscriptionFormateur from "./pages/InscriptionFormateur";
import DashboardFormateur from "./pages/DashboardFormateur";
import FormateurPending from "./pages/FormateurPending";
import FormateurSuccess from "./pages/FormateurSuccess";
import AdminConnexion from "./pages/AdminConnexion";
import DashboardAdmin from "./pages/DashboardAdmin";
import Favoris from "./pages/Favoris";
import { getSessionEtudiant, setSessionEtudiant } from "./services/etudiantService";
import { getThemePref } from "./services/stockageLocal";
import { graineFormateursDemo } from "./services/formateurService";

export default function App(_props: any) {
  const [etudiant, setEtudiant] = useState<Etudiant | null>(null);

  useEffect(() => {
    graineFormateursDemo();
    const session = getSessionEtudiant();
    if (session) setEtudiant(session);
    document.documentElement.classList.toggle("dark", getThemePref() === "dark");
  }, []);

  useEffect(() => {
    setSessionEtudiant(etudiant);
  }, [etudiant]);

  const handleDeconnexion = () => {
    setEtudiant(null);
    setSessionEtudiant(null);
  };

  const shell = { etudiant, onDeconnexion: handleDeconnexion };

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Accueil {...shell} />} />
        <Route path="/demo" element={<ModeDemo {...shell} />} />

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
          path="/profil"
          element={
            etudiant ? <Profil etudiant={etudiant} onDeconnexion={handleDeconnexion} /> : <Navigate to="/connexion" replace />
          }
        />

        <Route
          path="/tableau-bord"
          element={
            etudiant ? <TableauBord etudiant={etudiant} onDeconnexion={handleDeconnexion} /> : <Navigate to="/connexion" replace />
          }
        />

        <Route path="/challenges" element={etudiant ? <Challenges {...shell} /> : <Navigate to="/connexion" replace />} />
        <Route path="/communaute" element={etudiant ? <Communaute {...shell} /> : <Navigate to="/connexion" replace />} />
        <Route path="/projets-etudiants" element={etudiant ? <ProjetsEtudiants {...shell} /> : <Navigate to="/connexion" replace />} />
        <Route path="/classements" element={etudiant ? <Classements {...shell} /> : <Navigate to="/connexion" replace />} />
        <Route path="/favoris" element={<Favoris {...shell} />} />

        <Route path="/connexion-formateur" element={<ConnexionFormateur />} />
        <Route path="/inscription-formateur" element={<InscriptionFormateur />} />
        <Route path="/dashboard-formateur" element={<Navigate to="/formateur/dashboard" replace />} />
        <Route path="/formateur/pending" element={<FormateurPending />} />
        <Route path="/formateur/success" element={<FormateurSuccess />} />
        <Route path="/formateur/dashboard" element={<DashboardFormateur />} />

        <Route path="/admin" element={<AdminConnexion />} />
        <Route path="/admin/dashboard" element={<DashboardAdmin />} />

        <Route path="/a-propos" element={<Navigate to="/#a-propos" replace />} />
        <Route path="/contact" element={<Contact {...shell} />} />
      </Routes>
    </BrowserRouter>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  return null;
}

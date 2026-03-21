import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import type { Etudiant } from "./services/etudiantService";
import Accueil from "./pages/Acceuil";
import ListeCours from "./pages/ListeCours";
import DetailCours from "./pages/DetailCours";
import Connexion from "./pages/Connexion";
import Inscription from "./pages/Inscription";
import Profil from "./pages/Profil";
import TableauBord from "./pages/TableauBord";
import APropos from "./pages/APropos";
import Contact from "./pages/Contact";
import { getSessionEtudiant, setSessionEtudiant } from "./services/etudiantService";

export default function App(_props: any) {
  const [etudiant, setEtudiant] = useState<Etudiant | null>(null);

  useEffect(() => {
    const session = getSessionEtudiant();
    if (session) setEtudiant(session);
  }, []);

  useEffect(() => {
    setSessionEtudiant(etudiant);
  }, [etudiant]);

  const handleDeconnexion = () => {
    setEtudiant(null);
    setSessionEtudiant(null);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Accueil etudiant={etudiant} onDeconnexion={handleDeconnexion} />} />

        <Route
          path="/cours"
          element={<ListeCours etudiant={etudiant} onDeconnexion={handleDeconnexion} />}
        />

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
            etudiant ? (
              <Profil etudiant={etudiant} onDeconnexion={handleDeconnexion} />
            ) : (
              <Navigate to="/connexion" replace />
            )
          }
        />

        <Route
          path="/tableau-bord"
          element={
            etudiant ? (
              <TableauBord etudiant={etudiant} onDeconnexion={handleDeconnexion} />
            ) : (
              <Navigate to="/connexion" replace />
            )
          }
        />

        <Route path="/a-propos" element={<APropos etudiant={etudiant} onDeconnexion={handleDeconnexion} />} />
        <Route path="/contact" element={<Contact etudiant={etudiant} onDeconnexion={handleDeconnexion} />} />

      </Routes>
    </BrowserRouter>
  );
}

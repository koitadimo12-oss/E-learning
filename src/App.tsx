import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import type { Etudiant } from "./services/etudiantService";
import Accueil from "./pages/Acceuil";
import ListeCours from "./pages/ListeCours";
import DetailCours from "./pages/DetailCours";
import Connexion from "./pages/Connexion";
import Inscription from "./pages/Inscription";
import Profil from "./pages/Profil";
import TableauBord from "./pages/TableauBord";

export default function App() {
  const [etudiant, setEtudiant] = useState<Etudiant | null>(null);
  const handleDeconnexion = () => setEtudiant(null);

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
            etudiant ? (
              <DetailCours etudiant={etudiant} onDeconnexion={handleDeconnexion} />
            ) : (
              <Navigate to="/connexion" replace />
            )
          }
        />

        <Route path="/connexion" element={<Connexion setEtudiant={(e) => setEtudiant(e)} />} />
        <Route path="/inscription" element={<Inscription setEtudiant={(e) => setEtudiant(e)} />} />

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

      </Routes>
    </BrowserRouter>
  );
}

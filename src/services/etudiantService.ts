export interface Etudiant {
  id: number;
  nom: string;
  email: string;
  motDePasse: string;
  coursSuivis: { idCours: number; progression: number }[];
}

const etudiants: Etudiant[] = [
  {
    id: 1,
    nom: "Abdou Wahab",
    email: "wahab@example.com",
    motDePasse: "123456",
    coursSuivis: [
      { idCours: 1, progression: 40 },
      { idCours: 2, progression: 20 },
    ],
  },
];

export function inscriptionEtudiant(nom: string, email: string, motDePasse: string): Etudiant {
  const newEtudiant: Etudiant = {
    id: etudiants.length + 1,
    nom,
    email,
    motDePasse,
    coursSuivis: [],
  };
  etudiants.push(newEtudiant);
  return newEtudiant;
}

export function connexionEtudiant(email: string, motDePasse: string): Etudiant | null {
  return etudiants.find(e => e.email === email && e.motDePasse === motDePasse) || null;
}

export function getEtudiant(id: number): Etudiant | undefined {
  return etudiants.find(e => e.id === id);
}

export function mettreAJourProgression(idEtudiant: number, idCours: number, progression: number) {
  const etudiant = etudiants.find(e => e.id === idEtudiant);
  if (!etudiant) return;
  const coursSuivi = etudiant.coursSuivis.find(cs => cs.idCours === idCours);
  if (coursSuivi) coursSuivi.progression = progression;
  else etudiant.coursSuivis.push({ idCours, progression });
}

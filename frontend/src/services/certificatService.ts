import { jsPDF } from "jspdf";

export function genererCertificatPdf(nomEtudiant: string, titreCours: string, dateValidation: string) {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const width = doc.internal.pageSize.getWidth();
  const height = doc.internal.pageSize.getHeight();

  doc.setFillColor(248, 250, 252);
  doc.rect(0, 0, width, height, "F");

  doc.setDrawColor(30, 64, 175);
  doc.setLineWidth(2);
  doc.rect(10, 10, width - 20, height - 20);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(32);
  doc.setTextColor(15, 23, 42);
  doc.text("CERTIFICAT DE REUSSITE", width / 2, 45, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(16);
  doc.text("Ce document certifie que", width / 2, 68, { align: "center" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setTextColor(30, 64, 175);
  doc.text(nomEtudiant, width / 2, 84, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(15);
  doc.setTextColor(15, 23, 42);
  doc.text("a valide avec succes le parcours et le projet final du cours", width / 2, 100, { align: "center" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text(titreCours, width / 2, 115, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(13);
  doc.text(`Date de validation : ${new Date(dateValidation).toLocaleDateString("fr-FR")}`, width / 2, 136, {
    align: "center",
  });

  doc.setFontSize(11);
  doc.setTextColor(71, 85, 105);
  doc.text("Kaay Niou Diang - Certificat numerique", width / 2, 154, { align: "center" });

  const fileName = `certificat-${titreCours.toLowerCase().replace(/\s+/g, "-")}.pdf`;
  doc.save(fileName);
}

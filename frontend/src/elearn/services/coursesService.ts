import { chargerCours, creerCours, getCoursCache, getCoursParId, modifierCours, supprimerCours } from "../../services/coursApi";
import type { Course, CourseModule, Quiz } from "../types";

const emptyQuiz = (moduleId: string): Quiz => ({
  id: `quiz-${moduleId}`,
  moduleId,
  timeLimitSec: 600,
  questions: [],
});

function mapToElearnCourse(c: import("../../services/coursService").Cours): Course {
  const modules: CourseModule[] = (c.chapitres ?? []).map((ch) => ({
    id: String(ch.id),
    title: ch.titre,
    chapters: [
      {
        id: String(ch.id),
        title: ch.titre,
        contentType: "text",
        content: ch.contenu?.join("\n") ?? "",
      },
    ],
    quiz: emptyQuiz(String(ch.id)),
  }));

  return {
    id: String(c.id),
    trainerId: "system",
    title: c.titre,
    description: c.description,
    price: 0,
    published: true,
    rating: 0,
    ratingCount: 0,
    modules,
    finalProject: "",
  };
}

export const coursesService = {
  list(): Course[] {
    return getCoursCache().map(mapToElearnCourse);
  },

  async refresh() {
    await chargerCours(true);
    return this.list();
  },

  getById(id: string) {
    const row = getCoursCache().find((c) => c.id === Number(id));
    return row ? mapToElearnCourse(row) : null;
  },

  async create(payload: Omit<Course, "id" | "rating" | "ratingCount">) {
    const row = await creerCours({
      titre: payload.title,
      description: payload.description,
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600",
      instructeur: payload.trainerId,
      categorie: "Programmation",
      niveau: "Debutant",
      duree: "2h 00",
      chapitres: [],
      quiz: [],
    });
    await chargerCours(true);
    return mapToElearnCourse(row);
  },

  async update(id: string, patch: Partial<Course>) {
    const row = await modifierCours(Number(id), {
      titre: patch.title,
      description: patch.description,
    });
    await chargerCours(true);
    return mapToElearnCourse(row);
  },

  async remove(id: string) {
    await supprimerCours(Number(id));
    await chargerCours(true);
  },

  addRating(_courseId: string, _stars: number) {
    /* optionnel */
  },
};

// Préchargement asynchrone pour getById hors cache
void getCoursParId;

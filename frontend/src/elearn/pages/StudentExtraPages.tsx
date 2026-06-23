import { Link } from "react-router-dom";
import { useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { coursesService } from "../services/coursesService";
import { enrollmentsService } from "../services/enrollmentsService";
import { progressionService } from "../services/progressionService";
import { quizResultsService } from "../services/quizResultsService";

function downloadCertificate(courseTitle: string, learnerName: string) {
  const content = `CERTIFICAT\n${learnerName}\na complété ${courseTitle}\nDate: ${new Date().toLocaleDateString("fr-FR")}`;
  const blob = new Blob([content], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${courseTitle}-certificat.pdf`;
  a.click();
  URL.revokeObjectURL(url);
}

export function StudentMesCoursPage() {
  const { user } = useAuth();
  const list = useMemo(() => {
    if (!user) return [];
    return enrollmentsService.listByUser(user.id).map((e) => coursesService.getById(e.courseId)).filter(Boolean);
  }, [user]);

  if (!user) return null;

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Mes cours</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {list.map((c) =>
          c ? (
            <article key={c.id} className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
              <p className="font-semibold">{c.title}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Progression : {progressionService.progressPercent(user.id, c.id)} %</p>
              <Link to={`/learning/${c.id}`} className="mt-2 inline-block text-sm font-medium text-blue-600">
                Continuer
              </Link>
            </article>
          ) : null,
        )}
      </div>
      {list.length === 0 && <p className="text-slate-600 dark:text-slate-400">Aucun cours. <Link to="/courses" className="text-blue-600 underline">Catalogue</Link></p>}
    </section>
  );
}

export function StudentQuizHubPage() {
  const { user } = useAuth();
  if (!user) return null;
  const enrolled = enrollmentsService.listByUser(user.id);

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Quiz</h1>
      <p className="text-sm text-slate-600 dark:text-slate-400">Accès aux quiz des modules de vos cours.</p>
      {enrolled.map((e) => {
        const course = coursesService.getById(e.courseId);
        if (!course) return null;
        return (
          <div key={e.id} className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
            <p className="font-semibold">{course.title}</p>
            <ul className="mt-2 space-y-1 text-sm">
              {course.modules.map((m) => (
                <li key={m.id}>
                  <Link to={`/quiz/${m.quiz.id}`} className="text-blue-600 hover:underline">
                    Quiz — {m.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </section>
  );
}

export function StudentProgressionPage() {
  const { user } = useAuth();
  if (!user) return null;
  const enrolled = enrollmentsService.listByUser(user.id);

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Progression</h1>
      {enrolled.map((e) => {
        const course = coursesService.getById(e.courseId);
        if (!course) return null;
        const pct = progressionService.progressPercent(user.id, course.id);
        return (
          <article key={e.id} className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
            <p className="font-semibold">{course.title}</p>
            <div className="mt-2 h-3 w-full rounded bg-slate-200 dark:bg-slate-700">
              <div className="h-3 rounded bg-blue-600" style={{ width: `${pct}%` }} />
            </div>
            <p className="mt-1 text-sm">{pct} %</p>
          </article>
        );
      })}
      {enrolled.length === 0 && <p className="text-slate-600 dark:text-slate-400">Inscrivez-vous à un cours pour voir la progression.</p>}
    </section>
  );
}

export function StudentCertificatsPage() {
  const { user } = useAuth();
  if (!user) return null;
  const completed = enrollmentsService.listByUser(user.id).flatMap((e) => {
    const course = coursesService.getById(e.courseId);
    if (!course) return [];
    if (progressionService.progressPercent(user.id, course.id) < 100) return [];
    return [{ e, course }];
  });

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Certificats</h1>
      <p className="text-sm text-slate-600 dark:text-slate-400">Téléchargement simulé (PDF) lorsque le parcours du cours est à 100 %.</p>
      {completed.map(({ e, course }) => (
        <article key={e.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
          <p className="font-semibold">{course.title}</p>
          <button type="button" className="rounded-lg bg-amber-500 px-3 py-1.5 text-sm font-semibold text-white" onClick={() => downloadCertificate(course.title, user.name)}>
            Télécharger
          </button>
        </article>
      ))}
      {completed.length === 0 && <p className="text-slate-600 dark:text-slate-400">Aucun certificat disponible pour le moment.</p>}
    </section>
  );
}

export function StudentProfilPage() {
  const { user } = useAuth();
  if (!user) return null;
  const avg = quizResultsService.averageScore(user.id);

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Profil</h1>
      <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <p>
          <span className="font-medium">Nom :</span> {user.name}
        </p>
        <p>
          <span className="font-medium">Email :</span> {user.email}
        </p>
        <p>
          <span className="font-medium">XP :</span> {user.xp} — Niveau {user.level}
        </p>
        <p>
          <span className="font-medium">Badges :</span> {user.badges.join(", ") || "—"}
        </p>
        <p>
          <span className="font-medium">Score moyen quiz :</span> {avg} %
        </p>
      </div>
    </section>
  );
}

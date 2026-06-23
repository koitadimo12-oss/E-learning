import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { coursesService } from "../services/coursesService";
import { enrollmentsService } from "../services/enrollmentsService";

export function TrainerModulesPage() {
  const { user } = useAuth();
  if (!user) return null;
  const mine = coursesService.list().filter((c) => c.trainerId === user.id);

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Modules &amp; contenu</h1>
      <p className="text-sm text-slate-600 dark:text-slate-400">Vue par cours : modules, chapitres et types de contenu (édition avancée simulée).</p>
      {mine.map((c) => (
        <article key={c.id} className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
          <p className="font-semibold">{c.title}</p>
          <ul className="mt-2 list-inside list-disc text-sm">
            {c.modules.map((m) => (
              <li key={m.id}>
                {m.title} — {m.chapters.length} chapitre(s)
              </li>
            ))}
          </ul>
        </article>
      ))}
      {mine.length === 0 && <p>Aucun cours. <Link to="/formateur/create-course" className="text-blue-600 underline">Créer un cours</Link></p>}
    </section>
  );
}

export function TrainerQuizBuilderPage() {
  const { user } = useAuth();
  if (!user) return null;
  const mine = coursesService.list().filter((c) => c.trainerId === user.id);

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Quiz Builder</h1>
      <p className="text-sm text-slate-600 dark:text-slate-400">Quiz rattachés à chaque module (aperçu).</p>
      {mine.map((c) => (
        <article key={c.id} className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
          <p className="font-semibold">{c.title}</p>
          <ul className="mt-2 text-sm">
            {c.modules.map((m) => (
              <li key={m.id}>
                {m.title} — {m.quiz.questions.length} question(s), limite {m.quiz.timeLimitSec}s
              </li>
            ))}
          </ul>
        </article>
      ))}
    </section>
  );
}

export function TrainerStudentsPage() {
  const { user } = useAuth();
  if (!user) return null;
  const mine = coursesService.list().filter((c) => c.trainerId === user.id);

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Étudiants inscrits</h1>
      {mine.map((c) => {
        const rows = enrollmentsService.listByCourse(c.id);
        return (
          <article key={c.id} className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
            <p className="font-semibold">{c.title}</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">{rows.length} inscription(s)</p>
          </article>
        );
      })}
    </section>
  );
}

export function TrainerStatsPage() {
  const { user } = useAuth();
  if (!user) return null;
  const mine = coursesService.list().filter((c) => c.trainerId === user.id);
  const students = mine.reduce((s, c) => s + enrollmentsService.listByCourse(c.id).length, 0);
  const revenue = mine.reduce((s, c) => s + enrollmentsService.listByCourse(c.id).reduce((a, e) => a + e.amount, 0), 0);

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Statistiques</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">Cours : {mine.length}</div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">Inscriptions : {students}</div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">Revenus simulés : {revenue} €</div>
      </div>
    </section>
  );
}

export function TrainerProfilPage() {
  const { user } = useAuth();
  if (!user) return null;
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Profil formateur</h1>
      <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <p>
          <span className="font-medium">Nom :</span> {user.name}
        </p>
        <p>
          <span className="font-medium">Email :</span> {user.email}
        </p>
        <p>
          <span className="font-medium">Statut :</span> {user.status}
        </p>
      </div>
    </section>
  );
}

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { coursesService } from "../services/coursesService";
import { enrollmentsService } from "../services/enrollmentsService";
import { progressionService } from "../services/progressionService";
import { quizResultsService } from "../services/quizResultsService";
import { studentDashboardStats } from "../services/analyticsService";

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-3 w-full rounded bg-slate-200 dark:bg-slate-700">
      <div className="h-3 rounded bg-emerald-500" style={{ width: `${value}%` }} />
    </div>
  );
}

export function HomePage() {
  return (
    <section className="space-y-3">
      <h1 className="text-3xl font-bold">Plateforme E-Learning complete</h1>
      <p>Frontend only, backend simule avec LocalStorage, progression, quiz, paiements et gamification.</p>
      <Link className="inline-block rounded bg-indigo-600 px-4 py-2 text-white" to="/courses">
        Explorer les cours
      </Link>
    </section>
  );
}

export function CoursesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState(coursesService.list());

  const refresh = () => setCourses(coursesService.list());

  const enroll = (courseId: string, amount: number) => {
    if (!user) {
      alert("Connectez-vous pour vous inscrire aux cours.");
      navigate("/login");
      return;
    }
    const ok = amount > 0 ? window.confirm(`Simuler paiement de ${amount} EUR ?`) : true;
    if (!ok) return;
    enrollmentsService.enroll(user.id, courseId, amount);
    alert("Inscription confirmee.");
    refresh();
  };

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">Catalogue des cours</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {courses.map((course) => {
          const enrolled = user ? enrollmentsService.isEnrolled(user.id, course.id) : false;
          return (
            <article key={course.id} className="rounded border border-slate-300 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
              <h3 className="text-xl font-bold">{course.title}</h3>
              <p className="text-sm">{course.description}</p>
              <p className="mt-2">Prix: {course.price === 0 ? "Gratuit" : `${course.price} EUR`}</p>
              <p>Rating: {course.rating} / 5</p>
              <div className="mt-3 flex gap-2">
                <Link to={`/course/${course.id}`} className="rounded bg-slate-200 px-3 py-1 dark:bg-slate-700">
                  Details
                </Link>
                {user?.role === "etudiant" && !enrolled && (
                  <button className="rounded bg-indigo-600 px-3 py-1 text-white" onClick={() => enroll(course.id, course.price)}>
                    S'inscrire
                  </button>
                )}
                {enrolled && <Link to={`/learning/${course.id}`}>Continuer</Link>}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export function CourseDetailPage() {
  const { id = "" } = useParams();
  const { user } = useAuth();
  const course = coursesService.getById(id);

  const rate = (stars: number) => {
    coursesService.addRating(id, stars);
    alert("Merci pour votre avis.");
  };

  if (!course) return <p>Cours introuvable.</p>;

  const enrolled = user ? enrollmentsService.isEnrolled(user.id, course.id) : false;

  return (
    <section className="space-y-4">
      <h2 className="text-3xl font-bold">{course.title}</h2>
      <p>{course.description}</p>
      <p>Projet final: {course.finalProject}</p>
      <h3 className="text-xl font-semibold">Modules</h3>
      <ul className="list-disc pl-5">
        {course.modules.map((m) => (
          <li key={m.id}>
            {m.title} ({m.chapters.length} chapitres)
          </li>
        ))}
      </ul>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((s) => (
          <button key={s} className="rounded bg-amber-400 px-2 py-1" onClick={() => rate(s)}>
            {s}★
          </button>
        ))}
      </div>
      {enrolled && <Link to={`/learning/${course.id}`}>Commencer l'apprentissage</Link>}
    </section>
  );
}

export function LearningPage() {
  const { id = "" } = useParams();
  const { user, grantXp } = useAuth();
  const course = coursesService.getById(id);
  const navigate = useNavigate();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTick((v) => v + 1), 500);
    return () => clearInterval(timer);
  }, []);

  if (!course || !user) return <p>Cours introuvable.</p>;
  if (!enrollmentsService.isEnrolled(user.id, id)) return <p>Inscris-toi au cours avant d'acceder aux modules.</p>;
  const progress = progressionService.byCourse(user.id, id) ?? progressionService.initializeCourseProgress(user.id, id);
  if (!progress) return <p>Progression indisponible.</p>;

  const percent = progressionService.progressPercent(user.id, id);

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold">Apprentissage - {course.title}</h2>
      <ProgressBar value={percent} />
      <p>{percent}% complete</p>
      <div className="space-y-4">
        {course.modules.map((mod) => {
          const unlocked = progress.unlockedModuleIds.includes(mod.id);
          const completed = progress.completedModuleIds.includes(mod.id);
          return (
            <article key={`${mod.id}-${tick}`} className="rounded border border-slate-300 p-4 dark:border-slate-700">
              <h3 className="text-lg font-semibold">
                {mod.title} {completed ? "✅" : unlocked ? "🔓" : "🔒"}
              </h3>
              {unlocked ? (
                <>
                  <ul className="list-disc pl-5">
                    {mod.chapters.map((ch) => (
                      <li key={ch.id}>
                        {ch.title} - {ch.contentType}
                        <button
                          className="ml-2 rounded bg-slate-200 px-2 dark:bg-slate-700"
                          onClick={() => {
                            progressionService.markChapterDone(user.id, id, ch.id);
                            grantXp(5);
                            setTick((v) => v + 1);
                          }}
                        >
                          Marquer lu
                        </button>
                      </li>
                    ))}
                  </ul>
                  <button className="mt-2 rounded bg-indigo-600 px-3 py-1 text-white" onClick={() => navigate(`/quiz/${mod.quiz.id}`)}>
                    Passer le quiz
                  </button>
                </>
              ) : (
                <p>Module bloque. Valide le precedent avec score superieur ou egal a 50%.</p>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

export function QuizPage() {
  const { id = "" } = useParams();
  const { user, grantXp } = useAuth();
  const navigate = useNavigate();
  const quizRef = quizResultsService.moduleByQuizId(id);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    if (!quizRef) return;
    setSecondsLeft(quizRef.module.quiz.timeLimitSec);
  }, [quizRef]);

  useEffect(() => {
    if (!quizRef || secondsLeft <= 0) return;
    const timer = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [secondsLeft, quizRef]);

  if (!quizRef || !user) return <p>Quiz introuvable.</p>;
  const { course, module } = quizRef;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const good = module.quiz.questions.filter((q) => answers[q.id] === q.answerIndex).length;
    const res = quizResultsService.submit(user.id, course.id, module.id, good, module.quiz.questions.length);
    if (res.passed) {
      grantXp(25);
      alert(`Quiz reussi (${res.score}%). Module valide, suivant debloque.`);
    } else {
      alert(`Score ${res.score}%: echec. Revois le module puis refais le quiz.`);
    }
    navigate(`/learning/${course.id}`);
  };

  return (
    <form className="space-y-4" onSubmit={submit}>
      <h2 className="text-2xl font-bold">Quiz - {module.title}</h2>
      <p>Temps restant: {secondsLeft}s</p>
      {module.quiz.questions.map((q) => (
        <fieldset key={q.id} className="rounded border border-slate-300 p-3 dark:border-slate-700">
          <legend className="font-semibold">{q.prompt}</legend>
          {q.options.map((opt, idx) => (
            <label key={opt} className="block">
              <input type="radio" name={q.id} checked={answers[q.id] === idx} onChange={() => setAnswers((old) => ({ ...old, [q.id]: idx }))} /> {opt}
            </label>
          ))}
        </fieldset>
      ))}
      <button className="rounded bg-emerald-600 px-4 py-2 text-white" type="submit">
        Soumettre
      </button>
    </form>
  );
}

function downloadCertificate(courseTitle: string, learnerName: string) {
  const content = `CERTIFICAT\n${learnerName}\na complete ${courseTitle}\nDate: ${new Date().toLocaleDateString()}`;
  const blob = new Blob([content], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${courseTitle}-certificat.pdf`;
  a.click();
  URL.revokeObjectURL(url);
}

export function StudentDashboardPage() {
  const { user } = useAuth();

  const enrolledCourses = useMemo(() => {
    if (!user) return [];
    return enrollmentsService.listByUser(user.id).map((e) => coursesService.getById(e.courseId)).filter(Boolean);
  }, [user]);

  if (!user) return <p>Connecte-toi.</p>;
  const stats = studentDashboardStats(user.id);

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold">Dashboard etudiant</h2>
      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded bg-white p-4 dark:bg-slate-800">Cours inscrits: {stats.enrolledCount}</div>
        <div className="rounded bg-white p-4 dark:bg-slate-800">Cours termines: {stats.completedCount}</div>
        <div className="rounded bg-white p-4 dark:bg-slate-800">Score moyen quiz: {stats.avgScore}%</div>
      </div>
      <div className="rounded bg-white p-4 dark:bg-slate-800">
        <p>
          XP: {user.xp} | Niveau: {user.level}
        </p>
        <p>Badges: {user.badges.join(", ") || "Aucun badge"}</p>
      </div>
      <div>
        <h3 className="text-xl font-semibold">Mes cours et progression</h3>
        <div className="space-y-2">
          {enrolledCourses.map((course) => {
            if (!course) return null;
            const pct = progressionService.progressPercent(user.id, course.id);
            const completed = pct === 100;
            return (
              <article key={course.id} className="rounded border border-slate-300 p-3 dark:border-slate-700">
                <p className="font-semibold">{course.title}</p>
                <ProgressBar value={pct} />
                <p>{pct}%</p>
                {completed && (
                  <button className="rounded bg-amber-500 px-3 py-1 text-white" onClick={() => downloadCertificate(course.title, user.name)}>
                    Telecharger certificat
                  </button>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

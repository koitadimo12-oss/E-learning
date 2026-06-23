import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { coursesService } from "../services/coursesService";
import { enrollmentsService } from "../services/enrollmentsService";

export function TrainerDashboardPage() {
  const { user } = useAuth();
  if (!user) return null;
  const myCourses = coursesService.list().filter((c) => c.trainerId === user.id);
  const students = myCourses.reduce((sum, c) => sum + enrollmentsService.listByCourse(c.id).length, 0);

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold">Dashboard formateur</h2>
      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded bg-white p-4 dark:bg-slate-800">Cours crees: {myCourses.length}</div>
        <div className="rounded bg-white p-4 dark:bg-slate-800">Etudiants inscrits: {students}</div>
        <div className="rounded bg-white p-4 dark:bg-slate-800">
          Revenus simules: {myCourses.reduce((sum, c) => sum + enrollmentsService.listByCourse(c.id).reduce((a, e) => a + e.amount, 0), 0)} EUR
        </div>
      </div>
      <Link className="rounded bg-indigo-600 px-4 py-2 text-white" to="/formateur/create-course">
        Creer un cours
      </Link>
    </section>
  );
}

export function CreateCoursePage() {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [isFree, setIsFree] = useState(true);

  if (!user) return null;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    coursesService.create({
      trainerId: user.id,
      title,
      description,
      price: isFree ? 0 : price,
      published: true,
      finalProject: "Projet final a definir.",
      modules: [
        {
          id: `m-${crypto.randomUUID().slice(0, 6)}`,
          title: "Module 1",
          chapters: [{ id: `ch-${crypto.randomUUID().slice(0, 6)}`, title: "Chapitre 1", contentType: "text", content: "Contenu initial." }],
          quiz: {
            id: `q-${crypto.randomUUID().slice(0, 6)}`,
            moduleId: "module-1",
            timeLimitSec: 60,
            questions: [{ id: "q1", prompt: "Question initiale ?", options: ["A", "B", "C", "D"], answerIndex: 0 }],
          },
        },
      ],
    });
    setTitle("");
    setDescription("");
    alert("Cours cree.");
  };

  return (
    <form className="space-y-3" onSubmit={submit}>
      <h2 className="text-2xl font-bold">Creer un cours</h2>
      <input className="w-full rounded border p-2 text-black" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Titre" required />
      <textarea className="w-full rounded border p-2 text-black" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" required />
      <label className="block">
        <input type="checkbox" checked={isFree} onChange={(e) => setIsFree(e.target.checked)} /> Gratuit
      </label>
      {!isFree && (
        <input
          className="w-full rounded border p-2 text-black"
          type="number"
          min={1}
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          placeholder="Prix"
        />
      )}
      <button className="rounded bg-emerald-600 px-4 py-2 text-white" type="submit">
        Enregistrer
      </button>
    </form>
  );
}

export function MyCoursesPage() {
  const { user } = useAuth();
  if (!user) return null;
  const courses = coursesService.list().filter((c) => c.trainerId === user.id);
  return (
    <section className="space-y-3">
      <h2 className="text-2xl font-bold">Mes cours</h2>
      {courses.map((course) => (
        <article key={course.id} className="rounded border border-slate-300 p-3 dark:border-slate-700">
          <p className="font-semibold">{course.title}</p>
          <p>{course.description}</p>
          <p>Prix: {course.price === 0 ? "Gratuit" : `${course.price} EUR`}</p>
          <p>Etudiants: {enrollmentsService.listByCourse(course.id).length}</p>
        </article>
      ))}
    </section>
  );
}

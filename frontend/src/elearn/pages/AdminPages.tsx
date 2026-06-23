import { useState } from "react";
import { analyticsService } from "../services/analyticsService";
import { coursesService } from "../services/coursesService";
import { usersService } from "../services/usersService";

export function AdminDashboardPage() {
  const stats = analyticsService.adminStats();
  return (
    <section className="space-y-3">
      <h2 className="text-2xl font-bold">Dashboard admin</h2>
      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded bg-white p-4 dark:bg-slate-800">Utilisateurs: {stats.totalUsers}</div>
        <div className="rounded bg-white p-4 dark:bg-slate-800">Cours: {stats.totalCourses}</div>
        <div className="rounded bg-white p-4 dark:bg-slate-800">Formateurs en attente: {stats.pendingTrainers}</div>
        <div className="rounded bg-white p-4 dark:bg-slate-800">Inscriptions: {stats.totalEnrollments}</div>
        <div className="rounded bg-white p-4 dark:bg-slate-800">Revenus simules: {stats.totalRevenue} EUR</div>
      </div>
    </section>
  );
}

export function AdminUsersPage() {
  const [users, setUsers] = useState(usersService.list());
  const refresh = () => setUsers(usersService.list());

  return (
    <section className="space-y-3">
      <h2 className="text-2xl font-bold">Gestion utilisateurs (CRUD)</h2>
      {users.map((u) => (
        <article key={u.id} className="rounded border border-slate-300 p-3 dark:border-slate-700">
          <p>
            {u.name} - {u.email} - {u.role} - {u.status}
          </p>
          {u.role === "formateur" && (
            <div className="mt-2 flex gap-2">
              <button className="rounded bg-emerald-600 px-2 py-1 text-white" onClick={() => (usersService.setTrainerStatus(u.id, "active"), refresh())}>
                Valider
              </button>
              <button className="rounded bg-amber-500 px-2 py-1 text-white" onClick={() => (usersService.setTrainerStatus(u.id, "rejected"), refresh())}>
                Refuser
              </button>
            </div>
          )}
          {u.role !== "admin" && (
            <button className="mt-2 rounded bg-rose-600 px-2 py-1 text-white" onClick={() => (usersService.remove(u.id), refresh())}>
              Supprimer
            </button>
          )}
        </article>
      ))}
    </section>
  );
}

export function AdminCoursesPage() {
  const [courses, setCourses] = useState(coursesService.list());
  const refresh = () => setCourses(coursesService.list());

  return (
    <section className="space-y-3">
      <h2 className="text-2xl font-bold">Gestion cours</h2>
      {courses.map((c) => (
        <article key={c.id} className="rounded border border-slate-300 p-3 dark:border-slate-700">
          <p className="font-semibold">{c.title}</p>
          <p>Prix actuel: {c.price} EUR</p>
          <div className="mt-2 flex gap-2">
            <button className="rounded bg-slate-700 px-2 py-1 text-white" onClick={() => (coursesService.update(c.id, { price: c.price + 10 }), refresh())}>
              +10 EUR
            </button>
            <button className="rounded bg-rose-600 px-2 py-1 text-white" onClick={() => (coursesService.remove(c.id), refresh())}>
              Supprimer
            </button>
          </div>
        </article>
      ))}
    </section>
  );
}

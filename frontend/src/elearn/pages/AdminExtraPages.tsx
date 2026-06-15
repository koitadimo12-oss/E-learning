import { useState } from "react";
import { analyticsService } from "../services/analyticsService";
import { usersService } from "../services/usersService";
import { useAuth } from "../context/AuthContext";

export function AdminTrainersPage() {
  const [users, setUsers] = useState(usersService.list().filter((u) => u.role === "formateur"));
  const refresh = () => setUsers(usersService.list().filter((u) => u.role === "formateur"));

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Formateurs</h1>
      <p className="text-sm text-slate-600 dark:text-slate-400">Liste des comptes formateurs.</p>
      {users.map((u) => (
        <article key={u.id} className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
          <p className="font-semibold">{u.name}</p>
          <p className="text-sm">{u.email}</p>
          <p className="text-sm">Statut : {u.status}</p>
        </article>
      ))}
      <button type="button" className="text-sm text-blue-600 underline" onClick={refresh}>
        Rafraîchir
      </button>
    </section>
  );
}

export function AdminValidationPage() {
  const [users, setUsers] = useState(usersService.list().filter((u) => u.role === "formateur" && u.status === "pending"));
  const refresh = () => setUsers(usersService.list().filter((u) => u.role === "formateur" && u.status === "pending"));

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Validation formateurs</h1>
      {users.length === 0 && <p className="text-slate-600 dark:text-slate-400">Aucune demande en attente.</p>}
      {users.map((u) => (
        <article key={u.id} className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
          <p className="font-semibold">{u.name}</p>
          <p className="text-sm">{u.email}</p>
          <div className="mt-3 flex gap-2">
            <button type="button" className="rounded bg-emerald-600 px-3 py-1 text-sm text-white" onClick={() => (usersService.setTrainerStatus(u.id, "active"), refresh())}>
              Valider
            </button>
            <button type="button" className="rounded bg-amber-600 px-3 py-1 text-sm text-white" onClick={() => (usersService.setTrainerStatus(u.id, "rejected"), refresh())}>
              Refuser
            </button>
          </div>
        </article>
      ))}
    </section>
  );
}

export function AdminStatsPage() {
  const stats = analyticsService.adminStats();
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Statistiques globales</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
          <p className="text-sm text-slate-500">Utilisateurs</p>
          <p className="text-2xl font-bold">{stats.totalUsers}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
          <p className="text-sm text-slate-500">Cours publiés</p>
          <p className="text-2xl font-bold">{stats.totalCourses}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
          <p className="text-sm text-slate-500">Inscriptions totales</p>
          <p className="text-2xl font-bold">{stats.totalEnrollments}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
          <p className="text-sm text-slate-500">Formateurs en attente</p>
          <p className="text-2xl font-bold">{stats.pendingTrainers}</p>
        </div>
      </div>
    </section>
  );
}

export function AdminRevenuePage() {
  const stats = analyticsService.adminStats();
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Revenus (simulation)</h1>
      <p className="text-slate-600 dark:text-slate-400">Montants agrégés depuis les inscriptions payantes simulées (localStorage).</p>
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 dark:border-emerald-900 dark:bg-emerald-950/40">
        <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200">Total simulé</p>
        <p className="text-4xl font-black text-emerald-700 dark:text-emerald-300">{stats.totalRevenue} €</p>
      </div>
    </section>
  );
}

export function AdminSettingsPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Paramètres</h1>
      <p className="text-slate-600 dark:text-slate-400">Interface réservée (simulation). Aucun serveur : les réglages pourront être branchés ici plus tard.</p>
    </section>
  );
}

export function AdminProfilPage() {
  const { user } = useAuth();
  if (!user) return null;
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Profil administrateur</h1>
      <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <p>
          <span className="font-medium">Nom :</span> {user.name}
        </p>
        <p>
          <span className="font-medium">Email :</span> {user.email}
        </p>
        <p>
          <span className="font-medium">Rôle :</span> {user.role}
        </p>
      </div>
    </section>
  );
}

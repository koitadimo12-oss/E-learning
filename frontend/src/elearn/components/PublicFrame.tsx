import { Outlet } from "react-router-dom";
import BarreNavigation from "../../composants/BarreNavigation";

/** Pages publiques catalogue / auth : barre du haut + contenu */
export function PublicFrame() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <BarreNavigation fixe />
      <div className="mx-auto max-w-6xl px-4 pb-10 pt-[84px] sm:pt-[92px]">
        <Outlet />
      </div>
    </div>
  );
}

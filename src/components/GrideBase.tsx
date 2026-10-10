import CalendarDashboard from "./GrideComponents/CalendarDashboard";
import { InfoComponent } from "./GrideComponents/InfoComponent";
import LastNotes from "./GrideComponents/LastNotes";
import RecentCourses from "./GrideComponents/RecentCourses";
import Welcome from "./Welcome";

export default function GrideBase() {
  return (
    <div
      className="
        grid w-full gap-4 bg-gray-50 p-4 transition-colors dark:bg-[#181818]

        /* Mobile: 1 colonna, scroll verticale */
        grid-cols-1 auto-rows-auto overflow-y-auto

        /* Tablet: 2 colonne */
        md:grid-cols-2

        /* Desktop: 4 colonne, altezza piena, niente scroll */
        lg:h-full lg:min-h-0 lg:grid-cols-4
        lg:grid-rows-[100px_minmax(0,1fr)_minmax(0,1fr)]
        lg:overflow-hidden
      "
    >
      {/* Welcome */}
      <div className="min-w-0 md:col-span-2 lg:col-span-4 lg:min-h-0">
        <Welcome />
      </div>

      {/* Ultimi appunti */}
      <div className="min-h-[250px] min-w-0 md:col-span-2 lg:col-span-3 lg:min-h-0">
        <LastNotes />
      </div>

      {/* Scadenze */}
      <div className="min-h-[250px] min-w-0 md:col-span-1 lg:col-span-1 lg:min-h-0">
        <InfoComponent />
      </div>

      {/* Calendario */}
      <div className="min-h-[300px] min-w-0 md:col-span-1 lg:col-span-1 lg:min-h-0">
        <CalendarDashboard />
      </div>

      {/* Corsi recenti */}
      <div className="min-h-[250px] min-w-0 md:col-span-2 lg:col-span-3 lg:min-h-0">
        <RecentCourses />
      </div>
    </div>
  );
}
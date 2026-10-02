
import HomepageCalendario from "@/components/calendarioComponents/HomepageCalendario";
import { Sidebar } from "../components/Sidebar";

export default function CalendarioPage() {
  return (
    <div className="flex h-full w-full overflow-hidden">
      <Sidebar />

      <main className="min-w-0 flex-1 overflow-y-auto">
        <HomepageCalendario />
      </main>
    </div>
  );
}

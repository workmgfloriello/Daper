import { Sidebar } from "../components/Sidebar";
import HomepageNotes from "../components/HomepageNotes";

export default function AppuntiPage() {
  return (
    <div className="flex h-full w-full overflow-hidden">
      <Sidebar />

      <main className="min-w-0 flex-1 overflow-y-auto">
        <HomepageNotes />
      </main>
    </div>
  );
}

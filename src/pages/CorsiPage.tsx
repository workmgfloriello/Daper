import HomepageCourses from "../components/HomepageCourses";
import { Sidebar } from "../components/Sidebar";

export default function CorsiPage() {
  return (
    <div className="flex h-full w-full overflow-hidden">
      <Sidebar />

      <main className="min-w-0 flex-1 overflow-y-auto">
        <HomepageCourses />
      </main>
    </div>
  );
}

import { useUser } from "@/lib/context/UserContext";
import GrideBase from "../components/GrideBase";
import { Sidebar } from "../components/Sidebar";
import LoginPage from "./LoginPage";

export default function Home() {
  const { user } = useUser();

  console.log("USER:", user);

  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className="flex h-full min-h-0 w-full overflow-hidden">
      <Sidebar />

      <main className="min-w-0 min-h-0 h-full flex-1 overflow-y-auto">
        <GrideBase />
      </main>
    </div>
  );
}

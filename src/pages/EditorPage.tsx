import { Sidebar } from "../components/Sidebar";
import Editor from "../editor/Editor";

export default function EditorPage() {
  return (
    <div className="flex h-full w-full overflow-hidden">
      <Sidebar />

      <main className="min-w-0 flex-1 overflow-y-auto">
        <Editor />
      </main>
    </div>
  );
}

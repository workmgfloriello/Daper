import { useCourses } from "@/lib/context/CoursesContext";
import { File } from "@/interface/interface";
import FileManager from "@/lib/manager/FileManager";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { generateUUID } from "@/lib/utils/uuid";
import { useFiles } from "@/lib/context/NotesContext";
import { useNavigate } from "react-router-dom";

export default function ImportAppuntiPage() {
  const [file, setFile] = useState<any>(null);
  const [fileNamePreview, setFileNamePreview] = useState("");
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const { createFile } = useFiles();
  const { courses, updateNoteCount } = useCourses();

  //Uso Manager per copiare il file selezionato nella cartella dei file dell'applicazione e creare un nuovo file con le informazioni inserite dall'utente
  const handleFileSelectClick = async () => {
    const fileData = await FileManager.openFileForImport();
    setName(fileData.metadata.name);
    setFileNamePreview(fileData.metadata.name);
    setFile(fileData);
  };

  /* Creo nuovo file con le informazioni inserite dall'utente
     ma inserisco il contenuto del file importato mantenendo solamente il name */
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (
    event,
  ) => {
    event.preventDefault();
    if (!file || !course.trim()) {
      return;
    }

    const newFile: File = {
      id: generateUUID(),
      name: name,
      course: course,
      description: description,
      created_at: new Date(),
      content: file.content || [],
    };

    const create = await createFile(newFile);
    console.log(create);
    if (create) {
      const update = await updateNoteCount(course, 1);
      console.log("UPDATE: " + update);
      navigate(`/editor/${encodeURIComponent(newFile.name)}`);
    } else {
      console.error("Errore durante la creazione del file");
    }
  };

  return (
    <div className="relative flex h-full min-h-0 w-full items-center justify-center overflow-y-auto bg-indigo-50/60 p-6 transition-colors dark:bg-[#181818]">
      <button
        type="button"
        onClick={() => window.history.back()}
        className="absolute left-6 top-6 flex cursor-pointer items-center gap-2 rounded-lg border border-indigo-200 bg-white px-4 py-2 text-sm font-medium text-indigo-700 shadow-sm transition hover:bg-indigo-50 dark:border-[#3c3c3c] dark:bg-[#252526] dark:text-[#cccccc] dark:hover:bg-[#2a2d2e]"
      >
        <ArrowLeft size={18} />
        <span>Torna indietro</span>
      </button>

      <div className="w-full max-w-lg">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-lg space-y-6 rounded-2xl border border-indigo-100 bg-white p-8 shadow-sm shadow-indigo-100 transition-colors dark:border-[#303030] dark:bg-[#252526] dark:shadow-none"
        >
          <div>
            <h1 className="text-2xl font-bold text-indigo-950 dark:text-[#cccccc]">
              Importa un appunto
            </h1>

            <p className="mt-1 text-sm text-indigo-600 dark:text-[#9d9d9d]">
              Inserisci le informazioni per importare il tuo appunto.
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-indigo-900 dark:text-[#cccccc]">
              File
            </label>

            <div
              onClick={handleFileSelectClick}
              className="flex w-full cursor-pointer items-center justify-center border-4 border-dashed border-gray-400 p-6 rounded-lg py-6 bg-indigo-50/40 px-3 text-sm text-indigo-900 transition-colors hover:border-indigo-500 hover:bg-indigo-50 dark:border-[#3c3c3c] dark:bg-[#1e1e1e] dark:text-[#cccccc] dark:hover:bg-[#1e1e1e]"
            >
              {fileNamePreview ? (
                <span>{fileNamePreview}</span>
              ) : (
                <span>Seleziona file</span>
              )}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-indigo-900 dark:text-[#cccccc]">
              Modifica nome del File
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome file..."
              className="w-full rounded-lg border border-indigo-200 bg-indigo-50/40 px-3 py-2 text-indigo-900 placeholder:text-indigo-300 outline-none transition-colors focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-[#3c3c3c] dark:bg-[#1e1e1e] dark:text-[#cccccc] dark:placeholder:text-[#6e6e6e] dark:focus:border-[#007acc] dark:focus:bg-[#1e1e1e] dark:focus:ring-0"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-indigo-900 dark:text-[#cccccc]">
              Corso
            </label>

            <select
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              className="w-full rounded-lg border border-indigo-200 bg-indigo-50/40 px-3 py-2 text-indigo-900 outline-none transition-colors focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-[#3c3c3c] dark:bg-[#1e1e1e] dark:text-[#cccccc] dark:focus:border-[#007acc] dark:focus:bg-[#1e1e1e] dark:focus:ring-0"
            >
              <option value="">Seleziona un corso</option>
              {courses.map((courseItem) => (
                <option key={courseItem.id} value={courseItem.id}>
                  {courseItem.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-indigo-900 dark:text-[#cccccc]">
              Descrizione
            </label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrizione opzionale..."
              rows={3}
              className="w-full resize-none rounded-lg border border-indigo-200 bg-indigo-50/40 px-3 py-2 text-indigo-900 placeholder:text-indigo-300 outline-none transition-colors focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-[#3c3c3c] dark:bg-[#1e1e1e] dark:text-[#cccccc] dark:placeholder:text-[#6e6e6e] dark:focus:border-[#007acc] dark:focus:bg-[#1e1e1e] dark:focus:ring-0"
            />
          </div>

          <button
            type="submit"
            disabled={!file || !course.trim()}
            className="w-full rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-200 disabled:text-indigo-400 dark:bg-[#007acc] dark:hover:bg-[#1a85c7] dark:disabled:bg-[#3c3c3c] dark:disabled:text-[#6e6e6e]"
          >
            Importa appunto
          </button>
        </form>
      </div>
    </div>
  );
}

"use client";
import { useEffect, useRef, useState } from "react";
import { Editor } from "@tiptap/react";
import {
  ChevronDown,
  Save,
  Download,
  Clock3,
  Pencil,
  Trash2,
  FileBracesCorner,
} from "lucide-react";

import FileManager from "../../lib/manager/FileManager";
import { useNavigate } from "react-router-dom";
import { useFiles } from "@/lib/context/NotesContext";
import DelateAlert from "./DelateAlert";
import RenameAlert from "./RenameAlert";
import { useCourses } from "@/lib/context/CoursesContext";

interface FileBarProps {
  editor: Editor | null;
  fileMeta: any;
}

export default function FileBar({ editor, fileMeta }: FileBarProps) {
  const [open, setOpen] = useState(false);
  const [showDelateAlert, setShowDelateAlert] = useState(false);
  const [showRenameAlert, setShowRenameAlert] = useState(false);

  const componentRef = useRef<HTMLDivElement>(null);
  const { deleteFile, renameFile } = useFiles();
  const { updateNoteCount } = useCourses();
  const navigate = useNavigate();

  //click fuori chiudo menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (open) {
        if (componentRef.current && !componentRef.current.contains(target)) {
          setOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  //AutoSafe
  useEffect(() => {
    if (!editor) return;

    let dirty = false;

    const handleUpdate = () => {
      dirty = true;
    };

    editor.on("update", handleUpdate);

    const interval = setInterval(async () => {
      if (!dirty) return;

      dirty = false;

      try {
        console.log("AUTOSAVE");
        await FileManager.saveFile();
        console.log("SALVATO");
      } catch (error) {
        console.error("Errore autosave:", error);
        dirty = true;
      }
    }, 2000);

    return () => {
      editor.off("update", handleUpdate);
      clearInterval(interval);
    };
  }, [editor]);

  const handleOpenClick = async () => {
    console.log("APRO FILE");
    const file = await FileManager.openFile("");
    if (!file) return;

    navigate(`/editor/${encodeURIComponent(file)}`);
    setOpen(false);
  };

  const handleSaveClick = () => {
    console.log("SALVO CON NOME");
    FileManager.saveFile();
    setOpen(false);
  };

  const handleExportClick = () => {
    console.log("ESPORTO PDF");
    FileManager.exportPDF();
    setOpen(false);
  };

   const handleExportClickJSON = (fileName:string) => {
    console.log("ESPORTO JSON");
    FileManager.exportJSON(fileName);
    setOpen(false);
  };

  async function handleDelateFile() {
    if (!fileMeta) return;

    const result = await deleteFile(fileMeta.name);

    if (result?.success) {
      updateNoteCount(fileMeta.course, 0);
      navigate("/appunti/all");
    }
  }

  async function handleRenameFile(newName: string) {
    if (!fileMeta?.name || !newName.trim()) return;

    const result = await renameFile(fileMeta?.name, newName);
    if (result?.success) {
      console.log("File rinominato:", newName);
      setShowRenameAlert(false);
      navigate(`/editor/${encodeURIComponent(newName)}`);
    }
  }

  return (
    <>
      <div className="relative" ref={componentRef}>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          disabled={!editor}
          className="inline-flex h-10 items-center gap-2 rounded-md bg-indigo-600 px-3 text-sm font-medium text-white transition-colors hover:bg-indigo-700 active:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-[#007acc] dark:hover:bg-[#1a85c7] dark:active:bg-[#006bb3]"
        >
          <Save size={16} />
          <span>File</span>
          <ChevronDown
            size={15}
            className={`transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>

        {open && (
          <div className="absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-lg border border-gray-200 bg-white p-1 shadow-lg dark:border-[#3c3c3c] dark:bg-[#252526] dark:shadow-xl">
            <button
              type="button"
              onClick={handleSaveClick}
              className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-[#cccccc] dark:hover:bg-[#2a2d2e]"
            >
              <Save
                size={17}
                className="shrink-0 text-indigo-600 dark:text-[#4daafc]"
              />
              <div className="flex min-w-0 flex-col items-start">
                <span className="font-medium">Salva</span>
                <span className="text-xs text-gray-400 dark:text-[#9d9d9d]">
                  Salva il documento
                </span>
              </div>
            </button>

            <div className="my-1 border-t border-gray-100 dark:border-[#3c3c3c]" />

            <div className="flex items-center gap-3 rounded-md px-3 py-2.5">
              <Clock3
                size={17}
                className="shrink-0 text-gray-400 dark:text-[#6e6e6e]"
              />
              <div className="flex min-w-0 flex-col items-start">
                <span className="text-xs text-gray-500 dark:text-[#9d9d9d]">
                  Ultimo salvataggio
                </span>
                <span className="text-sm font-medium text-gray-700 dark:text-[#cccccc]">
                  {new Date().toLocaleString("it-IT", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>

            <div className="my-1 border-t border-gray-100 dark:border-[#3c3c3c]" />

            <button
              onClick={() => setShowRenameAlert(true)}
              type="button"
              className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-[#cccccc] dark:hover:bg-[#2a2d2e]"
            >
              <Pencil
                size={17}
                className="shrink-0 text-indigo-600 dark:text-[#4daafc]"
              />
              <div className="flex min-w-0 flex-col items-start">
                <span className="font-medium">Rinomina file</span>
                <span className="text-xs text-gray-400 dark:text-[#9d9d9d]">
                  Modifica il nome del documento
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={handleExportClick}
              className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-[#cccccc] dark:hover:bg-[#2a2d2e]"
            >
              <Download
                size={17}
                className="shrink-0 text-indigo-600 dark:text-[#4daafc]"
              />
              <div className="flex min-w-0 flex-col items-start">
                <span className="font-medium">Esporta file</span>
                <span className="text-xs text-gray-400 dark:text-[#9d9d9d]">
                  Esporta come PDF
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleExportClickJSON(fileMeta?.name)}
              className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-[#cccccc] dark:hover:bg-[#2a2d2e]"
            >
              <FileBracesCorner 
                size={17}
                className="shrink-0 text-indigo-600 dark:text-[#4daafc]"
              />
              <div className="flex min-w-0 flex-col items-start">
                <span className="font-medium">Esporta file</span>
                <span className="text-xs text-gray-400 dark:text-[#9d9d9d]">
                  Esporta come JSON
                </span>
              </div>
            </button>

            <div className="my-1 border-t border-gray-100 dark:border-[#3c3c3c]" />

            <button
              type="button"
              onClick={() => setShowDelateAlert(true)}
              className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-[#3a2020]"
            >
              <Trash2 size={17} className="shrink-0" />
              <div className="flex min-w-0 flex-col items-start">
                <span className="font-medium">Elimina file</span>
                <span className="text-xs text-red-400 dark:text-red-400">
                  Elimina definitivamente
                </span>
              </div>
            </button>
          </div>
        )}
      </div>
      <DelateAlert
        open={showDelateAlert}
        fileName={fileMeta?.name}
        onClose={() => setShowDelateAlert(false)}
        onConfirm={handleDelateFile}
      />
      <RenameAlert
        open={showRenameAlert}
        fileName={fileMeta?.name}
        onClose={() => setShowRenameAlert(false)}
        onConfirm={handleRenameFile}
      />
    </>
  );
}

"use client";

import { useCourses } from "@/lib/context/CoursesContext";
import { useFiles } from "@/lib/context/NotesContext.tsx";
import { useTheme } from "@/lib/context/ThemeContext";
import { Circle, NotebookPen } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Notes() {
  const { courses } = useCourses();
  const { files } = useFiles();
  const { palette } = useTheme();
  const navigate = useNavigate();

  const handleNoteClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const name = e.currentTarget.dataset.ref;

    if (!name) return;

    navigate(`/editor/${encodeURIComponent(name)}`);
  };

  // Ultime 10 note più recenti
  const recentNotes = [...files]
    .sort((a, b) => {
      const dateA = a.created_at
        ? new Date(a.created_at).getTime()
        : 0;

      const dateB = b.created_at
        ? new Date(b.created_at).getTime()
        : 0;

      return dateB - dateA;
    })
    .slice(0, 10);

  return (
    <div className="flex h-full min-h-0 flex-col rounded-xl border border-gray-300 bg-white transition-colors dark:border-[#303030] dark:bg-[#252526]">
      {/* Header */}
      <div className="flex shrink-0 items-center gap-2 px-8 py-5">
        <NotebookPen className="h-5 w-5 text-indigo-600 dark:text-[#4daafc]" />

        <h2 className="font-semibold text-gray-900 dark:text-[#cccccc]">
          Ultimi appunti
        </h2>
      </div>

      {/* Lista scrollabile */}
      <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto divide-y divide-gray-100 dark:divide-[#303030]">
        {recentNotes.length > 0 ? (recentNotes.map((note) => {
          const findCourse = courses.find(
            (course) => course.id === note.course
          );

          const courseName = findCourse?.name ?? "Nessun Corso";

          const colorKey =
            findCourse?.color as keyof typeof palette | undefined;

          const color =
            colorKey && colorKey in palette
              ? palette[colorKey]
              : palette.color1;


          return (
            <div
              key={note.id}
              data-ref={note.name}
              onClick={handleNoteClick}
              className="flex cursor-pointer items-center gap-4 px-4 py-3 transition-colors hover:bg-gray-50 dark:hover:bg-[#2a2d2e]"
            >
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                style={{ backgroundColor: color }}
              >
                <Circle className="text-white" />
              </div>

              <p className="min-w-0 flex-1 truncate text-sm font-medium text-gray-900 dark:text-[#cccccc]">
                {note.name}
              </p>

              <span
                className="hidden rounded-md px-2 py-1 text-sm font-bold text-gray-800 sm:block dark:text-white"
                style={{ backgroundColor: color }}
              >
                {courseName}
              </span>

              <span className="text-xs text-gray-500 dark:text-[#9d9d9d]">
                {note.created_at
                  ? new Date(note.created_at).toLocaleDateString("it-IT")
                  : "Nessuna data"}
              </span>
            </div>
          );
            })
        ) : (
            <div className="flex items-center justify-center px-4 py-8">
                <p className="text-sm text-gray-500 dark:text-[#9d9d9d]">
                    Nessuna Nota Recente
                </p>
            </div>
        )}



        <button className="w-full py-5 text-center text-sm font-medium text-indigo-600 transition hover:text-indigo-800 dark:text-[#4daafc] dark:hover:text-[#75beff]">
          Mostra tutti
        </button>
      </div>
    </div>
  );
}


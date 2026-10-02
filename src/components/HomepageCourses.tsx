"use client";

import { Course } from "@/interface/interface.tsx";

import { useCourses } from "@/lib/context/CoursesContext";
import {
  useTheme,
  type PaletteColor,
} from "@/lib/context/ThemeContext";

import { generateUUID } from "@/lib/utils/uuid";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

const paletteColors: PaletteColor[] = [
  "color1",
  "color2",
  "color3",
  "color4",
  "color5",
  "color6",
  "color7",
  "color8",
  "color9",
  "color10",
  "color11",
  "color12",
];

export default function HomepageCourses() {
  const {
    courses,
    setCourses,
    updateRecent,
  } = useCourses();

  const { palette } = useTheme();

  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState<Course>({
    id: "",
    name: "",
    code: "",
    professor: "",
    cfu: 0,
    semester: 1,
    notes_count: 0,
    description: "",
    year: 1,
    recent: false,

    // Primo colore della palette
    color: "color1",
  });

  const navigator = useNavigate();

  /* =========================
     FORM CHANGE
  ========================= */

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement |
      HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "cfu" ||
        name === "semester" ||
        name === "year"
          ? Number(value)
          : value,
    }));
  };

  /* =========================
     CREATE COURSE
  ========================= */

  const handleSubmit = async (
    e: React.FormEvent,
  ) => {
    e.preventDefault();

    const newCourse: Course = {
      id: generateUUID().toString(),

      name: formData.name,
      code: formData.code,
      professor: formData.professor,

      cfu: Number(formData.cfu),
      semester: Number(formData.semester),

      notes_count: 0,

      description: formData.description,

      year: Number(formData.year),

      recent: false,

      // Salviamo color1/color2/etc.
      color: formData.color,
    };

    console.log("NUOVO CORSO:", newCourse);

    try {
      const dbInsert =
        await (window.electronAPI as any)?.insertCourse(
          newCourse,
        );

      console.log(
        "RISPOSTA DATABASE:",
        dbInsert,
      );

      if (dbInsert?.success === false) {
        console.error(
          "Errore inserimento corso:",
          dbInsert,
        );

        return;
      }

      setCourses((prev) => [
        ...prev,
        newCourse,
      ]);

      setFormData({
        id: "",
        name: "",
        code: "",
        professor: "",
        cfu: 0,
        semester: 1,
        notes_count: 0,
        description: "",
        year: 1,
        recent: false,
        color: "color1",
      });

      setShowForm(false);
    } catch (error) {
      console.error(
        "Error inserting course:",
        error,
      );
    }
  };

  /* =========================
     CLICK COURSE
  ========================= */

  const handleClick = async (
    e: React.MouseEvent<HTMLDivElement>,
  ) => {
    const courseId = e.currentTarget.id;

    const clickedCourse = courses.find(
      (course) => course.id === courseId,
    );

    if (!clickedCourse) return;

    navigator(
      `/corsi/${clickedCourse.id}`,
    );

    if (clickedCourse.recent) {
      return;
    }

    const recentCourses = courses.filter(
      (course) => course.recent,
    );

    if (recentCourses.length < 3) {
      await updateRecent(
        courseId,
        true,
      );

      return;
    }

    const randomIndex = Math.floor(
      Math.random() *
        recentCourses.length,
    );

    const courseToRemove =
      recentCourses[randomIndex];

    await updateRecent(
      courseToRemove.id,
      false,
    );

    await updateRecent(
      courseId,
      true,
    );
  };

  return (
    <div className="min-h-full bg-gray-50 p-6 text-gray-900 transition-colors dark:bg-[#181818] dark:text-[#cccccc]">

      {/* ================= HEADER ================= */}

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-[#cccccc]">
            I miei corsi
          </h1>

          <p className="mt-1 text-sm text-gray-500 dark:text-[#9d9d9d]">
            Gestisci tutti i tuoi corsi universitari
          </p>
        </div>

        <button
          onClick={() =>
            setShowForm(!showForm)
          }
          className="rounded-xl bg-[var(--color1)] px-5 py-3 font-medium text-white transition hover:opacity-90"
        >
          {showForm
            ? "Chiudi"
            : "+ Nuovo corso"}
        </button>
      </div>

      {/* ================= FORM ================= */}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-colors dark:border-[#303030] dark:bg-[#252526]"
        >
          <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-[#cccccc]">
            Crea un nuovo corso
          </h2>

          <div className="grid gap-5 md:grid-cols-2">

            {/* Nome */}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-[#cccccc]">
                Nome corso
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Es. Analisi Matematica II"
                required
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-[var(--color1)] dark:border-[#3c3c3c] dark:bg-[#1e1e1e] dark:text-[#cccccc] dark:placeholder:text-[#6e6e6e]"
              />
            </div>

            {/* Codice */}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-[#cccccc]">
                Codice
              </label>

              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                placeholder="Es. AN2"
                required
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 uppercase text-gray-900 outline-none transition focus:border-[var(--color1)] dark:border-[#3c3c3c] dark:bg-[#1e1e1e] dark:text-[#cccccc]"
              />
            </div>

            {/* Professore */}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-[#cccccc]">
                Professore
              </label>

              <input
                type="text"
                name="professor"
                value={formData.professor}
                onChange={handleChange}
                placeholder="Es. Mario Rossi"
                required
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-[var(--color1)] dark:border-[#3c3c3c] dark:bg-[#1e1e1e] dark:text-[#cccccc]"
              />
            </div>

            {/* CFU */}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-[#cccccc]">
                CFU
              </label>

              <input
                type="number"
                name="cfu"
                value={formData.cfu}
                onChange={handleChange}
                min="1"
                required
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-[var(--color1)] dark:border-[#3c3c3c] dark:bg-[#1e1e1e] dark:text-[#cccccc]"
              />
            </div>

            {/* Semestre */}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-[#cccccc]">
                Semestre
              </label>

              <select
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none dark:border-[#3c3c3c] dark:bg-[#1e1e1e] dark:text-[#cccccc]"
              >
                <option value="1">
                  1° semestre
                </option>

                <option value="2">
                  2° semestre
                </option>
              </select>
            </div>

            {/* Anno */}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-[#cccccc]">
                Anno
              </label>

              <select
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none dark:border-[#3c3c3c] dark:bg-[#1e1e1e] dark:text-[#cccccc]"
              >
                <option value="1">
                  1° Anno
                </option>

                <option value="2">
                  2° Anno
                </option>

                <option value="3">
                  3° Anno
                </option>

                <option value="4">
                  4° Anno
                </option>

                <option value="5">
                  5° Anno
                </option>

                <option value="6">
                  6° Anno
                </option>
              </select>
            </div>

            {/* Descrizione */}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-[#cccccc]">
                Descrizione
              </label>

              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Descrizione del corso"
                required
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-[var(--color1)] dark:border-[#3c3c3c] dark:bg-[#1e1e1e] dark:text-[#cccccc]"
              />
            </div>

            {/* ================= COLORE ================= */}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-[#cccccc]">
                Colore
              </label>

              <div className="grid grid-cols-6 gap-3">
                {paletteColors.map(
                  (color) => {
                    const selected =
                      formData.color ===
                      color;

                    return (
                      <button
                        key={color}
                        type="button"
                        onClick={() =>
                          setFormData(
                            (prev) => ({
                              ...prev,
                              color,
                            }),
                          )
                        }
                        className={`h-10 w-10 rounded-xl transition hover:scale-110 ${
                          selected
                            ? "ring-2 ring-[var(--color1)] ring-offset-2 dark:ring-offset-[#252526]"
                            : ""
                        }`}
                        style={{
                          backgroundColor:
                            palette[color],
                        }}
                        aria-label={`Seleziona ${color}`}
                      />
                    );
                  },
                )}
              </div>
            </div>
          </div>

          {/* Submit */}

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="rounded-xl bg-[var(--color1)] px-6 py-3 font-medium text-white transition hover:opacity-90"
            >
              Crea corso
            </button>
          </div>
        </form>
      )}

      {/* ================= COURSES ================= */}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {courses.map((course) => (
          <div
            key={course.id}
            id={course.id}
            onClick={handleClick}
            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-[#303030] dark:bg-[#252526] dark:hover:bg-[#2a2d2e]"
          >

            {/* Badge */}

            <div className="mb-5 flex items-center justify-between">
              <span
                className="rounded-lg px-3 py-1 text-xs font-semibold text-white"
                style={{
                  backgroundColor:
                    palette[course.color as PaletteColor],
                }}
              >
                {course.name}
              </span>

              {course.recent && (
                <span className="text-xs font-medium text-green-600 dark:text-[#73c991]">
                  Recente
                </span>
              )}
            </div>

            {/* Titolo */}

            <h2 className="text-xl font-bold text-gray-900 dark:text-[#cccccc]">
              {course.name}
            </h2>

            <p className="mt-2 text-sm text-gray-500 dark:text-[#9d9d9d]">
              {course.description}
            </p>

            {/* Info */}

            <div className="mt-5 space-y-2 border-t border-gray-100 pt-4 text-sm text-gray-600 dark:border-[#303030] dark:text-[#9d9d9d]">

              <div className="flex justify-between">
                <span>Professore</span>

                <span className="font-medium text-gray-900 dark:text-[#cccccc]">
                  {course.professor}
                </span>
              </div>

              <div className="flex justify-between">
                <span>CFU</span>

                <span className="font-medium text-gray-900 dark:text-[#cccccc]">
                  {course.cfu}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Semestre</span>

                <span className="font-medium text-gray-900 dark:text-[#cccccc]">
                  {course.semester}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Anno</span>

                <span className="font-medium text-gray-900 dark:text-[#cccccc]">
                  {course.year}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Appunti</span>

                <span className="font-medium text-gray-900 dark:text-[#cccccc]">
                  {course.notes_count}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Nessun corso */}

      {courses.length === 0 && (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center transition-colors dark:border-[#3c3c3c] dark:bg-[#252526]">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-[#cccccc]">
            Nessun corso
          </h2>

          <p className="mt-2 text-sm text-gray-500 dark:text-[#9d9d9d]">
            Crea il tuo primo corso per iniziare.
          </p>
        </div>
      )}
    </div>
  );
}

"use client";

import {
  BookOpen,
  ChevronDown,
  ChevronLeft,
  FileText,
  LayoutDashboard,
  Plus,
  Settings,
  User,
  Calendars, Code2Icon
} from "lucide-react";

import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import { useCourses } from "../lib/context/CoursesContext";
import { useTheme } from "@/lib/context/ThemeContext";
import { useUser } from "@/lib/context/UserContext";
import BottomBarComponent from "@/components/CommandBarComponents/BottomBarComponent.tsx";
import { AnimatePresence } from "framer-motion";

const navItems = [
  {
    href: "/",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/corsi",
    label: "I miei corsi",
    icon: BookOpen,
  },
  {
    href: "/appunti/all",
    label: "Tutti gli appunti",
    icon: FileText,
  },
  {
    href: "/calendario",
    label: "Il Tuo Calendario",
    icon:   Calendars,
  },
];

export function Sidebar() {
  const { pathname } = useLocation();

  const [open, setOpen] = useState(true);
  const [coursesOpen, setCoursesOpen] = useState(true);
  const [showCommandPalete, setShowCommandPalette] = useState(false);

  const { courses } = useCourses();
  const { user } = useUser();
  const { palette } = useTheme();

  // Chiudi la sidebar quando ti trovi nell'editor
  useEffect(() => {
    if (pathname.startsWith("/editor")) {
      setOpen(false);
    }
  }, [pathname]);

  return (
    <>
    <aside
      className={`relative flex h-full min-h-0 shrink-0 flex-col overflow-hidden border-r border-gray-200 bg-white text-gray-900 transition-[width] duration-300 ease-in-out dark:border-[#303030] dark:bg-[#181818] dark:text-[#cccccc] ${
        open ? "w-64" : "w-16"
      }`}
    >
      {/* Logo */}
      <div className="flex h-18 shrink-0 items-center gap-2 px-4">
        {/* Toggle */}
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-indigo-900 bg-indigo-600 text-white shadow-sm transition hover:bg-white hover:text-indigo-600 dark:border-[#007acc] dark:bg-[#007acc] dark:hover:bg-[#1a85c7] dark:hover:text-white"
        >
          <ChevronLeft
            className={`h-4 w-4 transition-transform duration-300 ${
              open ? "" : "rotate-180"
            }`}
          />
        </button>

        {open && (
          <span className="whitespace-nowrap text-base font-semibold text-gray-900 dark:text-[#cccccc]">
            StuPaper
          </span>
        )}
      </div>

      {/* Nuovo appunto */}
      <div className="shrink-0 px-3">
        <Link
          to="/newappunti"
          className="flex h-10 w-full shrink-0 items-center gap-3 rounded-lg bg-indigo-600 px-3 text-sm font-medium text-white transition hover:bg-indigo-700 dark:bg-[#007acc] dark:hover:bg-[#1a85c7]"
        >
          <Plus className="h-4 w-4 shrink-0" />

          {open && <span className="whitespace-nowrap">Nuovo appunto</span>}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="mt-6 flex shrink-0 flex-col gap-1 px-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              to={item.href}
              className={`flex h-10 w-full shrink-0 items-center gap-3 rounded-lg px-3 text-sm transition ${
                active
                  ? "bg-indigo-50 font-medium text-indigo-700 dark:bg-[#264f78] dark:text-white"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-[#9d9d9d] dark:hover:bg-[#2a2d2e] dark:hover:text-[#cccccc]"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />

              {open && (
                <span className="truncate whitespace-nowrap">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      <hr className="my-5 border-0 ml-3 mr-3 border-t border-gray-200 dark:border-[#3a3d3e]" />

      {/*Palette Comandi*/}
      <div className="flex shrink-0 flex-col gap-1 px-3">
        <button
          type="button"
          onClick={() => setShowCommandPalette(!showCommandPalete)}
          className="flex h-10 w-full shrink-0 items-center justify-center gap-3 rounded-lg px-3 text-sm transition hover:bg-indigo-200 hover:text-gray-900 dark:hover:bg-[#2a2d2e] dark:hover:text-[#cccccc] bg-indigo-300 text-indigo-900 dark:bg-[#264f78] dark:text-white"
        >
          <Code2Icon className="h-4 w-4 shrink-0" />

          {open && (
            <span className="truncate whitespace-nowrap">Lista Comandi</span>
          )}
        </button>
      </div>

      <hr className="my-5 border-0 ml-3 mr-3 border-t border-gray-200 dark:border-[#3a3d3e]" />


      {/* Corsi */}
      <div className="mt-6 min-h-0 flex-1 overflow-hidden px-3">
        {open && (
          <>
            <button
              type="button"
              onClick={() => setCoursesOpen((value) => !value)}
              className="flex h-8 w-full shrink-0 items-center justify-between px-3 text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-[#6e6e6e]"
            >
              <span>Corsi</span>

              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-200 ${
                  coursesOpen ? "rotate-0" : "-rotate-90"
                }`}
              />
            </button>

            {coursesOpen && (
              <div className="mt-1 min-h-0 overflow-y-auto">
                <div className="flex flex-col gap-1">
                  {courses.map((course) => {
                    const active = pathname === `/corsi/${course.id}`;
                    const color = palette[course.color as keyof typeof palette];

                    return (
                      <Link
                        key={course.id}
                        to={`/corsi/${course.id}`}
                        className={`flex h-10 w-full shrink-0 items-center gap-3 rounded-lg px-3 text-sm transition ${
                          active
                            ? "bg-gray-100 text-gray-900 dark:bg-[#2a2d2e] dark:text-[#cccccc]"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-[#9d9d9d] dark:hover:bg-[#2a2d2e] dark:hover:text-[#cccccc]"
                        }`}
                      >
                        <span
                          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[10px] font-semibold text-white"
                          style={{
                            backgroundColor: color,
                          }}
                        >
                          {course.code}
                        </span>

                        <span className="truncate">{course.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* User */}
      <div className="shrink-0 border-t border-gray-200 px-3 py-3 dark:border-[#303030]">
        <div className="flex h-10 items-center gap-3 rounded-lg px-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 dark:bg-[#252526]">
            <User className="h-4 w-4 text-gray-500 dark:text-[#9d9d9d]" />
          </div>

          {open && (
            <>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900 dark:text-[#cccccc]">
                  {user?.name}
                </p>

                <p className="truncate text-xs text-gray-500 dark:text-[#9d9d9d]">
                  {user?.type}
                </p>
              </div>

              <Link
                to="/impostazioni"
                className="shrink-0 text-gray-400 transition hover:text-gray-600 dark:text-[#6e6e6e] dark:hover:text-[#cccccc]"
              >
                <Settings className="h-4 w-4" />
              </Link>
            </>
          )}
        </div>
      </div>
    </aside>


  {/*Mostro Palette Comandi*/}
        {showCommandPalete && <BottomBarComponent />}
  </>
)
}
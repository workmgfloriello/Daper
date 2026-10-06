import { useEffect, useState } from "react";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useUser } from "@/lib/context/UserContext";
import { useTheme, type PaletteColor } from "@/lib/context/ThemeContext";

import type { User } from "@/interface/interface";

type UserType = "studente" | "docente" | "personale";

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

export default function SettingPage() {
  const { user, updateUser } = useUser();

  const { theme, palette, setTheme, updatePaletteColor, resetPalette } =
    useTheme();

  const navigate = useNavigate();

  const [name, setName] = useState(user?.name ?? "");

  const [school, setSchool] = useState(user?.school ?? "");

  const [type, setType] = useState<UserType>(
    (user?.type as UserType) ?? "studente",
  );

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  /* =========================
     PROFILE
  ========================= */

  const handleSaveProfile = async () => {
    if (!name.trim() || !school.trim()) {
      return;
    }

    const newUser: User = {
      name: name.trim(),
      school: school.trim(),
      type,
    };

    try {
      await updateUser(newUser);
    } catch (error) {
      console.error("Errore durante il salvataggio del profilo:", error);
    }
  };

  //UPDATE
  const [appVersion, setAppVersion] = useState("...");
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [updateDownloaded, setUpdateDownloaded] = useState(false);
  const [updateVersion, setUpdateVersion] = useState("");

  useEffect(() => {
    window.electronAPI?.getVersion?.().then((version) => {
      setAppVersion(version);
    });

    window.electronAPI?.onUpdateAvailable?.((data) => {
      setUpdateAvailable(true);
      setUpdateVersion(data.version);
    });

    window.electronAPI?.onUpdateDownloaded?.((data) => {
      setUpdateDownloaded(true);
      setUpdateVersion(data.version);
    });

    console.log("UpdateDownloaded:", updateDownloaded);
  }, []);

  return (
    <main className="h-full min-h-0 overflow-y-auto bg-gray-50 dark:bg-[#181818]">
      <div className="mx-auto w-full max-w-4xl px-6 py-8">
        {/* ================= HEADER ================= */}

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-5 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 dark:text-[#aaaaaa] dark:hover:bg-[#252525] dark:hover:text-[#eeeeee]"
        >
          <ArrowLeft className="h-4 w-4" />
          Torna indietro
        </button>

        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-[#eeeeee]">
            Impostazioni
          </h1>

          <p className="mt-1 text-sm text-gray-500 dark:text-[#888888]">
            Personalizza il tuo profilo e l'aspetto di StuPaper.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          {/* ================= PROFILE ================= */}

          <section className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-[#303030] dark:bg-[#202020]">
            <div className="border-b border-gray-200 px-6 py-5 dark:border-[#303030]">
              <h2 className="text-base font-semibold text-gray-900 dark:text-[#eeeeee]">
                Profilo
              </h2>

              <p className="mt-1 text-sm text-gray-500 dark:text-[#888888]">
                Modifica le informazioni del tuo profilo.
              </p>
            </div>

            <div className="flex flex-col gap-5 p-6">
              {/* Nome */}

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-700 dark:text-[#cccccc]"
                >
                  Nome
                </label>

                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-11 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-900 outline-none transition focus:border-[var(--color1)] focus:ring-2 focus:ring-[var(--color1)]/20 dark:border-[#383838] dark:bg-[#181818] dark:text-[#eeeeee]"
                />
              </div>

              {/* Scuola */}

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="school"
                  className="text-sm font-medium text-gray-700 dark:text-[#cccccc]"
                >
                  Scuola o istituzione
                </label>

                <input
                  id="school"
                  type="text"
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  className="h-11 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-900 outline-none transition focus:border-[var(--color1)] focus:ring-2 focus:ring-[var(--color1)]/20 dark:border-[#383838] dark:bg-[#181818] dark:text-[#eeeeee]"
                />
              </div>

              {/* Tipo */}

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="type"
                  className="text-sm font-medium text-gray-700 dark:text-[#cccccc]"
                >
                  Tipo di profilo
                </label>

                <select
                  id="type"
                  value={type}
                  onChange={(e) => setType(e.target.value as UserType)}
                  className="h-11 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-900 outline-none transition focus:border-[var(--color1)] focus:ring-2 focus:ring-[var(--color1)]/20 dark:border-[#383838] dark:bg-[#181818] dark:text-[#eeeeee]"
                >
                  <option value="studente">Studente</option>

                  <option value="docente">Docente</option>

                  <option value="personale">Personale</option>
                </select>
              </div>

              {/* Salva */}

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  className="h-10 rounded-lg bg-[var(--color1)] px-5 text-sm font-semibold text-white transition hover:opacity-90"
                >
                  Salva modifiche
                </button>
              </div>
            </div>
          </section>

          {/* ================= APPEARANCE ================= */}

          <section className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-[#303030] dark:bg-[#202020]">
            <div className="border-b border-gray-200 px-6 py-5 dark:border-[#303030]">
              <h2 className="text-base font-semibold text-gray-900 dark:text-[#eeeeee]">
                Aspetto
              </h2>

              <p className="mt-1 text-sm text-gray-500 dark:text-[#888888]">
                Personalizza l'aspetto dell'applicazione.
              </p>
            </div>

            <div className="flex flex-col gap-8 p-6">
              {/* ================= THEME ================= */}

              <div>
                <h3 className="text-sm font-medium text-gray-800 dark:text-[#dddddd]">
                  Tema
                </h3>

                <div className="mt-3 grid grid-cols-2 gap-3">
                  {/* Chiaro */}

                  <button
                    type="button"
                    onClick={() => setTheme("light")}
                    className={`rounded-xl border p-4 text-left transition ${
                      theme === "light"
                        ? "border-[var(--color1)] bg-[var(--color1)]/10"
                        : "border-gray-200 hover:bg-gray-50 dark:border-[#383838] dark:hover:bg-[#181818]"
                    }`}
                  >
                    <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-700">
                      ☀
                    </div>

                    <p className="text-sm font-medium text-gray-900 dark:text-[#eeeeee]">
                      Chiaro
                    </p>

                    <p className="mt-1 text-xs text-gray-500 dark:text-[#777777]">
                      Sempre chiaro
                    </p>
                  </button>

                  {/* Scuro */}

                  <button
                    type="button"
                    onClick={() => setTheme("dark")}
                    className={`rounded-xl border p-4 text-left transition ${
                      theme === "dark"
                        ? "border-[var(--color1)] bg-[var(--color1)]/10"
                        : "border-gray-200 hover:bg-gray-50 dark:border-[#383838] dark:hover:bg-[#181818]"
                    }`}
                  >
                    <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-[#202020] text-gray-200">
                      ☾
                    </div>

                    <p className="text-sm font-medium text-gray-900 dark:text-[#eeeeee]">
                      Scuro
                    </p>

                    <p className="mt-1 text-xs text-gray-500 dark:text-[#777777]">
                      Sempre scuro
                    </p>
                  </button>
                </div>
              </div>

              {/* ================= PALETTE ================= */}

              <div>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-800 dark:text-[#dddddd]">
                      Palette
                    </h3>

                    <p className="mt-1 text-xs text-gray-500 dark:text-[#777777]">
                      Personalizza i 12 colori utilizzati in tutta StuPaper.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={resetPalette}
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600 transition hover:bg-gray-50 dark:border-[#383838] dark:text-[#aaaaaa] dark:hover:bg-[#181818]"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Ripristina
                  </button>
                </div>

                {/* Colors */}

                <div className="mt-5 grid grid-cols-4 gap-4 sm:grid-cols-6">
                  {paletteColors.map((color, index) => (
                    <label
                      key={color}
                      className="group flex cursor-pointer flex-col items-center gap-2"
                    >
                      <div
                        className="relative h-12 w-12 overflow-hidden rounded-xl border border-gray-200 shadow-sm transition group-hover:scale-105 dark:border-[#383838]"
                        style={{
                          backgroundColor: palette[color],
                        }}
                      >
                        <input
                          type="color"
                          value={palette[color]}
                          onChange={(e) =>
                            updatePaletteColor(color, e.target.value)
                          }
                          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                        />
                      </div>

                      <span className="text-[10px] font-medium text-gray-500 dark:text-[#777777]">
                        Colore {index + 1}
                      </span>

                      <span className="font-mono text-[9px] uppercase text-gray-400 dark:text-[#666666]">
                        {palette[color]}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ================= APP INFO ================= */}

          <section className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-[#303030] dark:bg-[#202020]">
            <div className="flex items-center justify-between px-6 py-5">
              <div>
                <h2 className="text-sm font-semibold text-gray-900 dark:text-[#eeeeee]">
                  Daper
                </h2>

                <p className="mt-1 text-xs text-gray-500 dark:text-[#777777]">
                  Il tuo spazio per lo studio
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-500 dark:bg-[#303030] dark:text-[#888888]">
                  Versione APP {appVersion}
                </span>

                {updateAvailable && !updateDownloaded && (
                  <span className="rounded-lg bg-[var(--color1)]/10 px-3 py-1 text-xs font-medium text-[var(--color1)]">
                    Disponibile {updateVersion}
                  </span>
                )}

                {updateDownloaded && (
                  <button
                    type="button"
                    onClick={() => window.electronAPI?.installUpdate?.()}
                    className="rounded-lg bg-[var(--color1)] px-3 py-2 text-xs font-semibold text-white transition hover:opacity-90"
                  >
                    Aggiorna
                  </button>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

import { useUser } from "@/lib/context/UserContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type UserType = "studente" | "docente" | "personale";

export default function LoginPage() {
  const { insertUser } = useUser();

  const [username, setUsername] = useState("");
  const [university, setUniversity] = useState("");
  const [type, setType] = useState<UserType>("studente");
  const [loadingUi, setLoadingUi] = useState(false);

  const navigator = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim() || !university.trim()) {
      return;
    }

    try {
      setLoadingUi(true);

      await insertUser({
        name: username.trim(),
        school: university.trim(),
        type: type.trim(),
      });

      navigator("/");
    } catch (error) {
      console.error(
        "Errore durante la creazione del profilo:",
        error,
      );
    } finally {
      setLoadingUi(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-[#181818]">
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-8 flex flex-col items-center">
            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 dark:bg-[#202020] dark:ring-[#303030]">
              <img
                src="/assets/logo.png"
                alt="Daper"
                className="h-14 w-14 object-contain"
              />
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-[#eeeeee]">
              Benvenuto in Daper
            </h1>

            <p className="mt-2 text-center text-sm text-gray-500 dark:text-[#999999]">
              Crea il tuo profilo per iniziare a organizzare
              il tuo studio.
            </p>
          </div>

          {/* Card */}
          <div className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm dark:border-[#303030] dark:bg-[#202020]">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-5"
            >
              {/* Nome */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="username"
                  className="text-sm font-medium text-gray-700 dark:text-[#cccccc]"
                >
                  Nome
                </label>

                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Il tuo nome"
                  autoComplete="name"
                  className="h-11 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-[#383838] dark:bg-[#181818] dark:text-[#eeeeee] dark:placeholder:text-[#666666] dark:focus:border-[#4daafc] dark:focus:ring-[#4daafc]/20"
                />
              </div>

              {/* Scuola / Istituzione */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="university"
                  className="text-sm font-medium text-gray-700 dark:text-[#cccccc]"
                >
                  Scuola o Istituzione
                </label>

                <input
                  id="university"
                  type="text"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  placeholder="Il tuo istituto"
                  className="h-11 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-[#383838] dark:bg-[#181818] dark:text-[#eeeeee] dark:placeholder:text-[#666666] dark:focus:border-[#4daafc] dark:focus:ring-[#4daafc]/20"
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
                  onChange={(e) =>
                    setType(e.target.value as UserType)
                  }
                  className="h-11 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-[#383838] dark:bg-[#181818] dark:text-[#eeeeee] dark:focus:border-[#4daafc] dark:focus:ring-[#4daafc]/20"
                >
                  <option value="studente">Studente</option>
                  <option value="docente">Docente</option>
                  <option value="personale">Personale</option>
                </select>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={
                  loadingUi ||
                  !username.trim() ||
                  !university.trim()
                }
                className="mt-2 h-11 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#4daafc] dark:text-[#111111] dark:hover:bg-[#3b9de8]"
              >
                {loadingUi
                  ? "Creazione profilo..."
                  : "Inizia con StuPaper"}
              </button>
            </form>

            <p className="mt-6 text-center text-xs leading-relaxed text-gray-400 dark:text-[#666666]">
              Il tuo profilo viene salvato localmente sul dispositivo.
            </p>
          </div>

          {/* Footer */}
          <p className="mt-6 text-center text-xs text-gray-400 dark:text-[#666666]">
            StuPaper
          </p>
        </div>
      </div>
    </main>
  );
}


import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { EditorCommandView } from "@/interface/interface.ts";

type CommandCategory = {
  name: string;
  commands: EditorCommandView[];
};

export default function BottomBarComponent() {
  const [search, setSearch] = useState("");

  const categories: CommandCategory[] = [
    {
      name: "Testo",
      commands: [
        {
          name: "Titolo Grande",
          symbol: "//tit1",
          desc: "Inserisci un titolo di grandi dimensioni",
        },
        {
          name: "Titolo Medio",
          symbol: "//tit2",
          desc: "Inserisci un titolo di medie dimensioni",
        },
        {
          name: "Sottotitolo",
          symbol: "//tit3",
          desc: "Inserisci un titolo di piccole dimensioni",
        },
        {
          name: "Paragrafo",
          symbol: "//p",
          desc: "Torna a un paragrafo normale",
        },
        {
          name: "Pulisci Formattazione",
          symbol: "//clear",
          desc: "Rimuove titoli, blocchi e formattazione dalla riga corrente",
        },
        {
          name: "Citazione",
          symbol: "//quote",
          desc: "Inserisci una citazione",
        },
        {
          name: "Definizione",
          symbol: "//def",
          desc: "Inserisci una definizione",
        },
        {
          name: "Avviso",
          symbol: "//warn",
          desc: "Inserisci un avviso",
        },
        {
          name: "Esempio",
          symbol: "//example",
          desc: "Inserisci un esempio",
        },
      ],
    },
    {
      name: "Liste",
      commands: [
        {
          name: "Lista di Attività",
          symbol: "//todo",
          desc: "Inserisci una lista di attività",
        },
        {
          name: "Lista Non Ordinata",
          symbol: "//ul",
          desc: "Inserisci una lista non ordinata",
        },
        {
          name: "Lista Ordinata",
          symbol: "//ol",
          desc: "Inserisci una lista ordinata",
        },
      ],
    },
    {
      name: "Blocchi",
      commands: [
        {
          name: "Blocco di Codice",
          symbol: "//code",
          desc: "Inserisci un blocco di codice",
        },
        {
          name: "Blocco Matematico",
          symbol: "//math",
          desc: "Inserisci un blocco matematico",
        },
        {
          name: "Blocco LaTeX",
          symbol: "$$.LATEX.$$",
          desc: "Inserisci un blocco matematico scritto in LaTeX",
        },
        {
          name: "Tabella",
          symbol: "//table-[righe]-[colonne]",
          desc: "Inserisci una tabella ad esempio //table-2-3 , 2 righe e 3 colonne",
        },
      ],
    },
    {
      name: "Struttura",
      commands: [
        {
          name: "Linea Orizzontale",
          symbol: "//hr",
          desc: "Inserisci una linea orizzontale",
        },
        {
          name: "Data di Oggi",
          symbol: "//oggi",
          desc: "Inserisci la data di oggi",
        },
      ],
    },
  ];

  const filteredCategories = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) {
      return categories;
    }

    return categories
      .map((category) => ({
        ...category,
        commands: category.commands.filter(
          (command) =>
            command.name.toLowerCase().includes(query) ||
            command.symbol.toLowerCase().includes(query) ||
            command.desc.toLowerCase().includes(query)
        ),
      }))
      .filter((category) => category.commands.length > 0);
  }, [search]);

  return (
    <div className="absolute bottom-0 left-0 z-[200] max-h-[35%] w-full overflow-y-auto border-t border-gray-200 bg-indigo-100 p-4 shadow-lg dark:border-[#3a3d3e] dark:bg-[#1e1f20]">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-[#cccccc]">
          Lista dei Comandi
        </h1>

        {/* Ricerca */}
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cerca un comando..."
            className="h-9 w-full rounded-lg border border-gray-300 bg-white pl-9 pr-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-[#3a3d3e] dark:bg-[#25282a] dark:text-[#cccccc] dark:placeholder:text-[#777777] dark:focus:border-[#4f6fa3] dark:focus:ring-[#264f78]"
          />
        </div>
      </div>

      {/* Categorie */}
      <div className="space-y-5">
        {filteredCategories.map((category) => (
          <section key={category.name}>
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-[#888888]">
              {category.name}
            </h2>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {category.commands.map((command) => (
                <button
                  key={command.symbol}
                  type="button"
                  className="group flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-3 text-left transition hover:border-indigo-300 hover:bg-indigo-50 dark:border-[#3a3d3e] dark:bg-[#1e1f20] dark:hover:border-[#4f6fa3] dark:hover:bg-[#25282a]"
                >
                  {/* Shortcut */}
                  <div className="flex h-9 shrink-0 items-center justify-center rounded-md bg-gray-100 px-2 font-mono text-sm font-semibold text-gray-700 transition group-hover:bg-indigo-100 group-hover:text-indigo-700 dark:bg-[#2a2d2e] dark:text-[#cccccc] dark:group-hover:bg-[#264f78] dark:group-hover:text-white">
                    {command.symbol}
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-gray-900 dark:text-[#cccccc]">
                      {command.name}
                    </span>

                    <p className="mt-1 line-clamp-2 text-xs text-gray-500 dark:text-[#888888]">
                      {command.desc}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        ))}

        {/* Nessun risultato */}
        {filteredCategories.length === 0 && (
          <div className="py-8 text-center">
            <p className="text-sm font-medium text-gray-600 dark:text-[#999999]">
              Nessun comando trovato
            </p>

            <p className="mt-1 text-xs text-gray-400">
              Prova a cercare un altro comando o simbolo.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

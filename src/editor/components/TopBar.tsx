import { useEffect, useReducer, useRef, useState } from "react";
import { type Editor } from "@tiptap/react";

import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Quote,
  Undo2,
  Redo2,
  SquareFunction,
  Highlighter,
  Palette,
  Type,
  ChevronDown,
  Code,
  Minus,
  ClipboardList,
  Table2,
  Rows3,
  Columns3,
  Columns4,
  Trash2,
  Rows4,
} from "lucide-react";

interface TopBarProps {
  editor: Editor | null;
  onMathClick: () => void;
}

const FONT_FAMILIES = [
  { label: "Predefinito", value: "" },
  { label: "Sans Serif", value: "Arial, sans-serif" },
  { label: "Serif", value: "Georgia, serif" },
  { label: "Monospace", value: "'Courier New', monospace" },
  { label: "Comic", value: "'Comic Sans MS', cursive" },
];

const TEXT_COLORS = [
  "#1e1b4b", // indigo-950
  "#4338ca", // indigo-700
  "#6366f1", // indigo-500
  "#ef4444", // red-500
  "#f59e0b", // amber-500
  "#10b981", // emerald-500
  "#0ea5e9", // sky-500
  "#000000",
];

function ToolbarButton({
  onClick,
  active,
  disabled,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} title={title} className={`inline-flex h-8 w-8 items-center justify-center rounded-md text-indigo-700 transition-colors hover:bg-indigo-100 hover:text-indigo-800 disabled:cursor-not-allowed disabled:opacity-40 dark:text-[#4daafc] dark:hover:bg-[#2a2d2e] dark:hover:text-[#75beff] ${active ? "bg-indigo-100 text-indigo-700 dark:bg-[#264f78] dark:text-[#4daafc] dark:hover:bg-[#264f78]" : ""}`}>
      {children}
    </button>
  );
}

function Divider() {
  return <div className="mx-1 h-6 w-px bg-indigo-200 dark:bg-[#3c3c3c]" />;
}

const DEFAULT_TEXT_COLOR = "#000000"; // nero, usato se non è ancora stato scelto nessun colore

function ColorPicker({ editor }: { editor: Editor }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentColor =
    (editor.getAttributes("textStyle").color as string | undefined) ??
    DEFAULT_TEXT_COLOR;

  // Chiude il popup se si clicca fuori
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const applyColor = (color: string) => {
    editor.chain().focus().setColor(color).run();
    setIsOpen(false);
  };

 return (
  <div ref={containerRef} className="relative flex items-center">
    {/* Bottone principale: applica l'ultimo colore selezionato (o quello di default) */}
    <button
      type="button"
      title="Colore testo"
      onClick={() => applyColor(currentColor)}
      className="flex h-8 flex-col items-center justify-center rounded-l-md px-1.5 text-indigo-700 transition hover:bg-indigo-100 dark:text-[#4daafc] dark:hover:bg-[#2a2d2e] dark:hover:text-[#75beff]"
    >
      <Palette size={16} />
      <span className="mt-0.5 h-1 w-4 rounded-sm" style={{ backgroundColor: currentColor }} />
    </button>

    {/* Freccina: apre/chiude la tendina dei colori */}
    <button
      type="button"
      title="Scegli colore"
      onClick={() => setIsOpen((prev) => !prev)}
      className={`flex h-8 w-5 items-center justify-center rounded-r-md text-indigo-700 transition hover:bg-indigo-100 dark:text-[#4daafc] dark:hover:bg-[#2a2d2e] dark:hover:text-[#75beff] ${isOpen ? "bg-indigo-100 dark:bg-[#264f78] dark:text-[#4daafc]" : ""}`}
    >
      <ChevronDown size={12} />
    </button>

    {isOpen && (
      <div className="absolute left-0 top-full z-50 mt-1 grid w-max grid-cols-4 gap-1 rounded-lg border border-indigo-200 bg-white p-2 shadow-lg dark:border-[#3c3c3c] dark:bg-[#252526] dark:shadow-xl">
        {TEXT_COLORS.map((color) => (
          <button
            key={color}
            type="button"
            className={`h-5 w-5 rounded-full border ${currentColor === color ? "ring-2 ring-indigo-500 ring-offset-1 dark:ring-[#4daafc] dark:ring-offset-[#252526]" : "border-indigo-100 dark:border-[#3c3c3c]"}`}
            style={{ backgroundColor: color }}
            onClick={() => applyColor(color)}
            title={color}
          />
        ))}

        <button
          type="button"
          className="col-span-4 mt-1 rounded-md bg-indigo-50 py-1 text-xs text-indigo-700 transition hover:bg-indigo-100 dark:bg-[#1e1e1e] dark:text-[#4daafc] dark:hover:bg-[#2a2d2e] dark:hover:text-[#75beff]"
          onClick={() => {
            editor.chain().focus().unsetColor().run();
            setIsOpen(false);
          }}
        >
          Rimuovi colore
        </button>
      </div>
    )}
  </div>
);
}

interface TableMenuItem {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
}

function TableMenu({ editor }: { editor: Editor }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Chiude il popup se si clicca fuori
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const run = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  const items: TableMenuItem[] = [
    {
      label: "Inserisci tabella",
      icon: <Table2 size={15} />,
      onClick: () =>
        run(() =>
          editor
            .chain()
            .focus()
            .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
            .run()
        ),
    },
    {
      label: "Inserisci riga sopra",
      icon: <Rows3 size={15} />,
      onClick: () => run(() => editor.chain().focus().addRowBefore().run()),
    },
    {
      label: "Inserisci riga sotto",
      icon: <Rows4 size={15} />,
      onClick: () => run(() => editor.chain().focus().addRowAfter().run()),
    },
    {
      label: "Elimina riga",
      icon: <Rows3 size={15} />,
      onClick: () => run(() => editor.chain().focus().deleteRow().run()),
      danger: true,
    },
    {
      label: "Inserisci colonna a sinistra",
      icon: <Columns3 size={15} />,
      onClick: () =>
        run(() => editor.chain().focus().addColumnBefore().run()),
    },
    {
      label: "Inserisci colonna a destra",
      icon: <Columns4 size={15} />,
      onClick: () => run(() => editor.chain().focus().addColumnAfter().run()),
    },
    {
      label: "Elimina colonna",
      icon: <Columns3 size={15} />,
      onClick: () => run(() => editor.chain().focus().deleteColumn().run()),
      danger: true,
    },
    {
      label: "Elimina tabella",
      icon: <Trash2 size={15} />,
      onClick: () => run(() => editor.chain().focus().deleteTable().run()),
      danger: true,
    },
  ];

return (
  <div ref={containerRef} className="relative flex items-center">
    <button
      type="button"
      title="Tabella"
      onClick={() => setIsOpen((prev) => !prev)}
      className={`flex h-8 items-center gap-1 rounded-md px-2 text-sm text-indigo-700 transition hover:bg-indigo-100 dark:text-[#4daafc] dark:hover:bg-[#2a2d2e] dark:hover:text-[#75beff] ${isOpen ? "bg-indigo-100 dark:bg-[#264f78] dark:text-[#4daafc]" : ""}`}
    >
      <Table2 size={16} />
      <span className="hidden sm:inline">Tabella</span>
      <ChevronDown size={12} />
    </button>

    {isOpen && (
      <div className="absolute left-0 top-full z-50 mt-1 w-56 rounded-lg border border-indigo-200 bg-white p-1 shadow-lg dark:border-[#3c3c3c] dark:bg-[#252526] dark:shadow-xl">
        {items.map((item, index) => (
          <button
            key={index}
            type="button"
            onClick={item.onClick}
            className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition ${item.danger ? "text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-[#3a2020]" : "text-indigo-800 hover:bg-indigo-100 dark:text-[#cccccc] dark:hover:bg-[#2a2d2e] dark:hover:text-[#4daafc]"}`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>
    )}
  </div>
);
}

export default function TopBar({ editor, onMathClick }: TopBarProps) {
  // Forza il re-render ogni volta che cambia qualcosa nell'editor
  // (selezione, marchi attivi, contenuto...) altrimenti i controlli
  // controllati (select, colore attivo, bottoni "active") restano
  // congelati all'ultimo render di React.
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  useEffect(() => {
    if (!editor) return;
    editor.on("transaction", forceUpdate);
    editor.on("selectionUpdate", forceUpdate);
    return () => {
      editor.off("transaction", forceUpdate);
      editor.off("selectionUpdate", forceUpdate);
    };
  }, [editor]);

  if (!editor) return null;
 return (
  <div className="flex flex-wrap items-center gap-1 rounded-lg border border-indigo-200 bg-indigo-50 px-2 py-2 dark:border-[#303030] dark:bg-[#252526]">
    {/* Undo / Redo */}
    <ToolbarButton
      onClick={() => editor.chain().focus().undo().run()}
      disabled={!editor.can().undo()}
      title="Annulla"
    >
      <Undo2 size={16} />
    </ToolbarButton>

    <ToolbarButton
      onClick={() => editor.chain().focus().redo().run()}
      disabled={!editor.can().redo()}
      title="Ripeti"
    >
      <Redo2 size={16} />
    </ToolbarButton>

    <Divider />

    {/* Font family */}
    <div className="relative inline-flex items-center">
      <Type size={14} className="pointer-events-none absolute left-2 text-indigo-500 dark:text-[#4daafc]" />

      <select
        className="h-8 cursor-pointer rounded-md border border-indigo-200 bg-white pl-7 pr-2 text-sm text-indigo-800 outline-none focus:border-indigo-500 dark:border-[#3c3c3c] dark:bg-[#1e1e1e] dark:text-[#cccccc] dark:focus:border-[#007acc]"
        onChange={(e) =>
          e.target.value
            ? editor.chain().focus().setFontFamily(e.target.value).run()
            : editor.chain().focus().unsetFontFamily().run()
        }
        value={(editor.getAttributes("textStyle").fontFamily as string) ?? ""}
      >
        {FONT_FAMILIES.map((f) => (
          <option key={f.label} value={f.value}>
            {f.label}
          </option>
        ))}
      </select>
    </div>

    {/* Heading */}
    <select
      className="h-8 cursor-pointer rounded-md border border-indigo-200 bg-white px-2 text-sm text-indigo-800 outline-none focus:border-indigo-500 dark:border-[#3c3c3c] dark:bg-[#1e1e1e] dark:text-[#cccccc] dark:focus:border-[#007acc]"
      value={
        editor.isActive("heading", { level: 1 })
          ? "1"
          : editor.isActive("heading", { level: 2 })
            ? "2"
            : editor.isActive("heading", { level: 3 })
              ? "3"
              : "0"
      }
      onChange={(e) => {
        const level = Number(e.target.value);
        if (level === 0) {
          editor.chain().focus().setParagraph().run();
        } else {
          editor.chain().focus().toggleHeading({ level: level as 1 | 2 | 3 }).run();
        }
      }}
    >
      <option value="0">Paragrafo</option>
      <option value="1">Titolo 1</option>
      <option value="2">Titolo 2</option>
      <option value="3">Titolo 3</option>
    </select>

    <Divider />

    {/* Basic marks */}
    <ToolbarButton
      onClick={() => editor.chain().focus().toggleBold().run()}
      active={editor.isActive("bold")}
      title="Grassetto"
    >
      <Bold size={16} />
    </ToolbarButton>

    <ToolbarButton
      onClick={() => editor.chain().focus().toggleItalic().run()}
      active={editor.isActive("italic")}
      title="Corsivo"
    >
      <Italic size={16} />
    </ToolbarButton>

    <ToolbarButton
      onClick={() => editor.chain().focus().toggleUnderline().run()}
      active={editor.isActive("underline")}
      title="Sottolineato"
    >
      <UnderlineIcon size={16} />
    </ToolbarButton>

    <ToolbarButton
      onClick={() => editor.chain().focus().toggleStrike().run()}
      active={editor.isActive("strike")}
      title="Barrato"
    >
      <Strikethrough size={16} />
    </ToolbarButton>

    <Divider />

    {/* Color */}
    <ColorPicker editor={editor} />

    <ToolbarButton
      onClick={() => editor.chain().focus().toggleHighlight({ color: "#fde68a" }).run()}
      active={editor.isActive("highlight")}
      title="Evidenzia"
    >
      <Highlighter size={16} />
    </ToolbarButton>

    <Divider />

    {/* Alignment */}
    <ToolbarButton
      onClick={() => editor.chain().focus().setTextAlign("left").run()}
      active={editor.isActive({ textAlign: "left" })}
      title="Allinea a sinistra"
    >
      <AlignLeft size={16} />
    </ToolbarButton>

    <ToolbarButton
      onClick={() => editor.chain().focus().setTextAlign("center").run()}
      active={editor.isActive({ textAlign: "center" })}
      title="Allinea al centro"
    >
      <AlignCenter size={16} />
    </ToolbarButton>

    <ToolbarButton
      onClick={() => editor.chain().focus().setTextAlign("right").run()}
      active={editor.isActive({ textAlign: "right" })}
      title="Allinea a destra"
    >
      <AlignRight size={16} />
    </ToolbarButton>

    <ToolbarButton
      onClick={() => editor.chain().focus().setTextAlign("justify").run()}
      active={editor.isActive({ textAlign: "justify" })}
      title="Giustifica"
    >
      <AlignJustify size={16} />
    </ToolbarButton>

    <Divider />

    {/* Lists & quote */}
    <ToolbarButton
      onClick={() => editor.chain().focus().toggleBulletList().run()}
      active={editor.isActive("bulletList")}
      title="Elenco puntato"
    >
      <List size={16} />
    </ToolbarButton>

    <ToolbarButton
      onClick={() => editor.chain().focus().toggleOrderedList().run()}
      active={editor.isActive("orderedList")}
      title="Elenco numerato"
    >
      <ListOrdered size={16} />
    </ToolbarButton>

    <ToolbarButton
      onClick={() => editor.chain().focus().toggleBlockquote().run()}
      active={editor.isActive("blockquote")}
      title="Citazione"
    >
      <Quote size={16} />
    </ToolbarButton>

    <Divider />

    {/* Extra */}
    <ToolbarButton
      onClick={() => editor.chain().focus().toggleCodeBlock().run()}
      title="Inserisci Blocco Codice"
    >
      <Code size={16} />
    </ToolbarButton>

    <ToolbarButton
      onClick={() => editor.chain().focus().setHorizontalRule().run()}
      title="Inserisci Regola Orizzontale"
    >
      <Minus size={16} />
    </ToolbarButton>

    <ToolbarButton
      onClick={() => editor.chain().focus().toggleTaskList().run()}
      title="Inserisci To-Do List"
    >
      <ClipboardList size={16} />
    </ToolbarButton>

    <ToolbarButton onClick={onMathClick} title="Inserisci formula matematica">
      <SquareFunction size={16} />
    </ToolbarButton>

    <Divider />

    {/* Tabelle */}
    <TableMenu editor={editor} />
  </div>
);
}
import { Extension, InputRule, newlineInCode } from "@tiptap/core";

interface CustomShortcutOptions {
  onMathBlock?: () => void;
}

export default Extension.create<CustomShortcutOptions>({
  name: "customShortcut",

  addOptions() {
    return {
      onMathBlock: undefined,
    };
  },

  addInputRules() {
    const headingType = this.editor.schema.nodes.heading;

    if (!headingType) {
      return [];
    }

    return [
      //tit[NUmero] per creare un heading di livello [Numero]
      new InputRule({
        find: /\/\/tit([1-3])\s$/,
        handler: ({ range, match, chain }) => {
          const level = parseInt(match[1], 10);

          chain().deleteRange(range).setNode("heading", { level }).run();
        },
      }),

      //p er creare un paragrafo
      new InputRule({
        find: /\/\/p\s$/,
        handler: ({ range, chain }) => {
          chain().deleteRange(range).setParagraph().run();
        },
      }),

      //clear pulisce formattazione
      new InputRule({
        find: /\/\/clear\s$/,
        handler: ({ range, chain }) => {
          chain().deleteRange(range).clearNodes().unsetAllMarks().run();
        },
      }),

      //oggi inserisce data di oggi
      new InputRule({
        find: /\/\/oggi\s$/,
        handler: ({ range, chain }) => {
          const data = new Date().toLocaleDateString("it-IT", {
            day: "numeric",
            month: "long",
            year: "numeric",
          });
          chain()
            .deleteRange(range)
            .insertContent(data + " ")
            .run();
        },
      }),

      //code per creare un blocco di codice
      new InputRule({
        find: /\/\/code\s$/,
        handler: ({ range, chain }) => {
          const codeBLockType = this.editor.schema.nodes.codeBlock;

          if (!codeBLockType) return;

          chain().deleteRange(range).setNode("codeBlock").run();
        },
      }),

      //hr per creare una regola orizzontale
      new InputRule({
        find: /\/\/hr\s$/,
        handler: ({ state, range, match, chain }) => {
          chain().deleteRange(range).setHorizontalRule().run();
        },
      }),

      //def | warn | example | quote  per creare un blockquote di tipo definizione
      new InputRule({
        find: /\/\/(quote|def|warn|example)\s$/,
        handler: ({ state, range, match, chain }) => {
          const quoteTypeDigit = match[1].toLowerCase();

          let quoteType;
          switch (quoteTypeDigit) {
            case "def":
              quoteType = "definition";
              break;
            case "warn":
              quoteType = "warning";
              break;
            case "example":
              quoteType = "example";
              break;
            case "quote":
              quoteType = "default";
              break;
            default:
              quoteType = "default";
          }

          chain()
            .deleteRange(range)
            .setBlockquote()
            .updateAttributes("blockquote", { type: quoteType })
            .run();
        },
      }),

      //todo per creare un task list
      new InputRule({
        find: /\/\/todo\s$/,
        handler: ({ state, range, match, chain }) => {
          const taskListType = this.editor.schema.nodes.taskList;
          const taskItemType = this.editor.schema.nodes.taskItem;

          if (!taskListType || !taskItemType) return;

          chain().deleteRange(range).toggleTaskList().run();
        },
      }),

      //ul | ol per creare una lista non ordinata
      new InputRule({
        find: /\/\/(ul|ol)\s$/,
        handler: ({ state, range, match, chain }) => {
          const bulletListType = this.editor.schema.nodes.bulletList;
          const listItemType = this.editor.schema.nodes.listItem;
          const listType = match[1].toLowerCase();

          let listTypeToUse;
          switch (listType) {
            case "ul":
              listTypeToUse = bulletListType;
              break;
            case "li":
              listTypeToUse = listItemType;
              break;
            default:
              listTypeToUse = bulletListType;
          }

          if (!bulletListType || !listItemType) return;

          if (listTypeToUse === bulletListType) {
            chain().deleteRange(range).toggleBulletList().run();
          } else if (listTypeToUse === listItemType) {
            chain().deleteRange(range).toggleOrderedList().run();
          }
        },
      }),

      //math per creare il blocco di matematica
      new InputRule({
        find: /\/\/math\s$/,
        handler: ({ state, range, chain }) => {
          const mathBlockType = state.schema.nodes.inlineMath;

          console.log("mathBlockType:", mathBlockType);

          if (!mathBlockType) {
            console.error("Nodo mathBlock non presente nello schema");
            return;
          }

          chain()
            .deleteRange(range)
            .insertContentAt(range.from, {
              type: "inlineMath",
            })
            .run();
          this.options.onMathBlock?.();
        },
      }),

      // table-righe-colonne
      new InputRule({
        find: /\/\/table-(\d+)-(\d+)\s$/,
        handler: ({ match, state, range, chain }) => {
          const tableNodeType = state.schema.nodes.table;

          console.log("tableNodeType:", tableNodeType);

          if (!tableNodeType) {
            console.error("Nodo table non presente nello schema");
            return;
          }

          const rows = Number(match[1]);
          const cols = Number(match[2]);

          if (rows <= 0 || cols <= 0) {
            return;
          }

          const table = {
            type: "table",
            content: Array.from({ length: rows }, () => ({
              type: "tableRow",
              content: Array.from({ length: cols }, () => ({
                type: "tableCell",
                content: [
                  {
                    type: "paragraph",
                  },
                ],
              })),
            })),
          };

          chain().deleteRange(range).insertContentAt(range.from, table).run();
        },
      }),
    ];
  },
});

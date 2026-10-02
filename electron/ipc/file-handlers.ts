import { ipcMain, dialog, BrowserWindow } from "electron";
import fs from "fs";
import path from "path";

import {
  delateNotes,
  insertNotes,
  selectNotes,
  renameNotes,
} from "../../database/ManageDatabase.ts";

import type { File } from "../../src/interface/interface.ts";

export function registerFileHandlers(win: BrowserWindow, dirPath: string) {

  //Creare File
  ipcMain.handle("file:create", async (_event, file: File) => {
    const filePath = path.join(dirPath, `${file.name}.json`);

    if (!fs.existsSync(filePath)) {
      //salvo ref nel db
      const note = insertNotes({
        id: file.id,
        course: file.course,
        name: file.name,
        data: new Date(file.created_at),
      });
      try {
        fs.writeFileSync(
          filePath,
          JSON.stringify(
            {
              metadata: {
                id: file.id,
                name: file.name,
                createAt: file.created_at.toISOString(),
                course: file.course,
              },
              type: "doc",
              content: file.content,
            },
            null,
            2,
          ),
        );
        console.log(`File ${file.name}.json creato con successo in ${dirPath}`);
        return { success: true, file: note };
      } catch (error) {
        console.error(`Errore durante la creazione del file ${file.name}.json:`, error);
        return { success: false, file: null };
      }
    }else{
      return { success: false, file: null };
    }
  });

  //Aprire File
  ipcMain.handle("file:open", async (_event, fileName: string) => {
    if (fileName === "") {
      const { canceled, filePaths } = await dialog.showOpenDialog({
        properties: ["openFile"],
        filters: [{ name: "File di testo", extensions: ["json"] }],
      });

      if (canceled || filePaths.length === 0) {
        return null;
      }

      return path.basename(filePaths[0], ".json");
    }

    const content = fs.readFileSync(`${dirPath}/${fileName}.json`, "utf-8");

    return content;
  });

  //Import file
  ipcMain.handle("file:import_file", async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ["openFile"],
      filters: [{ name: "File di testo", extensions: ["json"] }],
    });

    if (canceled || filePaths.length === 0) {
      return null;
    }
    const content = fs.readFileSync(filePaths[0], "utf-8");

    return content;
  });

  //salva File
  ipcMain.handle("file:save", async (_event, data: any, name: string) => {
    try {
      const filePath = path.join(dirPath, `${name}.json`);
      // Leggo il file esistente
      const fileContent = await fs.promises.readFile(filePath, "utf-8");
      // Converto il JSON in oggetto
      const file = JSON.parse(fileContent);

      file.content = data;

      // Riscrivo il file
      await fs.promises.writeFile(
        filePath,
        JSON.stringify(file, null, 2),
        "utf-8",
      );

      return {
        success: true,
        filePath,
        file,
      };
    } catch (error) {
      console.error("Errore nel salvataggio:", error);

      return {
        success: false,
        error: String(error),
      };
    }
  });

  //eliminare File
  ipcMain.handle("file:delate", async (_event, fileName: string) => {
    const filePath = path.join(dirPath, `${fileName}.json`);
    fs.unlinkSync(filePath);
    delateNotes(fileName);
    return { success: true };
  });

  //rinomina File
  ipcMain.handle(
    "file:rename",
    async (_event, fileName: string, newName: string) => {
      const oldPath = path.join(dirPath, `${fileName}.json`);
      const newPath = path.join(dirPath, `${newName}.json`);

      try {
        const content = await fs.promises.readFile(oldPath, "utf-8");
        const file = JSON.parse(content);

        file.metadata.name = newName;

        await fs.promises.writeFile(
          newPath,
          JSON.stringify(file, null, 2),
          "utf-8",
        );

        await fs.promises.unlink(oldPath);

        renameNotes(fileName, newName);

        return { success: true };
      } catch (error: any) {
        return { success: false, error: error.message };
      }
    },
  );

  // Esportare PDF
  ipcMain.handle("export-pdf", async () => {
    if (!win) {
      throw new Error("Finestra principale non disponibile");
    }

    const { canceled, filePath } = await dialog.showSaveDialog(win, {
      title: "Esporta PDF",
      defaultPath: "documento.pdf",
      filters: [
        {
          name: "PDF",
          extensions: ["pdf"],
        },
      ],
    });

    if (canceled || !filePath) {
      return {
        canceled: true,
      };
    }

    const pdf = await win.webContents.printToPDF({
      pageSize: "A4",
      printBackground: true,
    });

    fs.writeFileSync(filePath, pdf);

    return {
      canceled: false,
      filePath,
    };
  });

  //selezione file REF dal db
  ipcMain.handle("file:select", async () => {
    return selectNotes();
  });
}

import { File } from "@/interface/interface";
import { Editor } from "@tiptap/react";
import { ElectronApi } from "@/interface/interface";

interface SaveFilePickerOptions {
  suggestedName?: string;
  types?: Array<{
    description?: string;
    accept?: Record<string, string[]>;
  }>;
}

interface OpenFilePickerOptions {
  multiple?: boolean;
  types?: Array<{
    description?: string;
    accept?: Record<string, string[]>;
  }>;
}

declare global {
  interface Window {
    electronAPI?: ElectronApi;
    showSaveFilePicker?: (
      options?: SaveFilePickerOptions,
    ) => Promise<FileSystemFileHandle>;
    showOpenFilePicker?: (
      options?: OpenFilePickerOptions,
    ) => Promise<FileSystemFileHandle[]>;
  }
}

class CustomFileManager {
  private editor: Editor | null = null;
  private fileData: { name: string; course: string; data: any } | undefined;

  setEditor(editor: Editor) {
    this.editor = editor;
  }

  async createFile(file: File) {

    const create = window.electronAPI?.createFile?.(file);
    return create;
  }

  //Dall'editor, quando l'utente clicca su "Apri file", viene chiamata questa funzione che apre il file selezionato e lo carica nell'editor
  async openFile(fileName: string = "") {
    const openFile = window.electronAPI?.openFile;

    if (!openFile) {
      console.error("Apertura file non disponibile");
      return;
    }

    if (fileName === "") {
      const selectedFileName = await openFile("");

      return selectedFileName;
    }

    if (!this.editor) {
      console.error("Editor non impostato");
      return;
    }

    const file = await openFile(fileName);
    const jsonFile = JSON.parse(file);

    this.editor.commands.setContent(jsonFile);

    this.setFileData(
      jsonFile.metadata.name,
      jsonFile.metadata.course,
      jsonFile,
    );

    return this.fileData;
  }

  //Per ImportAppuntiPage, quando l'utente clicca su "Seleziona file", viene chiamata questa funzione che apre il file selezionato e lo carica nell'editor
  //ritora solo il contenuto del file selezionato senza caricarlo nell'editorù

  async openFileForImport() {
    const importFile = window.electronAPI?.importFile;

    if (!importFile) {
      console.error("Apertura file non disponibile");
      return;
    }
    const selectedFileName = await importFile();

    return JSON.parse(selectedFileName);
  }

  async saveFile() {
    if (!this.editor) {
      console.error("Editor non impostato");
      return;
    }

    const saveFile = window.electronAPI?.saveFile;
    if (!saveFile) {
      console.error("Salvataggio file non disponibile");
      return;
    }

    const content = this.getEditorContentJSON();
    const fileData = this.getFileData();
    if (!fileData) return;
    const { name, data } = fileData;

    const save = await saveFile(content, name);
    console.log(save);
  }

  delateFile(fileName: string) {
    const delate = window.electronAPI?.delateFile?.(fileName);
    return delate;
  }

  closeFile() {
    this.fileData = undefined;
  }

  exportPDF() {
    // Funzione che permette di esportare in PDF
    if (!window.electronAPI?.exportPDF) {
      console.error("Export PDF non disponibile");
      return;
    }
    window.electronAPI.exportPDF();
  }

  exportJSON(fileName: string){
    // Funzione che permette di esportare in JSON
    if(!window.electronAPI?.exportJSON){
        console.error("Export JSON non disponibile");
      return;
    }
    window.electronAPI?.exportJSON?.(fileName);
  }

  renameFile(fileName: string, newName: string) {
    const rename = window.electronAPI?.renameFile?.(fileName, newName);
    return rename;
  }

  //UTIL
  getFileData() {
    return this.fileData;
  }

  private setFileData(name: string, course: string, data: any) {
    this.fileData = { name, course, data };
  }

  private getEditorContentJSON() {
    if (!this.editor) return;
    return this.editor.getJSON().content;
  }
}

const FileManager = new CustomFileManager();

export default FileManager;

"use client";

import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

import { File } from "@/interface/interface";
import FileManager from "../manager/FileManager";

type FilesContextType = {
  files: File[];
  createFile: (newFile: File) => Promise<any>;
  setFiles: Dispatch<SetStateAction<File[]>>;
  deleteFile: (fileName: string) => Promise<any>;
  renameFile: (fileName: string, newName: string) => Promise<any>;
  removeFilesByCourse: (courseId: string) => void;
};

const FilesContext = createContext<FilesContextType | null>(null);

export function FilesProvider({ children }: { children: ReactNode }) {
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    async function loadFiles() {
      try {
        const electronAPI = window.electronAPI as
          | (typeof window.electronAPI & {
              selectFile?: () => Promise<File[]>;
            })
          | undefined;

        if (!electronAPI?.selectFile) {
          return;
        }

        const loadedFiles = await electronAPI.selectFile();

        setFiles(loadedFiles);
      } catch (error) {
        console.error("Errore caricamento File:", error);
      }
    }

    loadFiles();
  }, []);

  async function deleteFile(fileName: string) {
    const result = await FileManager.delateFile(fileName);

    if (result?.success) {
      setFiles((currentFiles) =>
        currentFiles.filter((file) => file.name !== fileName),
      );
    }

    return result;
  }

  async function renameFile(fileName: string, newName: string) {
    const result = await FileManager.renameFile(fileName, newName);

    if (result?.success) {
      setFiles((currentFiles) =>
        currentFiles.map((file) =>
          file.name === fileName
            ? {
                ...file,
                name: newName,
              }
            : file,
        ),
      );
    }

    return result;
  }

  async function createFile(newFile: File) {
    console.log(newFile);
    const result = await FileManager.createFile(newFile);

    if (result?.success && result.file) {
      setFiles((currentFiles) => [...currentFiles, result.file]);
    }

    return result;
  }

  function removeFilesByCourse(courseId: string) {
  setFiles((currentFiles) =>
    currentFiles.filter((file) => file.course !== courseId)
  );
}

  return (
    <FilesContext.Provider
      value={{ files, createFile, setFiles, deleteFile, renameFile, removeFilesByCourse }}
    >
      {children}
    </FilesContext.Provider>
  );
}

export function useFiles() {
  const context = useContext(FilesContext);

  if (!context) {
    throw new Error("useFiles must be used within a FilesProvider");
  }

  return context;
}

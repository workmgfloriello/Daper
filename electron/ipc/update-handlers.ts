import { app, BrowserWindow, ipcMain } from "electron";
import electronUpdater from "electron-updater";

const { autoUpdater } = electronUpdater;

export function registerAutoUpdater(win: BrowserWindow) {
  autoUpdater.autoDownload = true;

  autoUpdater.on("update-available", (info) => {
    win.webContents.send("update-available", {
      version: info.version,
    });
  });

  autoUpdater.on("update-downloaded", (info) => {
    win.webContents.send("update-downloaded", {
      version: info.version,
    });
  });

  autoUpdater.on("error", (error) => {
    console.error("Errore aggiornamento:", error);
  });

  ipcMain.handle("app:get-version", () => {
    return app.getVersion();
  });
  ipcMain.handle("update:install", () => {
    autoUpdater.quitAndInstall();
  });

  autoUpdater.checkForUpdates();
}

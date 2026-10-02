import { app, BrowserWindow, ipcMain } from "electron";
import electronUpdater from "electron-updater";
import fs from "fs";
import path from "path";

const { autoUpdater } = electronUpdater;
const logFile = path.join(app.getPath("userData"), "update.log");
function updateLog(message: string) {
  fs.appendFileSync(logFile, `${new Date().toISOString()} - ${message}\n`);
  console.log(message);
}
export function registerAutoUpdater(win: BrowserWindow) {
  autoUpdater.autoDownload = false;

  autoUpdater.on("checking-for-update", () => {
    updateLog("Controllo aggiornamenti...");
  });

  autoUpdater.on("update-available", (info) => {
    updateLog("Aggiornamento disponibile: " + info.version);

    win.webContents.send("update-available", {
      version: info.version,
    });
  });

  autoUpdater.on("update-not-available", (info) => {
    updateLog("Nessun aggiornamento disponibile: " + info.version);
  });

  autoUpdater.on("update-downloaded", (info) => {
    updateLog("Aggiornamento scaricato: " + info.version);

    win.webContents.send("update-downloaded", {
      version: info.version,
    });
  });

  autoUpdater.on("error", (error) => {
    updateLog("Errore aggiornamento: " + error.message);
  });

  ipcMain.handle("app:get-version", () => {
    return app.getVersion();
  });

  ipcMain.handle("update:download", async () => {
    return autoUpdater.downloadUpdate();
  });

  ipcMain.handle("update:install", () => {
    autoUpdater.quitAndInstall();
  });

  autoUpdater.checkForUpdates();
}
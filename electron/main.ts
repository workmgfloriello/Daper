import { app, BrowserWindow, Menu } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import fs from "node:fs";
import { setDatabase } from "../database/ManageDatabase.ts";
import { registerIpcHandlers } from "./ipc/index.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isDev = !app.isPackaged;

let win: BrowserWindow | null = null;
let splash: BrowserWindow | null = null;

// =========================================================
// PATH
// =========================================================

const logoPath = path.join(__dirname, "../public/assets/logo.ico");

const documentsPath = path.join(app.getPath("userData"), "documents");

const databasePath = path.join(app.getPath("userData"), "Daper.db");

// =========================================================
// SPLASH SCREEN
// =========================================================

function createSplashWindow() {
  splash = new BrowserWindow({
    width: 500,
    height: 300,

    frame: false,
    resizable: false,
    movable: false,

    transparent: true,
    alwaysOnTop: true,

    show: true,

    icon: logoPath,

    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (isDev) {
    splash.loadURL("http://localhost:3000/splash.html");
  } else {
    splash.loadFile(path.join(__dirname, "../out/splash.html"));
  }
}

// =========================================================
// MAIN WINDOW
// =========================================================

function createWindow() {
  win = new BrowserWindow({
    width: 1400,
    height: 900,

    minWidth: 1400,
    minHeight: 900,
    frame: false,

    // IMPORTANTE:
    // la finestra principale rimane nascosta
    // fino a quando non è completamente caricata
    show: false,

    icon: logoPath,
    title: "Daper",

    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  Menu.setApplicationMenu(null);

  // =======================================================
  // LOAD APP
  // =======================================================

  if (isDev) {
    win.loadURL("http://localhost:3000");
  } else {
    win.loadFile(path.join(__dirname, "../out/index.html"));
  }

  // =======================================================
  // APP PRONTA
  // =======================================================

  win.once("ready-to-show", () => {
    // Mostriamo la finestra principale
    win?.show();

    // Chiudiamo lo splash
    if (splash) {
      splash.close();
      splash = null;
    }
  });

  // =======================================================
  // DEVTOOLS
  // =======================================================

  //if (isDev) {
    win.webContents.openDevTools();
  //}

  // =======================================================
  // CLOSED
  // =======================================================

  win.on("closed", () => {
    win = null;
  });
}

// =========================================================
// DATABASE// =========================================================

async function createDatabase() {
  try {
    if (!fs.existsSync(databasePath)) {
      fs.writeFileSync(databasePath, "", "utf-8");
    }

    setDatabase(databasePath);

    console.log("Database inizializzato:", databasePath);
  } catch (error) {
    console.error("Errore inizializzazione database:", error);

    throw error;
  }
}

// =========================================================
// APP READY
// =========================================================

app.whenReady().then(async () => {
  try {
    // -------------------------------------------------------
    // 1. Mostra immediatamente lo splash
    // -------------------------------------------------------

    createSplashWindow();

    // -------------------------------------------------------
    // 2. Crea cartella documenti
    // -------------------------------------------------------

    fs.mkdirSync(documentsPath, {
      recursive: true,
    });

    // -------------------------------------------------------
    // 3. Inizializza database
    // -------------------------------------------------------

    await createDatabase();

    // -------------------------------------------------------
    // 4. Crea finestra principale
    // -------------------------------------------------------

    createWindow();

    // -------------------------------------------------------
    // 5. Registra IPC
    // -------------------------------------------------------

    if (win) {
      registerIpcHandlers(win, documentsPath);
    }

    console.log("Documents:", documentsPath);

    console.log("Database:", databasePath);

    // -------------------------------------------------------
    // 6. MacOS
    // -------------------------------------------------------

    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });
  } catch (error) {
    console.error("Errore durante l'avvio di Daper:", error);

    // Chiudi lo splash in caso di errore
    if (splash) {
      splash.close();
      splash = null;
    }

    app.quit();
  }
});

// =========================================================
// WINDOWS CLOSED
// =========================================================

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

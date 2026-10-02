import { BrowserWindow } from "electron";
import { registerCourseHandlers } from "./course-handlers.ts";
import { registerFileHandlers } from "./file-handlers.ts";
import { registerWindowHandlers } from "./window-handlers.ts";
import { registerUserHandlers } from "./user-handlers.ts";
import { registerAutoUpdater } from "./update-handlers.ts";

export function registerIpcHandlers(win: BrowserWindow, dirPath: string) {
  registerWindowHandlers(win);
  registerCourseHandlers();
  registerFileHandlers(win, dirPath);
  registerUserHandlers();
  registerAutoUpdater(win);
}

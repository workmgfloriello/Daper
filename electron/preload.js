const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  //window
  minimize: () => ipcRenderer.send("window-minimize"),
  maximize: () => ipcRenderer.send("window-maximize"),
  close: () => ipcRenderer.send("window-close"),

  //file
  openFile: (fileName) => ipcRenderer.invoke("file:open", fileName),
  createFile: (file) => ipcRenderer.invoke("file:create", file),
  saveFile: (data, name) => ipcRenderer.invoke("file:save", data, name),
  exportPDF: () => ipcRenderer.invoke("export-pdf"),
  selectFile: () => ipcRenderer.invoke("file:select"),
  delateFile: (fileName) => ipcRenderer.invoke("file:delate", fileName),
  renameFile: (fileName, newName) =>
    ipcRenderer.invoke("file:rename", fileName, newName),
  importFile: () => ipcRenderer.invoke("file:import_file"),

  //course
  insertCourse: (course) => ipcRenderer.invoke("courses:insert", course),
  selectCourses: () => ipcRenderer.invoke("courses:select"),
  updateRecent: (courseId, newRecent) =>
    ipcRenderer.invoke("courses:updateRecent", courseId, newRecent),
  updateColor: (courseId, color) =>
    ipcRenderer.invoke("courses:updateColor", courseId, color),
  updateNoteCount: (courseId, count) =>
    ipcRenderer.invoke("courses:updateNoteCount", courseId, count),
  delateCourse: (courseId) => ipcRenderer.invoke("courses:delate", courseId),
  updateCourse: (courseId, course) =>
    ipcRenderer.invoke("courses:update", courseId, course),

  //user
  insertUser: (user) => ipcRenderer.invoke("user:create", user),
  selectUser: () => ipcRenderer.invoke("user:select"),
  updateUser: (user) => ipcRenderer.invoke("user:update", user),

  //update
  onUpdateAvailable: (callback) => {
    ipcRenderer.on("update-available", (_event, data) => {
      callback(data);
    });
  },

  onUpdateDownloaded: (callback) => {
    ipcRenderer.on("update-downloaded", (_event, data) => {
      callback(data);
    });
  },

  installUpdate: () => ipcRenderer.invoke("update:install"),
  getVersion: () => ipcRenderer.invoke("app:get-version"),
});

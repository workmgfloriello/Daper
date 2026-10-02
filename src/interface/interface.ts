export interface Course {
  id: string;
  name: string;
  code: string;
  professor: string;
  cfu: number;
  semester: number;
  year: number;
  notes_count: number;
  description: string;
  color: string;
  recent: boolean;
}

export type File = {
  id: string;
  name: string;
  directory?: string;
  course: string;
  description?: string;
  created_at: Date;
  content?: any;
};

export type User = {
  name: string;
  school: string;
  type: string;
};

export type EditorCommandView = {
  name: string;
  symbol: string;
  desc: string;
};

export type ElectronApi = {
  //corsi
  selectCourses?: () => Promise<any[]>;
  insertCourse?: (course: any) => Promise<any>;
  updateRecent?: (courseId: string, newRecent: boolean) => Promise<any>;
  updateColor?: (courseId: string, color: string) => Promise<any>;
  updateNoteCount?: (courseId: string, count: number) => Promise<any>;
  delateCourse?: (courseId: string) => any;

  //file
  createFile?: (file: File) => any;
  exportPDF?: () => void | Promise<void>;
  openFile?: (fileName: string) => any;
  saveFile?: (data: any, name: any) => any;
  delateFile?: (fileName: string) => any;
  renameFile?: (fileName: string, newName: string) => any;
  updateCourse: (courseId: string, course: any) => any;
  importFile?: () => any;

  //User
  insertUser?: (user: User) => any;
  selectUser?: () => any;
  updateUser?: (user: User) => any;

 // update
  OnUpdateAvailable?: (callback: (data: { version: string }) => void) => void;
  OnUpdateDownloaded?: (callback: (data: { version: string }) => void) => void;
  installUpdate?: () => Promise<any>;
  getVersion?: () => Promise<string>;
};

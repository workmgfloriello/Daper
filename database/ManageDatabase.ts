import { DatabaseSync } from "node:sqlite";
import type { Course, User } from "../src/interface/interface.ts";

type Note = {
  id: string;
  name: string;
  course: string;
  data: Date;
};

let db: DatabaseSync | null = null;

/**
 * =========================
 * DATABASE
 * =========================
 */
export function setDatabase(path: string) {
  db = new DatabaseSync(path);
  if (db) {
    initializeDatabase(db);
  }
}
export function getDatabase(): DatabaseSync {
  if (db) {
    return db;
  } else {
    throw new Error("Database has not been initialized");
  }
}

function initializeDatabase(database: DatabaseSync) {
  database.exec(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS courses (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      code TEXT,
      professor TEXT,
      cfu INTEGER,
      semester INTEGER,
      notes_count INTEGER DEFAULT 0,
      description TEXT,
      color TEXT,
      recent INTEGER DEFAULT 0,
      year INTEGER
    );

    CREATE TABLE IF NOT EXISTS notes (
      id TEXT PRIMARY KEY,
      course TEXT NOT NULL,
      name TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (course)
        REFERENCES courses(id)
        ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT
    );

    CREATE TABLE IF NOT EXISTS user (
      name TEXT PRIMARY KEY,
      school TEXT NOT NULL,
      type TEXT NOT NULL
    );
  `);

  const existingCourse = database
    .prepare("SELECT id FROM courses WHERE name = ?")
    .get("Note Rapide");

  if (!existingCourse) {
    database
      .prepare(
        `
        INSERT INTO courses (
          id,
          name,
          code,
          professor,
          cfu,
          semester,
          notes_count,
          description,
          color,
          recent,
          year
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      )
      .run(
        "quick-notes",
        "Note Rapide",
        "",
        "",
        0,
        1,
        0,
        "Questo è il tuo spazio personale per creare e organizzare rapidamente appunti che non appartengono a un corso specifico.",
        "color1",
        1,
        1,
      );
  }
}
/**
 * =========================
 * COURSES
 * =========================
 */

export function insertCourse(course: Course) {
  const database = getDatabase();

  const stmt = database.prepare(`
    INSERT INTO courses (
      id,
      name,
      code,
      professor,
      cfu,
      semester,
      notes_count,
      description,
      color,
      recent,
      year
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    course.id,
    course.name,
    course.code,
    course.professor,
    course.cfu,
    course.semester,
    course.notes_count,
    course.description,
    course.color,
    course.recent ? 1 : 0,
    course.year,
  );

  return course;
}

export function selectCourses() {
  const database = getDatabase();

  return database.prepare("SELECT * FROM courses").all();
}

export function updateCourseColor(courseId: string, color: string) {
  const database = getDatabase();

  const stmt = database.prepare(`
    UPDATE courses
    SET color = ?
    WHERE id = ?
  `);

  const result = stmt.run(color, courseId);
  return {
    success: result.changes > 0,
    changes: result.changes,
  };
}

export function updateRecent(courseId: string, newRecent: boolean) {
  const database = getDatabase();

  const stmt = database.prepare(`
    UPDATE courses
    SET recent = ?
    WHERE id = ?
  `);

  const result = stmt.run(newRecent ? 1 : 0, courseId);
  return {
    success: result.changes > 0,
    changes: result.changes,
  };
}

//1 fa +1 0 fa -1
export function updateNoteCount(courseId: string, count: number) {
  const database = getDatabase();

  const stmt = database.prepare(`
    UPDATE courses
    SET notes_count = MAX(notes_count + ?, 0)
    WHERE id = ?
  `);

  const result = stmt.run(count === 1 ? 1 : -1, courseId);

  return {
    success: result.changes > 0,
    changes: result.changes,
  };
}

export function delateCourseDB(courseId: string) {
  const database = getDatabase();

  const stmt = database.prepare(`   
     DELETE FROM courses
    WHERE id = ?`);
  const result = stmt.run(courseId);

  return result;
}

export function updateCourse(
  courseId: string,
  course: {
    name: string;
    professor: string;
    description: string;
    year: number;
    semester: number;
  },
) {
  const database = getDatabase();

  const stmt = database.prepare(`
    UPDATE courses
    SET
      name = ?,
      professor = ?,
      description = ?,
      year = ?,
      semester = ?
    WHERE id = ?
  `);

  const result = stmt.run(
    course.name,
    course.professor,
    course.description,
    course.year,
    course.semester,
    courseId,
  );

  return {
    success: result.changes > 0,
    changes: result.changes,
  };
}

/**
 * =========================
 * NOTES
 * =========================
 */

export function insertNotes(note: Note) {
  const database = getDatabase();

  const stmt = database.prepare(`
    INSERT INTO notes (
      id,
      course,
      name,
      created_at
    )
    VALUES (?, ?, ?, ?)
  `);

  stmt.run(note.id, note.course, note.name, note.data.toISOString());

  return note;
}

export function selectNotes() {
  const database = getDatabase();

  return database.prepare("SELECT * FROM notes").all();
}

export function delateNotes(name: string) {
  const database = getDatabase();

  const stmt = database.prepare(`
    DELETE FROM notes
    WHERE name = ?
  `);

  const result = stmt.run(name);

  return result;
}

export function renameNotes(oldName: string, newName: string) {
  const database = getDatabase();

  const stmt = database.prepare(`
    UPDATE notes
    SET name = ?
    WHERE name = ?
  `);

  return stmt.run(newName, oldName);
}

/**
 * =========================
 * USER
 * =========================
 */

export function insertUser(user: User) {
  const database = getDatabase();

  const stmt = database.prepare(`
    INSERT INTO user (
      name,
      school,
      type
    )
    VALUES (?, ?, ? )
  `);

  const result = stmt.run(user.name, user.school, user.type);

  return {
    success: result.changes > 0,
    user,
  };
}

export function selectUser() {
  const database = getDatabase();

  return (
    database
      .prepare(
        `
      SELECT *
      FROM user
      LIMIT 1
    `,
      )
      .get() ?? null
  );
}

export function updateUser(user: User) {
  const database = getDatabase();
  
  const stmt = database.prepare(`
    UPDATE user
    SET
      name = ?,
      school = ?,
      type = ?
  `);

  const result = stmt.run(
    user.name,
    user.school,
    user.type,
  );

  return {
    success: result.changes > 0,
    changes: result.changes,
  };
}
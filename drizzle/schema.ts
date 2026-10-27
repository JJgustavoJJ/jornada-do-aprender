import { int, json, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Student roster imported from the school list. Progress is stored separately
 * in student_progress so importing the roster does not create fake activity.
 */
export const students = mysqlTable("students", {
  id: int("id").autoincrement().primaryKey(),
  studentNumber: int("studentNumber").notNull().unique(),
  name: varchar("name", { length: 160 }).notNull().unique(),
  sex: mysqlEnum("sex", ["F", "M"]).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Student = typeof students.$inferSelect;
export type InsertStudent = typeof students.$inferInsert;

/**
 * Individual answer attempts, including retries, for teacher review.
 */
export const studentAnswers = mysqlTable("student_answers", {
  id: int("id").autoincrement().primaryKey(),
  studentName: varchar("studentName", { length: 120 }).notNull(),
  level: int("level").notNull(),
  exercise: int("exercise").notNull(),
  activityType: varchar("activityType", { length: 20 }).notNull(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  expectedAnswer: text("expectedAnswer"),
  isCorrect: int("isCorrect").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type StudentAnswer = typeof studentAnswers.$inferSelect;
export type InsertStudentAnswer = typeof studentAnswers.$inferInsert;

/**
 * One shared progress snapshot per student. JSON columns keep the per-level
 * breakdown flexible while the aggregate counters remain query-friendly.
 */
export const studentProgress = mysqlTable("student_progress", {
  id: int("id").autoincrement().primaryKey(),
  studentName: varchar("studentName", { length: 120 }).notNull().unique(),
  hits: int("hits").default(0).notNull(),
  errors: int("errors").default(0).notNull(),
  attempts: int("attempts").default(0).notNull(),
  levelsDone: json("levelsDone").$type<Record<string, boolean>>().notNull(),
  levelHits: json("levelHits").$type<Record<string, number>>().notNull(),
  levelErrors: json("levelErrors").$type<Record<string, number>>().notNull(),
  timePerLevel: json("timePerLevel").$type<Record<string, number>>().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type StudentProgress = typeof studentProgress.$inferSelect;
export type InsertStudentProgress = typeof studentProgress.$inferInsert;

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

import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createContext(user: TrpcContext["user"] = null): TrpcContext {
  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => undefined,
    } as TrpcContext["res"],
  };
}

const teacher: AuthenticatedUser = {
  id: 1,
  openId: "teacher-user",
  email: "teacher@example.com",
  name: "Teacher",
  loginMethod: "manus",
  role: "admin",
  createdAt: new Date(),
  updatedAt: new Date(),
  lastSignedIn: new Date(),
};

const regularUser: AuthenticatedUser = { ...teacher, role: "user", openId: "regular-user" };

describe("studentProgress", () => {
  it("requires authentication to read the shared teacher panel", async () => {
    const caller = appRouter.createCaller(createContext());

    await expect(caller.studentProgress.list()).rejects.toMatchObject({
      code: "UNAUTHORIZED",
    });
  });

  it("rejects an empty student name before touching the database", async () => {
    const caller = appRouter.createCaller(createContext());

    await expect(
      caller.studentProgress.save({
        studentName: "",
        hits: 0,
        errors: 0,
        attempts: 0,
        levelsDone: {},
        levelHits: {},
        levelErrors: {},
        timePerLevel: {},
      }),
    ).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("rejects an invalid lookup before querying the database", async () => {
    const caller = appRouter.createCaller(createContext(teacher));

    await expect(caller.studentProgress.get({ studentName: " " })).rejects.toMatchObject({
      code: "BAD_REQUEST",
    });
  });

  it("does not allow a regular user to clear the shared history", async () => {
    const caller = appRouter.createCaller(createContext(regularUser));

    await expect(caller.studentProgress.clear()).rejects.toMatchObject({
      code: "FORBIDDEN",
    });
  });
});

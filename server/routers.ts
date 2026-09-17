import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { clearStudentProgress, getStudentProgress, listStudentProgress, upsertStudentProgress } from "./db";

const studentProgressInput = z.object({
  studentName: z.string().trim().min(1).max(120),
  hits: z.number().int().nonnegative(),
  errors: z.number().int().nonnegative(),
  attempts: z.number().int().nonnegative(),
  levelsDone: z.record(z.string(), z.boolean()),
  levelHits: z.record(z.string(), z.number().int().nonnegative()),
  levelErrors: z.record(z.string(), z.number().int().nonnegative()),
  timePerLevel: z.record(z.string(), z.number().int().nonnegative()),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  studentProgress: router({
    // Alunos podem salvar o snapshot sem criar conta; a leitura fica protegida.
    save: publicProcedure.input(studentProgressInput).mutation(async ({ input }) => {
      await upsertStudentProgress(input);
      return { success: true } as const;
    }),
    get: publicProcedure
      .input(z.object({ studentName: z.string().trim().min(1).max(120) }))
      .query(async ({ input }) => {
        const row = await getStudentProgress(input.studentName);
        if (!row) return null;
        return {
          studentName: row.studentName,
          hits: row.hits,
          errors: row.errors,
          attempts: row.attempts,
          levelsDone: row.levelsDone ?? {},
          levelHits: row.levelHits ?? {},
          levelErrors: row.levelErrors ?? {},
          timePerLevel: row.timePerLevel ?? {},
        };
      }),
    list: protectedProcedure.query(async () => {
      const rows = await listStudentProgress();
      return rows.map((row) => ({
        studentName: row.studentName,
        hits: row.hits,
        errors: row.errors,
        attempts: row.attempts,
        levelsDone: row.levelsDone ?? {},
        levelHits: row.levelHits ?? {},
        levelErrors: row.levelErrors ?? {},
        timePerLevel: row.timePerLevel ?? {},
      }));
    }),
    // O painel local usa esta leitura para funcionar na rede da escola sem
    // exigir que cada computador faça login OAuth. A proteção administrativa
    // continua aplicada à limpeza dos dados.
    sharedList: publicProcedure.query(async () => {
      const rows = await listStudentProgress();
      return rows.map((row) => ({
        studentName: row.studentName,
        hits: row.hits,
        errors: row.errors,
        attempts: row.attempts,
        levelsDone: row.levelsDone ?? {},
        levelHits: row.levelHits ?? {},
        levelErrors: row.levelErrors ?? {},
        timePerLevel: row.timePerLevel ?? {},
      }));
    }),
    clear: adminProcedure.mutation(async () => {
      await clearStudentProgress();
      return { success: true } as const;
    }),
  }),
});

export type AppRouter = typeof appRouter;

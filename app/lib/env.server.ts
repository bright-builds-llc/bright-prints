import { z } from "zod";

const serverEnvSchema = z.object({
  DATABASE_URL: z.url().optional(),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development")
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

export function parseServerEnv(source: NodeJS.ProcessEnv): ServerEnv {
  return serverEnvSchema.parse({
    DATABASE_URL: source.DATABASE_URL,
    NODE_ENV: source.NODE_ENV
  });
}

let maybeServerEnv: ServerEnv | null = null;

export function getServerEnv(): ServerEnv {
  if (maybeServerEnv) {
    return maybeServerEnv;
  }

  maybeServerEnv = parseServerEnv(process.env);
  return maybeServerEnv;
}

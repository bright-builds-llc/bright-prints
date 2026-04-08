import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

import { getServerEnv } from "~/lib/env.server";

declare global {
  var __brightPrintsPrisma: PrismaClient | undefined;
}

export function getDb(): PrismaClient {
  const { DATABASE_URL: maybeDatabaseUrl } = getServerEnv();

  if (!maybeDatabaseUrl) {
    throw new Error("DATABASE_URL is required before database-backed runtime features can run.");
  }

  if (!globalThis.__brightPrintsPrisma) {
    globalThis.__brightPrintsPrisma = new PrismaClient({
      adapter: new PrismaPg({ connectionString: maybeDatabaseUrl })
    });
  }

  return globalThis.__brightPrintsPrisma;
}

import { PrismaPg } from "@prisma/adapter-pg";
import prismaClientModule from "@prisma/client";
import type { PrismaClient as PrismaClientType } from "@prisma/client";

import { getServerEnv } from "~/lib/env.server";

const { PrismaClient } = prismaClientModule;

declare global {
  var __brightPrintsPrisma: PrismaClientType | undefined;
}

export function getDb(): PrismaClientType {
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

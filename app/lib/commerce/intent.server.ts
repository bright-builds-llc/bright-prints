import type { PrismaClient } from "@prisma/client";

import type { PrintRecord } from "~/lib/content/schema";

type CommerceDb = Pick<PrismaClient, "commerceIntent">;

export function buildCommerceIntentMetadata(print: PrintRecord) {
  return {
    availability: print.availability,
    commerce: print.commerce ?? null,
    title: print.title
  };
}

export async function createCommerceInterest(options: {
  contact: string;
  db: CommerceDb;
  note?: string;
  print: PrintRecord;
  userId?: string | null;
}) {
  const { contact, db, note, print, userId } = options;

  return db.commerceIntent.create({
    data: {
      contact,
      metadata: {
        ...buildCommerceIntentMetadata(print),
        note: note?.trim() || null
      },
      printSlug: print.slug,
      provider: print.commerce?.provider ?? null,
      status: "interest",
      userId: userId ?? null
    }
  });
}

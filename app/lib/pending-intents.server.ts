import type { PrismaClient } from "@prisma/client";

import type {
  PendingIntent,
  SessionFlashMessage,
} from "~/lib/auth/session.server";
import { replayPendingGeneratorPresetIntent } from "~/lib/generator-presets/server";
import { replayPendingLibraryIntent } from "~/lib/library/mutations.server";

type PendingIntentDb = Pick<
  PrismaClient,
  | "$transaction"
  | "savedGeneratorPreset"
  | "savedPrintList"
  | "savedPrintListItem"
>;

export async function replayPendingAppIntent(
  db: PendingIntentDb,
  userId: string,
  pendingIntent: PendingIntent,
): Promise<SessionFlashMessage | null> {
  const maybeGeneratorFlash = await replayPendingGeneratorPresetIntent(
    db,
    userId,
    pendingIntent,
  );

  if (maybeGeneratorFlash) {
    return maybeGeneratorFlash;
  }

  const maybeLibraryFlash = await replayPendingLibraryIntent(
    db,
    userId,
    pendingIntent,
  );

  return maybeLibraryFlash ?? null;
}

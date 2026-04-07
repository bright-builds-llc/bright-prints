ALTER TABLE "User" ADD COLUMN "passwordHash" TEXT;

CREATE INDEX "Session_expiresAt_idx" ON "Session"("expiresAt");

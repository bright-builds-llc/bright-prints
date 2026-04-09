CREATE TABLE "SavedGeneratorPreset" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "generatorSlug" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "values" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "SavedGeneratorPreset_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "SavedGeneratorPreset_userId_generatorSlug_idx"
ON "SavedGeneratorPreset"("userId", "generatorSlug");

CREATE UNIQUE INDEX "SavedGeneratorPreset_userId_generatorSlug_name_key"
ON "SavedGeneratorPreset"("userId", "generatorSlug", "name");

ALTER TABLE "SavedGeneratorPreset"
ADD CONSTRAINT "SavedGeneratorPreset_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

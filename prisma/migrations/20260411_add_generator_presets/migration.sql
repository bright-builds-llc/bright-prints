CREATE TABLE "GeneratorPreset" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "generatorSlug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "snapshot" JSONB NOT NULL,
    "comparisonKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GeneratorPreset_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "GeneratorPreset_userId_generatorSlug_idx" ON "GeneratorPreset"("userId", "generatorSlug");

CREATE UNIQUE INDEX "GeneratorPreset_userId_generatorSlug_name_key" ON "GeneratorPreset"("userId", "generatorSlug", "name");

ALTER TABLE "GeneratorPreset"
ADD CONSTRAINT "GeneratorPreset_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

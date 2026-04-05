import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

import YAML from "yaml";

import { assertCreatorReferences, buildFoundationContent } from "~/lib/content/public";
import {
  creatorSchema,
  generatorSchema,
  printSchema,
  type CreatorRecord,
  type GeneratorRecord,
  type PrintRecord
} from "~/lib/content/schema";

const contentRoot = path.join(process.cwd(), "content");

async function readYamlFile<T>(filePath: string, parse: (value: unknown) => T): Promise<T> {
  const source = await readFile(filePath, "utf8");
  return parse(YAML.parse(source));
}

async function readChildYamlFiles<T extends { slug: string }>(
  directoryPath: string,
  fileName: string,
  parse: (value: unknown) => T
): Promise<T[]> {
  const entries = await readdir(directoryPath, { withFileTypes: true });
  const records = await Promise.all(
    entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => readYamlFile(path.join(directoryPath, entry.name, fileName), parse))
  );

  return [...records].sort((left, right) => left.slug.localeCompare(right.slug));
}

async function loadCreators(): Promise<CreatorRecord[]> {
  const creatorsDir = path.join(contentRoot, "creators");
  const entries = await readdir(creatorsDir);
  const creators = await Promise.all(
    entries
      .filter((entry) => entry.endsWith(".yaml"))
      .map((entry) => readYamlFile(path.join(creatorsDir, entry), creatorSchema.parse))
  );

  return [...creators].sort((left, right) => left.slug.localeCompare(right.slug));
}

async function loadPrints(): Promise<PrintRecord[]> {
  return readChildYamlFiles(
    path.join(contentRoot, "prints"),
    "print.yaml",
    printSchema.parse
  );
}

async function loadGenerators(): Promise<GeneratorRecord[]> {
  return readChildYamlFiles(
    path.join(contentRoot, "generators"),
    "generator.yaml",
    generatorSchema.parse
  );
}

export async function loadPublicContent() {
  const [creators, prints, generators] = await Promise.all([
    loadCreators(),
    loadPrints(),
    loadGenerators()
  ]);

  const content = { creators, generators, prints };
  assertCreatorReferences(content);
  return content;
}

export async function loadFoundationContent() {
  const content = await loadPublicContent();
  return buildFoundationContent(content);
}

import { readFile } from "node:fs/promises";
import path from "node:path";

import type { PublicContentIndex } from "~/lib/content/public";
import { findPrintBySlug } from "~/lib/content/public";
import { buildPrintContentDirectory } from "~/lib/content/load.server";
import type { PrintRecord } from "~/lib/content/schema";

type RepoPrintFile = PrintRecord["files"][number] & {
  repoPath: string;
};

export class PrintDownloadError extends Error {
  status: number;

  constructor(message: string, status = 404) {
    super(message);
    this.name = "PrintDownloadError";
    this.status = status;
  }
}

function assertRepoPrintFile(print: PrintRecord, fileIndex: number): RepoPrintFile {
  const maybeFile = print.files[fileIndex];

  if (!maybeFile) {
    throw new PrintDownloadError(`Print "${print.slug}" has no file at index ${fileIndex}`);
  }

  if (!maybeFile.repoPath || maybeFile.externalUrl) {
    throw new PrintDownloadError(
      `Print "${print.slug}" file ${fileIndex} is not available for internal download`
    );
  }

  return maybeFile;
}

function buildDownloadName(file: RepoPrintFile): string {
  return path.basename(file.repoPath);
}

function buildContentType(downloadName: string): string {
  const extension = path.extname(downloadName).slice(1).toLowerCase();

  switch (extension) {
    case "3mf":
      return "model/3mf";
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "step":
    case "stp":
      return "application/step";
    case "stl":
      return "model/stl";
    default:
      return "application/octet-stream";
  }
}

function resolveAbsoluteRepoPath(print: PrintRecord, file: RepoPrintFile): string {
  const printDirectory = buildPrintContentDirectory(print.slug);
  const resolvedPath = path.resolve(printDirectory, file.repoPath);

  if (
    resolvedPath !== printDirectory &&
    !resolvedPath.startsWith(`${printDirectory}${path.sep}`)
  ) {
    throw new PrintDownloadError(`Resolved path escaped print directory for "${print.slug}"`, 400);
  }

  return resolvedPath;
}

export async function buildPrintDownloadResponse(
  content: PublicContentIndex,
  slug: string,
  fileIndex: number
): Promise<Response> {
  const maybePrint = findPrintBySlug(content, slug);

  if (!maybePrint) {
    throw new PrintDownloadError(`Unknown print "${slug}"`);
  }

  const repoFile = assertRepoPrintFile(maybePrint, fileIndex);
  const absolutePath = resolveAbsoluteRepoPath(maybePrint, repoFile);
  const fileContents = await readFile(absolutePath);
  const downloadName = buildDownloadName(repoFile);

  return new Response(fileContents, {
    headers: {
      "Content-Disposition": `attachment; filename="${downloadName}"`,
      "Content-Length": String(fileContents.byteLength),
      "Content-Type": buildContentType(downloadName)
    }
  });
}

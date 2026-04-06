import { readFile } from "node:fs/promises";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { loadPublicContent } from "~/lib/content/load.server";
import {
  buildPrintDownloadResponse,
  PrintDownloadError
} from "~/lib/prints/download.server";

describe("buildPrintDownloadResponse", () => {
  it("returns attachment headers and real fixture bytes for repo-backed files", async () => {
    // Arrange
    const content = await loadPublicContent();
    const fixturePath = path.join(
      process.cwd(),
      "content/prints/modular-cable-clip/files/modular-cable-clip-ready.3mf"
    );
    const expectedBytes = await readFile(fixturePath, "utf8");

    // Act
    const response = await buildPrintDownloadResponse(content, "modular-cable-clip", 0);
    const actualBytes = await response.text();

    // Assert
    expect(response.headers.get("Content-Disposition")).toBe(
      'attachment; filename="modular-cable-clip-ready.3mf"'
    );
    expect(response.headers.get("Content-Type")).toBe("model/3mf");
    expect(actualBytes).toBe(expectedBytes);
  });

  it("rejects unknown print slugs", async () => {
    // Arrange
    const content = await loadPublicContent();

    // Act / Assert
    await expect(
      buildPrintDownloadResponse(content, "missing-print", 0)
    ).rejects.toMatchObject({
      status: 404
    });
  });

  it("rejects file references that are not internal repo downloads", async () => {
    // Arrange
    const content = await loadPublicContent();

    // Act / Assert
    await expect(
      buildPrintDownloadResponse(content, "sample-featured-print", 1)
    ).rejects.toBeInstanceOf(PrintDownloadError);
    await expect(
      buildPrintDownloadResponse(content, "sample-featured-print", 1)
    ).rejects.toMatchObject({
      status: 404
    });
  });
});

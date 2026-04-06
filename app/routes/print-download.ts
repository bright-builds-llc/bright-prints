import type { Route } from "./+types/print-download";

import { loadPublicContent } from "~/lib/content/load.server";
import {
  buildPrintDownloadResponse,
  PrintDownloadError
} from "~/lib/prints/download.server";

export async function loader({ params }: Route.LoaderArgs) {
  const maybeSlug = params.slug;
  const maybeFileIndex = Number(params.fileIndex);

  if (!maybeSlug || Number.isNaN(maybeFileIndex)) {
    throw new Response("Not Found", { status: 404 });
  }

  const content = await loadPublicContent();

  try {
    return await buildPrintDownloadResponse(content, maybeSlug, maybeFileIndex);
  } catch (error: unknown) {
    if (error instanceof PrintDownloadError) {
      throw new Response(error.message, { status: error.status });
    }

    throw error;
  }
}

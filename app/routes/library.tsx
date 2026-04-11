import { data, Link, redirect } from "react-router";

import type { Route } from "./+types/library";
import libraryStyles from "./library.css?url";

import { LibraryListForms } from "~/components/library/LibraryListForms";
import { LibraryPresetSection } from "~/components/library/LibraryPresetSection";
import { LibraryPrintGrid } from "~/components/library/LibraryPrintGrid";
import { LibrarySidebar } from "~/components/library/LibrarySidebar";
import { loadPublicContent } from "~/lib/content/load.server";
import { buildLibraryModel } from "~/lib/library/model";

export const links: Route.LinksFunction = () => [
  { rel: "stylesheet", href: libraryStyles }
];

export async function loader({ request }: Route.LoaderArgs) {
  const { getCurrentUserFromRequest } = await import("~/lib/auth/session.server");
  const { getDb } = await import("~/lib/db.server");
  const { loadGeneratorPresetLibraryEntries } = await import(
    "~/lib/generator-presets/query.server"
  );
  const { loadRuntimeLibraryLists } = await import("~/lib/library/query.server");
  const maybeCurrentUser = await getCurrentUserFromRequest(request);

  if (!maybeCurrentUser) {
    return redirect("/account?mode=sign-in");
  }

  const content = await loadPublicContent();
  const generatorPresets = await loadGeneratorPresetLibraryEntries(
    getDb(),
    maybeCurrentUser.id
  );
  const runtimeLists = await loadRuntimeLibraryLists(getDb(), maybeCurrentUser.id);
  const url = new URL(request.url);
  const model = buildLibraryModel({
    content,
    generatorPresets,
    maybeSelectedListId: url.searchParams.get("list"),
    runtimeLists
  });

  return data({
    currentUser: maybeCurrentUser,
    model
  });
}

export function meta() {
  return [{ title: "Library | Bright Prints" }];
}

export default function LibraryRoute({ loaderData }: Route.ComponentProps) {
  return (
    <main className="library-page">
      <section className="library-shell">
        <p className="eyebrow">Personal Library</p>
        <h1>Saved prints stay close</h1>
        <p>
          Bookmarks stay primary, generator presets stay close by, and empty states send you back into discovery.
        </p>
      </section>

      <LibraryPresetSection presets={loaderData.model.generatorPresets} />

      <div className="library-layout">
        <div className="library-layout-side">
          <LibrarySidebar lists={loaderData.model.lists} />
          <LibraryListForms selectedList={loaderData.model.selectedList} />
        </div>

        <div className="library-layout-main">
          <LibraryPrintGrid
            emptyState={loaderData.model.emptyState}
            selectedList={loaderData.model.selectedList}
          />
        </div>
      </div>

      <p>
        <Link className="home-secondary-action" prefetch="intent" to="/catalog?type=prints">
          Back to Catalog
        </Link>
      </p>
    </main>
  );
}

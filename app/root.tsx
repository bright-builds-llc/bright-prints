import {
  data,
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";

export const links: Route.LinksFunction = () => [];

export async function loader({ request }: Route.LoaderArgs) {
  const {
    commitAuthSession,
    getAuthSession,
    getCurrentUserFromRequest,
    getFlashMessage
  } = await import("~/lib/auth/session.server");
  const session = await getAuthSession(request.headers.get("Cookie"));
  const maybeCurrentUser = await getCurrentUserFromRequest(request);
  const maybeFlash = getFlashMessage(session);
  let bookmarkedPrintSlugs: string[] = [];

  if (maybeCurrentUser) {
    try {
      const { getBookmarkedPrintSlugs } = await import("~/lib/library/lists.server");
      const { getDb } = await import("~/lib/db.server");
      bookmarkedPrintSlugs = await getBookmarkedPrintSlugs(getDb(), maybeCurrentUser.id);
    } catch {
      bookmarkedPrintSlugs = [];
    }
  }

  if (maybeFlash) {
    return data(
      {
        bookmarkedPrintSlugs,
        currentUser: maybeCurrentUser,
        flash: maybeFlash
      },
      {
        headers: {
          "Set-Cookie": await commitAuthSession(session)
        }
      }
    );
  }

  return {
    bookmarkedPrintSlugs,
    currentUser: maybeCurrentUser,
    flash: null
  };
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Bright Prints";
  let details = "An unexpected application error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="error-shell">
      <section className="error-card">
        <p className="eyebrow">Application Error</p>
        <h1>{message}</h1>
        <p>{details}</p>
      </section>
      {stack && (
        <pre className="error-stack">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}

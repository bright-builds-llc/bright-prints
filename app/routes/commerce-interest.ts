import { data } from "react-router";
import { z } from "zod";

import type { Route } from "./+types/commerce-interest";

import { createCommerceInterest } from "~/lib/commerce/intent.server";
import { findPrintBySlug } from "~/lib/content/public";
import { loadPublicContent } from "~/lib/content/load.server";

const commerceInterestSchema = z.object({
  contact: z.string().trim().email(),
  note: z.string().trim().max(2000).optional(),
  printSlug: z.string().trim().min(1),
});

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const parsedSubmission = commerceInterestSchema.safeParse({
    contact: formData.get("contact"),
    note: formData.get("note") || undefined,
    printSlug: formData.get("printSlug"),
  });

  if (!parsedSubmission.success) {
    return data(
      {
        message:
          "Enter a valid email address before sending a physical-print request.",
        ok: false,
      },
      { status: 400 },
    );
  }

  const { contact, note, printSlug } = parsedSubmission.data;

  const content = await loadPublicContent();
  const maybePrint = findPrintBySlug(content, printSlug);

  if (
    !maybePrint ||
    maybePrint.commerce?.interestMode !== "interest" ||
    (maybePrint.availability !== "both" &&
      maybePrint.availability !== "physical-print")
  ) {
    return data(
      {
        message:
          "This print is not currently accepting physical-print requests.",
        ok: false,
      },
      { status: 404 },
    );
  }

  const { getCurrentUserFromRequest } =
    await import("~/lib/auth/session.server");
  const maybeCurrentUser = await getCurrentUserFromRequest(request);
  const { getDb } = await import("~/lib/db.server");

  try {
    await createCommerceInterest({
      contact,
      db: getDb(),
      note,
      print: maybePrint,
      userId: maybeCurrentUser?.id,
    });

    return data({
      message: "Interest request sent. We will follow up by email.",
      ok: true,
    });
  } catch {
    return data(
      {
        message:
          "Physical-print requests are temporarily unavailable. Please try again later.",
        ok: false,
      },
      { status: 503 },
    );
  }
}

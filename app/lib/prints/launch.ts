import type { PrintRecord } from "~/lib/content/schema";
import type {
  PrintDetailActionIntent,
  PrintDetailFileItem,
  PrintDetailFileSection
} from "~/lib/prints/detail";

export type PrintLaunchAction = {
  description: string;
  external: boolean;
  href: string;
  kind: "launch";
  label: string;
};

export type PrintLaunchAssessment = {
  fallbackDescription: string;
  maybeLaunchAction: PrintLaunchAction | null;
};

export type ResolvedPrintAction = {
  description: string;
  external: boolean;
  href: string;
  kind: "browse-catalog" | "download" | "launch" | "request-contact";
  label: string;
};

export type ResolvedPrintActionGroup = {
  fallbackNote: string | null;
  primary: ResolvedPrintAction;
  secondary: ResolvedPrintAction[];
};

type LaunchCapability = {
  allowedHosts: string[];
  label: string;
  supportedFileTypes: string[];
  vendor: "prusa";
};

const launchCapabilities: LaunchCapability[] = [
  {
    allowedHosts: ["printables.com", "www.printables.com"],
    label: "Open in PrusaSlicer",
    supportedFileTypes: ["3MF"],
    vendor: "prusa"
  }
];

const defaultRepositoryUrl = "https://github.com/bright-builds-llc/bright-prints";

function normalizeRepositoryUrl(repositoryUrl: string): string {
  if (repositoryUrl.startsWith("git@github.com:")) {
    const repositoryPath = repositoryUrl
      .replace("git@github.com:", "")
      .replace(/\.git$/, "");

    return `https://github.com/${repositoryPath}`;
  }

  return repositoryUrl.replace(/\.git$/, "");
}

export function buildPrintRequestContactHref(
  print: PrintRecord,
  repositoryUrl = defaultRepositoryUrl
): string {
  const issueUrl = new URL(`${normalizeRepositoryUrl(repositoryUrl)}/issues/new`);

  issueUrl.searchParams.set("title", `Physical print request: ${print.title}`);
  issueUrl.searchParams.set(
    "body",
    [
      `Print: ${print.title}`,
      `Slug: ${print.slug}`,
      "",
      "I would like to ask about a physical version of this print."
    ].join("\n")
  );

  return issueUrl.toString();
}

export function assessPrintLaunchCapability(options: {
  maybeFileTypeLabel: string | null;
  maybeFileUrl: string | null;
  siteOrigin: string;
}): PrintLaunchAssessment {
  const { maybeFileTypeLabel, maybeFileUrl, siteOrigin } = options;

  if (!maybeFileTypeLabel || !maybeFileUrl) {
    return {
      fallbackDescription:
        "Direct slicer launch is not available here yet. Download the print-ready file instead.",
      maybeLaunchAction: null
    };
  }

  const host = new URL(siteOrigin).host;
  const maybeCapability = launchCapabilities.find(
    (capability) =>
      capability.allowedHosts.includes(host) &&
      capability.supportedFileTypes.includes(maybeFileTypeLabel.toUpperCase())
  );

  if (!maybeCapability) {
    return {
      fallbackDescription:
        "Direct slicer launch is not available here yet. Download the print-ready file instead.",
      maybeLaunchAction: null
    };
  }

  return {
    fallbackDescription:
      "This print can hand off through a supported slicer host when that integration is available.",
    maybeLaunchAction: {
      description:
        "Open the print-ready file through a supported Prusa host instead of relying on a generic browser handoff.",
      external: true,
      href: maybeFileUrl,
      kind: "launch",
      label: maybeCapability.label
    }
  };
}

function findPreferredDownloadItem(
  fileSections: PrintDetailFileSection[]
): PrintDetailFileItem | null {
  const maybePrintReady = fileSections.find(
    (section) => section.kind === "print-ready" && section.status === "available"
  )?.items[0];

  if (maybePrintReady) {
    return maybePrintReady;
  }

  return (
    fileSections.find(
      (section) => section.kind === "source" && section.status === "available"
    )?.items[0] ?? null
  );
}

export function resolvePrintFileSections(options: {
  fileSections: PrintDetailFileSection[];
  slug: string;
}): PrintDetailFileSection[] {
  const { fileSections, slug } = options;

  return fileSections.map((section) => ({
    ...section,
    items: section.items.map((item) => ({
      ...item,
      href: item.repoPath
        ? `/prints/${slug}/files/${item.fileIndex}/download`
        : item.externalUrl,
      isExternal: item.externalUrl !== null
    }))
  }));
}

function buildResolvedDownloadAction(
  action: PrintDetailActionIntent,
  maybePreferredFile: PrintDetailFileItem | null
): ResolvedPrintAction {
  if (!maybePreferredFile?.href) {
    return {
      description: action.description,
      external: false,
      href: "/catalog?type=prints",
      kind: "browse-catalog",
      label: "Browse More Prints"
    };
  }

  return {
    description: action.description,
    external: maybePreferredFile.isExternal,
    href: maybePreferredFile.href,
    kind: "download",
    label: action.label
  };
}

function buildResolvedAction(
  action: PrintDetailActionIntent,
  maybePreferredFile: PrintDetailFileItem | null,
  print: PrintRecord
): ResolvedPrintAction {
  switch (action.kind) {
    case "browse-catalog":
      return {
        description: action.description,
        external: false,
        href: "/catalog?type=prints",
        kind: "browse-catalog",
        label: action.label
      };
    case "download":
      return buildResolvedDownloadAction(action, maybePreferredFile);
    case "request-contact":
      return {
        description: `${action.description} Opens a prefilled GitHub issue for follow-up.`,
        external: true,
        href: buildPrintRequestContactHref(print),
        kind: "request-contact",
        label: action.label
      };
  }
}

export function resolvePrintHeroActions(options: {
  actionIntents: {
    primary: PrintDetailActionIntent;
    secondary: PrintDetailActionIntent[];
  };
  fileSections: PrintDetailFileSection[];
  print: PrintRecord;
  siteOrigin: string;
}): ResolvedPrintActionGroup {
  const { actionIntents, fileSections, print, siteOrigin } = options;
  const maybePreferredFile = findPreferredDownloadItem(fileSections);
  const primary = buildResolvedAction(actionIntents.primary, maybePreferredFile, print);
  const secondary = actionIntents.secondary.map((action) =>
    buildResolvedAction(action, maybePreferredFile, print)
  );

  if (primary.kind !== "download" || !maybePreferredFile || maybePreferredFile.kind !== "print-ready") {
    return {
      fallbackNote: null,
      primary,
      secondary
    };
  }

  const launchAssessment = assessPrintLaunchCapability({
    maybeFileTypeLabel: maybePreferredFile.fileTypeLabel,
    maybeFileUrl: maybePreferredFile.href,
    siteOrigin
  });

  if (!launchAssessment.maybeLaunchAction) {
    return {
      fallbackNote: launchAssessment.fallbackDescription,
      primary,
      secondary
    };
  }

  return {
    fallbackNote: null,
    primary: {
      ...launchAssessment.maybeLaunchAction
    },
    secondary: [primary, ...secondary]
  };
}

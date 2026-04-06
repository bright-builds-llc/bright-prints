import type { PrintRecord } from "~/lib/content/schema";

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

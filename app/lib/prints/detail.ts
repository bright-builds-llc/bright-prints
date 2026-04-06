import { buildCreatorMap, type PublicContentIndex } from "~/lib/content/public";
import type { PrintRecord } from "~/lib/content/schema";
import {
  buildDiscoveryItems,
  buildRelatedDiscoveryItems,
  findDiscoveryItem,
  type DiscoveryItem
} from "~/lib/discovery/model";

type PrintFileRecord = PrintRecord["files"][number];

export type PrintDetailActionIntentKind =
  | "browse-catalog"
  | "download"
  | "request-contact";

export type PrintDetailActionIntent = {
  description: string;
  kind: PrintDetailActionIntentKind;
  label: string;
};

export type PrintDetailAvailabilityPanel = {
  description: string;
  label: string;
};

export type PrintDetailFileItem = {
  externalUrl: string | null;
  fileTypeLabel: string;
  fileIndex: number;
  href: string | null;
  isExternal: boolean;
  kind: PrintFileRecord["kind"];
  label: string;
  purpose: string;
  provenanceLabel: string;
  repoPath: string | null;
};

export type PrintDetailFileSection = {
  description: string;
  items: PrintDetailFileItem[];
  kind: "print-ready" | "source";
  status: "available" | "unavailable";
  title: string;
};

export type PrintDetailGuidance = {
  material: string;
  specialSteps: string[];
  layerHeight: string;
};

export type PrintDetailHero = {
  categories: string[];
  creatorName: string;
  description: string;
  publishedOn: string;
  summary: string;
  title: string;
};

export type PrintDetailTrustField = {
  href: string | null;
  isUnavailable: boolean;
  label: string;
  value: string;
};

export type PrintDetailModel = {
  actionIntents: {
    primary: PrintDetailActionIntent;
    secondary: PrintDetailActionIntent[];
  };
  availabilityPanel: PrintDetailAvailabilityPanel;
  fileSections: PrintDetailFileSection[];
  guidance: PrintDetailGuidance;
  hero: PrintDetailHero;
  posterItem: DiscoveryItem;
  print: PrintRecord;
  relatedItems: DiscoveryItem[];
  trustFields: PrintDetailTrustField[];
};

type PrintDetailFileSectionKind = PrintDetailFileSection["kind"];

const fileSectionDefinitions: Record<
  PrintDetailFileSectionKind,
  Pick<PrintDetailFileSection, "description" | "title"> & {
    unavailableDescription: string;
  }
> = {
  "print-ready": {
    description: "Ready-to-make files intended for direct slicer or printer workflows.",
    title: "Print-Ready Files",
    unavailableDescription: "No print-ready files are currently shared for this print."
  },
  source: {
    description: "Editable source assets for remixing, export, or reference work.",
    title: "Source Files",
    unavailableDescription: "No source files are currently shared for this print."
  }
};

function buildAvailabilityPanel(
  availability: PrintRecord["availability"]
): PrintDetailAvailabilityPanel {
  switch (availability) {
    case "both":
      return {
        description:
          "This print offers downloadable files now and a separate path for asking about a physical version.",
        label: "Free Download + Physical Print"
      };
    case "physical-print":
      return {
        description:
          "This print is currently offered as a physical object, with a lightweight request path instead of checkout.",
        label: "Physical Print"
      };
    case "open-source":
      return {
        description:
          "This print focuses on downloadable files you can inspect, slice, and make yourself.",
        label: "Free Download"
      };
  }
}

function deriveFileTypeLabel(file: PrintFileRecord): string {
  const source = file.repoPath ?? file.externalUrl;

  if (!source) {
    return "Unknown";
  }

  const sanitizedSource = source.split("?")[0]?.split("#")[0] ?? source;
  const maybeExtension = sanitizedSource.split(".").pop()?.trim().toUpperCase();

  if (!maybeExtension) {
    return "Unknown";
  }

  return maybeExtension;
}

function mapFileToItem(file: PrintFileRecord, fileIndex: number): PrintDetailFileItem {
  return {
    externalUrl: file.externalUrl ?? null,
    fileTypeLabel: deriveFileTypeLabel(file),
    fileIndex,
    href: null,
    isExternal: file.externalUrl !== undefined,
    kind: file.kind,
    label: file.label,
    purpose: file.purpose,
    provenanceLabel: file.repoPath ? "Repo file" : "External",
    repoPath: file.repoPath ?? null
  };
}

function buildFileSection(
  kind: PrintDetailFileSectionKind,
  files: PrintFileRecord[]
): PrintDetailFileSection {
  const items = files.flatMap((file, fileIndex) =>
    file.kind === kind ? [mapFileToItem(file, fileIndex)] : []
  );
  const definition = fileSectionDefinitions[kind];

  if (items.length === 0) {
    return {
      description: definition.unavailableDescription,
      items,
      kind,
      status: "unavailable",
      title: definition.title
    };
  }

  return {
    description: definition.description,
    items,
    kind,
    status: "available",
    title: definition.title
  };
}

function buildTrustFields(
  print: PrintRecord,
  fileSections: PrintDetailFileSection[]
): PrintDetailTrustField[] {
  const sourceSection = fileSections.find((section) => section.kind === "source");
  const fileProvenances = new Set(
    fileSections.flatMap((section) => section.items.map((item) => item.provenanceLabel))
  );

  const provenanceValue =
    fileProvenances.size === 0
      ? "Unavailable"
      : [...fileProvenances].sort().join(" + ");

  return [
    {
      href: print.license?.url ?? null,
      isUnavailable: print.license === undefined,
      label: "License",
      value: print.license?.name ?? "Unavailable"
    },
    {
      href: null,
      isUnavailable: sourceSection?.status !== "available",
      label: "Source Files",
      value: sourceSection?.status === "available" ? "Available" : "Unavailable"
    },
    {
      href: null,
      isUnavailable: provenanceValue === "Unavailable",
      label: "File Provenance",
      value: provenanceValue
    }
  ];
}

function buildGuidance(print: PrintRecord): PrintDetailGuidance {
  return {
    layerHeight:
      print.printDetails.layerHeightMm !== undefined
        ? `${print.printDetails.layerHeightMm} mm`
        : "Unavailable",
    material: print.printDetails.material ?? "Unavailable",
    specialSteps: print.printDetails.specialSteps
  };
}

function buildDownloadIntent(fileSections: PrintDetailFileSection[]): PrintDetailActionIntent {
  const maybePrintReadySection = fileSections.find(
    (section) => section.kind === "print-ready" && section.status === "available"
  );

  if (maybePrintReadySection) {
    return {
      description: "Start with the ready-to-make files for the fastest path into printing.",
      kind: "download",
      label: "Download Print-Ready Files"
    };
  }

  const maybeSourceSection = fileSections.find(
    (section) => section.kind === "source" && section.status === "available"
  );

  if (maybeSourceSection) {
    return {
      description: "Open the available source files for editing, export, or remixing.",
      kind: "download",
      label: "Download Source Files"
    };
  }

  return {
    description: "Browse the catalog while this print's file access remains unavailable.",
    kind: "browse-catalog",
    label: "Browse More Prints"
  };
}

function buildRequestContactIntent(
  availability: PrintRecord["availability"]
): PrintDetailActionIntent {
  if (availability === "both") {
    return {
      description: "Ask about a finished physical version without leaving the download path behind.",
      kind: "request-contact",
      label: "Ask About a Physical Print"
    };
  }

  return {
    description: "Contact the creator about getting this print made for you.",
    kind: "request-contact",
    label: "Request This Print"
  };
}

function buildActionIntents(
  availability: PrintRecord["availability"],
  fileSections: PrintDetailFileSection[]
): PrintDetailModel["actionIntents"] {
  const downloadIntent = buildDownloadIntent(fileSections);
  const requestIntent = buildRequestContactIntent(availability);

  switch (availability) {
    case "both":
      if (downloadIntent.kind === "browse-catalog") {
        return {
          primary: requestIntent,
          secondary: []
        };
      }

      return {
        primary: downloadIntent,
        secondary: [requestIntent]
      };
    case "physical-print":
      return {
        primary: requestIntent,
        secondary:
          downloadIntent.kind === "browse-catalog" ? [] : [downloadIntent]
      };
    case "open-source":
      return {
        primary: downloadIntent,
        secondary: []
      };
  }
}

function buildHero(
  print: PrintRecord,
  creatorName: string
): PrintDetailHero {
  return {
    categories: print.categories,
    creatorName,
    description: print.description,
    publishedOn: print.publishedOn,
    summary: print.summary,
    title: print.title
  };
}

export function buildPrintDetailModel(
  content: PublicContentIndex,
  print: PrintRecord
): PrintDetailModel {
  const creatorMap = buildCreatorMap(content);
  const creatorName = creatorMap.get(print.creatorSlug)?.displayName ?? print.creatorSlug;
  const discoveryItems = buildDiscoveryItems(content);
  const maybePosterItem = findDiscoveryItem(discoveryItems, "print", print.slug);

  if (!maybePosterItem) {
    throw new Error(`Missing discovery item for print "${print.slug}"`);
  }

  const fileSections: PrintDetailFileSection[] = [
    buildFileSection("print-ready", print.files),
    buildFileSection("source", print.files)
  ];

  return {
    actionIntents: buildActionIntents(print.availability, fileSections),
    availabilityPanel: buildAvailabilityPanel(print.availability),
    fileSections,
    guidance: buildGuidance(print),
    hero: buildHero(print, creatorName),
    posterItem: maybePosterItem,
    print,
    relatedItems: buildRelatedDiscoveryItems(discoveryItems, maybePosterItem),
    trustFields: buildTrustFields(print, fileSections)
  };
}

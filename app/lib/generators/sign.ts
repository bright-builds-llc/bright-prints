import { z } from "zod";

import type {
  GeneratorRecord,
  GeneratorParameterRecord,
  SignGeneratorDefinition,
} from "~/lib/content/schema";
import { sanitizeSignText, bitmapFont } from "~/lib/generators/sign-font";
import {
  buildThreeMfArchive,
  type ThreeMfMesh,
} from "~/lib/generators/three-mf";

export type SignGeneratorValues = {
  cornerRadiusMm: number;
  heightMm: number;
  text: string;
  thicknessMm: number;
  widthMm: number;
};

export type SignGeneratorValidation = {
  issues: Partial<Record<keyof SignGeneratorValues, string>>;
  sanitizedText: string;
};

export const signGeneratorValuesSchema = z.object({
  cornerRadiusMm: z.number().finite(),
  heightMm: z.number().finite(),
  text: z.string(),
  thicknessMm: z.number().finite(),
  widthMm: z.number().finite(),
});

export type GeneratedSignArtifact = {
  downloadName: string;
  metadata: {
    cornerRadiusMm: number;
    generatedAt: string;
    heightMm: number;
    outputFormat: "3mf";
    text: string;
    thicknessMm: number;
    triangleCount: number;
    vertexCount: number;
    widthMm: number;
  };
  objectUrl: string;
};

const glyphColumns = 5;
const glyphRows = 7;
const glyphGapColumns = 1;

function getParameter(generator: GeneratorRecord, name: string) {
  const maybeParameter = generator.parameters.find(
    (parameter) => parameter.name === name,
  );

  if (!maybeParameter) {
    throw new Error(
      `Missing generator parameter "${name}" for "${generator.slug}"`,
    );
  }

  return maybeParameter;
}

function getNumberValue(
  generator: GeneratorRecord,
  name: string,
  rawValues?: Record<string, string>,
) {
  const parameter = getParameter(generator, name);
  const rawValue = rawValues?.[name];

  if (rawValue !== undefined && rawValue !== "") {
    return Number(rawValue);
  }

  return Number(parameter.defaultValue);
}

function getTextValue(
  generator: GeneratorRecord,
  name: string,
  rawValues?: Record<string, string>,
) {
  const parameter = getParameter(generator, name);
  const rawValue = rawValues?.[name];

  if (rawValue !== undefined) {
    return rawValue;
  }

  return String(parameter.defaultValue);
}

export function maybeParseSignGeneratorValues(
  rawValues: unknown,
): SignGeneratorValues | null {
  const parsedValues = signGeneratorValuesSchema.safeParse(rawValues);

  if (!parsedValues.success) {
    return null;
  }

  return parsedValues.data;
}

export function areSignGeneratorValuesEqual(
  left: SignGeneratorValues,
  right: SignGeneratorValues,
) {
  return (
    left.cornerRadiusMm === right.cornerRadiusMm &&
    left.heightMm === right.heightMm &&
    left.text === right.text &&
    left.thicknessMm === right.thicknessMm &&
    left.widthMm === right.widthMm
  );
}

export function buildSuggestedSignPresetName(values: SignGeneratorValues) {
  const sanitizedText = sanitizeSignText(values.text).sanitizedText.trim();

  if (sanitizedText) {
    return sanitizedText;
  }

  return `Sign ${values.widthMm}x${values.heightMm}`;
}

export function describeSignGeneratorValues(values: SignGeneratorValues) {
  const sanitizedText =
    sanitizeSignText(values.text).sanitizedText.trim() || "Untitled";

  return `${sanitizedText} · ${values.widthMm} x ${values.heightMm} mm · ${values.thicknessMm} mm thick`;
}

export function getDefaultSignValues(
  generator: GeneratorRecord,
): SignGeneratorValues {
  return {
    cornerRadiusMm: getNumberValue(generator, "corner-radius-mm"),
    heightMm: getNumberValue(generator, "height-mm"),
    text: getTextValue(generator, "text"),
    thicknessMm: getNumberValue(generator, "thickness-mm"),
    widthMm: getNumberValue(generator, "width-mm"),
  };
}

function getNumberConstraint(parameter: GeneratorParameterRecord) {
  return {
    max: parameter.max ?? Number.POSITIVE_INFINITY,
    min: parameter.min ?? Number.NEGATIVE_INFINITY,
  };
}

export function validateSignValues(
  generator: GeneratorRecord,
  values: SignGeneratorValues,
): SignGeneratorValidation {
  const issues: SignGeneratorValidation["issues"] = {};
  const textParameter = getParameter(generator, "text");
  const widthParameter = getParameter(generator, "width-mm");
  const heightParameter = getParameter(generator, "height-mm");
  const thicknessParameter = getParameter(generator, "thickness-mm");
  const radiusParameter = getParameter(generator, "corner-radius-mm");
  const sanitizedTextResult = sanitizeSignText(values.text);
  const text = sanitizedTextResult.sanitizedText;

  if (!text.trim()) {
    issues.text = "Enter at least one supported letter, number, or symbol.";
  }

  if (sanitizedTextResult.hadUnsupportedGlyphs) {
    issues.text = "Use letters, numbers, spaces, dashes, or periods only.";
  }

  if ((textParameter.maxLength ?? Number.POSITIVE_INFINITY) < text.length) {
    issues.text = `Keep the sign text to ${textParameter.maxLength} characters or fewer.`;
  }

  const widthBounds = getNumberConstraint(widthParameter);
  if (values.widthMm < widthBounds.min || values.widthMm > widthBounds.max) {
    issues.widthMm = `Width must stay between ${widthBounds.min} and ${widthBounds.max} mm.`;
  }

  const heightBounds = getNumberConstraint(heightParameter);
  if (
    values.heightMm < heightBounds.min ||
    values.heightMm > heightBounds.max
  ) {
    issues.heightMm = `Height must stay between ${heightBounds.min} and ${heightBounds.max} mm.`;
  }

  const thicknessBounds = getNumberConstraint(thicknessParameter);
  if (
    values.thicknessMm < thicknessBounds.min ||
    values.thicknessMm > thicknessBounds.max
  ) {
    issues.thicknessMm = `Thickness must stay between ${thicknessBounds.min} and ${thicknessBounds.max} mm.`;
  }

  const radiusBounds = getNumberConstraint(radiusParameter);
  if (
    values.cornerRadiusMm < radiusBounds.min ||
    values.cornerRadiusMm > radiusBounds.max
  ) {
    issues.cornerRadiusMm = `Corner radius must stay between ${radiusBounds.min} and ${radiusBounds.max} mm.`;
  }

  const maxRadius = Math.min(values.widthMm, values.heightMm) / 2;
  if (values.cornerRadiusMm > maxRadius) {
    issues.cornerRadiusMm = `Corner radius must be no more than ${maxRadius.toFixed(1)} mm for this sign size.`;
  }

  return {
    issues,
    sanitizedText: text,
  };
}

type SignPreviewLayout = {
  cellSize: number;
  glyphRects: Array<{
    height: number;
    width: number;
    x: number;
    y: number;
  }>;
  insetMm: number;
};

export function buildSignPreviewLayout(options: {
  definition: SignGeneratorDefinition;
  sanitizedText: string;
  values: SignGeneratorValues;
}): SignPreviewLayout {
  const { definition, sanitizedText, values } = options;
  const glyphCount = Math.max(sanitizedText.length, 1);
  const totalColumns =
    glyphCount * glyphColumns + (glyphCount - 1) * glyphGapColumns;
  const availableWidth = Math.max(values.widthMm - definition.paddingMm * 2, 1);
  const availableHeight = Math.max(
    values.heightMm - definition.paddingMm * 2,
    1,
  );
  const cellSize = Math.min(
    availableWidth / totalColumns,
    availableHeight / glyphRows,
  );
  const contentWidth = cellSize * totalColumns;
  const contentHeight = cellSize * glyphRows;
  const startX = (values.widthMm - contentWidth) / 2;
  const startY = (values.heightMm - contentHeight) / 2;
  const insetMm = cellSize * definition.previewCellInsetRatio;
  const glyphRects: SignPreviewLayout["glyphRects"] = [];

  [...sanitizedText].forEach((character, characterIndex) => {
    const rows =
      bitmapFont[character as keyof typeof bitmapFont] ?? bitmapFont[" "];
    rows.forEach((row, rowIndex) => {
      [...row].forEach((cell, columnIndex) => {
        if (cell !== "1") {
          return;
        }

        glyphRects.push({
          height: cellSize - insetMm * 2,
          width: cellSize - insetMm * 2,
          x:
            startX +
            (characterIndex * (glyphColumns + glyphGapColumns) + columnIndex) *
              cellSize +
            insetMm,
          y: startY + rowIndex * cellSize + insetMm,
        });
      });
    });
  });

  return {
    cellSize,
    glyphRects,
    insetMm,
  };
}

function addVertex(
  vertices: ThreeMfMesh["vertices"],
  x: number,
  y: number,
  z: number,
) {
  vertices.push({ x, y, z });
  return vertices.length - 1;
}

function addBox(
  mesh: ThreeMfMesh,
  box: {
    depth: number;
    height: number;
    width: number;
    x: number;
    y: number;
    z: number;
  },
) {
  const { depth, height, width, x, y, z } = box;
  const v0 = addVertex(mesh.vertices, x, y, z);
  const v1 = addVertex(mesh.vertices, x + width, y, z);
  const v2 = addVertex(mesh.vertices, x + width, y + height, z);
  const v3 = addVertex(mesh.vertices, x, y + height, z);
  const v4 = addVertex(mesh.vertices, x, y, z + depth);
  const v5 = addVertex(mesh.vertices, x + width, y, z + depth);
  const v6 = addVertex(mesh.vertices, x + width, y + height, z + depth);
  const v7 = addVertex(mesh.vertices, x, y + height, z + depth);

  mesh.triangles.push(
    [v0, v1, v2],
    [v0, v2, v3],
    [v4, v7, v6],
    [v4, v6, v5],
    [v0, v4, v5],
    [v0, v5, v1],
    [v1, v5, v6],
    [v1, v6, v2],
    [v2, v6, v7],
    [v2, v7, v3],
    [v3, v7, v4],
    [v3, v4, v0],
  );
}

export function buildSignMesh(options: {
  definition: SignGeneratorDefinition;
  sanitizedText: string;
  values: SignGeneratorValues;
}): ThreeMfMesh {
  const { definition, sanitizedText, values } = options;
  const mesh: ThreeMfMesh = {
    triangles: [],
    vertices: [],
  };
  const relief = Math.min(
    definition.textReliefMm,
    Math.max(values.thicknessMm * 0.4, 0.5),
  );
  const baseThickness = Math.max(values.thicknessMm - relief, 0.6);
  const layout = buildSignPreviewLayout({ definition, sanitizedText, values });

  addBox(mesh, {
    depth: baseThickness,
    height: values.heightMm,
    width: values.widthMm,
    x: 0,
    y: 0,
    z: 0,
  });

  layout.glyphRects.forEach((glyphRect) => {
    addBox(mesh, {
      depth: relief,
      height: glyphRect.height,
      width: glyphRect.width,
      x: glyphRect.x,
      y: values.heightMm - glyphRect.y - glyphRect.height,
      z: baseThickness,
    });
  });

  return mesh;
}

function slugifyText(text: string) {
  return (
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 24) || "sign"
  );
}

export async function buildGeneratedSignArtifact(options: {
  definition: SignGeneratorDefinition;
  generator: GeneratorRecord;
  values: SignGeneratorValues;
}) {
  const { definition, generator, values } = options;
  const validation = validateSignValues(generator, values);

  if (Object.keys(validation.issues).length > 0) {
    throw new Error("Cannot build a sign artifact from invalid values.");
  }

  const mesh = buildSignMesh({
    definition,
    sanitizedText: validation.sanitizedText,
    values,
  });
  const generatedAt = new Date().toISOString();
  const blob = await buildThreeMfArchive({
    mesh,
    metadata: {
      "BrightPrints:generator": generator.slug,
      "BrightPrints:text": validation.sanitizedText,
      "BrightPrints:generatedAt": generatedAt,
      "BrightPrints:widthMm": values.widthMm.toString(),
      "BrightPrints:heightMm": values.heightMm.toString(),
      "BrightPrints:thicknessMm": values.thicknessMm.toString(),
      "BrightPrints:cornerRadiusMm": values.cornerRadiusMm.toString(),
    },
  });
  const objectUrl = URL.createObjectURL(blob);

  return {
    downloadName: `${slugifyText(validation.sanitizedText)}-${values.widthMm}x${values.heightMm}.3mf`,
    metadata: {
      cornerRadiusMm: values.cornerRadiusMm,
      generatedAt,
      heightMm: values.heightMm,
      outputFormat: "3mf" as const,
      text: validation.sanitizedText,
      thicknessMm: values.thicknessMm,
      triangleCount: mesh.triangles.length,
      vertexCount: mesh.vertices.length,
      widthMm: values.widthMm,
    },
    objectUrl,
  };
}

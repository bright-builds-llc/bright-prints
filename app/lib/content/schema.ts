import { z } from "zod";

const schemaVersion = z.literal(1);
const discoveryToneSchema = z.enum([
  "verdigris",
  "copper",
  "slate",
  "sand",
  "berry"
]);
const availabilitySchema = z.enum(["open-source", "physical-print", "both"]);

const slugSchema = z
  .string()
  .min(1)
  .regex(/^[a-z0-9-]+$/, "Slugs must use lowercase letters, numbers, and hyphens");

const publicLinkSchema = z.string().url();
const publishedOnSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Dates must use YYYY-MM-DD format");

const discoveryMetaSchema = z.object({
  accentTone: discoveryToneSchema,
  catalogRank: z.number().int().positive(),
  eyebrow: z.string().min(1),
  featuredRank: z.number().int().positive().optional(),
  mark: z.string().min(1)
});

export const creatorSchema = z.object({
  schemaVersion,
  slug: slugSchema,
  displayName: z.string().min(1),
  bio: z.string().min(1),
  links: z
    .object({
      website: publicLinkSchema.optional(),
      github: publicLinkSchema.optional(),
      printables: publicLinkSchema.optional()
    })
    .default({})
});

export const printFileSchema = z.object({
  label: z.string().min(1),
  kind: z.enum(["source", "print-ready", "image"]),
  repoPath: z.string().min(1).optional(),
  externalUrl: publicLinkSchema.optional()
});

export const printSchema = z.object({
  schemaVersion,
  slug: slugSchema,
  creatorSlug: slugSchema,
  title: z.string().min(1),
  summary: z.string().min(1),
  description: z.string().min(1),
  featured: z.boolean().default(false),
  availability: availabilitySchema.default("open-source"),
  openSource: z.boolean().default(true),
  publishedOn: publishedOnSchema,
  categories: z.array(z.string().min(1)).default([]),
  discovery: discoveryMetaSchema,
  files: z.array(printFileSchema).default([]),
  printDetails: z
    .object({
      material: z.string().min(1).optional(),
      layerHeightMm: z.number().positive().optional(),
      specialSteps: z.array(z.string().min(1)).default([])
    })
    .default({ specialSteps: [] })
});

export const generatorParameterSchema = z.object({
  name: slugSchema,
  label: z.string().min(1),
  type: z.enum(["text", "number"]),
  unit: z.string().min(1).optional(),
  defaultValue: z.union([z.string(), z.number()]),
  min: z.number().optional(),
  max: z.number().optional(),
  step: z.number().positive().optional(),
  maxLength: z.number().int().positive().optional()
});

export const generatorSchema = z.object({
  schemaVersion,
  slug: slugSchema,
  creatorSlug: slugSchema,
  title: z.string().min(1),
  summary: z.string().min(1),
  description: z.string().min(1),
  availability: availabilitySchema.default("open-source"),
  categories: z.array(z.string().min(1)).default([]),
  discovery: discoveryMetaSchema,
  outputFormat: z.literal("3mf"),
  publishedOn: publishedOnSchema,
  parameters: z.array(generatorParameterSchema).min(1)
});

export type CreatorRecord = z.infer<typeof creatorSchema>;
export type PrintRecord = z.infer<typeof printSchema>;
export type GeneratorRecord = z.infer<typeof generatorSchema>;
export type DiscoveryTone = z.infer<typeof discoveryToneSchema>;
export type AvailabilityState = z.infer<typeof availabilitySchema>;

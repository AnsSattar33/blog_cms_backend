import { z } from "zod";

export const uuidParamSchema = z.object({
  id: z.string().uuid("Invalid ID format"),
});

export const slugParamSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
});

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  search: z.string().optional(),
  category: z.string().optional(),
  tag: z.string().optional(),
  sort: z.string().optional(),
  isPublished: z
    .union([z.literal("true"), z.literal("false")])
    .optional()
    .transform((val) => (val === undefined ? undefined : val === "true")),
});

export const limitQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(50).optional(),
});

export type PaginationQueryInput = z.infer<typeof paginationQuerySchema>;

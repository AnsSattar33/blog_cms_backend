import { z } from "zod";

export const createBlogSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200),
  slug: z.string().optional(),
  excerpt: z.string().min(10, "Excerpt must be at least 10 characters").max(500),
  content: z.string().min(20, "Content must be at least 20 characters"),
  category: z.string().min(1, "Category is required"),
  tags: z.union([z.string(), z.array(z.string())]).optional(),
  isPublished: z.union([z.boolean(), z.string()]).optional(),
  isFeatured: z.union([z.boolean(), z.string()]).optional(),
});

export const updateBlogSchema = z.object({
  title: z.string().min(3).max(200).optional(),
  slug: z.string().optional(),
  excerpt: z.string().min(10).max(500).optional(),
  content: z.string().min(20).optional(),
  category: z.string().min(1).optional(),
  tags: z.union([z.string(), z.array(z.string())]).optional(),
  isPublished: z.union([z.boolean(), z.string()]).optional(),
  isFeatured: z.union([z.boolean(), z.string()]).optional(),
});

export type CreateBlogInput = z.infer<typeof createBlogSchema>;
export type UpdateBlogInput = z.infer<typeof updateBlogSchema>;

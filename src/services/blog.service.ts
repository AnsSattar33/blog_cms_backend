import { MESSAGES } from "../constants/messages";
import { BlogCreateData, BlogFilter, BlogUpdateData } from "../interfaces";
import { blogRepository } from "../repositories/blog.repository";
import { ApiError } from "../utils/api-error";
import { mapBlogToResponse } from "../utils/blog-mapper.util";
import { buildPaginationMeta, parsePaginationQuery } from "../utils/pagination.util";
import { generateSlug, generateUniqueSlug } from "../utils/slug.util";
import { removeUndefinedFields } from "../utils/sanitize.util";
import { PaginationQuery } from "../types";
import { cloudinaryService } from "./cloudinary.service";
import { randomUUID } from "crypto";

const resolveUniqueSlug = async (
  title: string,
  providedSlug?: string,
  excludeId?: string
): Promise<string> => {
  let baseSlug = providedSlug ? generateSlug(providedSlug) : generateSlug(title);
  if (!baseSlug) baseSlug = `blog-${randomUUID().slice(0, 8)}`;

  let slug = baseSlug;
  let attempt = 0;

  while (await blogRepository.slugExists(slug, excludeId)) {
    attempt += 1;
    slug = generateUniqueSlug(baseSlug, String(attempt));
  }

  return slug;
};

const parseTags = (tags: string | string[] | undefined): string[] => {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags;
  if (typeof tags === "string") {
    try {
      const parsed = JSON.parse(tags);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      return tags.split(",").map((t) => t.trim()).filter(Boolean);
    }
  }
  return [];
};

const parseBoolean = (value: unknown, defaultValue = false): boolean => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") return value === "true";
  return defaultValue;
};

export const blogService = {
  async getBlogs(query: PaginationQuery, includeUnpublished = false) {
    const { page, limit, sort } = parsePaginationQuery(query);

    const filter: BlogFilter = {
      ...(query.category && { category: query.category }),
      ...(query.tag && { tag: query.tag }),
      ...(query.search && { search: query.search }),
    };

    if (query.isPublished !== undefined) {
      filter.isPublished = query.isPublished;
    } else if (!includeUnpublished) {
      filter.isPublished = true;
    }

    const { blogs, total } = await blogRepository.findAll(filter, {
      page,
      limit,
      sort,
    });

    return {
      blogs: blogs.map(mapBlogToResponse),
      pagination: buildPaginationMeta(total, page, limit),
    };
  },

  async getBlogBySlug(slug: string) {
    const blog = await blogRepository.findBySlug(slug);
    if (!blog) {
      throw ApiError.notFound(MESSAGES.BLOG.NOT_FOUND);
    }
    return mapBlogToResponse(blog);
  },

  async getBlogById(id: string) {
    const blog = await blogRepository.findById(id);
    if (!blog) {
      throw ApiError.notFound(MESSAGES.BLOG.NOT_FOUND);
    }
    return mapBlogToResponse(blog);
  },

  async getLatestBlogs(limit = 6) {
    const blogs = await blogRepository.findLatest(limit);
    return blogs.map(mapBlogToResponse);
  },

  async getFeaturedBlogs(limit = 3) {
    const blogs = await blogRepository.findFeatured(limit);
    return blogs.map(mapBlogToResponse);
  },

  async getRelatedBlogs(slug: string, limit = 3) {
    const blog = await blogRepository.findBySlug(slug);
    if (!blog) {
      throw ApiError.notFound(MESSAGES.BLOG.NOT_FOUND);
    }
    const related = await blogRepository.findRelated(slug, blog.category, limit);
    return related.map(mapBlogToResponse);
  },

  async getDashboardStats() {
    const [totalBlogs, publishedBlogs, draftBlogs, recentBlogs] = await Promise.all([
      blogRepository.countByFilter({}),
      blogRepository.countByFilter({ isPublished: true }),
      blogRepository.countByFilter({ isPublished: false }),
      blogRepository.getRecent(5),
    ]);

    return {
      totalBlogs,
      publishedBlogs,
      draftBlogs,
      recentBlogs: recentBlogs.map(mapBlogToResponse),
    };
  },

  async createBlog(
    body: Record<string, unknown>,
    authorId: string,
    file?: Express.Multer.File
  ) {
    if (!file) {
      throw ApiError.badRequest(MESSAGES.UPLOAD.NO_FILE);
    }

    const coverImage = await cloudinaryService.uploadImage(file.buffer);
    const slug = await resolveUniqueSlug(
      String(body.title ?? ""),
      body.slug ? String(body.slug) : undefined
    );

    const data: BlogCreateData = {
      title: String(body.title),
      slug,
      excerpt: String(body.excerpt),
      content: String(body.content),
      category: String(body.category),
      tags: parseTags(body.tags as string | string[]),
      isPublished: parseBoolean(body.isPublished),
      isFeatured: parseBoolean(body.isFeatured),
      coverImage,
      author: authorId,
    };

    const blog = await blogRepository.create(data);
    return mapBlogToResponse(blog);
  },

  async updateBlog(
    id: string,
    body: Record<string, unknown>,
    file?: Express.Multer.File
  ) {
    const existing = await blogRepository.findById(id);
    if (!existing) {
      throw ApiError.notFound(MESSAGES.BLOG.NOT_FOUND);
    }

    const updateData: BlogUpdateData = removeUndefinedFields({
      title: body.title !== undefined ? String(body.title) : undefined,
      excerpt: body.excerpt !== undefined ? String(body.excerpt) : undefined,
      content: body.content !== undefined ? String(body.content) : undefined,
      category: body.category !== undefined ? String(body.category) : undefined,
      tags: body.tags !== undefined ? parseTags(body.tags as string | string[]) : undefined,
      isPublished: body.isPublished !== undefined ? parseBoolean(body.isPublished) : undefined,
      isFeatured: body.isFeatured !== undefined ? parseBoolean(body.isFeatured) : undefined,
    });

    if (body.slug !== undefined || body.title !== undefined) {
      const slugSource = body.slug ? String(body.slug) : String(body.title ?? existing.title);
      updateData.slug = await resolveUniqueSlug(slugSource, slugSource, id);
    }

    if (file) {
      updateData.coverImage = await cloudinaryService.replaceImage(
        existing.coverImagePublicId,
        file.buffer
      );
    }

    const blog = await blogRepository.updateById(id, updateData);
    if (!blog) {
      throw ApiError.notFound(MESSAGES.BLOG.NOT_FOUND);
    }
    return mapBlogToResponse(blog);
  },

  async deleteBlog(id: string) {
    const blog = await blogRepository.findById(id);
    if (!blog) {
      throw ApiError.notFound(MESSAGES.BLOG.NOT_FOUND);
    }

    if (blog.coverImagePublicId) {
      await cloudinaryService.deleteImage(blog.coverImagePublicId);
    }

    await blogRepository.deleteById(id);
  },
};

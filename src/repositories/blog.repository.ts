import {
  eq,
  and,
  ne,
  or,
  ilike,
  desc,
  asc,
  sql,
  count,
  SQL,
} from "drizzle-orm";
import { db } from "../db";
import { blogs, users, BlogWithAuthor } from "../db/schema";
import { BlogCreateData, BlogFilter, BlogQueryOptions, BlogUpdateData } from "../interfaces";
import { calculateReadingTime } from "../utils/reading-time.util";

const blogSelect = {
  id: blogs.id,
  title: blogs.title,
  slug: blogs.slug,
  excerpt: blogs.excerpt,
  content: blogs.content,
  coverImageUrl: blogs.coverImageUrl,
  coverImagePublicId: blogs.coverImagePublicId,
  category: blogs.category,
  tags: blogs.tags,
  authorId: blogs.authorId,
  isPublished: blogs.isPublished,
  isFeatured: blogs.isFeatured,
  readingTime: blogs.readingTime,
  publishedAt: blogs.publishedAt,
  createdAt: blogs.createdAt,
  updatedAt: blogs.updatedAt,
  author: {
    id: users.id,
    name: users.name,
    email: users.email,
    role: users.role,
    avatar: users.avatar,
    createdAt: users.createdAt,
    updatedAt: users.updatedAt,
  },
};

const mapJoinedRow = (row: {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImageUrl: string;
  coverImagePublicId: string;
  category: string;
  tags: string[];
  authorId: string;
  isPublished: boolean;
  isFeatured: boolean;
  readingTime: number;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  author: {
    id: string;
    name: string;
    email: string;
    role: "admin" | "user";
    avatar: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
}): BlogWithAuthor => ({
  id: row.id,
  title: row.title,
  slug: row.slug,
  excerpt: row.excerpt,
  content: row.content,
  coverImageUrl: row.coverImageUrl,
  coverImagePublicId: row.coverImagePublicId,
  category: row.category,
  tags: row.tags,
  authorId: row.authorId,
  isPublished: row.isPublished,
  isFeatured: row.isFeatured,
  readingTime: row.readingTime,
  publishedAt: row.publishedAt,
  createdAt: row.createdAt,
  updatedAt: row.updatedAt,
  author: row.author,
});

const buildConditions = (filter: BlogFilter): SQL[] => {
  const conditions: SQL[] = [];

  if (filter.isPublished !== undefined) {
    conditions.push(eq(blogs.isPublished, filter.isPublished));
  }
  if (filter.isFeatured !== undefined) {
    conditions.push(eq(blogs.isFeatured, filter.isFeatured));
  }
  if (filter.category) {
    conditions.push(eq(blogs.category, filter.category));
  }
  if (filter.tag) {
    conditions.push(sql`${blogs.tags} @> ARRAY[${filter.tag}]::text[]`);
  }
  if (filter.search) {
    const term = `%${filter.search}%`;
    conditions.push(or(ilike(blogs.title, term), ilike(blogs.excerpt, term))!);
  }

  return conditions;
};

const getOrderBy = (sort: string) => {
  const descFlag = sort.startsWith("-");
  const field = descFlag ? sort.slice(1) : sort;

  const columnMap = {
    createdAt: blogs.createdAt,
    updatedAt: blogs.updatedAt,
    publishedAt: blogs.publishedAt,
    title: blogs.title,
  } as const;

  const column = columnMap[field as keyof typeof columnMap] ?? blogs.createdAt;
  return descFlag ? desc(column) : asc(column);
};

const queryWithAuthor = () =>
  db
    .select(blogSelect)
    .from(blogs)
    .innerJoin(users, eq(blogs.authorId, users.id));

export const blogRepository = {
  async findAll(
    filter: BlogFilter,
    options: BlogQueryOptions
  ): Promise<{ blogs: BlogWithAuthor[]; total: number }> {
    const conditions = buildConditions(filter);
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    const offset = (options.page - 1) * options.limit;

    const [rows, countResult] = await Promise.all([
      queryWithAuthor()
        .where(whereClause)
        .orderBy(getOrderBy(options.sort))
        .limit(options.limit)
        .offset(offset),
      db.select({ total: count() }).from(blogs).where(whereClause),
    ]);

    return {
      blogs: rows.map(mapJoinedRow),
      total: countResult[0]?.total ?? 0,
    };
  },

  async findBySlug(slug: string): Promise<BlogWithAuthor | null> {
    const [row] = await queryWithAuthor().where(eq(blogs.slug, slug)).limit(1);
    return row ? mapJoinedRow(row) : null;
  },

  async findById(id: string): Promise<BlogWithAuthor | null> {
    const [row] = await queryWithAuthor().where(eq(blogs.id, id)).limit(1);
    return row ? mapJoinedRow(row) : null;
  },

  async create(data: BlogCreateData): Promise<BlogWithAuthor> {
    const readingTime = calculateReadingTime(data.content);
    const publishedAt = data.isPublished ? new Date() : null;

    const [inserted] = await db
      .insert(blogs)
      .values({
        title: data.title,
        slug: data.slug!,
        excerpt: data.excerpt,
        content: data.content,
        coverImageUrl: data.coverImage!.url,
        coverImagePublicId: data.coverImage!.publicId,
        category: data.category,
        tags: data.tags,
        authorId: data.author,
        isPublished: data.isPublished,
        isFeatured: data.isFeatured ?? false,
        readingTime,
        publishedAt,
      })
      .returning();

    const blog = await this.findById(inserted.id);
    if (!blog) throw new Error("Failed to create blog");
    return blog;
  },

  async updateById(id: string, data: BlogUpdateData): Promise<BlogWithAuthor | null> {
    const existing = await db.select().from(blogs).where(eq(blogs.id, id)).limit(1);
    if (!existing[0]) return null;

    const current = existing[0];
    const content = data.content ?? current.content;
    const isPublished = data.isPublished ?? current.isPublished;

    let publishedAt = current.publishedAt;
    if (data.isPublished !== undefined) {
      publishedAt = isPublished ? current.publishedAt ?? new Date() : null;
    }

    const updateValues: Partial<typeof blogs.$inferInsert> = {
      updatedAt: new Date(),
      readingTime: calculateReadingTime(content),
      publishedAt,
    };

    if (data.title !== undefined) updateValues.title = data.title;
    if (data.slug !== undefined) updateValues.slug = data.slug;
    if (data.excerpt !== undefined) updateValues.excerpt = data.excerpt;
    if (data.content !== undefined) updateValues.content = data.content;
    if (data.category !== undefined) updateValues.category = data.category;
    if (data.tags !== undefined) updateValues.tags = data.tags;
    if (data.isPublished !== undefined) updateValues.isPublished = data.isPublished;
    if (data.isFeatured !== undefined) updateValues.isFeatured = data.isFeatured;
    if (data.coverImage) {
      updateValues.coverImageUrl = data.coverImage.url;
      updateValues.coverImagePublicId = data.coverImage.publicId;
    }

    await db.update(blogs).set(updateValues).where(eq(blogs.id, id));
    return this.findById(id);
  },

  async deleteById(id: string): Promise<BlogWithAuthor | null> {
    const existing = await this.findById(id);
    if (!existing) return null;
    await db.delete(blogs).where(eq(blogs.id, id));
    return existing;
  },

  async slugExists(slug: string, excludeId?: string): Promise<boolean> {
    const conditions = excludeId
      ? and(eq(blogs.slug, slug), ne(blogs.id, excludeId))
      : eq(blogs.slug, slug);

    const [result] = await db.select({ total: count() }).from(blogs).where(conditions);
    return (result?.total ?? 0) > 0;
  },

  async countByFilter(filter: BlogFilter): Promise<number> {
    const conditions = buildConditions(filter);
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    const [result] = await db.select({ total: count() }).from(blogs).where(whereClause);
    return result?.total ?? 0;
  },

  async findLatest(limit: number): Promise<BlogWithAuthor[]> {
    const rows = await queryWithAuthor()
      .where(eq(blogs.isPublished, true))
      .orderBy(desc(blogs.publishedAt), desc(blogs.createdAt))
      .limit(limit);
    return rows.map(mapJoinedRow);
  },

  async findFeatured(limit: number): Promise<BlogWithAuthor[]> {
    const rows = await queryWithAuthor()
      .where(and(eq(blogs.isPublished, true), eq(blogs.isFeatured, true)))
      .orderBy(desc(blogs.publishedAt))
      .limit(limit);
    return rows.map(mapJoinedRow);
  },

  async findRelated(slug: string, category: string, limit: number): Promise<BlogWithAuthor[]> {
    const rows = await queryWithAuthor()
      .where(
        and(ne(blogs.slug, slug), eq(blogs.category, category), eq(blogs.isPublished, true))
      )
      .orderBy(desc(blogs.publishedAt))
      .limit(limit);
    return rows.map(mapJoinedRow);
  },

  async getRecent(limit: number): Promise<BlogWithAuthor[]> {
    const rows = await queryWithAuthor()
      .orderBy(desc(blogs.updatedAt))
      .limit(limit);
    return rows.map(mapJoinedRow);
  },
};

import { BlogWithAuthor, UserPublic } from "../db/schema";
import { toIsoString } from "./date.util";

export const mapBlogToResponse = (blog: BlogWithAuthor) => {
  const status = blog.isPublished ? "published" : "draft";

  return {
    id: blog.id,
    title: blog.title,
    slug: blog.slug,
    excerpt: blog.excerpt,
    shortDescription: blog.excerpt,
    content: blog.content,
    coverImage: {
      url: blog.coverImageUrl,
      publicId: blog.coverImagePublicId,
    },
    thumbnail: blog.coverImageUrl,
    category: blog.category,
    tags: blog.tags,
    author: {
      id: blog.author.id,
      name: blog.author.name,
      email: blog.author.email,
      avatar: blog.author.avatar ?? undefined,
    },
    isPublished: blog.isPublished,
    isFeatured: blog.isFeatured,
    status,
    readingTime: blog.readingTime,
    readingTimeMinutes: blog.readingTime,
    publishedAt: toIsoString(blog.publishedAt),
    createdAt: toIsoString(blog.createdAt) ?? new Date().toISOString(),
    updatedAt: toIsoString(blog.updatedAt) ?? new Date().toISOString(),
  };
};

export const mapUserToResponse = (user: UserPublic & { id: string }) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  avatar: user.avatar ?? undefined,
  createdAt: toIsoString(user.createdAt) ?? new Date().toISOString(),
  updatedAt: toIsoString(user.updatedAt) ?? new Date().toISOString(),
});

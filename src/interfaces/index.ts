import { Request } from "express";
import { Role } from "../constants/roles";

export interface AuthUser {
  id: string;
  email: string;
  role: Role;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}

export interface CoverImage {
  url: string;
  publicId: string;
}

export interface BlogCreateData {
  title: string;
  slug?: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  isPublished: boolean;
  isFeatured?: boolean;
  coverImage?: CoverImage;
  author: string;
}

export interface BlogUpdateData {
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  category?: string;
  tags?: string[];
  isPublished?: boolean;
  isFeatured?: boolean;
  coverImage?: CoverImage;
}

export interface BlogFilter {
  isPublished?: boolean;
  category?: string;
  tag?: string;
  search?: string;
  isFeatured?: boolean;
}

export interface BlogQueryOptions {
  page: number;
  limit: number;
  sort: string;
}

export interface DashboardStats {
  totalBlogs: number;
  publishedBlogs: number;
  draftBlogs: number;
  recentBlogs: unknown[];
}

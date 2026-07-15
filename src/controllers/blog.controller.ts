import { Response } from "express";
import { AuthenticatedRequest } from "../interfaces";
import { blogService } from "../services/blog.service";
import { asyncHandler } from "../utils/async-handler";
import { sendSuccess, sendPaginated } from "../utils/api-response";
import { HTTP_STATUS } from "../constants/http-status";
import { MESSAGES } from "../constants/messages";
import { PaginationQuery } from "../types";

export const getBlogs = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const isAdmin = req.user?.role === "admin";
  const query = req.query as PaginationQuery;
  const includeUnpublished = isAdmin && query.isPublished === undefined;

  const result = await blogService.getBlogs(query, includeUnpublished);

  return sendPaginated(
    res,
    "Blogs retrieved successfully",
    result.blogs,
    result.pagination
  );
});

export const getBlogById = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const blog = await blogService.getBlogById(String(req.params.id));
  return sendSuccess(res, HTTP_STATUS.OK, "Blog retrieved successfully", blog);
});

export const getBlogBySlug = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const blog = await blogService.getBlogBySlug(String(req.params.slug));
  return sendSuccess(res, HTTP_STATUS.OK, "Blog retrieved successfully", blog);
});

export const getLatestBlogs = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const limit = Number(req.query.limit) || 6;
  const blogs = await blogService.getLatestBlogs(limit);
  return sendSuccess(res, HTTP_STATUS.OK, "Latest blogs retrieved successfully", blogs);
});

export const getFeaturedBlogs = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const limit = Number(req.query.limit) || 3;
  const blogs = await blogService.getFeaturedBlogs(limit);
  return sendSuccess(res, HTTP_STATUS.OK, "Featured blogs retrieved successfully", blogs);
});

export const getRelatedBlogs = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const limit = Number(req.query.limit) || 3;
  const blogs = await blogService.getRelatedBlogs(String(req.params.slug), limit);
  return sendSuccess(res, HTTP_STATUS.OK, "Related blogs retrieved successfully", blogs);
});

export const getDashboardStats = asyncHandler(async (_req: AuthenticatedRequest, res: Response) => {
  const stats = await blogService.getDashboardStats();
  return sendSuccess(res, HTTP_STATUS.OK, "Dashboard stats retrieved successfully", stats);
});

export const createBlog = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const blog = await blogService.createBlog(req.body, req.user!.id, req.file);
  return sendSuccess(res, HTTP_STATUS.CREATED, MESSAGES.BLOG.CREATED, blog);
});

export const updateBlog = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const blog = await blogService.updateBlog(String(req.params.id), req.body, req.file);
  return sendSuccess(res, HTTP_STATUS.OK, MESSAGES.BLOG.UPDATED, blog);
});

export const deleteBlog = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  await blogService.deleteBlog(String(req.params.id));
  return sendSuccess(res, HTTP_STATUS.OK, MESSAGES.BLOG.DELETED, null);
});

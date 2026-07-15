import { Router } from "express";
import {
  getBlogs,
  getBlogById,
  getBlogBySlug,
  getLatestBlogs,
  getFeaturedBlogs,
  getRelatedBlogs,
  getDashboardStats,
  createBlog,
  updateBlog,
  deleteBlog,
} from "../controllers/blog.controller";
import { validate } from "../middleware/validate.middleware";
import {
  paginationQuerySchema,
  uuidParamSchema,
  slugParamSchema,
  limitQuerySchema,
} from "../validators/common.validator";
import { createBlogSchema, updateBlogSchema } from "../validators/blog.validator";
import { authMiddleware } from "../middleware/auth.middleware";
import { optionalAuthMiddleware } from "../middleware/optional-auth.middleware";
import { adminMiddleware } from "../middleware/admin.middleware";
import { uploadCoverImage, optionalUploadCoverImage } from "../middleware/upload.middleware";

const router = Router();

router.get("/", optionalAuthMiddleware, validate(paginationQuerySchema, "query"), getBlogs);
router.get("/latest", validate(limitQuerySchema, "query"), getLatestBlogs);
router.get("/featured", validate(limitQuerySchema, "query"), getFeaturedBlogs);
router.get(
  "/dashboard/stats",
  authMiddleware,
  adminMiddleware,
  getDashboardStats
);
router.get(
  "/by-id/:id",
  authMiddleware,
  adminMiddleware,
  validate(uuidParamSchema, "params"),
  getBlogById
);
router.get("/:slug/related", validate(slugParamSchema, "params"), getRelatedBlogs);
router.get("/:slug", validate(slugParamSchema, "params"), getBlogBySlug);

router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  uploadCoverImage,
  validate(createBlogSchema),
  createBlog
);

router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  validate(uuidParamSchema, "params"),
  optionalUploadCoverImage,
  validate(updateBlogSchema),
  updateBlog
);

router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  validate(uuidParamSchema, "params"),
  deleteBlog
);

export default router;

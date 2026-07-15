import { Router } from "express";
import authRoutes from "./auth.routes";
import blogRoutes from "./blog.routes";
import healthRoutes from "./health.routes";
import { API_ROUTES } from "../constants/routes";

const router = Router();

router.use(API_ROUTES.HEALTH, healthRoutes);
router.use(API_ROUTES.AUTH, authRoutes);
router.use(API_ROUTES.BLOGS, blogRoutes);

export default router;

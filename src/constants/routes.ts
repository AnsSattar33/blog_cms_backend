export const API_ROUTES = {
  AUTH: "/auth",
  BLOGS: "/blogs",
  HEALTH: "/health",
} as const;

export const AUTH_ROUTES = {
  REGISTER: "/register",
  LOGIN: "/login",
  LOGOUT: "/logout",
  ME: "/me",
} as const;

export const BLOG_ROUTES = {
  ROOT: "/",
  LATEST: "/latest",
  FEATURED: "/featured",
  DASHBOARD_STATS: "/dashboard/stats",
  RELATED: "/:slug/related",
  BY_SLUG: "/:slug",
  BY_ID: "/:id",
} as const;

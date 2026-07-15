export const MESSAGES = {
  AUTH: {
    REGISTER_SUCCESS: "User registered successfully",
    LOGIN_SUCCESS: "Login successful",
    LOGOUT_SUCCESS: "Logged out successfully",
    INVALID_CREDENTIALS: "Invalid email or password",
    EMAIL_EXISTS: "Email already registered",
    UNAUTHORIZED: "Authentication required",
    FORBIDDEN: "You do not have permission to perform this action",
    USER_NOT_FOUND: "User not found",
  },
  BLOG: {
    CREATED: "Blog created successfully",
    UPDATED: "Blog updated successfully",
    DELETED: "Blog deleted successfully",
    NOT_FOUND: "Blog not found",
    SLUG_EXISTS: "A blog with this slug already exists",
  },
  VALIDATION: {
    FAILED: "Validation failed",
  },
  SERVER: {
    INTERNAL_ERROR: "Internal server error",
    NOT_FOUND: "Route not found",
  },
  UPLOAD: {
    NO_FILE: "No file uploaded",
    INVALID_TYPE: "Invalid file type. Only JPEG, PNG, and WebP are allowed",
    TOO_LARGE: "File size exceeds the maximum allowed limit",
    CLOUDINARY_NOT_CONFIGURED: "Cloudinary is not configured. Please set Cloudinary environment variables",
    UPLOAD_FAILED: "Image upload failed",
  },
} as const;

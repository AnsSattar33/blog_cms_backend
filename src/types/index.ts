import { Role } from "../constants/roles";

export interface JwtPayload {
  id: string;
  email: string;
  role: Role;
}

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  limit: number;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  tag?: string;
  sort?: string;
  isPublished?: boolean;
}

export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
}

export interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
  pagination?: PaginationMeta;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors: string[];
}

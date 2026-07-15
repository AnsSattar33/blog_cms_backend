import { PaginationMeta, PaginationQuery } from "../types";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

export const parsePaginationQuery = (query: PaginationQuery) => {
  const page = Math.max(1, Number(query.page) || DEFAULT_PAGE);
  const limit = Math.min(MAX_LIMIT, Math.max(1, Number(query.limit) || DEFAULT_LIMIT));
  const skip = (page - 1) * limit;
  const sort = query.sort || "-createdAt";

  return { page, limit, skip, sort };
};

export const buildPaginationMeta = (
  totalItems: number,
  page: number,
  limit: number
): PaginationMeta => ({
  currentPage: page,
  totalPages: Math.max(1, Math.ceil(totalItems / limit)),
  totalItems,
  limit,
});

export const parseSortField = (sort: string): Record<string, 1 | -1> => {
  const desc = sort.startsWith("-");
  const field = desc ? sort.slice(1) : sort;
  return { [field]: desc ? -1 : 1 };
};

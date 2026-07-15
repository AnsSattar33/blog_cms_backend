import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
  integer,
  pgEnum,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["admin", "user"]);

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    password: varchar("password", { length: 255 }).notNull(),
    role: roleEnum("role").notNull().default("user"),
    avatar: varchar("avatar", { length: 500 }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("users_email_idx").on(table.email)]
);

export const blogs = pgTable(
  "blogs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: varchar("title", { length: 200 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull(),
    excerpt: varchar("excerpt", { length: 500 }).notNull(),
    content: text("content").notNull(),
    coverImageUrl: varchar("cover_image_url", { length: 500 }).notNull(),
    coverImagePublicId: varchar("cover_image_public_id", { length: 255 }).notNull(),
    category: varchar("category", { length: 100 }).notNull(),
    tags: text("tags").array().notNull().default([]),
    authorId: uuid("author_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    isPublished: boolean("is_published").notNull().default(false),
    isFeatured: boolean("is_featured").notNull().default(false),
    readingTime: integer("reading_time").notNull().default(1),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("blogs_slug_idx").on(table.slug),
    index("blogs_is_published_idx").on(table.isPublished),
    index("blogs_category_idx").on(table.category),
    index("blogs_is_featured_idx").on(table.isFeatured),
    index("blogs_author_id_idx").on(table.authorId),
  ]
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Blog = typeof blogs.$inferSelect;
export type NewBlog = typeof blogs.$inferInsert;

export type UserPublic = Omit<User, "password">;

export interface BlogWithAuthor extends Blog {
  author: UserPublic;
}

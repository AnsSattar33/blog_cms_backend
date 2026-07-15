CREATE TYPE "role" AS ENUM('admin', 'user');

CREATE TABLE IF NOT EXISTS "users" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "name" varchar(100) NOT NULL,
  "email" varchar(255) NOT NULL,
  "password" varchar(255) NOT NULL,
  "role" "role" DEFAULT 'user' NOT NULL,
  "avatar" varchar(500),
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS "users_email_idx" ON "users" ("email");

CREATE TABLE IF NOT EXISTS "blogs" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "title" varchar(200) NOT NULL,
  "slug" varchar(255) NOT NULL,
  "excerpt" varchar(500) NOT NULL,
  "content" text NOT NULL,
  "cover_image_url" varchar(500) NOT NULL,
  "cover_image_public_id" varchar(255) NOT NULL,
  "category" varchar(100) NOT NULL,
  "tags" text[] DEFAULT '{}' NOT NULL,
  "author_id" uuid NOT NULL,
  "is_published" boolean DEFAULT false NOT NULL,
  "is_featured" boolean DEFAULT false NOT NULL,
  "reading_time" integer DEFAULT 1 NOT NULL,
  "published_at" timestamp with time zone,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE "blogs" ADD CONSTRAINT "blogs_author_id_users_id_fk"
  FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;

CREATE UNIQUE INDEX IF NOT EXISTS "blogs_slug_idx" ON "blogs" ("slug");
CREATE INDEX IF NOT EXISTS "blogs_is_published_idx" ON "blogs" ("is_published");
CREATE INDEX IF NOT EXISTS "blogs_category_idx" ON "blogs" ("category");
CREATE INDEX IF NOT EXISTS "blogs_is_featured_idx" ON "blogs" ("is_featured");
CREATE INDEX IF NOT EXISTS "blogs_author_id_idx" ON "blogs" ("author_id");

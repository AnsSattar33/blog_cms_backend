import dotenv from "dotenv";
import { eq, sql } from "drizzle-orm";
import { connectDatabase, disconnectDatabase, db } from "../db";
import { users, blogs } from "../db/schema";
import { ROLES } from "../constants/roles";
import { hashPassword } from "../utils/password.util";
import { calculateReadingTime } from "../utils/reading-time.util";

dotenv.config();

const ADMIN_EMAIL = "admin@blog.com";
const ADMIN_PASSWORD = "password123";

const sampleBlogs = [
  {
    title: "Building Scalable React Applications",
    excerpt: "Learn the patterns and practices for building React apps that grow with your team and user base.",
    content: "<p>Scalable React applications start with a clear folder structure and separation of concerns.</p><p>Feature-based architecture keeps related code together and makes onboarding easier.</p>",
    category: "Development",
    tags: ["react", "architecture", "frontend"],
    isPublished: true,
    isFeatured: true,
    coverUrl: "https://picsum.photos/seed/react/800/450",
  },
  {
    title: "The Future of Web Design in 2026",
    excerpt: "Explore emerging design trends including minimalism, micro-interactions, and AI-assisted workflows.",
    content: "<p>Web design continues to evolve toward cleaner, more purposeful interfaces.</p><p>Micro-interactions provide feedback without overwhelming the user experience.</p>",
    category: "Design",
    tags: ["design", "ui", "trends"],
    isPublished: true,
    isFeatured: true,
    coverUrl: "https://picsum.photos/seed/design/800/450",
  },
  {
    title: "Next.js App Router Best Practices",
    excerpt: "A practical guide to server components, route groups, and data fetching in Next.js.",
    content: "<p>The App Router enables powerful patterns with React Server Components.</p><p>Route groups help organize layouts without affecting URL structure.</p>",
    category: "Technology",
    tags: ["nextjs", "react", "ssr"],
    isPublished: true,
    isFeatured: true,
    coverUrl: "https://picsum.photos/seed/nextjs/800/450",
  },
  {
    title: "Startup Growth Strategies That Work",
    excerpt: "Proven tactics for early-stage startups to acquire users and build sustainable growth.",
    content: "<p>Product-market fit should come before aggressive scaling efforts.</p><p>Content marketing builds long-term organic traffic and brand authority.</p>",
    category: "Business",
    tags: ["startup", "growth", "marketing"],
    isPublished: true,
    isFeatured: false,
    coverUrl: "https://picsum.photos/seed/startup/800/450",
  },
  {
    title: "Minimalist Living for Developers",
    excerpt: "How simplifying your workspace and routines can boost focus and productivity.",
    content: "<p>A clutter-free workspace reduces cognitive load and improves focus.</p><p>Digital minimalism leads to deeper work sessions.</p>",
    category: "Lifestyle",
    tags: ["productivity", "minimalism", "wellness"],
    isPublished: true,
    isFeatured: false,
    coverUrl: "https://picsum.photos/seed/minimal/800/450",
  },
  {
    title: "TypeScript Tips for Large Codebases",
    excerpt: "Advanced TypeScript patterns to keep your codebase type-safe and maintainable at scale.",
    content: "<p>Use strict mode and avoid any to catch bugs at compile time.</p><p>Discriminated unions model complex state machines elegantly.</p>",
    category: "Development",
    tags: ["typescript", "types", "best-practices"],
    isPublished: true,
    isFeatured: false,
    coverUrl: "https://picsum.photos/seed/typescript/800/450",
  },
  {
    title: "Design Systems from Scratch",
    excerpt: "Step-by-step guide to building a design system your team will actually use.",
    content: "<p>Start with foundational tokens: color, spacing, typography, and radius.</p><p>Build primitive components before composite patterns.</p>",
    category: "Design",
    tags: ["design-system", "components", "tokens"],
    isPublished: true,
    isFeatured: false,
    coverUrl: "https://picsum.photos/seed/designsystem/800/450",
  },
  {
    title: "Remote Work Productivity Hacks",
    excerpt: "Practical tips for staying productive and connected while working from home.",
    content: "<p>Time blocking helps separate deep work from meetings and admin tasks.</p><p>Async communication reduces context switching.</p>",
    category: "Lifestyle",
    tags: ["remote", "productivity", "work"],
    isPublished: true,
    isFeatured: false,
    coverUrl: "https://picsum.photos/seed/remote/800/450",
  },
  {
    title: "API Design Principles for Modern Apps",
    excerpt: "RESTful conventions, versioning strategies, and error handling for robust APIs.",
    content: "<p>Consistent naming and HTTP verb usage make APIs intuitive for consumers.</p><p>Version your API from day one to avoid breaking changes later.</p>",
    category: "Technology",
    tags: ["api", "backend", "rest"],
    isPublished: true,
    isFeatured: false,
    coverUrl: "https://picsum.photos/seed/api/800/450",
  },
  {
    title: "Content Marketing for SaaS Products",
    excerpt: "How to build a content engine that drives qualified leads for your SaaS business.",
    content: "<p>Identify topics your ideal customers search for before they buy.</p><p>Create pillar content supported by cluster articles for SEO depth.</p>",
    category: "Business",
    tags: ["saas", "content", "marketing"],
    isPublished: true,
    isFeatured: false,
    coverUrl: "https://picsum.photos/seed/saas/800/450",
  },
  {
    title: "Tailwind CSS Advanced Patterns",
    excerpt: "Component extraction, custom utilities, and responsive design patterns with Tailwind.",
    content: "<p>Use composition with utility classes in JSX over excessive @apply.</p><p>Custom theme extensions keep design tokens centralized.</p>",
    category: "Development",
    tags: ["tailwind", "css", "frontend"],
    isPublished: false,
    isFeatured: false,
    coverUrl: "https://picsum.photos/seed/tailwind/800/450",
  },
  {
    title: "Accessibility in Modern Web Apps",
    excerpt: "Essential WCAG guidelines and practical techniques for building inclusive interfaces.",
    content: "<p>Semantic HTML is the foundation of accessible web applications.</p><p>Keyboard navigation and focus management are non-negotiable.</p>",
    category: "Design",
    tags: ["a11y", "accessibility", "wcag"],
    isPublished: false,
    isFeatured: false,
    coverUrl: "https://picsum.photos/seed/a11y/800/450",
  },
  {
    title: "GraphQL vs REST: When to Choose What",
    excerpt: "A balanced comparison to help you pick the right API style for your project.",
    content: "<p>REST excels for simple CRUD APIs with predictable resource structures.</p><p>GraphQL shines when clients need flexible data fetching.</p>",
    category: "Technology",
    tags: ["graphql", "rest", "api"],
    isPublished: true,
    isFeatured: false,
    coverUrl: "https://picsum.photos/seed/graphql/800/450",
  },
  {
    title: "Morning Routines of Top Engineers",
    excerpt: "Insights from leading developers on how they start their day for peak performance.",
    content: "<p>Many top engineers prioritize exercise or meditation before opening their laptop.</p><p>Consistency matters more than the specific routine you choose.</p>",
    category: "Lifestyle",
    tags: ["routine", "habits", "engineering"],
    isPublished: true,
    isFeatured: false,
    coverUrl: "https://picsum.photos/seed/morning/800/450",
  },
  {
    title: "Draft: Upcoming Feature Preview",
    excerpt: "A sneak peek at features coming to the platform — still being written.",
    content: "<p>This post is a work in progress covering upcoming platform features.</p>",
    category: "Business",
    tags: ["preview", "roadmap"],
    isPublished: false,
    isFeatured: false,
    coverUrl: "https://picsum.photos/seed/preview/800/450",
  },
];

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

const seed = async (): Promise<void> => {
  const force = process.argv.includes("--force");

  await connectDatabase();

  const [existingAdmin] = await db
    .select()
    .from(users)
    .where(eq(users.email, ADMIN_EMAIL))
    .limit(1);

  let admin = existingAdmin;

  if (!admin) {
    const hashed = await hashPassword(ADMIN_PASSWORD);
    [admin] = await db
      .insert(users)
      .values({
        name: "Alex Morgan",
        email: ADMIN_EMAIL,
        password: hashed,
        role: ROLES.ADMIN,
        avatar: "https://i.pravatar.cc/150?u=admin@blog.com",
      })
      .returning();
    console.log("Admin user created:", ADMIN_EMAIL);
  } else {
    console.log("Admin user already exists, skipping user creation");
  }

  const [countResult] = await db.select({ total: sql<number>`count(*)::int` }).from(blogs);
  const existingBlogs = countResult?.total ?? 0;

  if (existingBlogs > 0 && !force) {
    console.log(`${existingBlogs} blogs already exist. Use --force to re-seed blogs.`);
    await disconnectDatabase();
    return;
  }

  if (force) {
    await db.delete(blogs);
    console.log("Existing blogs cleared");
  }

  for (const blog of sampleBlogs) {
    const slug = slugify(blog.title);
    await db.insert(blogs).values({
      title: blog.title,
      slug,
      excerpt: blog.excerpt,
      content: blog.content,
      coverImageUrl: blog.coverUrl,
      coverImagePublicId: `seed/${slug}`,
      category: blog.category,
      tags: blog.tags,
      authorId: admin!.id,
      isPublished: blog.isPublished,
      isFeatured: blog.isFeatured,
      readingTime: calculateReadingTime(blog.content),
      publishedAt: blog.isPublished ? new Date() : null,
    });
  }

  console.log(`Seeded ${sampleBlogs.length} blogs successfully`);
  await disconnectDatabase();
};

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});

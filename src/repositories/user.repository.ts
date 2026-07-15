import { eq, sql } from "drizzle-orm";
import { db } from "../db";
import { users, User } from "../db/schema";
import { Role } from "../constants/roles";
import { hashPassword } from "../utils/password.util";

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role?: Role;
  avatar?: string;
}

export const userRepository = {
  async findByEmail(email: string, includePassword = false): Promise<User | null> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1);

    if (!user) return null;
    if (includePassword) return user;

    const { password: _, ...publicUser } = user;
    return { ...publicUser, password: "" } as User;
  },

  async findByEmailWithPassword(email: string): Promise<User | null> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1);
    return user ?? null;
  },

  async findById(id: string): Promise<Omit<User, "password"> | null> {
    const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
    if (!user) return null;
    const { password: _, ...publicUser } = user;
    return publicUser;
  },

  async create(data: CreateUserData): Promise<Omit<User, "password">> {
    const hashed = await hashPassword(data.password);
    const [user] = await db
      .insert(users)
      .values({
        name: data.name,
        email: data.email.toLowerCase(),
        password: hashed,
        role: data.role ?? "user",
        avatar: data.avatar,
      })
      .returning();

    const { password: _, ...publicUser } = user;
    return publicUser;
  },

  async updateById(
    id: string,
    data: Partial<CreateUserData>
  ): Promise<Omit<User, "password"> | null> {
    const updateData: Partial<typeof users.$inferInsert> = {
      ...data,
      updatedAt: new Date(),
    };

    if (data.password) {
      updateData.password = await hashPassword(data.password);
    }

    if (data.email) {
      updateData.email = data.email.toLowerCase();
    }

    const [user] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning();

    if (!user) return null;
    const { password: _, ...publicUser } = user;
    return publicUser;
  },

  async emailExists(email: string): Promise<boolean> {
    const [result] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(users)
      .where(eq(users.email, email.toLowerCase()));
    return (result?.count ?? 0) > 0;
  },
};

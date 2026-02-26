import { and, eq, ilike, or, sql } from "drizzle-orm";
import { db } from "../db";
import { users } from "../db/schema";

export type ListUsersFilters = {
  search?: string;
  role?: "user" | "admin";
};

export async function findByEmail(email: string) {
  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return user ?? null;
}

export async function findById(id: string) {
  const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return user ?? null;
}

export async function create(data: {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
}) {
  const [user] = await db
    .insert(users)
    .values(data)
    .returning({ id: users.id, name: users.name, email: users.email, role: users.role });
  return user;
}

export async function updateById(
  id: string,
  data: { name?: string; updatedAt?: Date }
) {
  const [user] = await db
    .update(users)
    .set(data)
    .where(eq(users.id, id))
    .returning({ id: users.id, name: users.name, email: users.email, role: users.role });
  return user ?? null;
}

export async function findManyPaginated(
  limit: number,
  offset: number,
  filters?: ListUsersFilters
) {
  const conditions = [];
  if (filters?.search?.trim()) {
    const term = `%${filters.search.trim()}%`;
    conditions.push(
      or(ilike(users.name, term), ilike(users.email, term))!
    );
  }
  if (filters?.role) {
    conditions.push(eq(users.role, filters.role));
  }
  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const rows = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
    })
    .from(users)
    .where(whereClause)
    .limit(limit)
    .offset(offset)
    .orderBy(users.createdAt);

  const countQuery = db
    .select({ count: sql<number>`count(*)::int` })
    .from(users);
  const [{ count }] = whereClause
    ? await countQuery.where(whereClause)
    : await countQuery;
  return { rows, total: Number(count) };
}

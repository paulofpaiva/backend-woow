import { eq } from "drizzle-orm";
import { db } from "../db";
import { users } from "../db/schema";

export async function findByEmail(email: string) {
  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
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

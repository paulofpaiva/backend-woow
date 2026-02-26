import bcrypt from "bcryptjs";
import { findByEmail, create } from "../repositories/user.repository";
import type { RegisterBody, RegisterResponse } from "../types/auth.types";

const SALT_ROUNDS = 10;

export async function register(body: RegisterBody): Promise<RegisterResponse> {
  const existing = await findByEmail(body.email);
  if (existing) {
    const error = new Error("EMAIL_IN_USE") as Error & { statusCode?: number };
    error.statusCode = 409;
    throw error;
  }
  const hashed = await bcrypt.hash(body.password, SALT_ROUNDS);
  await create({
    name: body.name.trim(),
    email: body.email.trim().toLowerCase(),
    password: hashed,
    role: "user",
  });
  return { message: "Usuario registrado exitosamente" };
}

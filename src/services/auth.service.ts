import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { findByEmail, create } from "../repositories/user.repository";
import { jwtConfig } from "../config/auth";
import type {
  RegisterBody,
  RegisterResponse,
  LoginBody,
  LoginResponse,
  UserDto,
} from "../types/auth.types";

const SALT_ROUNDS = 10;

function toUserDto(user: { id: string; name: string; email: string; role: string }): UserDto {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

export async function register(body: RegisterBody): Promise<RegisterResponse> {
  const existing = await findByEmail(body.email.trim().toLowerCase());
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

export async function login(body: LoginBody): Promise<LoginResponse> {
  const email = body.email.trim().toLowerCase();
  const user = await findByEmail(email);
  if (!user) {
    const error = new Error("INVALID_CREDENTIALS") as Error & { statusCode?: number };
    error.statusCode = 401;
    throw error;
  }
  const match = await bcrypt.compare(body.password, user.password);
  if (!match) {
    const error = new Error("INVALID_CREDENTIALS") as Error & { statusCode?: number };
    error.statusCode = 401;
    throw error;
  }
  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    jwtConfig.secret,
    { expiresIn: jwtConfig.expiresIn } as jwt.SignOptions
  );
  return {
    token,
    user: toUserDto(user),
  };
}

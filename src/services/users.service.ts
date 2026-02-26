import { findById } from "../repositories/user.repository";
import type { UserDto } from "../types/auth.types";

export async function getProfile(userId: string): Promise<UserDto> {
  const user = await findById(userId);
  if (!user) {
    const error = new Error("USER_NOT_FOUND") as Error & { statusCode?: number };
    error.statusCode = 404;
    throw error;
  }
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

import {
  findById,
  findManyPaginated,
  updateById,
} from "../repositories/user.repository";
import type { ListUsersFilters } from "../repositories/user.repository";
import type {
  ListUsersResponse,
  UpdateProfileBody,
  UpdateProfileResponse,
  UserDto,
} from "../models/auth.types";

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

export async function updateProfile(
  userId: string,
  body: UpdateProfileBody
): Promise<UpdateProfileResponse> {
  const user = await findById(userId);
  if (!user) {
    const error = new Error("USER_NOT_FOUND") as Error & { statusCode?: number };
    error.statusCode = 404;
    throw error;
  }
  const updated = await updateById(userId, {
    name: body.name.trim(),
    updatedAt: new Date(),
  });
  if (!updated) {
    const error = new Error("UPDATE_FAILED") as Error & { statusCode?: number };
    error.statusCode = 500;
    throw error;
  }
  return {
    message: "Perfil actualizado",
    user: {
      id: updated.id,
      name: updated.name,
      email: updated.email,
      role: updated.role,
    },
  };
}

export async function listUsers(
  page: number,
  limit: number,
  filters?: ListUsersFilters
): Promise<ListUsersResponse> {
  const offset = (page - 1) * limit;
  const { rows, total } = await findManyPaginated(limit, offset, filters);
  const totalPages = Math.ceil(total / limit) || 1;
  return {
    users: rows.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  };
}

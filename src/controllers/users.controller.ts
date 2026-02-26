import { Request, Response } from "express";
import type { ListUsersFilters } from "../repositories/user.repository";
import { getProfile, listUsers, updateProfile } from "../services/users.service";
import type { UpdateProfileBody } from "../models/auth.types";

export async function getMe(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user?.userId) {
      res.status(401).json({ message: "No autorizado" });
      return;
    }
    const user = await getProfile(req.user.userId);
    res.status(200).json(user);
  } catch (err) {
    const e = err as Error & { statusCode?: number };
    if (e.statusCode === 404) {
      res.status(404).json({ message: "Usuario no encontrado" });
      return;
    }
    res.status(500).json({ message: "Error al obtener perfil" });
  }
}

export async function putMe(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user?.userId) {
      res.status(401).json({ message: "No autorizado" });
      return;
    }
    const body = req.body as UpdateProfileBody;
    const data = await updateProfile(req.user.userId, body);
    res.status(200).json(data);
  } catch (err) {
    const e = err as Error & { statusCode?: number };
    if (e.statusCode === 404) {
      res.status(404).json({ message: "Usuario no encontrado" });
      return;
    }
    res.status(500).json({ message: "Error al actualizar perfil" });
  }
}

export async function getUsers(req: Request, res: Response): Promise<void> {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = typeof req.query.search === "string" ? req.query.search : undefined;
    const role =
      req.query.role === "user" || req.query.role === "admin"
        ? req.query.role
        : undefined;
    const filters: ListUsersFilters | undefined =
      search !== undefined || role !== undefined ? { search, role } : undefined;
    const data = await listUsers(page, limit, filters);
    res.status(200).json(data);
  } catch {
    res.status(500).json({ message: "Error al listar usuarios" });
  }
}

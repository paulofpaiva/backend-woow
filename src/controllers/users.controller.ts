import { Request, Response } from "express";
import { getProfile, updateProfile } from "../services/users.service";
import type { UpdateProfileBody } from "../types/auth.types";

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
    if (e.statusCode === 409) {
      res.status(409).json({ message: "El correo ya está en uso" });
      return;
    }
    res.status(500).json({ message: "Error al actualizar perfil" });
  }
}

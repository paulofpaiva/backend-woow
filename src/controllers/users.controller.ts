import { Request, Response } from "express";
import { getProfile } from "../services/users.service";

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

import { Request, Response } from "express";
import { register as registerService } from "../services/auth.service";
import type { RegisterBody } from "../types/auth.types";

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const body = req.body as RegisterBody;
    const data = await registerService(body);
    res.status(201).json(data);
  } catch (err) {
    const e = err as Error & { statusCode?: number };
    if (e.statusCode === 409) {
      res.status(409).json({ message: "El correo ya está registrado" });
      return;
    }
    res.status(500).json({ message: "Error al registrar usuario" });
  }
}

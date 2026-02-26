import { Request, Response } from "express";
import { register as registerService, login as loginService } from "../services/auth.service";
import { cookieConfig } from "../config/auth";
import type { LoginBody, RegisterBody } from "../models/auth.types";

export async function logout(req: Request, res: Response): Promise<void> {
  res.clearCookie(cookieConfig.name, { path: cookieConfig.options.path });
  res.status(200).json({ message: "Sesión cerrada" });
}

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

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const body = req.body as LoginBody;
    const data = await loginService(body);
    res.cookie(cookieConfig.name, data.token, cookieConfig.options);
    res.status(200).json({ token: data.token, user: data.user });
  } catch (err) {
    const e = err as Error & { statusCode?: number };
    if (e.statusCode === 401) {
      res.status(401).json({ message: "Credenciales inválidas" });
      return;
    }
    res.status(500).json({ message: "Error al iniciar sesión" });
  }
}

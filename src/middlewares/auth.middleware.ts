import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { jwtConfig, cookieConfig } from "../config/auth";

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const token =
    req.cookies?.[cookieConfig.name] ??
    req.headers.authorization?.replace(/^Bearer\s+/i, "");

  if (!token) {
    res.status(401).json({ message: "No autorizado" });
    return;
  }

  try {
    const decoded = jwt.verify(token, jwtConfig.secret) as {
      userId: string;
      email: string;
      role: string;
    };
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Token inválido o expirado" });
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  if (!req.user) {
    res.status(401).json({ message: "No autorizado" });
    return;
  }
  if (req.user.role !== "admin") {
    res.status(403).json({ message: "No tienes permiso para esta acción" });
    return;
  }
  next();
}

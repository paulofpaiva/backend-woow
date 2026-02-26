import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

export function handleValidationErrors(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const result = validationResult(req);
  if (result.isEmpty()) {
    next();
    return;
  }
  const firstError = result.array({ onlyFirstError: true })[0];
  const message =
    typeof firstError?.msg === "string" ? firstError.msg : "Error de validación";
  res.status(400).json({ message });
}

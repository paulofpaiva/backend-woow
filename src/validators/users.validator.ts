import { body, query } from "express-validator";

export const updateProfileValidations = [
  body("name").trim().notEmpty().withMessage("El nombre es requerido"),
];

export const listUsersValidations = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("La página debe ser un número mayor a 0")
    .toInt(),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("El límite debe estar entre 1 y 100")
    .toInt(),
  query("search")
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage("La búsqueda no puede superar 255 caracteres"),
  query("role")
    .optional()
    .isIn(["user", "admin"])
    .withMessage("El rol debe ser 'user' o 'admin'"),
];

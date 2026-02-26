import { body, query } from "express-validator";

export const updateProfileValidations = [
  body("name").trim().notEmpty().withMessage("El nombre es requerido"),
  body("email")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("El correo no puede estar vacío")
    .isEmail()
    .withMessage("El correo no es válido"),
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
];

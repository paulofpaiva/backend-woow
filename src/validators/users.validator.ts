import { body } from "express-validator";

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

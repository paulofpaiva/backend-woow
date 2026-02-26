import { body } from "express-validator";

export const registerValidations = [
  body("name").trim().notEmpty().withMessage("El nombre es requerido"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("El correo es requerido")
    .isEmail()
    .withMessage("El correo no es válido"),
  body("password")
    .notEmpty()
    .withMessage("La contraseña es requerida")
    .isLength({ min: 8 })
    .withMessage("La contraseña debe tener al menos 8 caracteres"),
];

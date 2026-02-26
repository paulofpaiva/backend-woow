import { Router } from "express";
import { login, logout, register } from "../controllers/auth.controller";
import { registerValidations, loginValidations } from "../validators/auth.validator";
import { handleValidationErrors } from "../middlewares/validation.middleware";

const router = Router();

router.post(
  "/register",
  registerValidations,
  handleValidationErrors,
  register
);

router.post(
  "/login",
  loginValidations,
  handleValidationErrors,
  login
);

router.post("/logout", logout);

export default router;

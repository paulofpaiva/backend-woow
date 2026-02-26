import { Router } from "express";
import { register } from "../controllers/auth.controller";
import { registerValidations } from "../validators/auth.validator";
import { handleValidationErrors } from "../middlewares/validation.middleware";

const router = Router();

router.post(
  "/register",
  registerValidations,
  handleValidationErrors,
  register
);

export default router;

import { Router } from "express";
import { getMe, putMe } from "../controllers/users.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { updateProfileValidations } from "../validators/users.validator";
import { handleValidationErrors } from "../middlewares/validation.middleware";

const router = Router();

router.get("/me", requireAuth, getMe);
router.put(
  "/me",
  requireAuth,
  updateProfileValidations,
  handleValidationErrors,
  putMe
);

export default router;

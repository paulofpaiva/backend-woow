import { Router } from "express";
import { getMe, putMe, getUsers } from "../controllers/users.controller";
import { requireAuth, requireAdmin } from "../middlewares/auth.middleware";
import { updateProfileValidations, listUsersValidations } from "../validators/users.validator";
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
router.get(
  "/",
  requireAuth,
  requireAdmin,
  listUsersValidations,
  handleValidationErrors,
  getUsers
);

export default router;

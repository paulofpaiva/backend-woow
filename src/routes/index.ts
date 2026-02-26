import { Router } from "express";
import healthRoutes from "./health.routes";
import authRoutes from "./auth.routes";
import usersRoutes from "./users.routes";

const router = Router();

router.use("/api", healthRoutes);
router.use("/api/auth", authRoutes);
router.use("/api/users", usersRoutes);

export default router;

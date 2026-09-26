import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";

const router = Router();

import { authenticateToken } from "../middlewares/auth.middleware.js";

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/profile", authenticateToken, authController.getProfile);

export default router;

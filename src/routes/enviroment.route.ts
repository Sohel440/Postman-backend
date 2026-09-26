import { Router } from "express";

import {
  createEnviromentVariable,
  getEnvironments,
  getEnvironment,
  updateEnvironment,
  deleteEnvironment,
} from "../controllers/environment.controller.js";
import { authenticateToken as authenticate} from "../middlewares/auth.middleware.js";

const router = Router();

// Create environment
router.post(
  "/",
  authenticate,
  createEnviromentVariable
);

// Get all environments
router.get(
  "/",
  authenticate,
  getEnvironments
);


// Get one environment
router.get(
  "/:id",
  authenticate,
  getEnvironment
);


// Update environment
router.patch(
  "/:id",
  authenticate,
  updateEnvironment
);


// Delete environment
router.delete(
  "/:id",
  authenticate,
  deleteEnvironment
);


export default router;
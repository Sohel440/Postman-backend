import express from "express";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import {
  createRequest,
  getRequests,
  getRequestById,
  updateRequest,
  deleteRequest,
} from "../controllers/request.controller.js";

import {
  executeSavedRequestController,
  executeUnsavedRequestController,
} from "../controllers/excution.controller.js";

const requestRouter = express.Router({ mergeParams: true });

requestRouter
  .route("/")
  .post(authenticateToken, createRequest)
  .get(authenticateToken, getRequests);

requestRouter
  .route("/:id")
  .get(authenticateToken, getRequestById)
  .patch(authenticateToken, updateRequest)
  .put(authenticateToken, updateRequest)
  .delete(authenticateToken, deleteRequest);

requestRouter
  .route("/execute")
  .post(authenticateToken, executeUnsavedRequestController);

requestRouter
  .route("/:id/execute")
  .post(authenticateToken, executeSavedRequestController);

export default requestRouter;

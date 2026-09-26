import express from "express";
import { authenticateToken } from "../middlewares/auth.middleware.js";
const collectionRouter = express.Router();

import { createCollection, updateCollection, deleteCollection, getCollectionById, getAllCollectionByUserId } from "../controllers/collection.controller.js";
import {
  createFolder,
  getFoldersByCollection,
  getFolderById,
  updateFolder,
  deleteFolder,
} from "../controllers/folder.controller.js";

collectionRouter.route("/")
  .post(authenticateToken, createCollection)
  .get(authenticateToken, getAllCollectionByUserId);
  
collectionRouter.route("/:id")
  .get(authenticateToken, getCollectionById)
  .patch(authenticateToken, updateCollection)
  .delete(authenticateToken, deleteCollection);

// Folder routes inside collection
collectionRouter.route("/:collectionId/folders")
  .post(authenticateToken, createFolder)
  .get(authenticateToken, getFoldersByCollection);

collectionRouter.route("/:collectionId/folders/:folderId")
  .get(authenticateToken, getFolderById)
  .patch(authenticateToken, updateFolder)
  .delete(authenticateToken, deleteFolder);

// Request routes inside collection and folder
import requestRouter from "./request.routes.js";
collectionRouter.use("/:collectionId/requests", requestRouter);
collectionRouter.use("/:collectionId/folders/:folderId/requests", requestRouter);

export default collectionRouter;
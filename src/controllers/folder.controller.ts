import { NextFunction, Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware.js";
import {
  createFolderService,
  getFoldersByCollectionService,
  getFolderByIdService,
  updateFolderService,
  deleteFolderService,
} from "../services/folder.service.js";

export const createFolder = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const collectionId = req.params.collectionId as string;
    if (!collectionId) {
      return res
        .status(400)
        .json({ success: false, message: "Collection ID is required" });
    }

    const { name } = req.body;
    if (!name || typeof name !== "string" || name.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Folder name is required and cannot be empty",
      });
    }

    const folder = await createFolderService(
      userId,
      collectionId,
      name.trim()
    );

    if (!folder) {
      return res.status(404).json({
        success: false,
        message: "Collection not found",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Folder created successfully",
      data: folder,
    });
  } catch (error) {
    next(error);
  }
};

export const getFoldersByCollection = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const collectionId = req.params.collectionId as string;
    if (!collectionId) {
      return res
        .status(400)
        .json({ success: false, message: "Collection ID is required" });
    }

    const folders = await getFoldersByCollectionService(userId, collectionId);

    if (!folders) {
      return res.status(404).json({
        success: false,
        message: "Collection not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: folders,
    });
  } catch (error) {
    next(error);
  }
};

export const getFolderById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const collectionId = req.params.collectionId as string;
    const folderId = req.params.folderId as string;
    if (!collectionId || !folderId) {
      return res.status(400).json({
        success: false,
        message: "Collection ID and Folder ID are required",
      });
    }

    const folder = await getFolderByIdService(
      userId,
      collectionId,
      folderId
    );

    if (!folder) {
      return res.status(404).json({
        success: false,
        message: "Folder not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: folder,
    });
  } catch (error) {
    next(error);
  }
};

export const updateFolder = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const collectionId = req.params.collectionId as string;
    const folderId = req.params.folderId as string;
    if (!collectionId || !folderId) {
      return res.status(400).json({
        success: false,
        message: "Collection ID and Folder ID are required",
      });
    }

    const { name } = req.body;
    if (name === undefined) {
      return res.status(400).json({
        success: false,
        message: "At least one field is required to update",
      });
    }

    if (typeof name !== "string" || name.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Folder name cannot be empty",
      });
    }

    const updatedFolder = await updateFolderService(
      userId,
      collectionId,
      folderId,
      { name: name.trim() }
    );

    if (!updatedFolder) {
      return res.status(404).json({
        success: false,
        message: "Folder not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Folder updated successfully",
      data: updatedFolder,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteFolder = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const collectionId = req.params.collectionId as string;
    const folderId = req.params.folderId as string;
    if (!collectionId || !folderId) {
      return res.status(400).json({
        success: false,
        message: "Collection ID and Folder ID are required",
      });
    }

    const result = await deleteFolderService(userId, collectionId, folderId);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Folder not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Folder deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

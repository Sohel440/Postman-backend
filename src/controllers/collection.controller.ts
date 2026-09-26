import { NextFunction, Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware.js";
import {
  createCollectService,
  getAllCollectionByUserIdService,
  getCollectionByIdService,
  updateCollectionService,
  deleteCollectionService,
} from "../services/collection.service.js";
import { CollectionUpdate } from "../types/collection.types.js";
export const createCollection = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const { name, description } = req.body;

    if (!name) {
      res
        .status(400)
        .json({ success: false, message: "Collection name is required" });
      return;
    }

    const result = await createCollectService({ name, description, userId });

    res
      .status(201)
      .json({ success: true, message: result.message, data: result.data });
  } catch (error) {
    next(error);
  }
};

export const getAllCollectionByUserId = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(400).json({ message: "User not authorized" });
    }

    const result = await getAllCollectionByUserIdService(userId);
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const getCollectionById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const collectionId = req.params.id as string;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const result = await getCollectionByIdService(collectionId, userId);

    if (!result) {
      return res.status(404).json({ success: false, message: "Collection not found" });
    }

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const updateCollection = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const collectionId = req.params.id as string;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { name, description } = req.body;

    if (name === undefined && description === undefined) {
      return res.status(400).json({
        success: false,
        message: "At least one field is required to update",
      });
    }

    const updateData: CollectionUpdate = {};

    if (name !== undefined) {
      const trimmedName = name.trim();
      if (trimmedName === "") {
        return res.status(400).json({
          success: false,
          message: "Collection name cannot be empty",
        });
      }
      updateData.name = trimmedName;
    }

    if (description !== undefined) {
      updateData.description = description?.trim() || null;
    }

    const updatedCollection = await updateCollectionService(
      collectionId,
      userId,
      updateData,
    );

    if (!updatedCollection) {
      return res.status(404).json({
        success: false,
        message: "Collection not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Collection updated successfully",
      data: updatedCollection,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCollection = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const collectionId = req.params.id as string;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const deleted = await deleteCollectionService(collectionId, userId);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Collection not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Collection deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

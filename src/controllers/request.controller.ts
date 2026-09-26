import { NextFunction, Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware.js";
import {
  createRequestService,
  getRequestByIdService,
  getRequestsService,
  updateRequestService,
  deleteRequestService,
} from "../services/request.service.js";
import { RequestCreateInput, RequestUpdateInput } from "../types/request.js";

export const createRequest = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const collectionId =
      (req.params.collectionId as string) || req.body.collectionId;
    const folderId = (req.params.folderId as string) || req.body.folderId;

    if (!collectionId) {
      return res.status(400).json({
        success: false,
        message: "Collection ID is required",
      });
    }

    const { name, method, url, queryParams, headers, authorization, body } =
      req.body;

    if (!name || typeof name !== "string" || name.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Request name is required and cannot be empty",
      });
    }

    const createData: RequestCreateInput = {
      name: name.trim(),
      collectionId,
      folderId: folderId || null,
      method: method ? String(method).toUpperCase().trim() : "GET",
      url: url !== undefined ? String(url).trim() : "",
      queryParams,
      headers,
      authorization,
      body,
    };

    const result = await createRequestService(userId, createData);

    if ("error" in result) {
      return res.status(result.status).json({
        success: false,
        message: result.error,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Request created successfully",
      data: result.request,
    });
  } catch (error) {
    next(error);
  }
};

export const getRequestById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const requestId = (req.params.id as string) || (req.params.requestId as string);
    if (!requestId) {
      return res.status(400).json({
        success: false,
        message: "Request ID is required",
      });
    }

    const request = await getRequestByIdService(requestId, userId);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: request,
    });
  } catch (error) {
    next(error);
  }
};

export const getRequests = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const collectionId =
      (req.params.collectionId as string) ||
      (req.query.collectionId as string | undefined);
    const folderId =
      (req.params.folderId as string) ||
      (req.query.folderId as string | undefined);

    const requests = await getRequestsService(userId, {
      collectionId,
      folderId,
    });

    return res.status(200).json({
      success: true,
      data: requests,
    });
  } catch (error) {
    next(error);
  }
};

export const updateRequest = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const requestId = (req.params.id as string) || (req.params.requestId as string);
    if (!requestId) {
      return res.status(400).json({
        success: false,
        message: "Request ID is required",
      });
    }

    const {
      name,
      method,
      url,
      queryParams,
      headers,
      authorization,
      body,
      folderId,
      collectionId,
    } = req.body;

    if (
      name === undefined &&
      method === undefined &&
      url === undefined &&
      queryParams === undefined &&
      headers === undefined &&
      authorization === undefined &&
      body === undefined &&
      folderId === undefined &&
      collectionId === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "At least one field is required to update",
      });
    }

    if (name !== undefined && (typeof name !== "string" || name.trim() === "")) {
      return res.status(400).json({
        success: false,
        message: "Request name cannot be empty",
      });
    }

    const updateData: RequestUpdateInput = {};
    if (name !== undefined) updateData.name = name.trim();
    if (method !== undefined) updateData.method = String(method).toUpperCase().trim();
    if (url !== undefined) updateData.url = String(url).trim();
    if (queryParams !== undefined) updateData.queryParams = queryParams;
    if (headers !== undefined) updateData.headers = headers;
    if (authorization !== undefined) updateData.authorization = authorization;
    if (body !== undefined) updateData.body = body;
    if (folderId !== undefined) updateData.folderId = folderId;
    if (collectionId !== undefined) updateData.collectionId = collectionId;

    const result = await updateRequestService(requestId, userId, updateData);

    if ("error" in result) {
      return res.status(result.status).json({
        success: false,
        message: result.error,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Request updated successfully",
      data: result.request,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteRequest = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const requestId = (req.params.id as string) || (req.params.requestId as string);
    if (!requestId) {
      return res.status(400).json({
        success: false,
        message: "Request ID is required",
      });
    }

    const deleted = await deleteRequestService(requestId, userId);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Request deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

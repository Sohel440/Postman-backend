import { NextFunction, Request, Response } from "express";
import * as executeService from "../services/excute.service.js";
import { AuthRequest } from "../middlewares/auth.middleware.js";

export const executeSavedRequestController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const requestId =
      (req.params.id as string) || (req.params.requestId as string);
    if (!requestId) {
      return res.status(400).json({
        message: "RequestId required!",
        success: false,
      });
    }

    const result = await executeService.executeSavedRequest(userId, requestId);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
export const executeUnsavedRequestController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

   
    const data = req.body;
    const result = await executeService.executeUnsavedRequest( userId , data);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};


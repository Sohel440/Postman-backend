import { NextFunction, Request, Response } from "express"
import { AuthRequest } from "../middlewares/auth.middleware.js"
import prisma from "../prisma.js";
import { createEnviromentServices } from "../services/environment.service.js";




export interface EnviromentVariableType{
    name: string,
    variables : {
        [key: string]: string
    },
    createdAt?: Date,
    updatedAt?: Date

}
export const createEnviromentVariable = async (req : AuthRequest, res : Response, next : NextFunction)=>{
    try{
        const userId = req.user?.userId;
        if(!userId){
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        // const data : EnviromentVariableType = req.body;
        // await prisma.environment.create({
        //     data:{
        //         userId,
        //         name: data.name,
        //         variables: data.variables 
        //     }
        // })
        const result = await createEnviromentServices(userId, req.body)

        return res.status(201).json({
            success: true,
            message: "Enviroment variable created successfully"
        })


    }catch(error: any){
        next(error);
    }
}


// GET ALL ENVIRONMENTS
export const getEnvironments = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const environments = await prisma.environment.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      data: environments,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch environments",
    });
  }
};


// GET SINGLE ENVIRONMENT
export const getEnvironment = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user?.userId;
    const id  = req.params.id as string;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Environment ID is required",
      });
    }

    const environment = await prisma.environment.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!environment) {
      return res.status(404).json({
        success: false,
        message: "Environment not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: environment,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch environment",
    });
  }
};


// UPDATE ENVIRONMENT
export const updateEnvironment = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user?.userId;
    const id  = req.params.id as string;

    const {
      name,
      variables,
    } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Environment ID is required",
      });
    }

    // Check ownership
    const environment = await prisma.environment.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!environment) {
      return res.status(404).json({
        success: false,
        message: "Environment not found",
      });
    }

    // Build update object
    const updateData: {
      name?: string,
      variables ?: {
        [key: string]: string
      };
    } = {};

    if (name !== undefined) {
      if (typeof name !== "string" || !name.trim()) {
        return res.status(400).json({
          success: false,
          message: "Environment name must be a non-empty string",
        });
      }

      updateData.name = name.trim();
    }

    if (variables !== undefined) {
      if (
        typeof variables !== "object" ||
        variables === null ||
        Array.isArray(variables)
      ) {
        return res.status(400).json({
          success: false,
          message: "Variables must be a JSON object",
        });
      }

      updateData.variables = variables;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields provided for update",
      });
    }

    const updatedEnvironment =
      await prisma.environment.update({
        where: {
          id,
        },
        data:updateData,
      });

    return res.status(200).json({
      success: true,
      message: "Environment updated successfully",
      data: updatedEnvironment,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to update environment",
    });
  }
};


// DELETE ENVIRONMENT
export const deleteEnvironment = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user?.userId;
    const id = req.params.id as string;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Environment ID is required",
      });
    }

    // Check ownership
    const environment = await prisma.environment.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!environment) {
      return res.status(404).json({
        success: false,
        message: "Environment not found",
      });
    }

    await prisma.environment.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Environment deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete environment",
    });
  }
};
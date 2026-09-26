import { EnviromentVariableType } from "../controllers/environment.controller.js";
import prisma from "../prisma.js";

export const createEnviromentServices = async (userId : string , data : EnviromentVariableType)  =>{
    try {
        const result = await prisma.environment.create({
            data:{
                userId,
                name: data.name,
                variables: data.variables 
            }
        })
        return result;
    } catch (error) {
        throw error;
    }
}
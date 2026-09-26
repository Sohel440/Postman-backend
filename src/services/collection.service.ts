import prisma from "../prisma.js";
import { CollectCreateResponse, CollectionCreate, CollectionUpdate } from "../types/collection.types.js";

export const createCollectService = async (data: CollectionCreate) : Promise<CollectCreateResponse> => {
    try {
        const {name , description , userId} = data ;
    const collection = await prisma.collection.create({
        data: {
            name,
            userId,
            description
        }
    });
    return {
      message: "Collection created successfully",
      data: {
        id: collection.id,
        name: collection.name,
        description : collection.description,
      },
    };
    } catch (error) {
        throw error
    }
    
};

export const getAllCollectionByUserIdService = async (userId: string) => {
    try {
        const collections = await prisma.collection.findMany({
            where: {
                userId
            },
            include: {
                folders: {
                    include: {
                        requests: true
                    },
                    orderBy: {
                        createdAt: 'asc'
                    }
                },
                requests: {
                    orderBy: {
                        createdAt: 'asc'
                    }
                }
            },
            orderBy: {
                createdAt: 'asc'
            }
        });
        return collections
    } catch (error) {
        throw error
    }    
}

export const getCollectionByIdService = async (collectionId: string , userId: string) =>{
    try {
        const getCollectionById = await prisma.collection.findFirst({
            where:{
                userId,
                id: collectionId
            }
        });

        return getCollectionById;        

    } catch (error) {
        throw error;
    }
}

export const updateCollectionService = async (collectionId: string, userId: string, updateData: CollectionUpdate) => {
    try {
        const collection = await prisma.collection.findFirst({
            where: {
                id: collectionId,
                userId
            }
        });

        if (!collection) {
            return null;
        }

        const updatedCollection = await prisma.collection.update({
            where: {
                id: collectionId
            },
            data: updateData
        });

        return updatedCollection;
    } catch (error) {
        throw error;
    }
}

export const deleteCollectionService = async (collectionId: string, userId: string) => {
    try {
        const collection = await prisma.collection.findFirst({
            where: {
                id: collectionId,
                userId
            }
        });

        if (!collection) {
            return null;
        }

        await prisma.collection.delete({
            where: {
                id: collectionId
            }
        });

        return true;
    } catch (error) {
        throw error;
    }
}
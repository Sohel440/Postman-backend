import prisma from "../prisma.js";
import { FolderCreateInput, FolderUpdateInput } from "../types/folder.types.js";

export const createFolderService = async (
  userId: string,
  collectionId: string,
  name: string
) => {
  try {
    // 1. Verify parent collection ownership
    const collection = await prisma.collection.findFirst({
      where: {
        id: collectionId,
        userId,
      },
    });

    if (!collection) {
      return null;
    }

    // 2. Create the folder
    const folder = await prisma.folder.create({
      data: {
        name,
        collectionId,
      },
    });

    return folder;
  } catch (error) {
    throw error;
  }
};

export const getFoldersByCollectionService = async (
  userId: string,
  collectionId: string
) => {
  try {
    // Verify collection belongs to authenticated user
    const collection = await prisma.collection.findFirst({
      where: {
        id: collectionId,
        userId,
      },
    });

    if (!collection) {
      return null;
    }

    const folders = await prisma.folder.findMany({
      where: {
        collectionId,
      },
      include: {
        requests: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return folders;
  } catch (error) {
    throw error;
  }
};

export const getFolderByIdService = async (
  userId: string,
  collectionId: string,
  folderId: string
) => {
  try {
    // Verify collection belongs to authenticated user
    const collection = await prisma.collection.findFirst({
      where: {
        id: collectionId,
        userId,
      },
    });

    if (!collection) {
      return null;
    }

    // Verify folder belongs to this collection
    const folder = await prisma.folder.findFirst({
      where: {
        id: folderId,
        collectionId,
      },
      include: {
        requests: true,
      },
    });

    return folder;
  } catch (error) {
    throw error;
  }
};

export const updateFolderService = async (
  userId: string,
  collectionId: string,
  folderId: string,
  updateData: FolderUpdateInput
) => {
  try {
    // Verify collection belongs to authenticated user
    const collection = await prisma.collection.findFirst({
      where: {
        id: collectionId,
        userId,
      },
    });

    if (!collection) {
      return null;
    }

    // Verify folder belongs to collection
    const existingFolder = await prisma.folder.findFirst({
      where: {
        id: folderId,
        collectionId,
      },
    });

    if (!existingFolder) {
      return null;
    }

    const updatedFolder = await prisma.folder.update({
      where: {
        id: folderId,
      },
      data: updateData,
    });

    return updatedFolder;
  } catch (error) {
    throw error;
  }
};

export const deleteFolderService = async (
  userId: string,
  collectionId: string,
  folderId: string
) => {
  try {
    // Verify collection belongs to authenticated user
    const collection = await prisma.collection.findFirst({
      where: {
        id: collectionId,
        userId,
      },
    });

    if (!collection) {
      return null;
    }

    // Verify folder belongs to collection
    const existingFolder = await prisma.folder.findFirst({
      where: {
        id: folderId,
        collectionId,
      },
    });

    if (!existingFolder) {
      return null;
    }

    await prisma.folder.delete({
      where: {
        id: folderId,
      },
    });

    return true;
  } catch (error) {
    throw error;
  }
};

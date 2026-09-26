import prisma from "../prisma.js";
import {
  RequestCreateInput,
  RequestFilterParams,
  RequestServiceResult,
  RequestUpdateInput,
} from "../types/request.js";

export const createRequestService = async (
  userId: string,
  data: RequestCreateInput
): Promise<RequestServiceResult<any>> => {
  try {
    // 1. Verify parent collection ownership
    const collection = await prisma.collection.findFirst({
      where: {
        id: data.collectionId,
        userId,
      },
    });

    if (!collection) {
      return { error: "Collection not found", status: 404 };
    }

    // 2. If folderId is provided, verify folder belongs to collection
    if (data.folderId) {
      const folder = await prisma.folder.findFirst({
        where: {
          id: data.folderId,
          collectionId: data.collectionId,
        },
      });

      if (!folder) {
        return { error: "Folder not found in this collection", status: 404 };
      }
    }

    // 3. Create request
    const request = await prisma.request.create({
      data: {
        name: data.name.trim(),
        collectionId: data.collectionId,
        folderId: data.folderId || null,
        method: (data.method || "GET").toUpperCase().trim(),
        url: data.url !== undefined ? data.url.trim() : "",
        queryParams: data.queryParams ?? null,
        headers: data.headers ?? null,
        authorization: data.authorization ?? null,
        body: data.body ?? null,
      },
    });

    return { request };
  } catch (error) {
    throw error;
  }
};

export const getRequestByIdService = async (
  requestId: string,
  userId: string
) => {
  try {
    const request = await prisma.request.findFirst({
      where: {
        id: requestId,
        collection: {
          userId,
        },
      },
      include: {
        collection: {
          select: {
            id: true,
            name: true,
          },
        },
        folder: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return request;
  } catch (error) {
    throw error;
  }
};

export const getRequestsService = async (
  userId: string,
  filters?: RequestFilterParams
) => {
  try {
    const where: any = {
      collection: {
        userId,
      },
    };

    if (filters?.collectionId) {
      where.collectionId = filters.collectionId;
    }

    if (filters?.folderId !== undefined) {
      where.folderId = filters.folderId;
    }

    const requests = await prisma.request.findMany({
      where,
      orderBy: {
        createdAt: "asc",
      },
    });

    return requests;
  } catch (error) {
    throw error;
  }
};

export const updateRequestService = async (
  requestId: string,
  userId: string,
  updateData: RequestUpdateInput
): Promise<RequestServiceResult<any>> => {
  try {
    // 1. Verify request exists and user owns the parent collection
    const existing = await prisma.request.findFirst({
      where: {
        id: requestId,
        collection: {
          userId,
        },
      },
    });

    if (!existing) {
      return { error: "Request not found", status: 404 };
    }

    const targetCollectionId = updateData.collectionId || existing.collectionId;

    // 2. If moving to another collection, verify target collection ownership
    if (updateData.collectionId && updateData.collectionId !== existing.collectionId) {
      const targetCollection = await prisma.collection.findFirst({
        where: {
          id: updateData.collectionId,
          userId,
        },
      });

      if (!targetCollection) {
        return { error: "Target collection not found", status: 404 };
      }
    }

    // 3. If updating folderId, verify folder exists in target collection
    if (updateData.folderId) {
      const folder = await prisma.folder.findFirst({
        where: {
          id: updateData.folderId,
          collectionId: targetCollectionId,
        },
      });

      if (!folder) {
        return { error: "Target folder not found in collection", status: 404 };
      }
    }

    const dataToUpdate: any = {};
    if (updateData.name !== undefined) dataToUpdate.name = updateData.name.trim();
    if (updateData.method !== undefined) dataToUpdate.method = updateData.method.toUpperCase().trim();
    if (updateData.url !== undefined) dataToUpdate.url = updateData.url.trim();
    if (updateData.queryParams !== undefined) dataToUpdate.queryParams = updateData.queryParams;
    if (updateData.headers !== undefined) dataToUpdate.headers = updateData.headers;
    if (updateData.authorization !== undefined) dataToUpdate.authorization = updateData.authorization;
    if (updateData.body !== undefined) dataToUpdate.body = updateData.body;
    if (updateData.folderId !== undefined) dataToUpdate.folderId = updateData.folderId;
    if (updateData.collectionId !== undefined) dataToUpdate.collectionId = updateData.collectionId;

    const updated = await prisma.request.update({
      where: {
        id: requestId,
      },
      data: dataToUpdate,
    });

    return { request: updated };
  } catch (error) {
    throw error;
  }
};

export const deleteRequestService = async (
  requestId: string,
  userId: string
) => {
  try {
    const existing = await prisma.request.findFirst({
      where: {
        id: requestId,
        collection: {
          userId,
        },
      },
    });

    if (!existing) {
      return false;
    }

    await prisma.request.delete({
      where: {
        id: requestId,
      },
    });

    return true;
  } catch (error) {
    throw error;
  }
};

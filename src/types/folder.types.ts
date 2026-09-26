export interface FolderCreateInput {
  name: string;
  collectionId: string;
}

export interface FolderUpdateInput {
  name?: string;
}

export interface FolderResponse {
  id: string;
  collectionId: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

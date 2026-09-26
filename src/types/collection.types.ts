export interface CollectionCreate {
    name: string;
    userId: string;
    description?: string | null;
}

export interface CollectCreateResponse {
  message: string;
  data: {
    id: string;
    name: string;
    description: string | null;
  };
}

export interface CollectionUpdate {
    name?: string;
    description?: string | null;
}
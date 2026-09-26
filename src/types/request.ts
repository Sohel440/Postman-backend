export type HttpMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE"
  | "HEAD"
  | "OPTIONS";

export interface RequestInput {
  id?: string;
  collectionId: string;
  folderId?: string | null;
  name: string;
  method: string;
  url: string;
  queryParams?: any;
  headers?: any;
  authorization?: any;
  body?: any;
}

export interface RequestCreateInput {
  name: string;
  collectionId: string;
  folderId?: string | null;
  method?: string;
  url?: string;
  queryParams?: any;
  headers?: any;
  authorization?: any;
  body?: any;
}

export interface RequestUpdateInput {
  name?: string;
  method?: string;
  url?: string;
  queryParams?: any;
  headers?: any;
  authorization?: any;
  body?: any;
  folderId?: string | null;
  collectionId?: string;
}

export interface RequestFilterParams {
  collectionId?: string;
  folderId?: string | null;
}

export interface RequestResponseData {
  id: string;
  collectionId: string;
  folderId: string | null;
  name: string;
  method: string;
  url: string;
  queryParams: any;
  headers: any;
  authorization: any;
  body: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface ServiceError {
  error: string;
  status: number;
}

export type RequestServiceResult<T> = { request: T } | ServiceError;


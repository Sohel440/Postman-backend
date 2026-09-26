import axios, { AxiosRequestConfig } from "axios";
import prisma from "../prisma.js";

export interface ExecuteRequestInput {
  method: string;
  url: string;
  queryParams?: Record<string, string>;
  headers?: Record<string, string>;
  authorization?: {
    type?: string;
    token?: string;
  };
  body?: unknown;
}

function sanitizeHeaders(headers: any): Record<string, any> {
  if (!headers) return {};
  try {
    if (typeof headers.toJSON === "function") {
      return headers.toJSON();
    }
    return JSON.parse(JSON.stringify(headers));
  } catch {
    const plain: Record<string, any> = {};
    if (typeof headers === "object") {
      for (const [key, value] of Object.entries(headers)) {
        if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
          plain[key] = value;
        } else {
          plain[key] = String(value);
        }
      }
    }
    return plain;
  }
}

function sanitizeBody(body: any): any {
  if (body === undefined || body === null) return null;
  try {
    return JSON.parse(JSON.stringify(body));
  } catch {
    return String(body);
  }
}

export const executeSavedRequest = async (
  userId: string,
  requestId: string,
) => {
  try {
    const request = await prisma.request.findFirst({
      where: {
        id: requestId,
        collection: {
          userId,
        },
      },
    });
    if (!request) {
      return {
        error: "Request not found",
        status: 404,
      };
    }

    // 2. Execute the request
    const result = await executeHttpRequest({
      method: request.method,
      url: request.url,

      queryParams: (request.queryParams as Record<string, string>) || {},

      headers: (request.headers as Record<string, string>) || {},

      authorization:
        (request.authorization as {
          type?: string;
          token?: string;
        }) || {},

      body: request.body,
    });

    try {
      await prisma.history.create({
        data: {
          userId,
          requestId: request.id,

          method: request.method,
          url: request.url,

          status: result.status,
          responseTime: result.responseTime,
          responseSize: result.responseSize,

          responseHeaders: result.headers,
          responseBody: result.body,
        },
      });
    } catch (histError) {
      console.warn("Failed to record request history:", histError);
    }

    return {
      data: result,
    };
  } catch (error) {
    throw error;
  }
};

export const executeUnsavedRequest = async (userId : string , data : ExecuteRequestInput) => {
    try {
        const result = await executeHttpRequest(data);
        try {
          await prisma.history.create({
              data:{
                  userId,
                  requestId: null,
                  method: data.method,
                  url: data.url,
                  status: result.status,
                  responseTime: result.responseTime,
                  responseSize: result.responseSize,
                  responseHeaders: result.headers, 
                  responseBody: result.body,
              }
          });
        } catch (histError) {
          console.warn("Failed to record unsaved request history:", histError);
        }

        return {
          data : result  
        };

    } catch (error) {
        throw error;
    }
}
const executeHttpRequest = async (data: ExecuteRequestInput) => {
  const startTime = Date.now();
  const config: AxiosRequestConfig = {
    method: (data.method || "GET").toUpperCase(),
    url: data.url,
    headers: {
      ...(data.headers || {}),
    },
    params: data.queryParams || {},
    validateStatus: () => true,
  };
  if (data.authorization?.type === "Bearer" && data.authorization?.token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${data.authorization.token}`,
    };
  }
  if (
    data.body !== undefined &&
    data.body !== null &&
    ["POST", "PUT", "PATCH"].includes((data.method || "").toUpperCase())
  ) {
    config.data = data.body;
  }
  try {
    const response = await axios(config);
    const responseTime = Date.now() - startTime;
    const responseBody = response.data;
    let responseSize = 0;
    try {
      responseSize = Buffer.byteLength(
        typeof responseBody === "string"
          ? responseBody
          : JSON.stringify(responseBody) || ""
      );
    } catch {
      responseSize = 0;
    }

    const headers = sanitizeHeaders(response.headers);
    const body = sanitizeBody(responseBody);

    return {
      status: response.status,
      responseTime,
      responseSize,
      headers,
      body,
    };
  } catch (error: any) {
    const responseTime = Date.now() - startTime;
    const headers = sanitizeHeaders(error.response?.headers);
    const body = sanitizeBody(
      error.response?.data || {
        message: error.message || "Request failed",
      }
    );

    return {
      status: error.response?.status || 500,
      statusText: error.response?.statusText || "Request failed",
      responseTime,
      responseSize: 0,
      headers,
      body,
    };
  }
};
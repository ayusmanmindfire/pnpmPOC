export interface StandardResponse<T = any> {
    statusCode: number;
    body: T;
    headers?: Record<string, string>;
  }
  
  export class ResponseUtils {
    static success<T>(data: T, message = 'Success'): StandardResponse<{ data: T; message: string }> {
      return {
        statusCode: 200,
        body: {
          data,
          message,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      };
    }
  
    static error(message: string, statusCode = 400): StandardResponse<{ error: string }> {
      return {
        statusCode,
        body: {
          error: message,
        },
      };
    }
  }
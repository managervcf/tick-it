export interface CommonErrorResponse {
  errors: {
    message: string;
    field?: string;
  }[];
}

export abstract class CustomError extends Error {
  abstract statusCode: number;
  abstract serializeErrors(): CommonErrorResponse;

  constructor(message: string) {
    super(message);
    // Only because we are extending a bulit-in class
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}

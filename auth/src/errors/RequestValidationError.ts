import { ValidationError } from 'express-validator';
import { CustomError } from './CustomError';

export class RequestValidationError extends CustomError {
  statusCode = 400;

  constructor(public errors: ValidationError[]) {
    super('Request validation error');
    // Only because we are extending a bulit-in class
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors() {
    return {
      errors: this.errors.map(error => ({
        message: error.msg,
        field: error.param,
      })),
    };
  }
}

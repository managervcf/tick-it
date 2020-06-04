import { CustomError } from './CustomError';

export class NotFoundError extends CustomError {
  statusCode = 404;

  constructor() {
    super('Route not found.');
    // Only because we are extending a bulit-in class
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors() {
    return { errors: [{ message: 'Not found' }] };
  }
}

import { Request, Response, NextFunction } from 'express';
import { CustomError, CommonErrorResponse } from '../errors/CustomError';

// Define error handling middleware
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Throw custom error
  if (err instanceof CustomError) {
    return res
      .status(err.statusCode)
      .send(err.serializeErrors() as CommonErrorResponse);
  }
  // Throw generic error
  else {
    return res.status(400).send({
      errors: [{ message: 'Something went wrong' }],
    } as CommonErrorResponse);
  }
};

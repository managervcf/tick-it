import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { DatabaseConnectionError } from '../errors/DatabaseConnectionError';
import { RequestValidationError } from '../errors/RequestValidationError';

// Define a router
const signUpRouter = Router();

// Define middleware validating request body
const validationMiddleware = [
  body('email').isEmail().withMessage('Email must be valid'),
  body('password')
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage('Password must be between 4 and 20 characters'),
];

// Define route handler
signUpRouter.post(
  '/api/users/signup',
  validationMiddleware,
  async (req: Request, res: Response) => {
    // Pull off errors that might occur and throw if present
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }

    // Pull off email and password
    const { email, password } = req.body;

    console.log(`(Auth) Creating a user...`);
    throw new DatabaseConnectionError();

    res.send({ created: true });
  }
);

export { signUpRouter };

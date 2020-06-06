import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { RequestValidationError } from '../errors/RequestValidationError';
import { BadRequestError } from '../errors/BadRequestError';

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

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new BadRequestError('Email in use');
    }

    // Create new user
    const newUser = User.build({ email, password });
    await newUser.save();

    // Generate jsonwebtoken and store is on session object
    const userJwt = jwt.sign(
      {
        id: newUser.id,
        email: newUser.email,
      },
      process.env.JWT_KEY!
    );
    req.session = { jwt: userJwt };

    return res.status(201).send(newUser);
  }
);

export { signUpRouter };

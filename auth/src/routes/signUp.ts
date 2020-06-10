import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { BadRequestError } from '../errors/BadRequestError';
import { validateRequest } from '../middlewares/validateRequest';

// Define a router
const signUpRouter = Router();

// Define middleware validating request body
const bodyValidationMiddleware = [
  body('email').isEmail().withMessage('Email must be valid'),
  body('password')
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage('Password must be between 4 and 20 characters'),
];

// Define route handler
signUpRouter.post(
  '/api/users/signup',
  bodyValidationMiddleware,
  validateRequest,
  async (req: Request, res: Response) => {
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

    // Generate jsonwebtoken
    const userJwt = jwt.sign(
      {
        id: newUser.id,
        email: newUser.email,
      },
      process.env.JWT_KEY!
    );

    // Store jwt on the session object
    req.session = { jwt: userJwt };

    return res.status(201).send(newUser);
  }
);

export { signUpRouter };

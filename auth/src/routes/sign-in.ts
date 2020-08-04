import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { validateRequest, BadRequestError } from '@tick-it/common';
import { User } from '../models/user';
import { Password } from '../utils/password';

const signInRouter = Router();

// Define middleware validating request body
const bodyValidationMiddleware = [
  body('email').isEmail().withMessage('Email must be valid'),
  body('password').trim().notEmpty().withMessage('Password must be provided'),
];

signInRouter.post(
  '/api/users/signin',
  bodyValidationMiddleware,
  validateRequest,
  async (req: Request, res: Response) => {
    // Pull off email and password
    const { email, password } = req.body;

    // Find a user in a database
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError('Invalid credentials');
    }

    // Compare passwords
    const passwordValid = await Password.compare(
      existingUser.password,
      password
    );
    if (!passwordValid) {
      throw new BadRequestError('Invalid credentials');
    }

    // Generate jsonwebtoken
    const userJwt = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_KEY!
    );

    // Store jwt on the session object
    req.session = { jwt: userJwt };
    res.status(200).send(existingUser);
  }
);

export { signInRouter };

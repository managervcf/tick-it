import express from 'express';
// Package handling async errors
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { currentUserRouter } from './routes/currentUser';
import { signUpRouter } from './routes/signUp';
import { signInRouter } from './routes/signIn';
import { signOutRouter } from './routes/signOut';
import { errorHandler, NotFoundError } from '@tick-it/common';

const app = express();

// Trust traffic from nginx
app.set('trust proxy', true);

// User cookie session
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);

// Parse the body of the request
app.use(json());

// Routes
app.use(currentUserRouter);
app.use(signUpRouter);
app.use(signInRouter);
app.use(signOutRouter);

// '404 Not Found' error handling
app.all('*', async () => {
  throw new NotFoundError();
});

// Error handling middleware
app.use(errorHandler);

export { app };

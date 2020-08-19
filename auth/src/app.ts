import express from 'express';
// Package handling async errors
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { currentUserRouter } from './routes/current-user';
import { signUpRouter } from './routes/sign-up';
import { signInRouter } from './routes/sign-in';
import { signOutRouter } from './routes/sign-out';
import { errorHandler, NotFoundError } from '@tick-it/common';

const app = express();

// Trust traffic from nginx
app.set('trust proxy', true);

// User cookie session
app.use(
  cookieSession({
    signed: false,
    secure: false,
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

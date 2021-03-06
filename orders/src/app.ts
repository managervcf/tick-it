import express from 'express';
// Package handling async errors
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@tick-it/common';
import { createOrderRouter } from './routes/new';
import { showOrderRouter } from './routes/show';
import { indexOrderRouter } from './routes';
import { cancelOrderRouter } from './routes/cancel';

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

// Use middleware from @tick-it/common library
app.use(currentUser);

// Routes
app.use(createOrderRouter);
app.use(showOrderRouter);
app.use(indexOrderRouter);
app.use(cancelOrderRouter);

// '404 Not Found' error handling
app.all('*', async () => {
  throw new NotFoundError();
});

// Error handling middleware
app.use(errorHandler);

export { app };

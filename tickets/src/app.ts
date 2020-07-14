import express from 'express';
// Package handling async errors
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@tick-it/common';
import { createTicketRouter } from './routes/new';
import { showTicketRouter } from './routes/show';
import { getTicketsRouter } from './routes';
import { updateTicketRouter } from './routes/update';

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

// Use middleware from @tick-it/common library
app.use(currentUser);

// Routes
app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(getTicketsRouter);
app.use(updateTicketRouter);

// '404 Not Found' error handling
app.all('*', async () => {
  throw new NotFoundError();
});

// Error handling middleware
app.use(errorHandler);

export { app };

import express from 'express';
// Package handling async errors
import 'express-async-errors';
import { json } from 'body-parser';
import { currentUserRouter } from './routes/currentUser';
import { signUpRouter } from './routes/signUp';
import { signInRouter } from './routes/signIn';
import { signOutRouter } from './routes/signOut';
import { errorHandler } from './middlewares/errorHandler';
import { NotFoundError } from './errors/NotFoundError';

const app = express();

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

const port = 3000;
app.listen(port, () => console.log(`(Auth) Listening on port ${port}...`));

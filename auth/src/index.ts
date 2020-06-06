import express from 'express';
// Package handling async errors
import 'express-async-errors';
import { json } from 'body-parser';
import { connect } from 'mongoose';
import cookieSession from 'cookie-session';
import { currentUserRouter } from './routes/currentUser';
import { signUpRouter } from './routes/signUp';
import { signInRouter } from './routes/signIn';
import { signOutRouter } from './routes/signOut';
import { errorHandler } from './middlewares/errorHandler';
import { NotFoundError } from './errors/NotFoundError';
import { DatabaseConnectionError } from './errors/DatabaseConnectionError';

const app = express();

// Trust traffic from nginx
app.set('trust proxy', true);

// User cookie session
app.use(
  cookieSession({
    signed: false,
    secure: true,
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

/**
 * Function that starts the server.
 */
const start = async () => {
  /**
   * Check evironment variables
   */
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY env variable not defined');
  }

  try {
    /**
     * Connect to database
     */
    await connect('mongodb://auth-mongo-srv:27017/auth', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log('(Auth) Connected to MongoDB');
  } catch (error) {
    throw new DatabaseConnectionError();
  } finally {
    const port = 3000;
    app.listen(port, () => console.log(`(Auth) Listening on port ${port}...`));
  }
};

start();

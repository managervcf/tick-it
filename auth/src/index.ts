import { app } from './app';
import { connect } from 'mongoose';
import { DatabaseConnectionError } from './errors/DatabaseConnectionError';

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

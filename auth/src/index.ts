import { app } from './app';
import { connect } from 'mongoose';
import { DatabaseConnectionError } from '@tick-it/common';

/**
 * Function that starts the server.
 */
const start = async () => {
  console.log('(Auth) Starting up...');
  /**
   * Check evironment variables
   */
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY env variable not defined');
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URO env variable not defined');
  }

  try {
    /**
     * Connect to database
     */
    await connect(process.env.MONGO_URI, {
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

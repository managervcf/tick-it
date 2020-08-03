import { app } from './app';
import { connect } from 'mongoose';
import { DatabaseConnectionError } from '@tick-it/common';
import { natsWrapper } from './nats-wrapper';
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

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI env variable not defined');
  }

  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL env variable not defined');
  }

  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID env variable not defined');
  }

  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID env variable not defined');
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

    console.log('(Orders) Connected to MongoDB');

    /**
     * Connect to NATS Streaming Server
     */
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );

    /**
     * Perform a graceful shutdown
     */
    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed');
      process.exit();
    });
    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());
  } catch (error) {
    throw new DatabaseConnectionError();
  } finally {
    const port = 3000;
    app.listen(port, () =>
      console.log(`(Orders) Listening on port ${port}...`)
    );
  }
};

start();

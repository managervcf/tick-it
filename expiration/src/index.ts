import { DatabaseConnectionError } from '@tick-it/common';
import { natsWrapper } from './nats-wrapper';
import { OrderCreatedListener } from './events/listeners/order-created-listener';

/**
 * Function that starts the server.
 */
const start = async () => {
  /**
   * Check evironment variables
   */
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

    /**
     * Setup listeners
     */
    new OrderCreatedListener(natsWrapper.client).listen();
  } catch (error) {
    throw new DatabaseConnectionError();
  }
};

start();

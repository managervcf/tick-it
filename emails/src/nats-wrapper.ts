import nats, { Stan } from 'node-nats-streaming';

class NatsWrapper {
  // Define but don't initialize _client
  private _client?: Stan;

  // Getter makes sure that we called this.connect() first
  get client() {
    if (!this._client) {
      throw new Error('Cannot access NATS client before connecting');
    } else {
      return this._client;
    }
  }

  // Connection function wrapped in a Promise
  connect(clusterId: string, clientId: string, url: string) {
    this._client = nats.connect(clusterId, clientId, { url });

    return new Promise((resolve, reject) => {
      this.client.on('connect', () => {
        console.log('(Emails) Connected to NATS');
        resolve();
      });

      this.client.on('error', err => {
        reject(err);
      });
    });
  }
}

export const natsWrapper = new NatsWrapper();

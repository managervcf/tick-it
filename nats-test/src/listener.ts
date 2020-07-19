import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import { TicketCreatedListener } from './events/ticket-created-listener';

// Clear the console so the logs area clearly visible
console.clear();

const sc = nats.connect('tick-it', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222',
});

sc.on('connect', () => {
  console.log('Listener connected to NATS');

  sc.on('close', () => {
    console.log('NATS connection closed');
    process.exit();
  });

  new TicketCreatedListener(sc).listen();
});

process.on('SIGINT', () => sc.close());
process.on('SIGTERM', () => sc.close());

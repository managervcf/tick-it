import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';

// Clear the console so the logs area clearly visible
console.clear();

const sc = nats.connect('tick-it', 'abc', {
  url: 'http://localhost:4222',
});

sc.on('connect', async () => {
  console.log('Publisher connected to NATS');

  // Generate random ticket
  const data = {
    id: '123',
    title: 'concert',
    price: 20,
  };

  const publisher = new TicketCreatedPublisher(sc);

  await publisher.publish(data);

  // // Publish an event
  // sc.publish('ticket:created', data, () => {
  //   console.log('Event published');
  // });
});

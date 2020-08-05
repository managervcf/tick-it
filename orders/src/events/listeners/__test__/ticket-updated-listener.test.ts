import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { TicketUpdatedEvent } from '@tick-it/common';
import { TicketUpdatedListener } from '../ticket-updated-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  // Create an instance of a listener
  const listener = new TicketUpdatedListener(natsWrapper.client);

  // Create a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 30,
  });

  await ticket.save();

  // Create a fake data event
  const data: TicketUpdatedEvent['data'] = {
    id: ticket.id,
    version: ticket.version + 1,
    title: 'new concert',
    price: 60,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  // Create a fake message object
  // @ts-ignore
  const message: Message = {
    ack: jest.fn(),
  };

  // Returns
  return { listener, data, message, ticket };
};

it('finds, updates and saves a ticket', async () => {
  const { listener, data, message, ticket } = await setup();

  // Call the onMessage function with the data + message objects
  await listener.onMessage(data, message);

  // Write assertions to make sure a ticket was created
  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
  expect(updatedTicket!.version).toEqual(data.version);
});

it('acks the message', async () => {
  const { listener, data, message } = await setup();

  // Call the onMessage function with the data + message objects
  await listener.onMessage(data, message);

  // Write assertions to make sure ack functions is called
  expect(message.ack).toHaveBeenCalled();
});

it('does not call ack if the event has a skipped version number', async () => {
  const { listener, data, message } = await setup();

  data.version = 10;

  try {
    await listener.onMessage(data, message);
  } catch (err) {}

  expect(message.ack).not.toHaveBeenCalled();
});

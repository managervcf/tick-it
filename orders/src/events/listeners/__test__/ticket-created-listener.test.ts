import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { TicketCreatedEvent } from '@tick-it/common';
import { TicketCreatedListener } from '../ticket-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  // Create an instance of a listener
  const listener = new TicketCreatedListener(natsWrapper.client);

  // Create a fake data event
  const data: TicketCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    title: 'concert',
    price: 49,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  // Create a fake message object
  // @ts-ignore
  const message: Message = {
    ack: jest.fn(),
  };

  return { listener, data, message };
};

it('creates and saves a ticket', async () => {
  const { listener, data, message } = await setup();

  // Call the onMessage function with the data + message objects
  await listener.onMessage(data, message);

  // Write assertions to make sure a ticket was created
  const ticket = await Ticket.findById(data.id);

  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
});

it('acks the message', async () => {
  const { listener, data, message } = await setup();

  // Call the onMessage function with the data + message objects
  await listener.onMessage(data, message);

  // Write assertions to make sure ack functions is called
  expect(message.ack).toHaveBeenCalled();
});

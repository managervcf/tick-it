import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { OrderCreatedEvent, OrderStatus } from '@tick-it/common';
import { OrderCreatedListener } from '../order-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  // Create an instance of a listener
  const listener = new OrderCreatedListener(natsWrapper.client);

  // Create and save a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 92,
    userId: 'asfdasf',
  });
  await ticket.save();

  // Create a fake data event
  const data: OrderCreatedEvent['data'] = {
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    userId: 'sdfsdf',
    status: OrderStatus.Created,
    expiresAt: 'asdfa',
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };

  // Create a fake message object
  // @ts-ignore
  const message: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, data, message };
};

it('sets the orderId and therefore locking the ticket', async () => {
  const { listener, message, ticket, data } = await setup();

  await listener.onMessage(data, message);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).toEqual(data.id);
});

it('acks the message', async () => {
  const { listener, message, data } = await setup();

  await listener.onMessage(data, message);

  expect(message.ack).toHaveBeenCalled();
});

it('publishes a ticket updated event', async () => {
  const { listener, message, ticket, data } = await setup();

  await listener.onMessage(data, message);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const ticketUpdatedData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );

  expect(ticketUpdatedData.orderId).toEqual(data.id);
});

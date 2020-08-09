import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { OrderCreatedEvent, OrderStatus } from '@tick-it/common';
import { OrderCreatedListener } from '../order-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Order } from '../../../models/orders';

const setup = async () => {
  // Create an instance of a listener
  const listener = new OrderCreatedListener(natsWrapper.client);

  // Create a fake data event
  const data: OrderCreatedEvent['data'] = {
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    userId: 'sdfsdf',
    status: OrderStatus.Created,
    expiresAt: 'asdfa',
    ticket: {
      id: 'safdasdf',
      price: 10,
    },
  };

  // Create a fake message object
  // @ts-ignore
  const message: Message = {
    ack: jest.fn(),
  };

  return { listener, data, message };
};

it('replicates the order info', async () => {
  const { listener, message, data } = await setup();

  await listener.onMessage(data, message);

  const order = await Order.findById(data.id);

  expect(order!.price).toEqual(data.ticket.price);
});

it('acks the message', async () => {
  const { listener, message, data } = await setup();

  await listener.onMessage(data, message);

  expect(message.ack).toHaveBeenCalled();
});

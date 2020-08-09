import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { OrderCancelledEvent, OrderStatus } from '@tick-it/common';
import { natsWrapper } from '../../../nats-wrapper';
import { Order } from '../../../models/orders';
import { OrderCancelledListener } from '../order-cancelled-listener';

const setup = async () => {
  // Create an instance of a listener
  const listener = new OrderCancelledListener(natsWrapper.client);

  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    price: 10,
    userId: 'asdfsafd',
    version: 0,
  });

  await order.save();

  // Create a fake data event
  const data: OrderCancelledEvent['data'] = {
    id: order.id,
    version: order.version + 1,
    ticket: {
      id: 'safdasdf',
    },
  };

  // Create a fake message object
  // @ts-ignore
  const message: Message = {
    ack: jest.fn(),
  };

  return { listener, data, message };
};

it('updates the order status to cancelled', async () => {
  const { listener, message, data } = await setup();

  await listener.onMessage(data, message);

  const order = await Order.findById(data.id);

  expect(order!.status).toEqual(OrderStatus.Cancelled);
});

it('acks the message', async () => {
  const { listener, message, data } = await setup();

  await listener.onMessage(data, message);

  expect(message.ack).toHaveBeenCalled();
});

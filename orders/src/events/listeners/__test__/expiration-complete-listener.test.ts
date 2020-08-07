import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { ExpirationCompleteListener } from '../expiration-complete-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/ticket';
import { Order, OrderStatus } from '../../../models/order';
import { ExpirationCompleteEvent } from '@tick-it/common';

const setup = async () => {
  const listener = new ExpirationCompleteListener(natsWrapper.client);

  const ticket = Ticket.build({
    title: 'new title',
    price: 20,
    id: mongoose.Types.ObjectId().toHexString(),
  });

  await ticket.save();

  const order = Order.build({
    status: OrderStatus.Created,
    expiresAt: new Date(),
    userId: 'sdfsfd',
    ticket,
  });

  await order.save();

  const data: ExpirationCompleteEvent['data'] = {
    orderId: order.id,
  };

  // @ts-ignore
  const message: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, order, data, message };
};

it('updates the order status to cancelled', async () => {
  const { listener, ticket, order, data, message } = await setup();
  await listener.onMessage(data, message);

  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('emit an order:cancelled event', async () => {
  const { listener, ticket, order, data, message } = await setup();
  await listener.onMessage(data, message);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const eventData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );

  expect(eventData.id).toEqual(order.id);
});

it('ack the message', async () => {
  const { listener, ticket, order, data, message } = await setup();
  await listener.onMessage(data, message);

  expect(message.ack).toHaveBeenCalled();
});

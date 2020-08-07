import { Message } from 'node-nats-streaming';
import {
  Listener,
  ExpirationCompleteEvent,
  Subjects,
  NotFoundError,
  OrderStatus,
} from '@tick-it/common';
import { queueGroupName } from './queue-group-name';
import { Order } from '../../models/order';
import { OrderCancelledPublisher } from '../publishers/order-cancelled-publisher';

export class ExpirationCompleteListener extends Listener<
  ExpirationCompleteEvent
> {
  readonly subject = Subjects.ExpirationComplete;
  queueGroupName = queueGroupName;

  async onMessage(data: ExpirationCompleteEvent['data'], message: Message) {
    const foundOrder = await Order.findById(data.orderId).populate('ticket');

    if (!foundOrder) {
      throw new NotFoundError();
    }

    if (foundOrder.status === OrderStatus.Complete) {
      return message.ack();
    }

    // Update status
    foundOrder.set({
      status: OrderStatus.Cancelled,
    });

    await foundOrder.save();

    await new OrderCancelledPublisher(this.client).publish({
      id: foundOrder.id,
      version: foundOrder.version,
      ticket: {
        id: foundOrder.ticket.id,
      },
    });

    message.ack();
  }
}

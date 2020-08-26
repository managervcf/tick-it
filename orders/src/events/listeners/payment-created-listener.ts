import {
  Listener,
  PaymentCreatedEvent,
  Subjects,
  NotFoundError,
  OrderStatus,
} from '@tick-it/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Order } from '../../models/order';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: PaymentCreatedEvent['data'], message: Message) {
    const foundOrder = await Order.findById(data.order.id);

    if (!foundOrder) {
      throw new NotFoundError();
    }

    foundOrder.set({
      status: OrderStatus.Complete,
    });

    await foundOrder.save();

    // Emit an event for order updated (ideally, but not used in this app)

    message.ack();
  }
}

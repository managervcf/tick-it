import { Message } from 'node-nats-streaming';
import {
  Listener,
  OrderCancelledEvent,
  Subjects,
  NotFoundError,
} from '@tick-it/common';
import { queueGroupName } from './queue-group-name';
import { Ticket } from '../../models/ticket';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent['data'], message: Message) {
    const foundTicket = await Ticket.findById(data.ticket.id);

    if (!foundTicket) {
      throw new NotFoundError();
    }

    foundTicket.set({ orderId: undefined });

    await foundTicket.save();

    // Publish an event
    await new TicketUpdatedPublisher(this.client).publish({
      id: foundTicket.id,
      title: foundTicket.title,
      price: foundTicket.price,
      userId: foundTicket.userId,
      orderId: foundTicket.orderId,
      version: foundTicket.version,
    });

    message.ack();
  }
}

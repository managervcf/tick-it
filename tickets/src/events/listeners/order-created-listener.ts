import { Message } from 'node-nats-streaming';
import {
  Listener,
  OrderCreatedEvent,
  Subjects,
  NotFoundError,
} from '@tick-it/common';
import { queueGroupName } from './queue-group-name';
import { Ticket } from '../../models/ticket';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], message: Message) {
    // Find the ticket that the order is reserving
    const foundTicket = await Ticket.findById(data.ticket.id);

    // If no ticket, throw error
    if (!foundTicket) {
      throw new NotFoundError();
    }

    // Mark the ticket as being reserved by setting its orderId property
    foundTicket.set({ orderId: data.id });

    // Save the ticket
    await foundTicket.save();

    // Emit an event because the ticket has been updated
    await new TicketUpdatedPublisher(this.client).publish({
      id: foundTicket.id,
      title: foundTicket.title,
      price: foundTicket.price,
      userId: foundTicket.userId,
      orderId: foundTicket.orderId,
      version: foundTicket.version,
    });

    // Acknowledge the message
    message.ack();
  }
}

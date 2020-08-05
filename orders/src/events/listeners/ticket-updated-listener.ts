import { Message } from 'node-nats-streaming';
import {
  Subjects,
  Listener,
  TicketUpdatedEvent,
  NotFoundError,
} from '@tick-it/common';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  /**
   * The onMessage function needs to save the updated ticket into
   * order's service database. After saving updated record to the
   * database, this function needs to call message.ack() to
   * acknowledge the incoming event. That's a classic example of
   * data duplication between microservices.
   *
   * @param data Ticket info
   * @param message NATS message
   */
  async onMessage(data: TicketUpdatedEvent['data'], message: Message) {
    const foundTicket = await Ticket.findById(data.id);

    if (!foundTicket) {
      throw new NotFoundError();
    }

    const { title, price } = data;
    foundTicket.set({ title, price });
    await foundTicket.save();

    message.ack();
  }
}

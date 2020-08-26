import { Message } from 'node-nats-streaming';
import {
  Listener,
  PaymentCreatedEvent,
  Subjects,
  BadRequestError,
} from '@tick-it/common';
import { queueGroupName } from './queue-group-name';
import { Mail } from '../../api/sendgrid';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: PaymentCreatedEvent['data'], message: Message) {
    try {
      // Send email to the user
      await Mail.send(data);
    } catch (err) {
      throw new BadRequestError('Could not sent email');
    }
    // Acknowledge the message
    message.ack();
  }
}

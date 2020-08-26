import sendgrid, { MailDataRequired } from '@sendgrid/mail';
import { PaymentCreatedEvent } from '@tick-it/common';

// Set API key
sendgrid.setApiKey(process.env.SENDGRID_API_KEY!);

export class Mail {
  static async send({ chargeId, order, user }: PaymentCreatedEvent['data']) {
    const email: MailDataRequired = {
      to: user.email,
      from: 'admin@tickit.com',
      subject: `TickIt - Hi ${user.email}, have fun during the concert`,
      text: `Congratulations ${user.email}. You bought a ticket for $${order.price}. Your payment number is ${chargeId}. Your order number is ${order.id}`,
    };

    await sendgrid.send(email);
  }
}

import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Order, OrderStatus } from '../../models/order';
import { Ticket } from '../../models/ticket';

it('returns an error if the ticket does not exist', async () => {
  const ticketId = mongoose.Types.ObjectId();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.getAuthCookie())
    .send({ ticketId })
    .expect(404);
});

it('returns an error when ticket is already reserved', async () => {
  const newTicket = Ticket.build({
    title: 'test',
    price: 40,
  });

  await newTicket.save();

  const newOrder = Order.build({
    userId: 'sfafasfd',
    ticket: newTicket,
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });

  await newOrder.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.getAuthCookie())
    .send({ ticketId: newTicket.id })
    .expect(400);
});

it('reserves a ticket', async () => {
  const newTicket = Ticket.build({
    title: 'test',
    price: 40,
  });

  await newTicket.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.getAuthCookie())
    .send({ ticketId: newTicket.id })
    .expect(201);
});

it.todo('emits an order created event');

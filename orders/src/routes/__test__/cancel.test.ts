import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { Order, OrderStatus } from '../../models/order';
import { natsWrapper } from '../../nats-wrapper';

it('marks an order as cancelled', async () => {
  // Create a ticket with Ticket model
  const newTicket = Ticket.build({
    title: 'titleOfNewTicket',
    price: 30,
  });

  await newTicket.save();

  // Save user credentials
  const userAuth = global.getAuthCookie();

  // Make a request to create an order
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', userAuth)
    .send({ ticketId: newTicket.id })
    .expect(201);

  // Make a request to cancel the order
  await request(app)
    .patch(`/api/orders/${order.id}`)
    .set('Cookie', userAuth)
    .send()
    .expect(202);

  // Expectation to make sure the thing is cancelled
  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('emits an order cancelled event', async () => {
  // Create a ticket with Ticket model
  const newTicket = Ticket.build({
    title: 'titleOfNewTicket',
    price: 30,
  });

  await newTicket.save();

  // Save user credentials
  const userAuth = global.getAuthCookie();

  // Make a request to create an order
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', userAuth)
    .send({ ticketId: newTicket.id })
    .expect(201);

  // Make a request to cancel the order
  await request(app)
    .patch(`/api/orders/${order.id}`)
    .set('Cookie', userAuth)
    .send()
    .expect(202);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

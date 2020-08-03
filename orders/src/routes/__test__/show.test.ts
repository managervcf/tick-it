import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';

it('fetches and order', async () => {
  // Create a ticket
  const ticket = Ticket.build({ title: 'titlenewticket', price: 39 });
  await ticket.save();

  // Create a user authentication cookie
  const userAuth = global.getAuthCookie();

  // Make a request to build an order with this ticket
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', userAuth)
    .send({ ticketId: ticket.id })
    .expect(201);

  // Make request to fetch the order
  const { body: fetchOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', userAuth)
    .send()
    .expect(200);

  expect(fetchOrder.id).toEqual(order.id);
});

it('returns an error when one user is trying to fetch another users orders', async () => {
  // Create a ticket
  const ticket = Ticket.build({ title: 'titlenewticket', price: 39 });
  await ticket.save();

  // Create a user authentication cookie
  const userAuth = global.getAuthCookie();

  // Make a request to build an order with this ticket
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', userAuth)
    .send({ ticketId: ticket.id })
    .expect(201);

  // Make request to fetch the order
  const { body: fetchOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', global.getAuthCookie())
    .send()
    .expect(401);
});

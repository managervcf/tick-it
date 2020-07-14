import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/Ticket';

it('has a route handler listening to /api/tickets for post requests', async () => {
  const response = await request(app).post('/api/tickets').send({});
  expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async () => {
  await request(app).post('/api/tickets').send({}).expect(401);
});

it('returns a status other than 401 if the user is signed in', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.getAuthCookie())
    .send({});
  expect(response.status).not.toEqual(401);
});

it('returns an error when invalid title is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.getAuthCookie())
    .send({ title: '', price: 10 })
    .expect(400);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.getAuthCookie())
    .send({ price: 10 })
    .expect(400);
});

it('returns an error when invalid price is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.getAuthCookie())
    .send({ title: 'ticket title', price: 'asdfa' })
    .expect(400);
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.getAuthCookie())
    .send({ title: 'ticket title', price: -10 })
    .expect(400);
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.getAuthCookie())
    .send({ title: 'ticket title' })
    .expect(400);
});

it('creates a ticket with valid inputs', async () => {
  const title = 'Test Title';
  const price = 20;

  // Add a a check to make sure ticket was saved
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  await request(app)
    .post('/api/tickets')
    .send({ title, price })
    .set('Cookie', global.getAuthCookie())
    .expect(201);

  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].title).toEqual(title);
  expect(tickets[0].price).toEqual(price);
});

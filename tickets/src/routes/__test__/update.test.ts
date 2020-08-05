import request from 'supertest';
import { app } from '../../app';
import { Types } from 'mongoose';
import { natsWrapper } from '../../nats-wrapper';
import { Ticket } from '../../models/ticket';

it('returns a 404 if provided id does not exist', async () => {
  const id = Types.ObjectId().toHexString();
  const [title, price] = ['random title', 39];

  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.getAuthCookie())
    .send({ title, price })
    .expect(404);
});

it('returns a 401 if the user is not autheniticated', async () => {
  const id = Types.ObjectId().toHexString();
  const [title, price] = ['random title', 39];

  await request(app)
    .put(`/api/tickets/${id}`)
    .send({ title, price })
    .expect(401);
});

it('returns a 401 if the user does not own the ticket', async () => {
  const [title, price] = ['random title', 39];

  const response = await request(app)
    .post(`/api/tickets`)
    .set('Cookie', global.getAuthCookie())
    .send({ title, price });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', global.getAuthCookie())
    .send({ title: 'asdfs', price: 40 })
    .expect(401);
});

it('returns a 400 if the user provides an invalid title or price', async () => {
  const [title, price] = ['random title', 39];
  const cookie = global.getAuthCookie();

  const response = await request(app)
    .post(`/api/tickets`)
    .set('Cookie', cookie)
    .send({ title, price });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: '', price: 40 })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'sadfasdfasdf', price: -100 })
    .expect(400);
});

it('updates the tickets provided valid inputs', async () => {
  const [title, price] = ['random old title', 39];
  const [newTitle, newPrice] = ['random new title', 40];
  const cookie = global.getAuthCookie();

  const response = await request(app)
    .post(`/api/tickets`)
    .set('Cookie', cookie)
    .send({ title, price });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: newTitle, price: newPrice })
    .expect(200);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send();

  expect(ticketResponse.body.title).toEqual(newTitle);
  expect(ticketResponse.body.price).toEqual(newPrice);
});

it('publishes an event', async () => {
  const [title, price] = ['random old title', 39];
  const [newTitle, newPrice] = ['random new title', 40];
  const cookie = global.getAuthCookie();

  const response = await request(app)
    .post(`/api/tickets`)
    .set('Cookie', cookie)
    .send({ title, price });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: newTitle, price: newPrice })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('rejects updates if the ticket is reserved', async () => {
  const [title, price] = ['random old title', 39];
  const [newTitle, newPrice] = ['random new title', 40];
  const cookie = global.getAuthCookie();

  const response = await request(app)
    .post(`/api/tickets`)
    .set('Cookie', cookie)
    .send({ title, price });

  const ticket = await Ticket.findById(response.body.id);

  ticket!.set({ orderId: Types.ObjectId().toHexString() });
  await ticket!.save();

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: newTitle, price: newPrice })
    .expect(400);
});

import request from 'supertest';
import { app } from '../../app';

const createTicket = () => {
  const [title, price] = ['random title', 30];

  return request(app)
    .post('/api/tickets')
    .set('Cookie', global.getAuthCookie())
    .send({ title, price })
    .expect(201);
};

it('can fetch a list of tickets', async () => {
  // Create 3 tickets
  await createTicket();
  await createTicket();
  await createTicket();

  // Fetch tickets
  const response = await request(app).get('/api/tickets').send().expect(200);

  expect(response.body.length).toEqual(3);
});

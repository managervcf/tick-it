import request from 'supertest';
import { app } from '../../app';
import mongoose, { mongo } from 'mongoose';
import { Order } from '../../models/orders';
import { OrderStatus } from '@tick-it/common';
import { stripe } from '../../stripe';

jest.mock('../../stripe');

it('returns a 404 when trying to purchase an order that does not exist', async () => {
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.getAuthCookie())
    .send({
      token: 'asfdsadfsaf',
      orderId: mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it('returns a 401 when trying to purchase an order that does not belong to the user ', async () => {
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 20,
    status: OrderStatus.Created,
  });

  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.getAuthCookie())
    .send({
      token: 'asfdsadfsaf',
      orderId: order.id,
    })
    .expect(401);
});

it('returns a 400 when trying to purchase a cancelled order', async () => {
  const userId = mongoose.Types.ObjectId().toHexString();

  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price: 20,
    status: OrderStatus.Cancelled,
  });

  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.getAuthCookie(userId))
    .send({
      token: 'asfdsadfsaf',
      orderId: order.id,
    })
    .expect(400);
});

it('creates a 204 with valid inputs', async () => {
  const userId = mongoose.Types.ObjectId().toHexString();

  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price: 20,
    status: OrderStatus.Created,
  });

  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.getAuthCookie(userId))
    .send({
      token: 'tok_visa',
      orderId: order.id,
    })
    .expect(201);

  const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];

  expect(chargeOptions.source).toEqual('tok_visa');
  expect(chargeOptions.currency).toEqual('usd');
  expect(chargeOptions.amount).toEqual(20 * 100);
});

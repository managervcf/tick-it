import { Request, Response, Router } from 'express';
import { body } from 'express-validator';
import { Types } from 'mongoose';
import {
  requireAuth,
  validateRequest,
  NotFoundError,
  OrderStatus,
  BadRequestError,
} from '@tick-it/common';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';
import { natsWrapper } from '../nats-wrapper';
import { Ticket } from '../models/ticket';
import { Order } from '../models/order';

const EXPIRATION_WINDOW_SECONDS = 0.5 * 60;

const createOrderRouter = Router();

const bodyValidators = [
  body('ticketId')
    .not()
    .isEmpty()
    // Check if provided id is a valid MongoDB id
    .custom((input: string) => Types.ObjectId.isValid(input))
    .withMessage('Ticket id must be provided'),
];

createOrderRouter.post(
  '/api/orders',
  requireAuth,
  bodyValidators,
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;

    // Find the ticket user is trying to order in the database
    const foundTicket = await Ticket.findById(ticketId);
    if (!foundTicket) {
      throw new NotFoundError();
    }

    // Make sure the ticket has not yet been reserved
    const isReserved = await foundTicket.isReserved();
    if (isReserved) {
      throw new BadRequestError('Ticket is already reserved');
    }

    // Calculate an expiration date for the order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    // Build the order and save it to the database
    const newOrder = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket: foundTicket,
    });
    await newOrder.save();

    // Publish an event saying that order has been created
    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: newOrder.id,
      version: newOrder.version,
      status: newOrder.status,
      userId: newOrder.userId,
      expiresAt: newOrder.expiresAt.toISOString(),
      ticket: {
        id: foundTicket.id,
        price: foundTicket.price,
      },
    });

    res.status(201).send(newOrder);
  }
);

export { createOrderRouter };

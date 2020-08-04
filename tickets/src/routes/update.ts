import { Request, Response, Router } from 'express';
import { body } from 'express-validator';
import {
  NotAuthorizedError,
  NotFoundError,
  validateRequest,
  requireAuth,
} from '@tick-it/common';
import { Ticket } from '../models/ticket';
import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publisher';
import { natsWrapper } from '../nats-wrapper';

const validateBody = [
  body('title').notEmpty().withMessage('Title is required'),
  body('price')
    .isFloat({ gt: 0 })
    .notEmpty()
    .withMessage('Price is required and must be greater than 0'),
];

const updateTicketRouter = Router();

updateTicketRouter.put(
  '/api/tickets/:id',
  requireAuth,
  validateBody,
  validateRequest,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      throw new NotFoundError();
    }

    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    // Update record
    ticket.set({
      title: req.body.title,
      price: req.body.price,
    });

    // Save updated record to the database
    await ticket.save();

    // Emit an event with and updated ticket
    new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
    });

    res.send(ticket);
  }
);

export { updateTicketRouter };

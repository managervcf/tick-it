import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest } from '@tick-it/common';
import { Ticket } from '../models/ticket';
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const createTicketRouter = Router();

// Function that checks if title and price are valid
const validateTitleAndPrice = [
  body('title').not().isEmpty().withMessage('Title is required'),
  body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0'),
];

createTicketRouter.post(
  '/api/tickets',
  requireAuth,
  validateTitleAndPrice,
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    // Build new record
    const newTicket = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id,
    });

    // Save new record to the database
    await newTicket.save();

    // Emit an event with the new record
    await new TicketCreatedPublisher(natsWrapper.client).publish({
      id: newTicket.id,
      title: newTicket.title,
      price: newTicket.price,
      userId: newTicket.userId,
    });

    res.status(201).send(newTicket);
  }
);

export { createTicketRouter };

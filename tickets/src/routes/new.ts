import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest } from '@tick-it/common';
import { Ticket } from '../models/Ticket';

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

    const newTicket = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id,
    });

    const savedTicket = await newTicket.save();

    res.status(201).send(savedTicket);
  }
);

export { createTicketRouter };

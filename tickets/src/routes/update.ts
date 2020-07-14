import { Request, Response, Router } from 'express';
import { body } from 'express-validator';
import {
  NotAuthorizedError,
  NotFoundError,
  validateRequest,
  requireAuth,
} from '@tick-it/common';
import { Ticket } from '../models/Ticket';

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

    ticket.set({
      title: req.body.title,
      price: req.body.price,
    });

    await ticket.save();

    res.send(ticket);
  }
);

export { updateTicketRouter };

import { Router } from 'express';
import { currentUser } from '@tick-it/common';

const currentUserRouter = Router();

currentUserRouter.get('/api/users/currentuser', currentUser, (req, res) =>
  res.send({ currentUser: req.currentUser || null })
);

export { currentUserRouter };

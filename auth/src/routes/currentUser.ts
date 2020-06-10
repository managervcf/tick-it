import { Router } from 'express';
import { currentUser } from '../middlewares/currentUser';

const currentUserRouter = Router();

currentUserRouter.get('/api/users/currentuser', currentUser, (req, res) =>
  res.send({ currrentUser: req.currentUser || null })
);

export { currentUserRouter };

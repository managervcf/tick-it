import { Router } from 'express';

const currentUserRouter = Router();

currentUserRouter.get('/api/users/currentuser', (req, res) => {
  res.send('current user');
});

export { currentUserRouter };

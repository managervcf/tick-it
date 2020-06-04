import { Router } from 'express';

const signOutRouter = Router();

signOutRouter.post('/api/users/signout', (req, res) => {
  res.send('sign out');
});

export { signOutRouter };

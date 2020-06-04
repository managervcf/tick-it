import { Router } from 'express';

const signInRouter = Router();

signInRouter.post('/api/users/signin', (req, res) => {
  res.send('sign in');
});

export { signInRouter };

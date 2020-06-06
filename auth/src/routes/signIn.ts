import { Router } from 'express';
import { body } from 'express-validator';

const signInRouter = Router();

signInRouter.post('/api/users/signin', (req, res) => {
  res.send('sign in');
});

export { signInRouter };

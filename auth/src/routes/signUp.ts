import { Router } from 'express';

const signUpRouter = Router();

signUpRouter.post('/api/users/signup', (req, res) => {
  res.send('sign up');
});

export { signUpRouter };

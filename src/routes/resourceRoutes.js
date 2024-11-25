import { Router } from 'express';
import { UserController } from '../controllers/userController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

export const resourceRoutes = (app) => {
  const router = Router();

  const userController = new UserController();
  
  app.use('/resources', router);
  router.use(authMiddleware);

  router.post('/register', userController.registerUser);
  router.post('/login', userController.loginUser);
};
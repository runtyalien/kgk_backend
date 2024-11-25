import { Router } from 'express';
import { ResourceController } from '../controllers/resourceController.js';
import { UserController } from '../controllers/userController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

export const resourceRoutes = (app) => {
  const router = Router();

  const resourceController = new ResourceController();
  const userController = new UserController();
  
  router.post('/register', userController.registerUser);
  router.post('/login', userController.loginUser);

  app.use('/resources', router);
  router.use(authMiddleware);

  router.post('/', resourceController.createResource);
  router.get('/', resourceController.getUserResources);
  router.get('/:accessToken', resourceController.accessResource);
  router.delete('/:id', resourceController.deleteResource);
};
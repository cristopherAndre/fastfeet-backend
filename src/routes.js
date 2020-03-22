import { Router } from 'express';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/sessions', SessionController.store);
routes.post('/users', UserController.store);

routes.use(authMiddleware);
routes.put('/users', UserController.update);
routes.get('/users/:id', UserController.get);

routes.post('/recipients', RecipientController.store);
routes.get('/recipients/:id', RecipientController.get);

export default routes;

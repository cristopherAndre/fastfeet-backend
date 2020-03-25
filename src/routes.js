import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import FileController from './app/controllers/FileController';
import DeliverymanController from './app/controllers/DeliverymanController';
import DeliveryController from './app/controllers/DeliveryController';
import PickupDeliveryController from './app/controllers/PickupDeliveryController';
import DropDeliveryController from './app/controllers/DropDeliveryController';
import authMiddleware from './app/middlewares/auth';
import checkIsAdminUserMiddleware from './app/middlewares/checkIsAdminUser';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/sessions', SessionController.store);
routes.post('/users', UserController.store);

routes.use(authMiddleware);
routes.use(checkIsAdminUserMiddleware);

routes.put('/users', UserController.update);
routes.get('/users/:id', UserController.get);
routes.get('/users/', UserController.index);

routes.post('/recipients', RecipientController.store);
routes.get('/recipients', RecipientController.index);
routes.get('/recipients/:id', RecipientController.show);
routes.put('/recipients/:id', RecipientController.update);
routes.delete('/recipients/:id', RecipientController.destroy);

routes.post('/files', upload.single('file'), FileController.store);

// Deliverymen
routes.get('/deliverymen', DeliverymanController.index);
routes.get('/deliverymen/:id', DeliverymanController.show);
routes.post('/deliverymen', DeliverymanController.store);
routes.put('/deliverymen/:id', DeliverymanController.update);
routes.delete('/deliverymen/:id', DeliverymanController.delete);

// Deliveries
routes.get('/deliveries', DeliveryController.index);
routes.get('/deliveries/:id', DeliveryController.show);
routes.post('/deliveries', DeliveryController.store);
routes.put('/deliveries/:id', DeliveryController.update);
routes.delete('/deliveries/:id', DeliveryController.delete);

// Pickup Delivery
routes.put(
  '/deliveryman/:deliverymanId/delivery/:deliveryId/pickup',
  PickupDeliveryController.update
);

// Drop Delivery
routes.put(
  '/deliveryman/:deliverymanId/delivery/:deliveryId/drop',
  DropDeliveryController.update
);

export default routes;

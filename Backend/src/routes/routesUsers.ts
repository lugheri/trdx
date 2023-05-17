import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import { UsersController } from '../controllers/users';

export default (routes: Router) => {
  routes.post('/getUsers',UsersController.getAll)
  routes.get('/getUsersById/:id',UsersController.getById)
}
import { Router } from 'express';
import UserController from '../controllers/UserController';

export default (routes: Router) => {
  routes.post("/newUser", UserController.newUser)
  routes.get("/getUser/:userId", UserController.getUser)
  routes.patch("/EditUser/:userId", UserController.editUser)
  routes.delete("/RemoveUser/:userId", UserController.removeUser)
  routes.post("/listUsers", UserController.listUsers)
}
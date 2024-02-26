import { Router } from 'express';
import multer from 'multer';
import UserController from '../../controllers/UserController';

const upload = multer({
  dest:'./tmp',
  fileFilter: (req,file,cb)=>{
    const allowed: string[] = ['image/jpg', 'image/jpeg','image/png','image/gif','image/webp'];
    cb(null,allowed.includes(file.mimetype))
  },
  limits: {fieldSize: 20000000}
});

export default (routes: Router) => {
  routes.post("/newUser", UserController.newUser)
  routes.get("/userPhotoProfile/:photo_id",UserController.userPhotoProfile);
  routes.post("/newUserPhotoProfile",upload.single('file'),UserController.newUserPhotoProfile);

  routes.get("/getUser/:userId", UserController.getUser)
  routes.patch("/EditUser/:userId", UserController.editUser)
  routes.delete("/RemoveUser/:userId", UserController.removeUser)
  routes.post("/listUsers", UserController.listUsers)
}
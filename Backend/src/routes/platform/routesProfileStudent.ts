import { Router } from "express";
import multer from 'multer';
import ProfileStudentController from "../../controllers/ProfileStudentController";

const upload = multer({
  dest:'./tmp',
  fileFilter: (req,file,cb)=>{
    const allowed: string[] = ['image/jpg', 'image/jpeg','image/png','image/gif','image/webp'];
    console.log("Info Image", file)
    cb(null,allowed.includes(file.mimetype))
  },
  limits: {fieldSize: 20000000}
});

export default (routes:Router)=>{
  //Manager Course
  routes.get("/photoProfile/:photo_id",ProfileStudentController.photoProfile);
  routes.post("/newPhotoProfile",upload.single('file'),ProfileStudentController.newPhotoProfile);

  routes.get("/getInfoStudent/:student_id",ProfileStudentController.getInfoStudent);
  routes.patch("/editInfoStudent/:student_id",ProfileStudentController.editInfoStudent);
  routes.patch("/resetPassword/:student_id",ProfileStudentController.resetPassword);
}
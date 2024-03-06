import { Router } from "express";
import CommunityAdmController from "../../../controllers/CommunityAdmController";

export default (routes: Router) => {
  routes.get('/getPhotoProfile/:mail_student_access',CommunityAdmController.getPhotoProfile)
  routes.get('/getDataStudentAccess/:mail_student_access',CommunityAdmController.getDataStudentAccess)
}
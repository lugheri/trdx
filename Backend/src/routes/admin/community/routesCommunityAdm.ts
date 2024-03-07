import { Router } from "express";
import CommunityAdmController from "../../../controllers/CommunityAdmController";

export default (routes: Router) => {
  routes.get('/getPhotoProfile/:mail_student_access',CommunityAdmController.getPhotoProfile)
  routes.get('/getDataStudentAccess/:mail_student_access',CommunityAdmController.getDataStudentAccess)

  routes.post('/blockingMember',CommunityAdmController.blockingMember)
  routes.patch('/editBlockMember/:member_id',CommunityAdmController.editBlockMember)
  routes.get('/infoBlockMember/:member_id',CommunityAdmController.infoBlockMember)
}
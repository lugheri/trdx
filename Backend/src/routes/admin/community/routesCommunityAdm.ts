import { Router } from "express";
import CommunityAdmController from "../../../controllers/CommunityAdmController";

export default (routes: Router) => {
  routes.get('/getPhotoProfile/:mail_student_access',CommunityAdmController.getPhotoProfile)
  routes.get('/getDataStudentAccess/:mail_student_access',CommunityAdmController.getDataStudentAccess)

  routes.post('/newSetupChat',CommunityAdmController.newSetupChat)
  routes.get('/infoSetupChat',CommunityAdmController.infoSetupChat)
  routes.patch('/editSetupChat',CommunityAdmController.editSetupChat)

  routes.post('/blockingMember',CommunityAdmController.blockingMember)
  routes.patch('/editBlockMember/:member_id',CommunityAdmController.editBlockMember)
  routes.get('/infoBlockMember/:member_id',CommunityAdmController.infoBlockMember)

  routes.patch('/editMessage/:message_id',CommunityAdmController.editMessage)

}
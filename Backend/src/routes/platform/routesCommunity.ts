import { Router } from "express";
import multer from 'multer';
import CommunityController from "../../controllers/CommunityController";

const upload = multer({
  dest:'./tmp',
  fileFilter: (req,file,cb)=>{
    const allowed: string[] = ['image/jpg', 'image/jpeg','image/png','image/gif','pdf', 'doc', 'docx'];
    cb(null,true)
  },
  limits: {fieldSize: 20000000}
});

export default (routes: Router) => {
  //Community
  routes.post('/setOnline',CommunityController.setOnline)
  routes.get('/getInfoMembers',CommunityController.getInfoMembers)
  routes.get("/listMessagesCommunity/:page",CommunityController.listMessagesCommunity)
  routes.post("/newMessage",CommunityController.newMessage)
  routes.get("/loadMedia/:mediaId",CommunityController.loadMedia)
  routes.post("/newAudioMessage",CommunityController.newAudioMessage)
  routes.post("/newFileMessage",upload.single('file'),CommunityController.newFileMessage)
  
  
}
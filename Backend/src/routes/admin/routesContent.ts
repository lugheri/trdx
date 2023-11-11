import { Router } from "express";
import ContentController from "../../controllers/ContentController";

export default (routes:Router)=>{
  //Video or Image Home Community
  routes.post("/updateVideoWelcomeCommunity",ContentController.updateVideoWelcomeCommunity)
  routes.get("/getVideoWelcomeCommunity",ContentController.getVideoWelcomeCommunity) 
  //Text Home Community
  routes.get("/getTextHomeCommunity",ContentController.getTextHomeCommunity)
  routes.post("/updateTextHomeCommunity",ContentController.updateTextHomeCommunity) 
  //Buttons Home Community
  routes.post("/newButtonCommunity",ContentController.newButtonCommunity)
  routes.get("/getButtonsCommunity",ContentController.getButtonsCommunity)
  routes.get("/infoButtonCommunity/:button_id",ContentController.infoButtonCommunity)
  routes.patch("/updateButtonCommunity/:button_id",ContentController.updateButtonCommunity)
  routes.delete("/deleteButtonCommunity/:button_id",ContentController.deleteButtonCommunity)

  //Video or Image Home Default
  routes.post("/updateVideoWelcome",ContentController.updateVideoWelcome)
  routes.get("/getVideoWelcome",ContentController.getVideoWelcome) 
  //Text Home Default
  routes.get("/getTextHome",ContentController.getTextHome)
  routes.post("/updateTextHome",ContentController.updateTextHome) 
  //Buttons Home Default
  routes.post("/newButton",ContentController.newButton)
  routes.get("/getButtons",ContentController.getButtons)
  routes.get("/infoButton/:button_id",ContentController.infoButton)
  routes.patch("/updateButton/:button_id",ContentController.updateButton)
  routes.delete("/deleteButton/:button_id",ContentController.deleteButton)

  //Social Medias
  routes.post("/newSocialMedia",ContentController.newSocialMedia)
  routes.get("/getSocialMedias",ContentController.getSocialMedias)
  routes.get("/infoSocialMedia/:media_id",ContentController.infoSocialMedia)
  routes.patch("/updateSocialMedia/:media_id",ContentController.updateSocialMedia)
  routes.delete("/deleteSocialMedia/:media_id",ContentController.deleteSocialMedia)
}
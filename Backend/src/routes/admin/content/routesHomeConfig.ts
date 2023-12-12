import { Router } from "express";
import HomeConfigController from "../../../controllers/HomeConfigController";

export default (routes:Router)=>{
  //Video or Image Home Community
  routes.post("/updateVideoWelcomeCommunity",HomeConfigController.updateVideoWelcomeCommunity)
  routes.get("/getVideoWelcomeCommunity",HomeConfigController.getVideoWelcomeCommunity) 
  //Text Home Community
  routes.get("/getTextHomeCommunity",HomeConfigController.getTextHomeCommunity)
  routes.post("/updateTextHomeCommunity",HomeConfigController.updateTextHomeCommunity) 
  //Buttons Home Community
  routes.post("/newButtonCommunity",HomeConfigController.newButtonCommunity)
  routes.get("/getButtonsCommunity",HomeConfigController.getButtonsCommunity)
  routes.get("/infoButtonCommunity/:button_id",HomeConfigController.infoButtonCommunity)
  routes.patch("/updateButtonCommunity/:button_id",HomeConfigController.updateButtonCommunity)
  routes.delete("/deleteButtonCommunity/:button_id",HomeConfigController.deleteButtonCommunity)

  //Video or Image Home Default
  routes.post("/updateVideoWelcome",HomeConfigController.updateVideoWelcome)
  routes.get("/getVideoWelcome",HomeConfigController.getVideoWelcome) 
  //Text Home Default
  routes.get("/getTextHome",HomeConfigController.getTextHome)
  routes.post("/updateTextHome",HomeConfigController.updateTextHome) 
  //Buttons Home Default
  routes.post("/newButton",HomeConfigController.newButton)
  routes.get("/getButtons",HomeConfigController.getButtons)
  routes.get("/infoButton/:button_id",HomeConfigController.infoButton)
  routes.patch("/updateButton/:button_id",HomeConfigController.updateButton)
  routes.delete("/deleteButton/:button_id",HomeConfigController.deleteButton)

  //Social Medias
  routes.post("/newSocialMedia",HomeConfigController.newSocialMedia)
  routes.get("/getSocialMedias",HomeConfigController.getSocialMedias)
  routes.get("/infoSocialMedia/:media_id",HomeConfigController.infoSocialMedia)
  routes.patch("/updateSocialMedia/:media_id",HomeConfigController.updateSocialMedia)
  routes.delete("/deleteSocialMedia/:media_id",HomeConfigController.deleteSocialMedia)
}
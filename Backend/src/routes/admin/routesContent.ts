import { Router } from "express";
import ContentController from "../../controllers/ContentController";

export default (routes:Router)=>{
  //Video Home Community
  routes.get("/getVideoWelcome",ContentController.getVideoWelcome)
  routes.post("/updateVideoWelcome",ContentController.updateVideoWelcome)
  //Text Home Community
  routes.get("/getTextHomeCommunity",ContentController.getTextHomeCommunity)
  routes.post("/updateTextHomeCommunity",ContentController.updateTextHomeCommunity)
  //Buttons Home Community
  routes.post("/newButton",ContentController.newButton)
  routes.get("/getButtons",ContentController.getButtons)
  routes.get("/infoButton/:button_id",ContentController.infoButton)
  routes.patch("/updateButton/:button_id",ContentController.updateButton)
  routes.delete("/deleteButton/:button_id",ContentController.deleteButton)
}
import { Router } from "express";
import ContentController from "../../controllers/ContentController";

export default (routes:Router)=>{
  routes.get("/getVideoWelcome",ContentController.getVideoWelcome)
  routes.post("/updateVideoWelcome",ContentController.updateVideoWelcome)
  routes.get("/getButtonInitCTA",ContentController.getButtonInitCTA)
  routes.post("/updateButtonInitCTA",ContentController.updateButtonInitCTA)
  routes.get("/getButtonInitLink",ContentController.getButtonInitLink)
  routes.post("/updateButtonInitLink",ContentController.updateButtonInitLink)
  routes.get("/getInformationText",ContentController.getInformationText)
  routes.post("/updateInformationText",ContentController.updateInformationText)
}
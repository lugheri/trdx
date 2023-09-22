import { Router } from "express";
import CommunityController from "../controllers/CommunityController";

export default (routes:Router)=>{
  routes.get("/getVideoWelcome",CommunityController.getVideoWelcome)
  routes.post("/updateVideoWelcome",CommunityController.updateVideoWelcome)
  routes.get("/getButtonInitCTA",CommunityController.getButtonInitCTA)
  routes.post("/updateButtonInitCTA",CommunityController.updateButtonInitCTA)
  routes.get("/getButtonInitLink",CommunityController.getButtonInitLink)
  routes.post("/updateButtonInitLink",CommunityController.updateButtonInitLink)
  routes.get("/getInformationText",CommunityController.getInformationText)
  routes.post("/updateInformationText",CommunityController.updateInformationText)
}
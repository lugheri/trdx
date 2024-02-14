import { Router } from "express";
import CommunityController from "../../controllers/CommunityController";

export default (routes: Router) => {
  //Community
  routes.get("/listMessagesCommunity/:page",CommunityController.listMessagesCommunity)
  routes.post("/newMessage",CommunityController.newMessage)
  routes.post("/newMediaMessage",CommunityController.newMediaMessage)
  routes.put("/editMessage/:message_id",CommunityController.editMessage)
}
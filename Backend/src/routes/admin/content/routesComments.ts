import { Router } from "express";
import CommentsController from "../../../controllers/CommentsController";


export default (routes:Router)=>{
  routes.get('/totalComments/:type',CommentsController.totalComments);
  routes.get('/getComments/:type/:page',CommentsController.getComments);
  routes.get('/getAnswers/:commentId',CommentsController.getAnswers);
  routes.get("/searchComment/:params/:type",CommentsController.searchComment);
  routes.post("/newAnswer",CommentsController.newAnswer);
  routes.get("/infoComment/:commentId",CommentsController.infoComment);
  routes.patch("/editComment/:commentId",CommentsController.editComment);

  //Comments by Student
  routes.get('/getCommentsStudent/:studentId',CommentsController.getCommentsStudent);



}
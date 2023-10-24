import { Router } from "express";
import CoursesController from "../../controllers/CoursesController";

export default (routes:Router)=>{
  //Home
  routes.get("/lastLessonViewed/:studentId",CoursesController.lastLessonViewed)


  //Courses
  routes.get("/myCourses/:studentId",CoursesController.myCourses)
  routes.get("/validityCourse/:courseId/:studentId",CoursesController.validityCourse)
  routes.get("/progressStudent/:studentId",CoursesController.progressStudent)
  routes.get("/progressCourse/:courseId/:studentId",CoursesController.progressCourse)
  routes.get("/progressModule/:moduleId/:studentId",CoursesController.progressModule)
  
  //Attachments
  routes.get("/getAttachmentsLesson/:lessonId",CoursesController.attachmentLesson)
 
  //Notes
  routes.get("/studentsNotes/:courseId/:studentId",CoursesController.studentsNotes)
  routes.post("/editNote",CoursesController.editNote)

  //Actions
  routes.post("/watchedLesson",CoursesController.watchedLesson)
  routes.get("/getWatchedLesson/:studentId/:lessonId",CoursesController.getWatchedLesson)
  routes.delete("/watchedLesson/:studentId/:lessonId",CoursesController.removeWatchedLesson)
  routes.get("/continueCourse/:studentId/:courseId",CoursesController.continueCourse)
  routes.get("/nextLesson/:studentId/:courseId/:lessonId",CoursesController.nextLesson)  
  routes.patch("/ratingLesson/:studentId/:lessonId",CoursesController.ratingLesson)

  //Comments
  routes.get("/totalCommentsLesson/:lessonId",CoursesController.totalCommentsLesson)
  routes.get("/lessonsComments/:lessonId/:page",CoursesController.commentsLesson)
  routes.get("/lessonsCommentsAnswers/:commentId/:page",CoursesController.commentsAnswersLesson)
  routes.post("/newCommentLesson",CoursesController.newCommentLesson)
  routes.get("/commentsPendingApproval/:lessonId/:studentId",CoursesController.commentsPendingApproval)
}
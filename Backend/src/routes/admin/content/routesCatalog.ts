import { Router } from "express";
import CatalogController from "../../../controllers/CatalogController";
import multer from 'multer';

const storage = multer.diskStorage({
  destination: './public/docs', // Diretório de destino
  filename: (req, file, cb) => {
    // Define o nome do arquivo manualmente
    const fileName = 'doc_' + file.originalname;
    cb(null, fileName);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    cb(null, true); // Aceitar todos os arquivos
  },
  limits: { fieldSize: 20000000 },
});

export default (routes:Router)=>{
  //Courses
  routes.post("/newCourse",CatalogController.newCourse);
  routes.post("/listCourses",CatalogController.listCourses);
  routes.get("/infoCourse/:courseId",CatalogController.infoCourse);
  routes.patch("/editCourse/:courseId",CatalogController.editCourse);
 

  //Modules
  routes.post("/newModuleCourse",CatalogController.newModuleCourse);
  routes.get("/modulesCourse/:courseId",CatalogController.modulesCourse)  
  routes.get("/infoModuleCourse/:moduleId",CatalogController.infoModuleCourse);
  routes.patch("/editModuleCourse/:moduleId",CatalogController.editModuleCourse);


  //Lessons
  routes.post("/newLessonModule",CatalogController.newLessonModule);
  routes.get("/nextLessonOrder/:moduleId",CatalogController.nextLessonOrder);
  routes.get("/lessonsModule/:moduleId",CatalogController.lessonsModule)  
  
  routes.get("/infoLesson/:lessonId",CatalogController.infoLessonModule);
  routes.patch("/editLessonModule/:lessonId",CatalogController.editLessonModule);  
  routes.get("/firstLessonModule/:moduleId",CatalogController.firstLessonModule);


  //Attachments
  routes.post("/newAttachmentsLesson",CatalogController.newAttachmentsLesson);
  routes.post('/uploadFileAttachments',upload.single('file'),CatalogController.uploadFileAttachments)
  routes.get("/getAttachmentsLesson/:lessonId",CatalogController.lessonAttachments)  
  routes.get("/infoAttachmentsLesson/:attachmentId",CatalogController.infoAttachmentsLesson) 
  routes.patch("/editAttachmentsLesson/:attachmentId",CatalogController.editAttachmentsLesson);
  routes.delete("/removeAttachmentsLesson/:attachmentId/:lessonId",CatalogController.removeAttachmentsLesson);
  
  //LessonsAccessRules
  routes.post("/newAccessRuleLesson",CatalogController.newAccessRuleLesson);
  routes.get("/lessonAccessRule/:lessonId",CatalogController.lessonAccessRule)  
  routes.patch("/editLessonAccessRule/:lessonId",CatalogController.editLessonAccessRule);

  //Check Access Lesson Student,
  routes.get("/checkAccessLesson/:lessonId/:studentId",CatalogController.checkAccessLesson) 
  
  
  //Update Bulk Courses
  routes.get("/addCoursesCommunity/:courseId",CatalogController.addCoursesCommunity) 

  //Setup Quiz
  //Questions
  routes.post("/newQuestion",CatalogController.newQuestion)
  routes.get("/getLastOrderQuestion/:quiz_id",CatalogController.getLastOrderQuestion)
  routes.get("/listQuestions/:quiz_id",CatalogController.listQuestions)
  routes.get("/infoQuestions/:question_id",CatalogController.infoQuestions)
  routes.patch("/editQuestion/:question_id",CatalogController.editQuestion)
  
  //Options Questions
  routes.post("/newOptionQuestion",CatalogController.newOptionQuestion)
  routes.get("/getLastOrderOption/:question_id",CatalogController.getLastOrderOption)
  routes.get("/listOptionsQuestion/:question_id",CatalogController.listOptionsQuestion)
  routes.get("/infoOptionQuestion/:option_id",CatalogController.infoOptionQuestion)
  routes.patch("/editOptionQuestion/:option_id",CatalogController.editOptionQuestion)
  routes.patch("/editQuestionOptionByQuestionId/:question_id",CatalogController.editQuestionOptionByQuestionId)

  //Questions Settings
  routes.get("/infoSettingsQuestion/:quiz_id",CatalogController.infoSettingsQuestion)
  routes.patch("/editSettingsQuestion/:quiz_id",CatalogController.editSettingsQuestion)

  //Student Page Routes Quiz
  routes.get("/nextQuestion/:quiz_id/:last_question_id",CatalogController.nextQuestion)
  routes.get("/previousQuestion/:quiz_id/:next_question_id",CatalogController.previousQuestion)
  //Answers
  routes.post("/answerQuestion",CatalogController.answerQuestion)
  routes.get("/infoAnswerQuestion/:question_id/:student_id",CatalogController.infoAnswerQuestion)
  routes.patch("/editAnswerQuestion/:question_id/:student_id",CatalogController.editAnswerQuestion)
  //End Quiz
  routes.get("/averageGradeQuizStudent/:student_id/:quiz_id",CatalogController.averageGradeQuizStudent)
  routes.post("/endQuiz",CatalogController.endQuiz)
  //Get Grade
  routes.get("/gradeQuizStudent/:student_id/:quiz_id",CatalogController.gradeQuizStudent)
}
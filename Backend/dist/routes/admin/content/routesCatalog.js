"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CatalogController_1 = __importDefault(require("../../../controllers/CatalogController"));
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.diskStorage({
    destination: './public/docs',
    filename: (req, file, cb) => {
        // Define o nome do arquivo manualmente
        const fileName = 'doc_' + file.originalname;
        cb(null, fileName);
    },
});
const upload = (0, multer_1.default)({
    storage: storage,
    fileFilter: (req, file, cb) => {
        cb(null, true); // Aceitar todos os arquivos
    },
    limits: { fieldSize: 20000000 },
});
exports.default = (routes) => {
    //Courses
    routes.post("/newCourse", CatalogController_1.default.newCourse);
    routes.post("/listCourses", CatalogController_1.default.listCourses);
    routes.get("/infoCourse/:courseId", CatalogController_1.default.infoCourse);
    routes.patch("/editCourse/:courseId", CatalogController_1.default.editCourse);
    //Modules
    routes.post("/newModuleCourse", CatalogController_1.default.newModuleCourse);
    routes.get("/modulesCourse/:courseId", CatalogController_1.default.modulesCourse);
    routes.get("/infoModuleCourse/:moduleId", CatalogController_1.default.infoModuleCourse);
    routes.patch("/editModuleCourse/:moduleId", CatalogController_1.default.editModuleCourse);
    //Lessons
    routes.post("/newLessonModule", CatalogController_1.default.newLessonModule);
    routes.get("/nextLessonOrder/:moduleId", CatalogController_1.default.nextLessonOrder);
    routes.get("/lessonsModule/:moduleId", CatalogController_1.default.lessonsModule);
    routes.get("/infoLesson/:lessonId", CatalogController_1.default.infoLessonModule);
    routes.patch("/editLessonModule/:lessonId", CatalogController_1.default.editLessonModule);
    routes.get("/firstLessonModule/:moduleId", CatalogController_1.default.firstLessonModule);
    //Attachments
    routes.post("/newAttachmentsLesson", CatalogController_1.default.newAttachmentsLesson);
    routes.post('/uploadFileAttachments', upload.single('file'), CatalogController_1.default.uploadFileAttachments);
    routes.get("/getAttachmentsLesson/:lessonId", CatalogController_1.default.lessonAttachments);
    routes.get("/infoAttachmentsLesson/:attachmentId", CatalogController_1.default.infoAttachmentsLesson);
    routes.patch("/editAttachmentsLesson/:attachmentId", CatalogController_1.default.editAttachmentsLesson);
    routes.delete("/removeAttachmentsLesson/:attachmentId/:lessonId", CatalogController_1.default.removeAttachmentsLesson);
    //LessonsAccessRules
    routes.post("/newAccessRuleLesson", CatalogController_1.default.newAccessRuleLesson);
    routes.get("/lessonAccessRule/:lessonId", CatalogController_1.default.lessonAccessRule);
    routes.patch("/editLessonAccessRule/:lessonId", CatalogController_1.default.editLessonAccessRule);
    //Check Access Lesson Student,
    routes.get("/checkAccessLesson/:lessonId/:studentId", CatalogController_1.default.checkAccessLesson);
    //Update Bulk Courses
    routes.get("/addCoursesCommunity/:courseId", CatalogController_1.default.addCoursesCommunity);
    //Setup Quiz
    //Questions
    routes.post("/newQuestion", CatalogController_1.default.newQuestion);
    routes.get("/getLastOrderQuestion/:quiz_id", CatalogController_1.default.getLastOrderQuestion);
    routes.get("/listQuestions/:quiz_id", CatalogController_1.default.listQuestions);
    routes.get("/infoQuestions/:question_id", CatalogController_1.default.infoQuestions);
    routes.patch("/editQuestion/:question_id", CatalogController_1.default.editQuestion);
    //Options Questions
    routes.post("/newOptionQuestion", CatalogController_1.default.newOptionQuestion);
    routes.get("/getLastOrderOption/:question_id", CatalogController_1.default.getLastOrderOption);
    routes.get("/listOptionsQuestion/:question_id", CatalogController_1.default.listOptionsQuestion);
    routes.get("/infoOptionQuestion/:option_id", CatalogController_1.default.infoOptionQuestion);
    routes.patch("/editOptionQuestion/:option_id", CatalogController_1.default.editOptionQuestion);
};

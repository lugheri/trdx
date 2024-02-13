"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CoursesController_1 = __importDefault(require("../../controllers/CoursesController"));
exports.default = (routes) => {
    //Home
    routes.get("/lastLessonViewed/:studentId", CoursesController_1.default.lastLessonViewed);
    //Courses
    routes.get("/myCourses/:studentId", CoursesController_1.default.myCourses);
    routes.get("/validityCourse/:courseId/:studentId", CoursesController_1.default.validityCourse);
    routes.get("/progressStudent/:studentId", CoursesController_1.default.progressStudent);
    routes.get("/progressCourse/:courseId/:studentId", CoursesController_1.default.progressCourse);
    routes.get("/progressModule/:moduleId/:studentId", CoursesController_1.default.progressModule);
    routes.get("/lessonsModule/:courseId/:moduleId/:studentId", CoursesController_1.default.lessonsModule);
    //Notes
    routes.get("/studentsNotes/:courseId/:studentId", CoursesController_1.default.studentsNotes);
    routes.post("/editNote", CoursesController_1.default.editNote);
    //Actions
    routes.post("/watchedLesson", CoursesController_1.default.watchedLesson);
    routes.get("/getWatchedLesson/:studentId/:lessonId", CoursesController_1.default.getWatchedLesson);
    routes.delete("/watchedLesson/:courseId/:moduleId/:studentId/:lessonId", CoursesController_1.default.removeWatchedLesson);
    routes.get("/continueCourse/:studentId/:courseId", CoursesController_1.default.continueCourse);
    routes.get("/nextLesson/:studentId/:courseId/:lessonId", CoursesController_1.default.nextLesson);
    routes.patch("/ratingLesson/:studentId/:lessonId", CoursesController_1.default.ratingLesson);
    //Comments
    routes.get("/totalCommentsLesson/:lessonId", CoursesController_1.default.totalCommentsLesson);
    routes.get("/lessonsComments/:lessonId/:page/:studentId", CoursesController_1.default.commentsLesson);
    routes.get("/lessonsCommentsAnswers/:commentId/:page", CoursesController_1.default.commentsAnswersLesson);
    routes.post("/newCommentLesson", CoursesController_1.default.newCommentLesson);
    routes.get("/commentsPendingApproval/:lessonId/:studentId", CoursesController_1.default.commentsPendingApproval);
};

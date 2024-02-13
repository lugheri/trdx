"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const StudentsController_1 = __importDefault(require("../../../controllers/StudentsController"));
exports.default = (routes) => {
    //CRUD STUDENTS
    routes.post('/newStudent', StudentsController_1.default.newStudent);
    routes.get("/getStudent/:studentId", StudentsController_1.default.getStudent);
    routes.patch("/EditStudent/:studentId", StudentsController_1.default.editStudent);
    routes.delete("/RemoveStudent/:studentId", StudentsController_1.default.removeStudent);
    routes.get("/listStudents/:status/:page/:filterType/:orderedBy/:order", StudentsController_1.default.listStudents);
    //Search and Info
    routes.get("/totalStudents/:status", StudentsController_1.default.totalStudents);
    routes.get("/lastStudentAccess/:studentId", StudentsController_1.default.lastStudentAccess);
    routes.get("/searchParams/:status/:searchParams/:page/:filterType/:orderedBy/:order", StudentsController_1.default.searchStudent);
    routes.post("/searchStudents", StudentsController_1.default.searchStudent);
    routes.get("/checkTypeStudentAccess/:studentId", StudentsController_1.default.checkCommunityStatusStudent);
    //Provisory
    routes.get("/resetPass/:studentId", StudentsController_1.default.resetPass);
    //Courses
    routes.get("/totalMyCourses/:studentId", StudentsController_1.default.totalMyCourses);
    routes.get('/studentsCourses/:studentId', StudentsController_1.default.studentsCourses);
    routes.get('/checkCourseStudent/:studentId/:courseId', StudentsController_1.default.checkCourseStudent);
    routes.post('/addCourseStudent', StudentsController_1.default.addCourseStudent);
    routes.delete('/delCourseStudent/:idJoin', StudentsController_1.default.delCourseStudent);
    //Views Lessons
    routes.get("/allLessonsViews/:studentId", StudentsController_1.default.allLessonsViews);
    //Send Presence
    routes.post("/sendPresence", StudentsController_1.default.sendPresence);
    //Courses
    //Validity Contracts Courses
    routes.get('/validityContracts/:studentId/:courseId', StudentsController_1.default.validityContracts);
    routes.get('/activeContract/:studentId/:courseId', StudentsController_1.default.activeContract);
    routes.post('/addContract', StudentsController_1.default.addContract);
    routes.delete('/removeContract/:contractId', StudentsController_1.default.removeContract);
    routes.get('/recentCommentsStudentsCourses/:studentId', StudentsController_1.default.recentCommentsStudentsCourses);
};

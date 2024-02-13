"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TeacherController_1 = __importDefault(require("../../../controllers/TeacherController"));
exports.default = (routes) => {
    routes.post("/newTeacher", TeacherController_1.default.newTeacher);
    routes.get("/listTeachers", TeacherController_1.default.listTeachers);
    routes.get("/infoTeacher/:teacherId", TeacherController_1.default.infoTeacher);
    routes.patch("/editTeacher/:teacherId", TeacherController_1.default.editTeacher);
};

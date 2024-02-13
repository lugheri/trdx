"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const courseTeachersService_1 = __importDefault(require("../services/courseTeachersService"));
const teachers_dto_1 = require("./Dtos/teachers.dto");
class TeacherController {
    //Courses
    newTeacher(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const dataTeacher = teachers_dto_1.TeacherDTO.safeParse(req.body);
            if (!dataTeacher.success) {
                res.json({ "error": dataTeacher.error });
                return;
            }
            try {
                const dataNewTeacher = yield courseTeachersService_1.default.createNewTeacher(dataTeacher.data);
                if (dataNewTeacher) {
                    res.json({ "success": true, "response": dataNewTeacher });
                    return;
                }
                res.json({ "error": "Falha ao criar o novo Professor!" });
                return;
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
    listTeachers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const listCourses = yield courseTeachersService_1.default.listTeachers();
                res.json({ "success": true, "response": listCourses });
                return;
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
    infoTeacher(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const teacherId = parseInt(req.params.teacherId);
            try {
                const infoTeacher = yield courseTeachersService_1.default.infoTeacher(teacherId);
                res.json({ "success": true, "response": infoTeacher });
                return;
                return;
            }
            catch (err) {
                res.json({ "error": err });
                return;
            }
        });
    }
    editTeacher(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const teacherId = parseInt(req.params.teacherId);
            const dataTeacher = teachers_dto_1.TeacherDTO.safeParse(req.body);
            if (!dataTeacher.success) {
                res.json({ "error": dataTeacher.error });
                return;
            }
            try {
                const edit = yield courseTeachersService_1.default.editTeacher(teacherId, dataTeacher.data);
                res.json({ "success": true, "response": edit });
                return;
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
}
exports.default = new TeacherController();

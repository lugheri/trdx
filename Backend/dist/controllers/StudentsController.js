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
const studentsService_1 = __importDefault(require("../services/studentsService"));
const student_dto_1 = require("./Dtos/student.dto");
const studentCoursesServices_1 = __importDefault(require("../services/studentCoursesServices"));
const LessonsCommentsService_1 = __importDefault(require("../services/LessonsCommentsService"));
const coursesValidityContractsService_1 = __importDefault(require("../services/coursesValidityContractsService"));
const lessonsViewedService_1 = __importDefault(require("../services/lessonsViewedService"));
const md5_1 = __importDefault(require("md5"));
const redis_1 = require("../config/redis");
class StudentsController {
    newStudent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const dataStudent = student_dto_1.StudentDTO.safeParse(req.body);
            if (!dataStudent.success) {
                res.json({ "error": dataStudent.error });
                return;
            }
            try {
                //Create a new credential
                const dataNewStudent = yield studentsService_1.default.createNewStudent(dataStudent.data);
                if (dataNewStudent) {
                    res.json({ "success": true, "response": dataNewStudent });
                    return;
                }
                res.json({ "error": "Falha ao criar o novo Aluno de acesso!" });
                return;
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
    getStudent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const studentId = parseInt(req.params.studentId);
            try {
                const student = yield studentsService_1.default.getStudent(studentId);
                res.json({ "success": true, "response": student });
                return;
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
    lastStudentAccess(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const studentId = parseInt(req.params.studentId);
            try {
                const lastAccess = yield studentsService_1.default.getLastAccessStudent(studentId);
                res.json({ "success": true, "response": lastAccess });
                return;
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
    editStudent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const studentId = parseInt(req.params.studentId);
            const dataStudent = student_dto_1.StudentPartialDTO.safeParse(req.body);
            if (!dataStudent.success) {
                res.json({ "error": dataStudent.error });
                return;
            }
            try {
                const edit = yield studentsService_1.default.editStudent(studentId, dataStudent.data);
                res.json({ "success": true, "response": edit });
                return;
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
    removeStudent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const studentId = parseInt(req.params.studentId);
            try {
                yield studentsService_1.default.removeStudent(studentId);
                res.json({ "success": true });
                return;
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
    listStudents(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const status = parseInt(req.params.status);
            const page = parseInt(req.params.page);
            const filter = req.params.filterType == 'all' ? null : parseInt(req.params.filterType);
            const orderedBy = req.params.orderedBy;
            const order = req.params.order;
            try {
                const listStudents = yield studentsService_1.default.listStudent(status, page, filter, orderedBy, order);
                res.json({ "success": true, "response": listStudents });
                return;
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
    searchStudent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const status = parseInt(req.params.status);
            const page = parseInt(req.params.page);
            const searchParams = req.params.searchParams;
            const filter = req.params.filterType == 'all' ? null : parseInt(req.params.filterType);
            const orderedBy = req.params.orderedBy;
            const order = req.params.order;
            try {
                const listStudents = yield studentsService_1.default.searchStudents(status, page, searchParams, filter, orderedBy, order);
                res.json({ "success": true, "response": listStudents });
                return;
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
    totalStudents(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const status = parseInt(req.params.status);
            try {
                const total = yield studentsService_1.default.totalStudents(status);
                res.json({ "success": true, "response": total });
                return;
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
    searchStudentOld(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const searchParams = student_dto_1.SearchStudentDTO.safeParse(req.body);
            if (!searchParams.success) {
                res.json({ "error": searchParams.error });
                return;
            }
            try {
                const searchStudent = yield studentsService_1.default.searchStudentsOld(searchParams.data);
                res.json({ "success": true, "response": searchStudent });
                return;
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
    checkCommunityStatusStudent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const studentId = parseInt(req.params.studentId);
            try {
                const communityStatusStudent = yield studentsService_1.default.checkCommunityStatusStudent(studentId);
                res.json({ "success": true, "response": communityStatusStudent });
                return;
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
    resetPass(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const studentId = parseInt(req.params.studentId);
            try {
                const length = 6;
                const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_-+=<>?';
                let passwordHash = '';
                for (let i = 0; i < length; i++) {
                    const randomIndex = Math.floor(Math.random() * characters.length);
                    passwordHash += characters.charAt(randomIndex);
                }
                const newPass = passwordHash;
                yield studentsService_1.default.editStudent(studentId, { password: (0, md5_1.default)(newPass) });
                res.json({ "success": true, "response": newPass });
                return;
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
    studentsCourses(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const studentId = parseInt(req.params.studentId);
            try {
                const courses = yield studentCoursesServices_1.default.myCourses(studentId);
                res.json({ "success": true, "response": courses });
                return;
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
    totalMyCourses(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const studentId = parseInt(req.params.studentId);
            try {
                const total = yield studentCoursesServices_1.default.totalMyCourses(studentId);
                res.json({ "success": true, "response": total });
                return;
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
    checkCourseStudent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const studentId = parseInt(req.params.studentId);
            const courseId = parseInt(req.params.courseId);
            try {
                const checkCourse = yield studentCoursesServices_1.default.checkCourseStudent(studentId, courseId);
                res.json({ "success": true, "response": checkCourse });
                return;
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
    addCourseStudent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const dataNewCourse = student_dto_1.AddCourseStudentDTO.safeParse(req.body);
            if (!dataNewCourse.success) {
                res.json({ "error": dataNewCourse.error });
                return;
            }
            try {
                const addCourseStudent = yield studentCoursesServices_1.default.addCourseStudent(dataNewCourse.data);
                res.json({ "success": true, "response": addCourseStudent });
                return;
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
    delCourseStudent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const idJoin = parseInt(req.params.idJoin);
            try {
                const del = yield studentCoursesServices_1.default.delCourseStudent(idJoin);
                res.json({ "success": true, "response": del });
                return;
            }
            catch (err) {
                res.json({ "error": err });
            }
        });
    }
    allLessonsViews(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const studentId = parseInt(req.params.studentId);
            try {
                const total = yield lessonsViewedService_1.default.allLessonsStudentViewed(studentId);
                res.json({ "success": true, "response": total });
                return;
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
    //Send Presence
    sendPresence(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const studentId = parseInt(req.body.studentId);
            const course = parseInt(req.body.course);
            const module = parseInt(req.body.module);
            const lesson = parseInt(req.body.lesson);
            const activeSessions = yield (0, redis_1.redisGet)('activeSessions');
            if (activeSessions === null) {
                const sessions = [{
                        student: studentId,
                        course: course,
                        module: module,
                        lesson: lesson
                    }];
                yield (0, redis_1.redisSet)('activeSessions', sessions, 60);
                res.json(true);
                return;
            }
            const index = activeSessions.findIndex(student => student.student === studentId);
            if (index !== -1) {
                activeSessions[index].course = course;
                activeSessions[index].module = module;
                activeSessions[index].lesson = lesson;
            }
            else {
                const newStudent = {
                    student: studentId,
                    course: course,
                    module: module,
                    lesson: lesson
                };
                activeSessions.push(newStudent);
            }
            yield (0, redis_1.redisSet)('activeSessions', activeSessions, 60);
            res.json(true);
            return;
        });
    }
    //Validity Contracts
    activeContract(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const studentId = parseInt(req.params.studentId);
            const courseId = parseInt(req.params.courseId);
            try {
                const activeContract = yield coursesValidityContractsService_1.default.validityCourse(courseId, studentId);
                res.json({ "success": true, "response": activeContract });
            }
            catch (err) {
                res.json({ "error": err });
            }
        });
    }
    validityContracts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const studentId = parseInt(req.params.studentId);
            const courseId = parseInt(req.params.courseId);
            try {
                const current = yield coursesValidityContractsService_1.default.validityCourse(courseId, studentId);
                const contracts = yield coursesValidityContractsService_1.default.allContrats(courseId, studentId);
                res.json({ "success": true, "response": { "contracts": contracts, "currentContract": current } });
            }
            catch (err) {
                res.json({ "error": err });
            }
        });
    }
    addContract(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const dataContract = student_dto_1.AddContractValidityDTO.safeParse(req.body);
            if (!dataContract.success) {
                res.json({ "error": dataContract.error });
                return;
            }
            try {
                const contract = yield coursesValidityContractsService_1.default.addContract(dataContract.data);
                res.json({ "success": true, "response": contract });
            }
            catch (err) {
                res.json({ "error": err });
            }
        });
    }
    removeContract(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const contractId = parseInt(req.params.contractId);
            try {
                const del = yield coursesValidityContractsService_1.default.removeContract(contractId);
                res.json({ "success": true, "response": del });
            }
            catch (err) {
                res.json({ "error": err });
            }
        });
    }
    recentCommentsStudentsCourses(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const studentId = parseInt(req.params.studentId);
            try {
                const comments = yield LessonsCommentsService_1.default.getRecentCommentsStudent(studentId);
                res.json({ "success": true, "response": comments });
                return;
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
}
exports.default = new StudentsController();

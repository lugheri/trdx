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
const coursesService_1 = __importDefault(require("../services/coursesService"));
const courses_dto_1 = require("./Dtos/courses.dto");
const courseModulesService_1 = __importDefault(require("../services/courseModulesService"));
const coursesLessonsService_1 = __importDefault(require("../services/coursesLessonsService"));
const LessonsAttachmentsService_1 = __importDefault(require("../services/LessonsAttachmentsService"));
const lessonAccessRulesService_1 = __importDefault(require("../services/lessonAccessRulesService"));
const moment_1 = __importDefault(require("moment"));
const studentsService_1 = __importDefault(require("../services/studentsService"));
const quiz_dto_1 = require("./Dtos/quiz.dto");
const quizQuestionOptionsService_1 = __importDefault(require("../services/quizQuestionOptionsService"));
const quizQuestionsService_1 = __importDefault(require("../services/quizQuestionsService"));
class CatalogController {
    //Courses
    newCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const dataCourse = courses_dto_1.CoursesDTO.safeParse(req.body);
            if (!dataCourse.success) {
                res.json({ "error": dataCourse.error });
                return;
            }
            try {
                const dataNewCourse = yield coursesService_1.default.createNewCourse(dataCourse.data);
                if (dataNewCourse) {
                    res.json({ "success": true, "response": dataNewCourse });
                    return;
                }
                res.json({ "error": "Falha ao criar o novo Curso!" });
                return;
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
    listCourses(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const pagination = courses_dto_1.PaginationCoursesDTO.safeParse(req.body);
            if (!pagination.success) {
                res.json({ "error": pagination.error });
                return;
            }
            try {
                const listCourses = yield coursesService_1.default.listCourses(pagination.data);
                res.json({ "success": true, "response": listCourses });
                return;
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
    infoCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const courseId = parseInt(req.params.courseId);
            try {
                const course = yield coursesService_1.default.getCourse(courseId);
                res.json({ "success": true, "response": course });
                return;
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
    editCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const courseId = parseInt(req.params.courseId);
            const dataCourse = courses_dto_1.CoursesPartialDTO.safeParse(req.body);
            if (!dataCourse.success) {
                res.json({ "error": dataCourse.error });
                return;
            }
            try {
                const edit = yield coursesService_1.default.editCourse(courseId, dataCourse.data);
                res.json({ "success": true, "response": edit });
                return;
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
    //Modules
    newModuleCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const dataModule = courses_dto_1.ModulesCourseDTO.safeParse(req.body);
            if (!dataModule.success) {
                res.json({ "error": dataModule.error });
                return;
            }
            try {
                const dataNewModule = yield courseModulesService_1.default.createNewModuleCourse(dataModule.data);
                if (dataNewModule) {
                    res.json({ "success": true, "response": dataNewModule });
                    return;
                }
                res.json({ "error": "Falha ao criar o novo Módulo!" });
                return;
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
    modulesCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const courseId = parseInt(req.params.courseId);
            try {
                const modulesCourse = yield courseModulesService_1.default.modulesCourse(courseId);
                res.json({ "success": true, "response": modulesCourse });
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
    infoModuleCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const moduleId = parseInt(req.params.moduleId);
            try {
                const infoModule = yield courseModulesService_1.default.infoModuleCourse(moduleId);
                res.json({ "success": true, "response": infoModule });
                return;
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
    editModuleCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const moduleId = parseInt(req.params.moduleId);
            const dataModuleCourse = courses_dto_1.ModulesCourseDTO.safeParse(req.body);
            if (!dataModuleCourse.success) {
                res.json({ "error": dataModuleCourse.error });
                return;
            }
            try {
                const edit = yield courseModulesService_1.default.editModuleCourse(moduleId, dataModuleCourse.data);
                res.json({ "success": true, "response": edit });
                return;
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
    //Lessons
    newLessonModule(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const dataLesson = courses_dto_1.ModulesLessonModuleDTO.safeParse(req.body);
            if (!dataLesson.success) {
                res.json({ "error": dataLesson.error });
                return;
            }
            try {
                const dataNewLesson = yield coursesLessonsService_1.default.createNewLessonModule(dataLesson.data);
                if (dataNewLesson) {
                    res.json({ "success": true, "response": dataNewLesson.id });
                    return;
                }
                res.json({ "error": "Falha ao criar o novo Aula!" });
                return;
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
    lessonsModule(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const moduleId = parseInt(req.params.moduleId);
            try {
                const lessonsModule = yield coursesLessonsService_1.default.lessonsModulesCourse(moduleId);
                res.json({ "success": true, "response": lessonsModule });
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
    nextLessonOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const moduleId = parseInt(req.params.moduleId);
            try {
                const orderLastLesson = yield coursesLessonsService_1.default.nextLessonOrder(moduleId);
                let nextOrder = 0;
                if (orderLastLesson) {
                    nextOrder = orderLastLesson.order + 1;
                }
                else {
                    const infoModule = yield courseModulesService_1.default.infoModuleCourse(moduleId);
                    nextOrder = typeof infoModule == 'boolean' ? 101 : infoModule.order + 1;
                }
                res.json({ "success": true, "response": nextOrder });
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
    infoLessonModule(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const lessonId = parseInt(req.params.lessonId);
            try {
                const infoLesson = yield coursesLessonsService_1.default.infoLesson(lessonId);
                res.json({ "success": true, "response": infoLesson });
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
    editLessonModule(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const lessonId = parseInt(req.params.lessonId);
            const dataLessonModule = courses_dto_1.ModulesLessonModuleDTO.safeParse(req.body);
            if (!dataLessonModule.success) {
                res.json({ "error": dataLessonModule.error });
                return;
            }
            try {
                const edit = yield coursesLessonsService_1.default.editLessonModule(lessonId, dataLessonModule.data);
                res.json({ "success": true, "response": edit });
                return;
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
    firstLessonModule(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const moduleId = parseInt(req.params.moduleId);
            try {
                const lesson = yield coursesLessonsService_1.default.firstLessonModule(moduleId);
                res.json({ "success": true, "response": lesson });
                return;
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
    //Attachments
    newAttachmentsLesson(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const dataAttachment = courses_dto_1.LessonAttachmentDTO.safeParse(req.body);
            if (!dataAttachment.success) {
                res.json({ "error": dataAttachment.error });
                return;
            }
            console.log('newAttachmentsLesson', dataAttachment.data);
            try {
                const dataNewAttachment = yield LessonsAttachmentsService_1.default.createNewAttachmentsLesson(dataAttachment.data);
                if (dataNewAttachment) {
                    res.json({ "success": true, "response": dataNewAttachment });
                    return;
                }
                res.json({ "error": "Falha ao criar o novo Aula!" });
                return;
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
    uploadFileAttachments(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const dataForm = req.body;
            const dataFile = req.file;
            const nameFile = dataFile ? `${dataFile.filename}` : "";
            console.log('uploadFileAttachments', req.file);
            if (dataFile) {
                try {
                    const dataAttachment = {
                        course_id: dataForm.course_id,
                        module_id: dataForm.module_id,
                        lesson_id: dataForm.lesson_id,
                        name: dataForm.name,
                        description: dataForm.description,
                        type: dataForm.type,
                        material: nameFile,
                        status: 1
                    };
                    yield LessonsAttachmentsService_1.default.createNewAttachmentsLesson(dataAttachment);
                    res.json({ "success": true, "response": true });
                    return;
                }
                catch (err) {
                    console.error(err);
                }
            }
            res.json({ "error": true });
        });
    }
    lessonAttachments(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const lessonId = parseInt(req.params.lessonId);
            try {
                const attachmentsLesson = yield LessonsAttachmentsService_1.default.getAttachmentsLesson(lessonId);
                res.json({ "success": true, "response": attachmentsLesson });
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
    infoAttachmentsLesson(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const attachmentId = parseInt(req.params.attachmentId);
            try {
                const attachmentLesson = yield LessonsAttachmentsService_1.default.infoAttachmentsLesson(attachmentId);
                res.json({ "success": true, "response": attachmentLesson });
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
    editAttachmentsLesson(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const attachmentId = parseInt(req.params.attachmentId);
            const dataAttachment = courses_dto_1.LessonAttachmentDTO.safeParse(req.body);
            if (!dataAttachment.success) {
                res.json({ "error": dataAttachment.error });
                return;
            }
            try {
                yield LessonsAttachmentsService_1.default.editAttachmentLesson(attachmentId, dataAttachment.data);
                res.json({ "success": true, "response": true });
                return;
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
    removeAttachmentsLesson(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const attachmentId = parseInt(req.params.attachmentId);
            const lessonId = parseInt(req.params.lessonId);
            try {
                yield LessonsAttachmentsService_1.default.deleteAttachmentLesson(attachmentId, lessonId);
                res.json({ "success": true, "response": true });
                return;
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
    //LessonAccessRule
    newAccessRuleLesson(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const dataAccessRule = courses_dto_1.LessonAccessRuleDTO.safeParse(req.body);
            if (!dataAccessRule.success) {
                res.json({ "error": dataAccessRule.error });
                return;
            }
            try {
                const dataNewAccessRuleLesson = yield lessonAccessRulesService_1.default.createNewLessonAccessRule(dataAccessRule.data);
                if (dataNewAccessRuleLesson) {
                    res.json({ "success": true, "response": dataNewAccessRuleLesson });
                    return;
                }
                res.json({ "error": "Falha ao criar o novo Aula!" });
                return;
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
    lessonAccessRule(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const lessonId = parseInt(req.params.lessonId);
            try {
                const accessRule = yield lessonAccessRulesService_1.default.getLessonAccessRule(lessonId);
                res.json({ "success": true, "response": accessRule });
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
    editLessonAccessRule(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const lessonId = parseInt(req.params.lessonId);
            const dataLessonAccessRule = courses_dto_1.LessonAccessRuleDTO.safeParse(req.body);
            if (!dataLessonAccessRule.success) {
                res.json({ "error": dataLessonAccessRule.error });
                return;
            }
            try {
                const checkAccessRule = yield lessonAccessRulesService_1.default.getLessonAccessRule(lessonId);
                if (checkAccessRule) {
                    yield lessonAccessRulesService_1.default.editLessonAccessRule(lessonId, dataLessonAccessRule.data);
                }
                else {
                    const newAccess = Object.assign({ lesson_id: lessonId }, dataLessonAccessRule.data);
                    yield lessonAccessRulesService_1.default.createNewLessonAccessRule(newAccess);
                }
                res.json({ "success": true, "response": true });
                return;
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
    checkAccessLesson(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const lessonId = parseInt(req.params.lessonId);
            const studentId = parseInt(req.params.studentId);
            try {
                const accessRule = yield lessonAccessRulesService_1.default.getLessonAccessRule(lessonId);
                if (accessRule) {
                    if (accessRule.rule_access == "L") {
                        res.json({ "success": true, "response": { "access": true } });
                    }
                    if (accessRule.rule_access == "D") {
                        const infoStudent = yield studentsService_1.default.getStudent(studentId);
                        if (infoStudent) {
                            const days = accessRule.days_to_access;
                            const since = infoStudent.since;
                            //const sinceStudent = moment(since).format('YYYY-MM-DD');
                            const sinceStudent = (0, moment_1.default)(since, 'YYYY-MM-DD');
                            const accessDate = sinceStudent.add(days, 'days').format('YYYY-MM-DD');
                            //const accessDate = moment(sinceStudent.add(days, 'days').format('YYYY-MM-DD'), 'YYYY-MM-DD');            
                            const today = (0, moment_1.default)();
                            if ((0, moment_1.default)(accessDate).isAfter(today)) {
                                res.json({ "success": true, "response": { access: false, dateAccess: accessDate, msg: "" } });
                            }
                            else {
                                res.json({ "success": true, "response": { access: true, dateAccess: "", msg: "" } });
                            }
                        }
                        else {
                            res.json({ "success": true, "response": { access: false, dateAccess: "", msg: "Dados do aluno não encontrados!" } });
                        }
                    }
                    if (accessRule.rule_access == "F") {
                        const accessDate = accessRule.date_of_access;
                        const momentRule = (0, moment_1.default)(accessDate, 'YYYY-MM-DD');
                        const today = (0, moment_1.default)();
                        if (momentRule.isAfter(today)) {
                            res.json({ "success": true, "response": { access: false, dateAccess: accessDate, msg: "" } });
                        }
                        else {
                            res.json({ "success": true, "response": { access: true, dateAccess: "", msg: "" } });
                        }
                    }
                }
                else {
                    res.json({ "success": true, "response": { access: true, dateAccess: "", msg: "" } });
                }
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
    addCoursesCommunity(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const courseId = parseInt(req.params.courseId);
            const studentsCommunity = yield studentsService_1.default.studentsCommunity();
            return false;
        });
    }
    //Questions
    newQuestion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const dataQuestion = quiz_dto_1.QuizQuestionDTO.safeParse(req.body);
            if (!dataQuestion.success) {
                res.json({ "error": true, "message": dataQuestion.error });
                return;
            }
            try {
                const dataNewQuestion = yield quizQuestionsService_1.default.createNewQuestion(dataQuestion.data);
                if (dataNewQuestion) {
                    res.json({ "success": true, "response": dataNewQuestion });
                    return;
                }
                res.json({ "error": true, "message": "Falha ao criar o nova Questão!" });
                return;
            }
            catch (err) {
                console.error(err);
                res.json({ "error": true, "message": err });
            }
        });
    }
    getLastOrderQuestion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const quizId = parseInt(req.params.quiz_id);
            try {
                const lastOrderQuestion = yield quizQuestionsService_1.default.lastOrderQuestion(quizId);
                res.json({ "success": true, "response": lastOrderQuestion });
                return;
            }
            catch (err) {
                console.error(err);
                res.json({ "error": true, "message": err });
            }
        });
    }
    listQuestions(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const quizId = parseInt(req.params.quiz_id);
            try {
                const listQuestion = yield quizQuestionsService_1.default.listQuestions(quizId);
                res.json({ "success": true, "response": listQuestion });
                return;
            }
            catch (err) {
                console.error(err);
                res.json({ "error": true, "message": err });
            }
        });
    }
    infoQuestions(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const questionId = parseInt(req.params.question_id);
            try {
                const question = yield quizQuestionsService_1.default.infoQuestion(questionId);
                res.json({ "success": true, "response": question });
                return;
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
    editQuestion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const questionId = parseInt(req.params.question_id);
            const dataQuestion = quiz_dto_1.QuizQuestionDTO.safeParse(req.body);
            if (!dataQuestion.success) {
                res.json({ "error": dataQuestion.error });
                return;
            }
            try {
                const edit = yield quizQuestionsService_1.default.editQuestion(questionId, dataQuestion.data);
                res.json({ "success": true, "response": edit });
                return;
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
    //Options Questions
    newOptionQuestion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const dataQuestionOption = quiz_dto_1.QuizQuestionOptionsDTO.safeParse(req.body);
            if (!dataQuestionOption.success) {
                res.json({ "error": true, "message": dataQuestionOption.error });
                return;
            }
            try {
                const dataNewOption = yield quizQuestionOptionsService_1.default.createNewQuestionOptions(dataQuestionOption.data);
                if (dataNewOption) {
                    res.json({ "success": true, "response": dataNewOption });
                    return;
                }
                res.json({ "error": true, "message": "Falha ao criar o opção de resposta!" });
                return;
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
    getLastOrderOption(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const questionId = parseInt(req.params.question_id);
            try {
                const lastOrderOption = yield quizQuestionOptionsService_1.default.lastOrderOptions(questionId);
                res.json({ "success": true, "response": lastOrderOption });
                return;
            }
            catch (err) {
                console.error(err);
                res.json({ "error": true, "message": err });
            }
        });
    }
    listOptionsQuestion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const questionId = parseInt(req.params.question_id);
            try {
                const listOptionsQuestion = yield quizQuestionOptionsService_1.default.listQuestionsOptions(questionId);
                res.json({ "success": true, "response": listOptionsQuestion });
                return;
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
    infoOptionQuestion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const optionId = parseInt(req.params.option_id);
            try {
                const options = yield quizQuestionOptionsService_1.default.infoQuestionOption(optionId);
                res.json({ "success": true, "response": options });
                return;
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
    editOptionQuestion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const optionId = parseInt(req.params.option_id);
            const dataOptionQuestion = quiz_dto_1.QuizQuestionOptionsDTO.safeParse(req.body);
            if (!dataOptionQuestion.success) {
                res.json({ "error": dataOptionQuestion.error });
                return;
            }
            try {
                const edit = yield quizQuestionOptionsService_1.default.editQuestionOption(optionId, dataOptionQuestion.data);
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
exports.default = new CatalogController();

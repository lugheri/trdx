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
const courses_dto_1 = require("./Dtos/courses.dto");
const studentCoursesServices_1 = __importDefault(require("../services/studentCoursesServices"));
const coursesValidityContractsService_1 = __importDefault(require("../services/coursesValidityContractsService"));
const coursesLessonsService_1 = __importDefault(require("../services/coursesLessonsService"));
const lessonsViewedService_1 = __importDefault(require("../services/lessonsViewedService"));
const date_fns_1 = require("date-fns");
const LessonsCommentsService_1 = __importDefault(require("../services/LessonsCommentsService"));
const StudentsNotesService_1 = __importDefault(require("../services/StudentsNotesService"));
class CoursesController {
    //Students Methods
    myCourses(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const studentId = parseInt(req.params.studentId);
            try {
                const myCourses = yield studentCoursesServices_1.default.myCourses(studentId);
                res.json({ "success": true, "response": myCourses });
                return;
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
    validityCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const studentId = parseInt(req.params.studentId);
            const courseId = parseInt(req.params.courseId);
            try {
                const checkStudentCourse = yield studentCoursesServices_1.default.checkCourseStudent(studentId, courseId);
                if (checkStudentCourse == false) {
                    res.json({ "success": true, "response": 'not_have' });
                    return;
                }
                const validityCourse = yield coursesValidityContractsService_1.default.validityCourse(courseId, studentId);
                let contractStatus = 'expired';
                if (validityCourse) {
                    if (validityCourse.payment_cycle == 'V') {
                        contractStatus = 'valid';
                    }
                    else {
                        const endContract = validityCourse.end_validity;
                        const today = new Date();
                        const dateEndedContract = (0, date_fns_1.parseISO)(endContract);
                        if ((0, date_fns_1.isAfter)(dateEndedContract, today) || (0, date_fns_1.format)(dateEndedContract, 'yyyy-MM-dd') === (0, date_fns_1.format)(today, 'yyyy-MM-dd')) {
                            contractStatus = 'valid';
                        }
                        else {
                            contractStatus = 'expired';
                        }
                    }
                }
                res.json({ "success": true, "response": contractStatus });
                return;
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
    progressStudent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const studentId = parseInt(req.params.studentId);
            const coursesStudents = yield studentCoursesServices_1.default.myCourses(studentId);
            let totalLessons = 0;
            let viewedLessons = 0;
            for (const course of coursesStudents) {
                const lessons = yield coursesLessonsService_1.default.lessonsCourse(course.id);
                const viewsCourse = yield lessonsViewedService_1.default.lessonsViewed(studentId, course.id);
                totalLessons += lessons;
                viewedLessons += viewsCourse;
            }
            const progress = viewedLessons == 0 ? 0 : Math.round((viewedLessons / totalLessons) * 100);
            console.log(viewedLessons, '/', totalLessons, '=', progress);
            res.json({ "success": true, "response": progress });
        });
    }
    progressCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const studentId = parseInt(req.params.studentId);
            const courseId = parseInt(req.params.courseId);
            try {
                const lessonsCourse = yield coursesLessonsService_1.default.lessonsCourse(courseId);
                const viewedLessons = yield lessonsViewedService_1.default.lessonsViewed(studentId, courseId);
                const progress = viewedLessons == 0 ? 0 : Math.round((viewedLessons / lessonsCourse) * 100);
                res.json({ "success": true, "response": progress });
                return;
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
    progressModule(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const studentId = parseInt(req.params.studentId);
            const moduleId = parseInt(req.params.moduleId);
            try {
                const lessonsModule = yield coursesLessonsService_1.default.totalLessonsModule(moduleId);
                const viewedLessons = yield lessonsViewedService_1.default.lessonsViewedByModule(studentId, moduleId);
                const progress = viewedLessons == 0 ? 0 : Math.round((viewedLessons / lessonsModule) * 100);
                res.json({ "success": true, "response": progress });
                return;
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
    lastLessonViewed(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const studentId = parseInt(req.params.studentId);
            try {
                const infoNextLesson = yield lessonsViewedService_1.default.lastLessonStudent(studentId);
                if (!infoNextLesson) {
                    res.json({ "success": true, "response": null });
                    return;
                }
                const courseId = infoNextLesson.course_id;
                const infoLesson = yield coursesLessonsService_1.default.infoLesson(infoNextLesson.lesson_id);
                const order = infoLesson ? infoLesson.order : 0;
                const nextCourseLesson = yield coursesLessonsService_1.default.nextLessonCourse(courseId, order);
                const nextLessonId = nextCourseLesson ? nextCourseLesson.id : infoNextLesson.lesson_id;
                //Info Next Lesson
                res.json({ "success": true, "response": nextLessonId });
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
    watchedLesson(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const watch = courses_dto_1.WatchedLessonDTO.safeParse(req.body);
            if (!watch.success) {
                res.json({ "error": watch.error });
                return;
            }
            try {
                yield lessonsViewedService_1.default.setViewedLesson(watch.data);
                res.json({ "success": true, "response": watch.data.viewed });
                return;
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
    removeWatchedLesson(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const courseId = parseInt(req.params.courseId);
            const moduleId = parseInt(req.params.moduleId);
            const lessonId = parseInt(req.params.lessonId);
            const studentId = parseInt(req.params.studentId);
            try {
                yield lessonsViewedService_1.default.removeViewedLesson(courseId, moduleId, lessonId, studentId);
                res.json({ "success": true, "response": 0 });
                return;
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
    getWatchedLesson(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const lessonId = parseInt(req.params.lessonId);
            const studentId = parseInt(req.params.studentId);
            try {
                const lesson = yield lessonsViewedService_1.default.lessonStudentViewed(lessonId, studentId);
                res.json({ "success": true, "response": lesson });
                return;
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
    continueCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const courseId = parseInt(req.params.courseId);
            const studentId = parseInt(req.params.studentId);
            try {
                const lastLesson = yield lessonsViewedService_1.default.lastLessonViewed(studentId, courseId);
                const infoLesson = yield coursesLessonsService_1.default.infoLesson(lastLesson);
                const order = infoLesson ? infoLesson.order : 0;
                const nextLesson = yield coursesLessonsService_1.default.nextLessonCourse(courseId, order);
                res.json({ "success": true, "response": { "lastLesson": lastLesson,
                        "nextLesson": nextLesson ? nextLesson.id : 0,
                        "module": nextLesson ? nextLesson.module_id : 0 } });
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
    nextLesson(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //const studentId = parseInt(req.params.studentId)
            const courseId = parseInt(req.params.courseId);
            const lessonId = parseInt(req.params.lessonId);
            try {
                const infoLesson = yield coursesLessonsService_1.default.infoLesson(lessonId);
                const order = infoLesson ? infoLesson.order : 0;
                const nextLesson = yield coursesLessonsService_1.default.nextLessonCourse(courseId, order);
                res.json({ "success": true, "response": { "lastLesson": lessonId,
                        "nextLesson": nextLesson ? nextLesson.id : 0,
                        "module": nextLesson ? nextLesson.module_id : 0 } });
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
    ratingLesson(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const lessonId = parseInt(req.params.lessonId);
            const studentId = parseInt(req.params.studentId);
            const score = courses_dto_1.RatingLessonDTO.safeParse(req.body);
            if (!score.success) {
                res.json({ "error": score.error });
                return;
            }
            try {
                yield lessonsViewedService_1.default.setScoreLesson(lessonId, studentId, score.data);
                res.json({ "success": true, "response": score.data.score });
                return;
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
    //Attachment
    //Notes
    studentsNotes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const courseId = parseInt(req.params.courseId);
            const studentId = parseInt(req.params.studentId);
            try {
                const notesCourse = yield StudentsNotesService_1.default.studentsNotes(courseId, studentId);
                res.json({ "success": true, "response": notesCourse });
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
    editNote(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const noteStudents = courses_dto_1.NoteStudentsDTO.safeParse(req.body);
            if (!noteStudents.success) {
                res.json({ "error": noteStudents.error });
                return;
            }
            try {
                const note = yield StudentsNotesService_1.default.editNote(noteStudents.data);
                res.json({ "success": true, "response": note });
                return;
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
    //Comments Lessons
    totalCommentsLesson(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const lessonId = parseInt(req.params.lessonId);
            try {
                const totalLessons = yield LessonsCommentsService_1.default.totalCommentsLesson(lessonId);
                res.json({ "success": true, "response": totalLessons });
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
    commentsLesson(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const lessonId = parseInt(req.params.lessonId);
            const page = parseInt(req.params.page);
            const studentId = parseInt(req.params.studentId);
            try {
                const commentsLessons = yield LessonsCommentsService_1.default.getCommentsLesson(lessonId, page, studentId);
                res.json({ "success": true, "response": commentsLessons });
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
    commentsAnswersLesson(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const commentId = parseInt(req.params.commentId);
            const page = parseInt(req.params.page);
            try {
                const commentsAnswersLesson = yield LessonsCommentsService_1.default.getCommentsAnswersLesson(commentId, page);
                res.json({ "success": true, "response": commentsAnswersLesson });
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
    newCommentLesson(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const commentsData = courses_dto_1.NewCommentLessonDTO.safeParse(req.body);
            if (!commentsData.success) {
                res.json({ "error": commentsData.error });
                return;
            }
            try {
                yield LessonsCommentsService_1.default.newCommentLesson(commentsData.data);
                res.json({ "success": true, "response": true });
                return;
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
    commentsPendingApproval(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const studentId = parseInt(req.params.studentId);
            const lessonId = parseInt(req.params.lessonId);
            try {
                const commentsPendingApproval = yield LessonsCommentsService_1.default.commentsPendingApproval(studentId, lessonId);
                res.json({ "success": true, "response": commentsPendingApproval });
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
    lessonsModule(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const courseId = parseInt(req.params.courseId);
            const moduleId = parseInt(req.params.moduleId);
            const studentId = parseInt(req.params.studentId);
            try {
                const lessonsModule = yield coursesLessonsService_1.default.lessonsModule(courseId, moduleId, studentId);
                res.json({ "success": true, "response": lessonsModule });
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
}
exports.default = new CoursesController();

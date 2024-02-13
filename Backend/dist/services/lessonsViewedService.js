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
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("../config/redis");
const LessonsViewed_1 = require("../models/LessonsViewed");
class LessonsViewedService {
    allLessonsStudentViewed(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const totalViewed = yield LessonsViewed_1.LessonsViewed.count({
                where: { student_id: studentId }
            });
            return totalViewed;
        });
    }
    lessonsViewed(studentId, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const redisKey = `lessonsViewedbyCourse:[studentId:[${studentId}],courseId:[${courseId}]]`;
            const lessonViewedRedis = yield (0, redis_1.redisGet)(redisKey);
            if (lessonViewedRedis !== null) {
                return lessonViewedRedis;
            }
            const totalViewed = yield LessonsViewed_1.LessonsViewed.count({
                where: { student_id: studentId, course_id: courseId }
            });
            yield (0, redis_1.redisSet)(redisKey, totalViewed, 30);
            return totalViewed;
        });
    }
    lastLessonStudent(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const redisKey = `nextLessonStudent:[${studentId}]`;
            const nextLastStudentRedis = yield (0, redis_1.redisGet)(redisKey);
            if (nextLastStudentRedis !== null) {
                return nextLastStudentRedis;
            }
            const results = yield LessonsViewed_1.LessonsViewed.findOne({
                attributes: ['course_id', 'module_id', 'lesson_id'],
                where: { student_id: studentId },
                order: [['id', 'DESC']]
            });
            if (!results)
                return null;
            yield (0, redis_1.redisSet)(nextLastStudentRedis, results);
            return results;
        });
    }
    lessonsViewedByModule(studentId, moduleId) {
        return __awaiter(this, void 0, void 0, function* () {
            const redisKey = `lessonsViewedByModule:[studentId:[${studentId}],moduleId:[${moduleId}]]`;
            const lessonsViewedByModuleRedis = yield (0, redis_1.redisGet)(redisKey);
            if (lessonsViewedByModuleRedis !== null) {
                return lessonsViewedByModuleRedis;
            }
            const totalViewed = yield LessonsViewed_1.LessonsViewed.count({
                where: { student_id: studentId, module_id: moduleId }
            });
            yield (0, redis_1.redisSet)(redisKey, totalViewed, 30);
            return totalViewed;
        });
    }
    setViewedLesson(viewedData) {
        return __awaiter(this, void 0, void 0, function* () {
            const [newView, created] = yield LessonsViewed_1.LessonsViewed.findCreateFind({
                where: { student_id: viewedData.student_id, module_id: viewedData.module_id, lesson_id: viewedData.lesson_id },
                defaults: viewedData
            });
            yield (0, redis_1.redisDel)(`Lessons:lessonsModuleStudent:courseId[${viewedData.course_id}]:moduleId[${viewedData.module_id}]:studentId[${viewedData.student_id}]`);
            yield (0, redis_1.redisDel)(`lessonsViewedbyCourse:[studentId:[${viewedData.student_id}],courseId:[${viewedData.course_id}]]`);
            yield (0, redis_1.redisDel)(`lessonsViewedByModule:[studentId:[${viewedData.student_id}],moduleId:[${viewedData.module_id}]]`);
            yield (0, redis_1.redisDel)(`nextLessonStudent:[${viewedData.student_id}]`);
            yield (0, redis_1.redisSet)(`lastLessonViewed:[studentId:[${viewedData.student_id}],courseId:[${viewedData.lesson_id}]]`, newView.id);
            yield (0, redis_1.redisSet)(`lessonViewed:[studentId:[${viewedData.student_id}],lessonId:[${viewedData.lesson_id}]]`, newView);
            console.info('New', newView);
            console.info('Created', created);
            return newView.id ? newView : false;
        });
    }
    removeViewedLesson(courseId, moduleId, lessonId, studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield LessonsViewed_1.LessonsViewed.destroy({ where: { student_id: studentId, lesson_id: lessonId } });
            yield (0, redis_1.redisDel)(`lessonViewed:[studentId:[${studentId}],lessonId:[${lessonId}]]`);
            yield (0, redis_1.redisDel)(`nextLessonStudent:[${studentId}]`);
            yield (0, redis_1.redisDel)(`Lessons:lessonsModuleStudent:courseId[${courseId}]:moduleId[${moduleId}]:studentId[${studentId}]`);
            return true;
        });
    }
    lessonStudentViewed(lessonId, studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const redisKey = `lessonViewed:[studentId:[${studentId}],lessonId:[${lessonId}]]`;
            const lessonViewed = yield (0, redis_1.redisGet)(redisKey);
            //if(lessonViewed!==null){return lessonViewed}
            const viewed = yield LessonsViewed_1.LessonsViewed.findOne({
                where: { student_id: studentId, lesson_id: lessonId }
            });
            yield (0, redis_1.redisSet)(redisKey, viewed, 60);
            return viewed;
        });
    }
    lastLessonViewed(studentId, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const redisKey = `lastLessonViewed:[studentId:[${studentId}],courseId:[${courseId}]]`;
            const lastLessonViewed = yield (0, redis_1.redisGet)(redisKey);
            if (lastLessonViewed !== null) {
                return lastLessonViewed;
            }
            const lastLesson = yield LessonsViewed_1.LessonsViewed.findOne({
                attributes: ['lesson_id'],
                where: { student_id: studentId, course_id: courseId },
                order: [['id', 'DESC']]
            });
            if (!lastLesson) {
                return 0;
            }
            yield (0, redis_1.redisSet)(redisKey, lastLesson.id);
            return lastLesson.lesson_id;
        });
    }
    setScoreLesson(lessonId, studentId, scoreData) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, redis_1.redisDel)(`lessonViewed:[studentId:[${studentId}],lessonId:[${lessonId}]]`);
            yield (0, redis_1.redisDel)(`nextLessonStudent:[${studentId}]`);
            yield LessonsViewed_1.LessonsViewed.update(scoreData, { where: { student_id: studentId, lesson_id: lessonId } });
            return true;
        });
    }
}
exports.default = new LessonsViewedService();

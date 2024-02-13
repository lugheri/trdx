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
const sequelize_1 = require("sequelize");
const CoursesLessons_1 = require("../models/CoursesLessons");
const LessonsViewed_1 = require("../models/LessonsViewed");
class CoursesLessonsService {
    lessonsCourse(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const redisKey = `Lessons:TotalLessonsCourse:[${courseId}]`;
            const lessonsCourseRd = yield (0, redis_1.redisGet)(redisKey);
            if (lessonsCourseRd !== null) {
                return lessonsCourseRd;
            }
            const totalLessons = yield CoursesLessons_1.CoursesLessons.count({
                where: { course_id: courseId, visibility: 1, status: 1 }
            });
            yield (0, redis_1.redisSet)(redisKey, totalLessons);
            return totalLessons;
        });
    }
    totalLessonsModule(moduleId) {
        return __awaiter(this, void 0, void 0, function* () {
            const redisKey = `Lessons:TotalLessonsModule:[${moduleId}]`;
            const lessonsCourseRd = yield (0, redis_1.redisGet)(redisKey);
            if (lessonsCourseRd !== null) {
                return lessonsCourseRd;
            }
            const totalLessons = yield CoursesLessons_1.CoursesLessons.count({
                where: { module_id: moduleId, visibility: 1, status: 1 }
            });
            yield (0, redis_1.redisSet)(redisKey, totalLessons);
            return totalLessons;
        });
    }
    createNewLessonModule(dataLessonModule) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, redis_1.redisDel)(`Lessons:TotalLessonsCourse:[${dataLessonModule.course_id}]`);
            yield (0, redis_1.redisDel)(`Lessons:TotalLessonsModule:[${dataLessonModule.module_id}]`);
            yield (0, redis_1.redisDel)(`Lessons:LessonsModule:[${dataLessonModule.module_id}]`);
            const [newLessonModule, created] = yield CoursesLessons_1.CoursesLessons.findOrCreate({
                where: { module_id: dataLessonModule.module_id, course_id: dataLessonModule.course_id, name: dataLessonModule.name, status: 1 },
                defaults: dataLessonModule
            });
            console.info(created);
            return newLessonModule.id ? newLessonModule : null;
        });
    }
    lessonsModulesCourse(moduleId) {
        return __awaiter(this, void 0, void 0, function* () {
            const redisKey = `Lessons:LessonsModule:[${moduleId}]`;
            const lessonsModulesRD = yield (0, redis_1.redisGet)(redisKey);
            if (lessonsModulesRD !== null) {
                return lessonsModulesRD;
            }
            const lessonsModulesCourse = yield CoursesLessons_1.CoursesLessons.findAll({
                where: { module_id: moduleId, status: 1 },
                order: [['order', 'ASC']],
            });
            yield (0, redis_1.redisSet)(redisKey, lessonsModulesCourse);
            return lessonsModulesCourse;
        });
    }
    firstLessonModule(moduleId) {
        return __awaiter(this, void 0, void 0, function* () {
            const lessonsModulesCourse = yield CoursesLessons_1.CoursesLessons.findOne({
                where: { module_id: moduleId, status: 1 },
                order: [['order', 'ASC']],
            });
            return lessonsModulesCourse ? lessonsModulesCourse.id : 0;
        });
    }
    nextLessonOrder(moduleId) {
        return __awaiter(this, void 0, void 0, function* () {
            const order = yield CoursesLessons_1.CoursesLessons.findOne({
                attributes: ['order'],
                where: { module_id: moduleId, status: 1 },
                order: [['order', 'DESC']],
                limit: 1
            });
            return order;
        });
    }
    infoLesson(lessonId) {
        return __awaiter(this, void 0, void 0, function* () {
            const redisKey = `Lessons:infoLesson:[${lessonId}]`;
            const infoLessonRedis = yield (0, redis_1.redisGet)(redisKey);
            if (infoLessonRedis !== null) {
                return infoLessonRedis;
            }
            const infoLesson = yield CoursesLessons_1.CoursesLessons.findByPk(lessonId);
            yield (0, redis_1.redisSet)(redisKey, infoLesson);
            return infoLesson;
        });
    }
    editLessonModule(lessonId, dataLesson) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, redis_1.redisDel)(`Lessons:TotalLessonsCourse:[${dataLesson.course_id}]`);
            yield (0, redis_1.redisDel)(`Lessons:TotalLessonsModule:[${dataLesson.module_id}]`);
            yield (0, redis_1.redisDel)(`Lessons:infoLesson:[${lessonId}]`);
            yield (0, redis_1.redisDel)(`Lessons:LessonsModule:[${dataLesson.module_id}]`);
            console.log(`Lessons:LessonsModule:[${dataLesson.module_id}]`);
            yield CoursesLessons_1.CoursesLessons.update(dataLesson, { where: { id: lessonId } });
            return true;
        });
    }
    lessonsModule(courseId, moduleId, studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const redisKey = `Lessons:lessonsModuleStudent:courseId[${courseId}]:moduleId[${moduleId}]:studentId[${studentId}]`;
            const lessonsModuleRD = yield (0, redis_1.redisGet)(redisKey);
            if (lessonsModuleRD !== null) {
                return lessonsModuleRD;
            }
            const lessonsModule = yield CoursesLessons_1.CoursesLessons.findAll({
                where: { course_id: courseId, module_id: moduleId, visibility: 1, status: 1 },
                order: [['order', 'ASC']],
                include: { attributes: ['id', 'student_id'], model: LessonsViewed_1.LessonsViewed, required: false, where: { student_id: studentId }, }
            });
            yield (0, redis_1.redisSet)(redisKey, lessonsModule, 30);
            return lessonsModule;
        });
    }
    nextLessonCourse(courseId, orderLastLesson) {
        return __awaiter(this, void 0, void 0, function* () {
            const nextLesson = yield CoursesLessons_1.CoursesLessons.findOne({
                attributes: ['id', 'module_id'],
                where: { order: { [sequelize_1.Op.gt]: orderLastLesson }, course_id: courseId, visibility: 1, status: 1 },
                order: [['order', 'ASC']]
            });
            return nextLesson;
        });
    }
}
exports.default = new CoursesLessonsService();

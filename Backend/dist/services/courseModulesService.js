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
const CoursesModules_1 = require("../models/CoursesModules");
class CourseModulesService {
    createNewModuleCourse(dataModuleCourse) {
        return __awaiter(this, void 0, void 0, function* () {
            const redisKey = `Modules:listModules:courseId[${dataModuleCourse.course_id}]`;
            yield (0, redis_1.redisDel)(redisKey);
            const [newModuleCourse, created] = yield CoursesModules_1.CoursesModules.findOrCreate({
                where: { module: dataModuleCourse.module, course_id: dataModuleCourse.course_id },
                defaults: dataModuleCourse
            });
            console.info(created);
            return newModuleCourse.id ? newModuleCourse : false;
        });
    }
    modulesCourse(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const redisKey = `Modules:listModules:courseId[${courseId}]`;
            const modulesCourseRd = yield (0, redis_1.redisGet)(redisKey);
            if (modulesCourseRd !== null) {
                return modulesCourseRd;
            }
            const modulesCourse = yield CoursesModules_1.CoursesModules.findAll({
                where: { course_id: courseId, status: 1 },
                order: [['order', 'ASC']],
            });
            return modulesCourse;
        });
    }
    infoModuleCourse(moduleId) {
        return __awaiter(this, void 0, void 0, function* () {
            const redisKey = `Module:infoModuleCourse:[${moduleId}]`;
            const getCourseRd = yield (0, redis_1.redisGet)(redisKey);
            if (getCourseRd !== null) {
                return getCourseRd;
            }
            const module = yield CoursesModules_1.CoursesModules.findByPk(moduleId);
            yield (0, redis_1.redisSet)(redisKey, module ? module : null);
            return module ? module : false;
        });
    }
    editModuleCourse(moduleId, dataModule) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(dataModule);
            const redisKey = `Module:infoModuleCourse:[${moduleId}]`;
            const redisListKey = `Modules:listModules:courseId[${dataModule.course_id}]`;
            yield (0, redis_1.redisDel)(redisKey);
            yield (0, redis_1.redisDel)(redisListKey);
            yield CoursesModules_1.CoursesModules.update(dataModule, { where: { id: moduleId } });
            return true;
        });
    }
}
exports.default = new CourseModulesService();

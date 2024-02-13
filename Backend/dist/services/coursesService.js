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
const Courses_1 = require("../models/Courses");
//import { Op } from "sequelize"
class CoursesService {
    createNewCourse(dataCourse) {
        return __awaiter(this, void 0, void 0, function* () {
            const [newCourse, created] = yield Courses_1.Courses.findOrCreate({
                where: { name: dataCourse.name },
                defaults: dataCourse
            });
            return newCourse.id ? newCourse : false;
        });
    }
    listCourses(pagination) {
        return __awaiter(this, void 0, void 0, function* () {
            const redisKey = `Course:listCourses:status[${pagination.status}],published:[${pagination.published}],orderedBy:[${pagination.orderedBy}],order:[${pagination.order}],page:[${pagination.page}]`;
            const listCoursesRd = yield (0, redis_1.redisGet)(redisKey);
            if (listCoursesRd !== null) {
                return listCoursesRd;
            }
            const p = pagination.page - 1;
            const qtdRegPage = 30;
            const offset = qtdRegPage * p;
            const listCourses = yield Courses_1.Courses.findAll({
                where: { status: pagination.status, published: pagination.published },
                order: [[pagination.orderedBy, pagination.order]],
                offset: offset,
                limit: qtdRegPage
            });
            yield (0, redis_1.redisSet)(redisKey, listCourses, 30);
            return listCourses;
        });
    }
    getCourse(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const redisKey = `Course:getCourse:[${courseId}]`;
            const getCourseRd = yield (0, redis_1.redisGet)(redisKey);
            if (getCourseRd !== null) {
                return getCourseRd;
            }
            const course = yield Courses_1.Courses.findByPk(courseId);
            yield (0, redis_1.redisSet)(redisKey, course ? course : null);
            return course ? course : false;
        });
    }
    editCourse(courseId, dataCourse) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, redis_1.redisDel)(`Course:listCourses:status[1],published:[1],orderedBy:[order],order:[ASC],page:[1]`);
            yield (0, redis_1.redisDel)(`Course:listCourses:status[1],published:[0],orderedBy:[order],order:[ASC],page:[1]`);
            yield (0, redis_1.redisDel)(`Course:listCourses:status[0],published:[1],orderedBy:[order],order:[ASC],page:[1]`);
            yield (0, redis_1.redisDel)(`Course:listCourses:status[0],published:[0],orderedBy:[order],order:[ASC],page:[1]`);
            yield (0, redis_1.redisDel)(`Course:listCourses:status[1],published:[1],orderedBy:[id],order:[ASC],page:[1]`);
            yield (0, redis_1.redisDel)(`Course:listCourses:status[1],published:[0],orderedBy:[id],order:[ASC],page:[1]`);
            yield (0, redis_1.redisDel)(`Course:listCourses:status[0],published:[1],orderedBy:[id],order:[ASC],page:[1]`);
            yield (0, redis_1.redisDel)(`Course:listCourses:status[0],published:[0],orderedBy:[id],order:[ASC],page:[1]`);
            yield (0, redis_1.redisDel)(`Course:getCourse:[${courseId}]`);
            yield Courses_1.Courses.update(dataCourse, { where: { id: courseId } });
            return true;
        });
    }
}
exports.default = new CoursesService();

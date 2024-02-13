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
const StudentsCourses_1 = require("../models/StudentsCourses");
const Courses_1 = require("../models/Courses");
const redis_1 = require("../config/redis");
class StudentCoursesService {
    //Students Methods
    /* async myCourses(studentId:number):Promise<StudentsCoursesInstance[]>{
       const myCourses = await StudentsCourses.findAll({
         where: {student_id:studentId},
         include: { model: Courses, where: { published:1, status:1 },},
       })
       return myCourses
     }*/
    totalMyCourses(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            /* const totalMyCourses = await StudentsCourses.count({
               where: { status:1,student_id:studentId },
             })    */
            const totalMyCourses = yield Courses_1.Courses.count({
                where: { status: 1 },
                include: { attributes: [], model: StudentsCourses_1.StudentsCourses, where: { student_id: studentId }, },
            });
            return totalMyCourses;
        });
    }
    myCourses(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const redisKey = `myCourses:[${studentId}]`;
            const myCoursesRedis = yield (0, redis_1.redisGet)(redisKey);
            if (myCoursesRedis !== null) {
                return myCoursesRedis;
            }
            const myCourses = yield Courses_1.Courses.findAll({
                attributes: ['id', 'image', 'background_image', 'default_thumb', 'name'],
                group: ['id'],
                where: { status: 1 },
                order: [['order', 'ASC']],
                include: { attributes: [], model: StudentsCourses_1.StudentsCourses, where: { student_id: studentId }, },
            });
            yield (0, redis_1.redisSet)(redisKey, myCourses);
            return myCourses;
        });
    }
    checkCourseStudent(studentId, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const redisKey = `checkCourseStudent:[${studentId}];courseId:[${courseId}]`;
            const checkCourseStudent = yield (0, redis_1.redisGet)(redisKey);
            if (checkCourseStudent !== null) {
                return checkCourseStudent;
            }
            const check = yield StudentsCourses_1.StudentsCourses.findAll({
                attributes: ['id'],
                where: { student_id: studentId, course_id: courseId, status: 1 },
                limit: 1
            });
            yield (0, redis_1.redisSet)(redisKey, check.length == 1 ? check[0].id : false);
            return check.length == 1 ? check[0].id : false;
        });
    }
    addCourseStudent(dataNewCourse) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, redis_1.redisDel)(`myCourses:[${dataNewCourse.student_id}]`);
            yield StudentsCourses_1.StudentsCourses.findOrCreate({
                where: { student_id: dataNewCourse.student_id, course_id: dataNewCourse.course_id },
                defaults: dataNewCourse
            });
            return true;
        });
    }
    delCourseStudent(idJoin) {
        return __awaiter(this, void 0, void 0, function* () {
            const dataJoin = yield StudentsCourses_1.StudentsCourses.findByPk(idJoin);
            yield (0, redis_1.redisDel)(`myCourses:[${dataJoin === null || dataJoin === void 0 ? void 0 : dataJoin.student_id}]`);
            yield (0, redis_1.redisDel)(`checkCourseStudent:[${dataJoin === null || dataJoin === void 0 ? void 0 : dataJoin.student_id}];courseId:[${dataJoin === null || dataJoin === void 0 ? void 0 : dataJoin.course_id}]`);
            yield StudentsCourses_1.StudentsCourses.destroy({ where: { id: idJoin } });
            return true;
        });
    }
}
exports.default = new StudentCoursesService();

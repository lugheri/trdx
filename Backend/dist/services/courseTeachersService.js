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
const CoursesTeachers_1 = require("../models/CoursesTeachers");
class CourseTeacherService {
    createNewTeacher(dataTeacher) {
        return __awaiter(this, void 0, void 0, function* () {
            const [newTeacher, created] = yield CoursesTeachers_1.CoursesTeachers.findOrCreate({
                where: { name: dataTeacher.name },
                defaults: dataTeacher
            });
            console.info(created);
            yield (0, redis_1.redisDel)(`Teachers:listTeachers`);
            return newTeacher.id ? newTeacher : false;
        });
    }
    infoTeacher(teacherId) {
        return __awaiter(this, void 0, void 0, function* () {
            const redisKey = `Teachers:infoTeacher:[${teacherId}]`;
            const infoTeacherRedis = yield (0, redis_1.redisGet)(redisKey);
            if (infoTeacherRedis !== null) {
                return infoTeacherRedis;
            }
            const teacher = yield CoursesTeachers_1.CoursesTeachers.findByPk(teacherId);
            const infoTeacher = teacher ? teacher : false;
            yield (0, redis_1.redisSet)(redisKey, infoTeacher);
            return infoTeacher;
        });
    }
    listTeachers() {
        return __awaiter(this, void 0, void 0, function* () {
            const redisKey = `Teachers:listTeachers`;
            const listTeachersRd = yield (0, redis_1.redisGet)(redisKey);
            if (listTeachersRd !== null) {
                return listTeachersRd;
            }
            const listTeachers = yield CoursesTeachers_1.CoursesTeachers.findAll({
                where: { status: 1 },
            });
            yield (0, redis_1.redisSet)(redisKey, listTeachers, 30);
            return listTeachers;
        });
    }
    editTeacher(teacherId, dataTeacher) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, redis_1.redisDel)(`Teachers:listTeachers`);
            yield (0, redis_1.redisDel)(`Teachers:infoTeacher:[${teacherId}]`);
            yield CoursesTeachers_1.CoursesTeachers.update(dataTeacher, { where: { id: teacherId } });
            return true;
        });
    }
}
exports.default = new CourseTeacherService();

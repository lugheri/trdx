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
const Students_1 = require("../models/Students");
const sequelize_1 = require("sequelize");
const StudentsLogins_1 = require("../models/StudentsLogins");
const redis_1 = require("../config/redis");
class StudentsService {
    createNewStudent(studentData) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, redis_1.redisDel)(`totalStudents[1]`);
            yield (0, redis_1.redisDel)(`totalStudents[0]`);
            const [newStudent, created] = yield Students_1.Students.findOrCreate({
                where: { mail: studentData.mail },
                defaults: studentData
            });
            console.info('created', created);
            return newStudent.id ? newStudent.id : false;
        });
    }
    getStudent(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const redisKey = `infoStudent:[${studentId}]`;
            const infoStudentRedis = yield (0, redis_1.redisGet)(redisKey);
            if (infoStudentRedis !== null) {
                return infoStudentRedis;
            }
            const student = yield Students_1.Students.findByPk(studentId);
            const infoStudent = student ? student : null;
            yield (0, redis_1.redisSet)(redisKey, infoStudent);
            return infoStudent;
        });
    }
    editStudent(studentId, studentData) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, redis_1.redisDel)(`infoStudent:[${studentId}]`);
            yield Students_1.Students.update(studentData, { where: { id: studentId } });
            return true;
        });
    }
    removeStudent(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, redis_1.redisDel)(`infoStudent:[${studentId}]`);
            yield (0, redis_1.redisDel)(`totalStudents[1]`);
            yield (0, redis_1.redisDel)(`totalStudents[0]`);
            yield Students_1.Students.destroy({ where: { id: studentId } });
            return true;
        });
    }
    listStudent(status, page, filter, orderedBy, order) {
        return __awaiter(this, void 0, void 0, function* () {
            const p = page - 1;
            const qtdRegPage = 15;
            const offset = qtdRegPage * p;
            const filterCondition = filter ? { nome: filter } : {};
            const listStudents = yield Students_1.Students.findAll({
                where: Object.assign({ status: status }, filterCondition),
                order: [[orderedBy, order]],
                offset: offset,
                limit: qtdRegPage
            });
            return listStudents;
        });
    }
    searchStudents(status, page, params, filter, orderedBy, order) {
        return __awaiter(this, void 0, void 0, function* () {
            const p = page - 1;
            const qtdRegPage = 15;
            const offset = qtdRegPage * p;
            const filterCondition = filter ? { community: filter } : {};
            const listStudents = yield Students_1.Students.findAll({
                where: Object.assign(Object.assign({ status: status }, filterCondition), { [sequelize_1.Op.or]: [{ name: { [sequelize_1.Op.like]: `%${params}%` } }, { mail: { [sequelize_1.Op.like]: `%${params}%` } }] }),
                order: [[orderedBy, order]],
                offset: offset,
                limit: qtdRegPage
            });
            return listStudents;
        });
    }
    totalStudents(status) {
        return __awaiter(this, void 0, void 0, function* () {
            const redisKey = `totalStudents[${status}]`;
            const totalStudentsRedis = yield (0, redis_1.redisGet)(redisKey);
            if (totalStudentsRedis != null) {
                return totalStudentsRedis;
            }
            const totalStudents = yield Students_1.Students.count({
                where: { status: status }
            });
            yield (0, redis_1.redisSet)(redisKey, totalStudents);
            return totalStudents;
        });
    }
    totalFilteredStudents(params, value, filter, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const filterCondition = filter ? { community: filter } : {};
            const paramsSearch = params ? { [params]: { [sequelize_1.Op.like]: `%${value}%` } } : {};
            const totalStudents = yield Students_1.Students.count({
                where: Object.assign(Object.assign({ status: status }, filterCondition), paramsSearch)
            });
            return totalStudents;
        });
    }
    checkCommunityStatusStudent(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const redisKey = `typeAccessStudent:[${studentId}]`;
            const communityStatusStudentRedis = yield (0, redis_1.redisGet)(redisKey);
            if (communityStatusStudentRedis !== null) {
                return communityStatusStudentRedis;
            }
            const access = yield Students_1.Students.findOne({
                attributes: ['community'],
                where: { id: studentId, status: 1 },
                limit: 1
            });
            const communityStatusStudent = access ? access : false;
            yield (0, redis_1.redisSet)(redisKey, communityStatusStudent);
            return communityStatusStudent;
        });
    }
    getLastAccessStudent(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const lastAccess = yield StudentsLogins_1.StudentsLogins.findOne({
                where: { student_id: studentId },
                order: [['id', 'DESC']],
                limit: 1
            });
            return lastAccess;
        });
    }
    searchStudentsOld(searchParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const p = searchParams.page - 1;
            const qtdRegPage = 30;
            const offset = qtdRegPage * p;
            const students = yield Students_1.Students.findAll({ where: { [searchParams.params]: { [sequelize_1.Op.like]: `%${searchParams.value}%` }, status: searchParams.status },
                order: [[searchParams.orderedBy, searchParams.order]],
                offset: offset,
                limit: qtdRegPage });
            return students;
        });
    }
    studentsCommunity() {
        return __awaiter(this, void 0, void 0, function* () {
            const students = yield Students_1.Students.findAll({ where: { community: 1, status: 1 } });
            return students;
        });
    }
}
exports.default = new StudentsService();

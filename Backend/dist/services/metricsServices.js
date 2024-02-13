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
const moment_1 = __importDefault(require("moment"));
const mysql_1 = require("../instances/mysql");
const sequelize_1 = require("sequelize");
class metricsService {
    countStudents(community, date) {
        return __awaiter(this, void 0, void 0, function* () {
            const since = date ? `AND since LIKE '${date}%'` : '';
            const query = `SELECT COUNT(id) as total 
                     FROM students
                    WHERE community=${community} AND status=1 ${since}`;
            const students = yield mysql_1.sequelize.query(query, { type: sequelize_1.QueryTypes.SELECT });
            return students[0].total;
        });
    }
    studentStatus(status) {
        return __awaiter(this, void 0, void 0, function* () {
            const date = (0, moment_1.default)();
            const today = date.format('YYYY-MM-DD');
            const init = (0, moment_1.default)(today, 'YYYY-MM-DD');
            const alertEnd = init.add(15, 'days').format('YYYY-MM-DD');
            const where = status == "expired" ? `c.expired_in<'${today}'` :
                status == "endContract" ? `c.expired_in<'${alertEnd}' AND c.expired_in>'${today}'` :
                    status == "actives" ? 's.status=1' : 's.status=0';
            const query = `SELECT COUNT(s.id) as total 
                     FROM students AS s
                     LEFT JOIN students_validity_contracts AS c ON s.id=c.student_id
                    WHERE ${where}`;
            const students = yield mysql_1.sequelize.query(query, { type: sequelize_1.QueryTypes.SELECT });
            return students[0].total;
        });
    }
    checkExpiredAccess() {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `SELECT s.id FROM students AS s 
                LEFT JOIN students_validity_contracts AS c ON s.id=c.student_id
                    WHERE s.status=1 AND c.student_id is null`;
            const students = yield mysql_1.sequelize.query(query, { type: sequelize_1.QueryTypes.SELECT });
            return students;
        });
    }
    satisfactionCourses() {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `SELECT course_id,c.name, AVG(score) as media 
                     FROM lessons_viewed AS l
                     JOIN courses AS c ON l.course_id=c.id
                 GROUP BY course_id`;
            const satisfaction = yield mysql_1.sequelize.query(query, {
                type: sequelize_1.QueryTypes.SELECT
            });
            return satisfaction;
        });
    }
}
exports.default = new metricsService();

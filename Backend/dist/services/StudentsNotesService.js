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
const mysql_1 = require("../instances/mysql");
const StudentsNotes_1 = require("../models/StudentsNotes");
const redis_1 = require("../config/redis");
const sequelize_1 = require("sequelize");
class LessonsNotesService {
    studentsNotes(courseId, studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const redisKey = `noteStudent:[courseId:[${courseId}],studentId:[${studentId}]]`;
            const noteStudentRd = yield (0, redis_1.redisGet)(redisKey);
            if (noteStudentRd !== null) {
                return noteStudentRd;
            }
            const noteStudent = yield StudentsNotes_1.StudentsNotes.findOne({
                attributes: ['note'],
                where: { student_id: studentId, course_id: courseId }
            });
            const note = noteStudent ? noteStudent.note : "";
            yield (0, redis_1.redisSet)(redisKey, note);
            return note;
        });
    }
    editNote(note) {
        return __awaiter(this, void 0, void 0, function* () {
            const redisKey = `noteStudent:[courseId:[${note.course_id}],studentId:[${note.student_id}]]`;
            yield (0, redis_1.redisSet)(redisKey, note.note);
            const [newView, created] = yield StudentsNotes_1.StudentsNotes.findCreateFind({
                where: { student_id: note.student_id, course_id: note.course_id },
                defaults: note
            });
            yield StudentsNotes_1.StudentsNotes.update(note, { where: { student_id: note.student_id, course_id: note.course_id } });
            return true;
        });
    }
    lessonsNotes(courseId, studentId, page) {
        return __awaiter(this, void 0, void 0, function* () {
            const redisKey = `listNotes:[courseId:[${courseId}],studentId:[${studentId}],page:[${page}]]`;
            const listNotesCache = yield (0, redis_1.redisGet)(redisKey);
            if (listNotesCache !== null) {
                return listNotesCache;
            }
            const p = page - 1;
            const qtdRegPage = 30;
            const offset = qtdRegPage * p;
            const query = `
        SELECT n.id AS note_id, n.date_created, n.note, l.id as lesson_id, l.name AS lesson, m.module 
          FROM lessons_notes AS n 
          JOIN courses_lessons AS l ON n.lesson_id=l.id
          JOIN courses_modules AS m ON n.module_id=m.id
         WHERE n.course_id=${courseId} AND n.student_id=${studentId}
      ORDER BY n.date_created DESC LIMIT ${offset},${qtdRegPage};
    `;
            const listNotes = yield mysql_1.sequelize.query(query, {
                type: sequelize_1.QueryTypes.SELECT
            });
            yield (0, redis_1.redisSet)(redisKey, listNotes);
            return listNotes;
        });
    }
}
exports.default = new LessonsNotesService();

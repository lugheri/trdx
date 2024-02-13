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
const IntegrationPlatformsCourses_1 = require("../models/IntegrationPlatformsCourses");
class IntegrationCoursesService {
    newCourse(dataCourse) {
        return __awaiter(this, void 0, void 0, function* () {
            const [newCourse, created] = yield IntegrationPlatformsCourses_1.IntegrationPlatformsCourses.findOrCreate({
                where: { product_id: dataCourse.product_id, offer_id: dataCourse.offer_id, course_id_students: dataCourse.course_id_students },
                defaults: dataCourse
            });
            console.info(created);
            return newCourse.id ? newCourse : false;
        });
    }
    getCoursesPlatform(product_id, offer_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const listCoursesIntegrations = yield IntegrationPlatformsCourses_1.IntegrationPlatformsCourses.findAll({
                where: { product_id: product_id, offer_id: offer_id },
            });
            return listCoursesIntegrations;
        });
    }
    infoCourse(course_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const infoCourse = yield IntegrationPlatformsCourses_1.IntegrationPlatformsCourses.findByPk(course_id);
            return infoCourse;
        });
    }
    infoCourseStudentPlatform(offer_id, course_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const infoCourseStudentPlatform = yield IntegrationPlatformsCourses_1.IntegrationPlatformsCourses.findOne({
                where: { offer_id: offer_id, course_id_students: course_id },
            });
            return infoCourseStudentPlatform;
        });
    }
    editCourse(course_id, dataCourse) {
        return __awaiter(this, void 0, void 0, function* () {
            yield IntegrationPlatformsCourses_1.IntegrationPlatformsCourses.update(dataCourse, { where: { id: course_id } });
            return true;
        });
    }
    removeCourse(course_id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield IntegrationPlatformsCourses_1.IntegrationPlatformsCourses.destroy({ where: { id: course_id } });
            return true;
        });
    }
}
exports.default = new IntegrationCoursesService();

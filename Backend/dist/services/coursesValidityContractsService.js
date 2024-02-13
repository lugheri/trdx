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
const CoursesValidityContracts_1 = require("../models/CoursesValidityContracts");
class CoursesValidityContractsService {
    validityCourse(courseId, studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const validity = yield CoursesValidityContracts_1.CoursesValidityContracts.findOne({
                where: { student_id: studentId, course_id: courseId },
                order: [['start_validity', 'DESC'], ['id', 'DESC']],
            });
            return validity;
        });
    }
    allContrats(courseId, studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const allContrats = yield CoursesValidityContracts_1.CoursesValidityContracts.findAll({
                where: { student_id: studentId, course_id: courseId },
                order: [['id', 'DESC']],
            });
            return allContrats;
        });
    }
    endDataContractStudent(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const dataContract = yield CoursesValidityContracts_1.CoursesValidityContracts.findOne({
                where: { student_id: studentId },
                order: [['end_validity', 'DESC']]
            });
            return dataContract;
        });
    }
    addContract(dataContract) {
        return __awaiter(this, void 0, void 0, function* () {
            const newContract = yield CoursesValidityContracts_1.CoursesValidityContracts.create(dataContract);
            return newContract;
        });
    }
    removeContract(contractId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield CoursesValidityContracts_1.CoursesValidityContracts.destroy({ where: { id: contractId } });
            return true;
        });
    }
}
exports.default = new CoursesValidityContractsService();

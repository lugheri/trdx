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
const StudentsValidityContracts_1 = require("../models/StudentsValidityContracts");
class StudentContractValidity {
    createNewStudentContract(studentContract) {
        return __awaiter(this, void 0, void 0, function* () {
            const [newContract, created] = yield StudentsValidityContracts_1.StudentsValidityContractsInstance.findOrCreate({
                where: { student_id: studentContract.student_id },
                defaults: studentContract
            });
            console.log('created', created);
            return newContract.id ? newContract.id : false;
        });
    }
}
exports.default = new StudentContractValidity();

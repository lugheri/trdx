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
const EmailCopys_1 = require("../models/EmailCopys");
class EmailCopyService {
    newCopy(dataCopy) {
        return __awaiter(this, void 0, void 0, function* () {
            const newCopy = yield EmailCopys_1.EmailCopy.create(dataCopy);
            return newCopy.id ? newCopy : false;
        });
    }
    getCopys() {
        return __awaiter(this, void 0, void 0, function* () {
            const listCopys = yield EmailCopys_1.EmailCopy.findAll({ where: { status: 1 } });
            return listCopys;
        });
    }
    infoCopy(copy_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const infoCopy = yield EmailCopys_1.EmailCopy.findByPk(copy_id);
            return infoCopy;
        });
    }
    editCopy(copy_id, dataCopy) {
        return __awaiter(this, void 0, void 0, function* () {
            yield EmailCopys_1.EmailCopy.update(dataCopy, { where: { id: copy_id } });
            return true;
        });
    }
    removeCourse(copy_id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield EmailCopys_1.EmailCopy.destroy({ where: { id: copy_id } });
            return true;
        });
    }
}
exports.default = new EmailCopyService();

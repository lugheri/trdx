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
const MailAccounts_1 = require("../models/MailAccounts");
class mailAccountService {
    newAccount(dataAccount) {
        return __awaiter(this, void 0, void 0, function* () {
            const [newAccount, created] = yield MailAccounts_1.MailAccounts.findOrCreate({
                where: { user: dataAccount.user },
                defaults: dataAccount
            });
            console.info(created);
            return newAccount.id ? newAccount : false;
        });
    }
    listAccounts() {
        return __awaiter(this, void 0, void 0, function* () {
            const listAccounts = yield MailAccounts_1.MailAccounts.findAll({
                where: { status: 1 }
            });
            return listAccounts;
        });
    }
    infoAccountMail(accountId) {
        return __awaiter(this, void 0, void 0, function* () {
            const account = yield MailAccounts_1.MailAccounts.findByPk(accountId);
            return account ? account : null;
        });
    }
    editAccount(accountId, dataAccount) {
        return __awaiter(this, void 0, void 0, function* () {
            yield MailAccounts_1.MailAccounts.update(dataAccount, { where: { id: accountId } });
            return true;
        });
    }
    removeMailAccount(accountId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield MailAccounts_1.MailAccounts.destroy({ where: { id: accountId } });
            return true;
        });
    }
}
exports.default = new mailAccountService();

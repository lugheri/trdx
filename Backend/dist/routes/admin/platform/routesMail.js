"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MailController_1 = __importDefault(require("../../../controllers/MailController"));
exports.default = (routes) => {
    routes.post('/newAccount', MailController_1.default.newAccount);
    routes.get('/listAccounts', MailController_1.default.listAccounts);
    routes.get('/infoAccount/:account_id', MailController_1.default.infoAccount);
    routes.patch('/editAccount/:account_id', MailController_1.default.editAccount);
    routes.delete('/removeAccount/:account_id', MailController_1.default.removeAccount);
    routes.post('/sendMail', MailController_1.default.sendMail);
};

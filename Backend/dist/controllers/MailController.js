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
const mail_dto_1 = require("./Dtos/mail.dto");
const mailAccountService_1 = __importDefault(require("../services/mailAccountService"));
const nodemailer_1 = __importDefault(require("nodemailer"));
class MailController {
    newAccount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const dataAccount = mail_dto_1.MailAccountDTO.safeParse(req.body);
            if (!dataAccount.success) {
                res.json({ "error": dataAccount.error });
                return;
            }
            try {
                const newAccount = yield mailAccountService_1.default.newAccount(dataAccount.data);
                if (newAccount) {
                    res.json({ "success": true, "response": newAccount });
                    return;
                }
                res.json({ "error": "Falha ao criar o conta de E-mail!" });
                return;
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
    listAccounts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const listAccounts = yield mailAccountService_1.default.listAccounts();
                res.json({ "success": true, "response": listAccounts });
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
    infoAccount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const accountId = parseInt(req.params.account_id);
            try {
                const mailAccount = yield mailAccountService_1.default.infoAccountMail(accountId);
                res.json({ "success": true, "response": mailAccount });
                return;
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
    editAccount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const accountId = parseInt(req.params.account_id);
            const dataAccount = mail_dto_1.MailAccountDTO.safeParse(req.body);
            if (!dataAccount.success) {
                res.json({ "error": dataAccount.error });
                return;
            }
            try {
                const edit = yield mailAccountService_1.default.editAccount(accountId, dataAccount.data);
                res.json({ "success": true, "response": edit });
                return;
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
    removeAccount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const accountId = parseInt(req.params.account_id);
            try {
                yield mailAccountService_1.default.removeMailAccount(accountId);
                res.json({ "success": true, "response": true });
                return;
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
    sendMail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const dataSend = mail_dto_1.SendMailDTO.safeParse(req.body);
            if (!dataSend.success) {
                res.json({ "error": dataSend.error });
                return;
            }
            const infoAccount = yield mailAccountService_1.default.infoAccountMail(dataSend.data.accountId);
            if (infoAccount === null) {
                res.json({ "error": "Conta de E-mail não localizada" });
                return;
            }
            // Configurações do transporte (SMTP)
            const transporter = nodemailer_1.default.createTransport({
                host: infoAccount.host,
                port: infoAccount.port,
                secure: infoAccount.secure == 1 ? true : false,
                auth: {
                    user: infoAccount.user,
                    pass: infoAccount.pass, // Senha do servidor SMTP
                },
            });
            // Opções do e-mail
            const mailOptions = {
                from: `${dataSend.data.from} <${infoAccount.user}>`,
                to: dataSend.data.mailTo,
                cc: dataSend.data.copy ? dataSend.data.copy : "",
                bcc: dataSend.data.hiddenCopy ? dataSend.data.hiddenCopy : "",
                subject: dataSend.data.subject,
                html: dataSend.data.body,
            };
            // Envia o e-mail
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Erro ao enviar e-mail:', error);
                    res.json({ "success": false, "message": `Erro ao enviar e-mail: ${error}` });
                }
                else {
                    console.info('E-mail enviado com sucesso! ID:', info.messageId);
                    res.json({ "success": true, "message": `E-mail enviado com sucesso! ID:${info.messageId}` });
                }
            });
        });
    }
}
exports.default = new MailController();

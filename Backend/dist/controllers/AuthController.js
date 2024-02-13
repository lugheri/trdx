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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const loginService_1 = __importDefault(require("../services/loginService"));
const usersAccess_dto_1 = require("./Dtos/usersAccess.dto");
const student_dto_1 = require("./Dtos/student.dto");
const studentsService_1 = __importDefault(require("../services/studentsService"));
const md5_1 = __importDefault(require("md5"));
const sendMail_1 = __importDefault(require("../services/sendMail"));
class AuthController {
    live(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.json(true);
        });
    }
    checkMailStudent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const mail = req.params.mail;
            const studentId = yield loginService_1.default.checkMailStudent(mail);
            if (studentId) {
                res.json({ "success": studentId });
                return;
            }
            res.json({ "error": 'Aluno não encontrado!!' });
        });
    }
    resetPassLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const studentId = parseInt(req.params.studentId);
            const mailStudent = req.params.mail;
            try {
                const length = 6;
                const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$&';
                let passwordHash = '';
                for (let i = 0; i < length; i++) {
                    const randomIndex = Math.floor(Math.random() * characters.length);
                    passwordHash += characters.charAt(randomIndex);
                }
                const newPass = passwordHash;
                yield studentsService_1.default.editStudent(studentId, { password: (0, md5_1.default)(newPass) });
                //SendMail
                const from = 'Guilherme Cardoso';
                const fromMail = 'suporte@otraderquemultiplica.com.br';
                const subject = '[RESET de Senha] Seus novos dados de acesso';
                const text = `<p style="font-size:18px;margin-bottom:10px">Seus dados de acesso foram resetados.</p>
                    <p style="font-size:18px;margin-bottom:10px">Aperte no link abaixo e entre com os seus novos dados de acesso:</p>
                    <br/>                         
                      <p style="font-size:18px;margin:0px"><a href="https://app.otraderquemultiplica.com.br">https://app.otraderquemultiplica.com.br</a></p>
                      <p style="font-size:18px;margin:0px"><b>Usuário:</b> ${mailStudent}</p>
                      <p style="font-size:18px;margin:0px"><b>Senha:</b> ${passwordHash}</p>                          
                    <br/>
                    <p style="font-size:18px;margin-bottom:10px">Abração,<br/>
                    Guilherme</p>`;
                sendMail_1.default.sendMail(from, fromMail, mailStudent, subject, text);
            }
            catch (e) {
                console.log(e);
            }
            res.json({ "success": 'Senha resetada com sucesso' });
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userAccess = usersAccess_dto_1.UserAccessDTO.safeParse(req.body);
            if (!userAccess.success) {
                res.json({ "error": userAccess.error });
                return;
            }
            try {
                const userdata = yield loginService_1.default.checkUser(userAccess.data);
                if (!userdata) {
                    res.json({ "error": 'Usuário não encontrado!!' });
                    return;
                }
                //Authenticate
                const action = 'login';
                const token = yield loginService_1.default.userAuthenticate(action, userdata);
                res.json({
                    token: token,
                    success: true
                });
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
    loginStudent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const studentAccess = student_dto_1.StudentAccessDTO.safeParse(req.body);
            if (!studentAccess.success) {
                res.json({ "error": studentAccess.error });
                return;
            }
            try {
                const userdata = yield loginService_1.default.checkStudent(studentAccess.data);
                if (!userdata) {
                    res.json({ "error": 'Aluno não encontrado!!' });
                    return;
                }
                //Authenticate
                const action = 'login';
                const token = yield loginService_1.default.studentAuthenticate(action, userdata);
                res.json({
                    token: token,
                    success: true
                });
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
    validation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const authHeader = req.headers.authorization ? req.headers.authorization : null;
                if (authHeader) {
                    const payload = jsonwebtoken_1.default.verify(authHeader, process.env.APP_SECRET);
                    res.json(payload);
                    return;
                }
                res.json({ "error": "token invalid" });
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
    resetPass(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userdata = yield loginService_1.default.checkStudent({ password: req.body.password, username: req.body.username });
            if (!userdata) {
                res.json({ "error": 'Senha de acesso invalida!' });
                return;
            }
            try {
                const studentId = parseInt(req.params.student_id);
                const edit = yield studentsService_1.default.editStudent(studentId, { password: (0, md5_1.default)(req.body.newPass) });
                res.json({ success: true });
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
    logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const authHeader = req.headers.authorization;
                yield loginService_1.default.userAuthenticate('logout', undefined, authHeader);
                res.json({ success: true });
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
}
exports.default = new AuthController();

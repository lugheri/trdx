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
const md5_1 = __importDefault(require("md5"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const Logins_1 = require("../models/Logins");
const Users_1 = require("../models/Users");
const Students_1 = require("../models/Students");
const StudentsLogins_1 = require("../models/StudentsLogins");
class LoginService {
    checkUser(accessUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const userdata = yield Users_1.User.findOne({
                attributes: ['id', 'name', 'password'],
                where: { mail: accessUser.username, status: 1 }
            });
            if (!userdata) {
                return false;
            }
            if (userdata.password != (0, md5_1.default)(accessUser.password)) {
                return false;
            }
            return userdata;
        });
    }
    checkStudent(accessStudent) {
        return __awaiter(this, void 0, void 0, function* () {
            const userdata = yield Students_1.Students.findOne({
                attributes: ['id', 'name', 'password'],
                where: { mail: accessStudent.username, status: 1 }
            });
            if (!userdata) {
                return false;
            }
            if (userdata.password != (0, md5_1.default)(accessStudent.password)) {
                return false;
            }
            return userdata;
        });
    }
    checkMailStudent(mail) {
        return __awaiter(this, void 0, void 0, function* () {
            const userdata = yield Students_1.Students.findOne({
                attributes: ['id'],
                where: { mail: mail, status: 1 }
            });
            if (!userdata) {
                return null;
            }
            return userdata.id;
        });
    }
    userAuthenticate(action, userdata, authHeader) {
        return __awaiter(this, void 0, void 0, function* () {
            if (action == 'login') {
                if (userdata) {
                    const typeAccess = 'Adm';
                    const token = jsonwebtoken_1.default.sign({ userId: userdata.id, userName: userdata.mail, typeAccess: typeAccess }, process.env.APP_SECRET);
                    //Check last action login user
                    const lastAction = yield Logins_1.Logins.findOne({ attributes: ['action'],
                        where: { id: userdata.id },
                        order: [['id', 'DESC']],
                        limit: 1 });
                    if (lastAction) {
                        if (lastAction.action == "login") { //Register last Logout
                            yield Logins_1.Logins.create({ date: new Date().toISOString().split('T')[0],
                                hour: new Date().toLocaleTimeString('en-US', { hour12: false }),
                                user_id: userdata.id,
                                action: "logout" });
                        }
                    }
                    userdata.logged = 1;
                    yield userdata.save();
                    //Register Login
                    yield Logins_1.Logins.create({ date: new Date().toISOString().split('T')[0],
                        hour: new Date().toLocaleTimeString('en-US', { hour12: false }),
                        user_id: userdata.id,
                        action: action });
                    return token;
                }
                return null;
            }
            else {
                if (!authHeader) {
                    console.info("No auth header");
                    return false;
                }
                const { userId } = jsonwebtoken_1.default.verify(authHeader, process.env.APP_SECRET);
                if (!userId) {
                    console.info("User Id is not founded");
                    return false;
                }
                const userdata = yield Users_1.User.findByPk(userId);
                if (userdata) {
                    console.info("User has been logged out successfully");
                    userdata.logged = 0;
                    yield userdata.save();
                    yield Logins_1.Logins.create({ date: new Date().toISOString().split('T')[0],
                        hour: new Date().toLocaleTimeString('en-US', { hour12: false }),
                        user_id: userdata.id,
                        action: action });
                    return null;
                }
                console.info("User Id is not valid");
                return null;
            }
        });
    }
    studentAuthenticate(action, userdata, authHeader) {
        return __awaiter(this, void 0, void 0, function* () {
            if (action == 'login') {
                if (userdata) {
                    const typeAccess = 'Student';
                    const token = jsonwebtoken_1.default.sign({ userId: userdata.id, userName: userdata.mail, typeAccess: typeAccess }, process.env.APP_SECRET);
                    //Check last action login user
                    const lastAction = yield StudentsLogins_1.StudentsLogins.findOne({ attributes: ['action'],
                        where: { id: userdata.id },
                        order: [['id', 'DESC']],
                        limit: 1 });
                    if (lastAction) {
                        if (lastAction.action == "login") { //Register last Logout
                            yield StudentsLogins_1.StudentsLogins.create({ date: new Date().toISOString().split('T')[0],
                                hour: new Date().toLocaleTimeString('en-US', { hour12: false }),
                                student_id: userdata.id,
                                action: "logout" });
                        }
                    }
                    userdata.logged = 1;
                    yield userdata.save();
                    //Register Login
                    yield StudentsLogins_1.StudentsLogins.create({ date: new Date().toISOString().split('T')[0],
                        hour: new Date().toLocaleTimeString('en-US', { hour12: false }),
                        student_id: userdata.id,
                        action: action });
                    return token;
                }
                return null;
            }
            else {
                if (!authHeader) {
                    console.info("No auth header");
                    return false;
                }
                const { userId } = jsonwebtoken_1.default.verify(authHeader, process.env.APP_SECRET);
                if (!userId) {
                    console.info("User Id is not founded");
                    return false;
                }
                const userdata = yield Students_1.Students.findByPk(userId);
                if (userdata) {
                    console.info("User has been logged out successfully");
                    userdata.logged = 0;
                    yield userdata.save();
                    yield StudentsLogins_1.StudentsLogins.create({ date: new Date().toISOString().split('T')[0],
                        hour: new Date().toLocaleTimeString('en-US', { hour12: false }),
                        student_id: userdata.id,
                        action: action });
                    return null;
                }
                console.info("User Id is not valid");
                return null;
            }
        });
    }
}
exports.default = new LoginService();

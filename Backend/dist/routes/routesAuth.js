"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AuthController_1 = __importDefault(require("../controllers/AuthController"));
const auth_1 = __importDefault(require("../middlewares/auth"));
exports.default = (routes) => {
    routes.get('/live', AuthController_1.default.live);
    routes.get("/checkMailStudent/:mail", AuthController_1.default.checkMailStudent);
    routes.get("/resetPassLogin/:studentId/:mail", AuthController_1.default.resetPassLogin);
    routes.post('/login', AuthController_1.default.login);
    routes.post('/loginStudent', AuthController_1.default.loginStudent);
    routes.use(auth_1.default);
    routes.get('/validation', AuthController_1.default.validation);
    routes.patch('/resetPass/:student_id', AuthController_1.default.resetPass); //Logged
    routes.post('/logout', AuthController_1.default.logout);
};

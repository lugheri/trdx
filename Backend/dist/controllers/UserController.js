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
const userService_1 = __importDefault(require("../services/userService"));
const usersAccess_dto_1 = require("./Dtos/usersAccess.dto");
class UserController {
    newUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const dataUser = usersAccess_dto_1.UserDataDTO.safeParse(req.body);
            if (!dataUser.success) {
                res.json({ "error": dataUser.error });
                return;
            }
            try {
                //Create a new credential
                const dataNewUser = yield userService_1.default.createNewUser(dataUser.data);
                if (dataNewUser) {
                    res.json({ "success": true, "response": dataNewUser });
                    return;
                }
                res.json({ "error": "Falha ao criar o novo Usuário de acesso!" });
                return;
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
    getUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = parseInt(req.params.userId);
            try {
                const user = yield userService_1.default.getUser(userId);
                res.json({ "success": true, "response": user });
                return;
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
    editUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = parseInt(req.params.userId);
            const dataUser = usersAccess_dto_1.UserDataPartialDTO.safeParse(req.body);
            if (!dataUser.success) {
                res.json({ "error": dataUser.error });
                return;
            }
            try {
                const edit = yield userService_1.default.editUser(userId, dataUser.data);
                res.json({ "success": true, "response": edit });
                return;
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
    removeUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = parseInt(req.params.userId);
            try {
                yield userService_1.default.removeUser(userId);
                res.json({ "success": true });
                return;
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
    listUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const pagination = usersAccess_dto_1.PaginationUserDTO.safeParse(req.body);
            if (!pagination.success) {
                res.json({ "error": pagination.error });
                return;
            }
            try {
                const listUsers = yield userService_1.default.listUsers(pagination.data);
                res.json({ "success": true, "response": listUsers });
                return;
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
}
exports.default = new UserController();

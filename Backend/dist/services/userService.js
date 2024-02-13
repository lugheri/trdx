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
const Users_1 = require("../models/Users");
const redis_1 = require("../config/redis");
class userService {
    createNewUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const [newUser, created] = yield Users_1.User.findOrCreate({
                where: { name: userData.name },
                defaults: userData
            });
            yield (0, redis_1.redisDel)('Users:[all]');
            console.info('created', created);
            return newUser.id ? newUser : false;
        });
    }
    editUser(userId, userData) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Users_1.User.update(userData, { where: { id: userId } });
            yield (0, redis_1.redisDel)(`UserData:[${userId}]`);
            return true;
        });
    }
    removeUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Users_1.User.destroy({ where: { id: userId } });
            yield (0, redis_1.redisDel)(`UserData:[${userId}]`);
            return true;
        });
    }
    getUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const infoUser = yield (0, redis_1.redisGet)(`UserData:[${userId}]`);
            if (infoUser !== null) {
                return infoUser;
            }
            const user = yield Users_1.User.findByPk(userId);
            yield (0, redis_1.redisSet)(`UserData:[${userId}]`, user, 30);
            return user ? user : false;
        });
    }
    listUsers(pagination) {
        return __awaiter(this, void 0, void 0, function* () {
            const p = pagination.page - 1;
            const qtdRegPage = 30;
            const offset = qtdRegPage * p;
            const listUsers = yield Users_1.User.findAll({
                where: { status: pagination.status },
                order: [[pagination.orderedBy, pagination.order]],
                offset: offset,
                limit: qtdRegPage
            });
            return listUsers;
        });
    }
}
exports.default = new userService();

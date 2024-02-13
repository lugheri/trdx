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
const redis_1 = require("../config/redis");
const HomeButtons_1 = require("../models/HomeButtons");
class homeButtonsServices {
    newButtonHome(buttonData) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, redis_1.redisDel)(`buttonsHome`);
            const [newButton, created] = yield HomeButtons_1.HomeButtons.findOrCreate({
                where: { name: buttonData.name, status: 1 },
                defaults: buttonData
            });
            return newButton.id ? newButton : false;
        });
    }
    getButtonsHome() {
        return __awaiter(this, void 0, void 0, function* () {
            const redisKey = `buttonsHome`;
            const buttonsHomeRedis = yield (0, redis_1.redisGet)(redisKey);
            if (buttonsHomeRedis !== null) {
                return buttonsHomeRedis;
            }
            const buttonsHome = yield HomeButtons_1.HomeButtons.findAll({
                where: { status: 1 },
                order: [['order', 'asc']]
            });
            yield (0, redis_1.redisSet)(redisKey, buttonsHome);
            return buttonsHome;
        });
    }
    infoButtonHome(button_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const redisKey = `infoButton:[${button_id}]`;
            const infoButtonRedis = yield (0, redis_1.redisGet)(redisKey);
            if (infoButtonRedis !== null) {
                return infoButtonRedis;
            }
            const infoButton = yield HomeButtons_1.HomeButtons.findByPk(button_id);
            yield (0, redis_1.redisSet)(redisKey, infoButton);
            return infoButton;
        });
    }
    updateButtonHome(button_id, buttonData) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, redis_1.redisDel)(`infoButton:[${button_id}]`);
            yield (0, redis_1.redisDel)(`buttonsHome`);
            const update = yield HomeButtons_1.HomeButtons.update(buttonData, { where: { id: button_id } });
            yield (0, redis_1.redisDel)(`infoButton:[${button_id}]`);
            yield (0, redis_1.redisDel)(`buttonsHome`);
            return update;
        });
    }
    deleteButtonHome(button_id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, redis_1.redisDel)(`infoButton:[${button_id}]`);
            yield (0, redis_1.redisDel)(`buttonsHome`);
            yield HomeButtons_1.HomeButtons.destroy({ where: { id: button_id } });
            return true;
        });
    }
}
exports.default = new homeButtonsServices();

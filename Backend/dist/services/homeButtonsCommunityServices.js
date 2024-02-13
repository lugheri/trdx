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
const HomeButtonsCommunity_1 = require("../models/HomeButtonsCommunity");
class homeButtonsCommunityServices {
    newButtonHome(buttonData) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, redis_1.redisDel)(`buttonsHomeCommunity`);
            const [newButton, created] = yield HomeButtonsCommunity_1.HomeButtonsCommunity.findOrCreate({
                where: { name: buttonData.name, status: 1 },
                defaults: buttonData
            });
            return newButton.id ? newButton : false;
        });
    }
    getButtonsHome() {
        return __awaiter(this, void 0, void 0, function* () {
            const redisKey = `buttonsHomeCommunity`;
            const buttonsHomeRedis = yield (0, redis_1.redisGet)(redisKey);
            if (buttonsHomeRedis !== null) {
                return buttonsHomeRedis;
            }
            const buttonsHome = yield HomeButtonsCommunity_1.HomeButtonsCommunity.findAll({
                where: { status: 1 },
                order: [['order', 'asc']]
            });
            yield (0, redis_1.redisSet)(redisKey, buttonsHome);
            return buttonsHome;
        });
    }
    infoButtonHome(button_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const redisKey = `infoButtonCommunity:[${button_id}]`;
            const infoButtonRedis = yield (0, redis_1.redisGet)(redisKey);
            if (infoButtonRedis !== null) {
                return infoButtonRedis;
            }
            const infoButton = yield HomeButtonsCommunity_1.HomeButtonsCommunity.findByPk(button_id);
            yield (0, redis_1.redisSet)(redisKey, infoButton);
            return infoButton;
        });
    }
    updateButtonHome(button_id, buttonData) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, redis_1.redisDel)(`infoButtonCommunity:[${button_id}]`);
            yield (0, redis_1.redisDel)(`buttonsHomeCommunity`);
            const update = yield HomeButtonsCommunity_1.HomeButtonsCommunity.update(buttonData, { where: { id: button_id } });
            yield (0, redis_1.redisDel)(`infoButtonCommunity:[${button_id}]`);
            yield (0, redis_1.redisDel)(`buttonsHomeCommunity`);
            return update;
        });
    }
    deleteButtonHome(button_id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, redis_1.redisDel)(`infoButtonCommunity:[${button_id}]`);
            yield (0, redis_1.redisDel)(`buttonsHomeCommunity`);
            yield HomeButtonsCommunity_1.HomeButtonsCommunity.destroy({ where: { id: button_id } });
            return true;
        });
    }
}
exports.default = new homeButtonsCommunityServices();

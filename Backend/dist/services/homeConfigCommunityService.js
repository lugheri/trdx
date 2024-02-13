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
const HomeConfigCommunity_1 = require("../models/HomeConfigCommunity");
class homeConfigCommunityService {
    //Video
    getWelcomeVideo() {
        return __awaiter(this, void 0, void 0, function* () {
            const redisKey = `WelcomeVideoCommunity`;
            const WelcomeVideoRedis = yield (0, redis_1.redisGet)(redisKey);
            if (WelcomeVideoRedis !== null) {
                return WelcomeVideoRedis;
            }
            const video = yield HomeConfigCommunity_1.HomeConfigCommunity.findOne({
                attributes: ['idvideo_welcome', 'video_platform', 'image_gallery'],
                where: { status: 1 }
            });
            yield (0, redis_1.redisSet)(redisKey, video);
            return video ? video : false;
        });
    }
    updateWelcomeVideo(videoData) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, redis_1.redisDel)(`WelcomeVideoCommunity`);
            yield HomeConfigCommunity_1.HomeConfigCommunity.update(videoData, { where: { status: 1 } });
            return true;
        });
    }
    createNewWelcomeVideo(videoData) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, redis_1.redisDel)(`WelcomeVideoCommunity`);
            const [newVideo, created] = yield HomeConfigCommunity_1.HomeConfigCommunity.findOrCreate({
                where: { status: 1 },
                defaults: videoData
            });
            console.info('created', created);
            return newVideo.id ? newVideo : false;
        });
    }
    //Text
    getTextHome() {
        return __awaiter(this, void 0, void 0, function* () {
            const redisKey = 'TextHomeCommunity';
            const TextHomeRedis = yield (0, redis_1.redisGet)(redisKey);
            if (TextHomeRedis !== null) {
                return TextHomeRedis;
            }
            const TextHome = yield HomeConfigCommunity_1.HomeConfigCommunity.findOne({
                attributes: ['title_text', 'text', 'additional_text'],
                where: { status: 1 }
            });
            yield (0, redis_1.redisSet)(redisKey, TextHome);
            return TextHome;
        });
    }
    updateTextHome(textData) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, redis_1.redisDel)(`TextHomeCommunity`);
            yield HomeConfigCommunity_1.HomeConfigCommunity.update(textData, { where: { status: 1 } });
            return true;
        });
    }
    createNewWelcomeText(textData) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, redis_1.redisDel)(`TextHomeCommunity`);
            const [newText, created] = yield HomeConfigCommunity_1.HomeConfigCommunity.findOrCreate({
                where: { status: 1 },
                defaults: textData
            });
            console.info('created', created);
            return newText.id ? newText : false;
        });
    }
}
exports.default = new homeConfigCommunityService();

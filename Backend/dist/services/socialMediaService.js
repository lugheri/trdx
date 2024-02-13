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
const SocialMediaChannels_1 = require("../models/SocialMediaChannels");
class socialMediaService {
    newSocialMedia(socialMediaData) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, redis_1.redisDel)(`socialMediaChannels`);
            const [newChannel, created] = yield SocialMediaChannels_1.SocialMediaChannels.findOrCreate({
                where: { social_media: socialMediaData.social_media, status: 1 },
                defaults: socialMediaData
            });
            return newChannel.id ? newChannel : false;
        });
    }
    getSocialMedias() {
        return __awaiter(this, void 0, void 0, function* () {
            const redisKey = `socialMediaChannels`;
            const socialMediasRedis = yield (0, redis_1.redisGet)(redisKey);
            if (socialMediasRedis !== null) {
                return socialMediasRedis;
            }
            const socialMedias = yield SocialMediaChannels_1.SocialMediaChannels.findAll({
                where: { status: 1 },
                order: [['order', 'asc']]
            });
            yield (0, redis_1.redisSet)(redisKey, socialMedias);
            return socialMedias;
        });
    }
    infoSocialMedia(media_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const redisKey = `infoSocialMedia:[${media_id}]`;
            const infoSocialMediaRedis = yield (0, redis_1.redisGet)(redisKey);
            if (infoSocialMediaRedis !== null) {
                return infoSocialMediaRedis;
            }
            const infoSocialMedia = yield SocialMediaChannels_1.SocialMediaChannels.findByPk(media_id);
            yield (0, redis_1.redisSet)(redisKey, infoSocialMedia);
            return infoSocialMedia;
        });
    }
    updateSocialMedia(media_id, socialMediaData) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, redis_1.redisDel)(`infoSocialMedia:[${media_id}]`);
            yield (0, redis_1.redisDel)(`socialMediaChannels`);
            const update = yield SocialMediaChannels_1.SocialMediaChannels.update(socialMediaData, { where: { id: media_id } });
            yield (0, redis_1.redisDel)(`infoButton:[${media_id}]`);
            yield (0, redis_1.redisDel)(`socialMediaChannels`);
            return update;
        });
    }
    deleteSocialMedia(media_id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, redis_1.redisDel)(`infoSocialMedia:[${media_id}]`);
            yield (0, redis_1.redisDel)(`socialMediaChannels`);
            yield SocialMediaChannels_1.SocialMediaChannels.destroy({ where: { id: media_id } });
            return true;
        });
    }
}
exports.default = new socialMediaService();

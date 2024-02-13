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
const StudentsProfilePhotos_1 = require("../models/StudentsProfilePhotos");
class StudentsProfilePhotosServices {
    newPhoto(fileData) {
        return __awaiter(this, void 0, void 0, function* () {
            const [newFile, created] = yield StudentsProfilePhotos_1.StudentsProfilePhotos.findOrCreate({
                where: { name: fileData.file },
                defaults: fileData
            });
            return newFile.id ? newFile : false;
        });
    }
    infoPhoto(fileId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!fileId) {
                return false;
            }
            const redisKey = `infoPhoto:[${fileId}]`;
            const infoPhotoRedis = yield (0, redis_1.redisGet)(redisKey);
            if (infoPhotoRedis !== null) {
                return infoPhotoRedis;
            }
            const file = yield StudentsProfilePhotos_1.StudentsProfilePhotos.findByPk(fileId);
            const infoPhoto = file ? file : false;
            yield (0, redis_1.redisSet)(redisKey, infoPhoto);
            return infoPhoto;
        });
    }
}
exports.default = new StudentsProfilePhotosServices();

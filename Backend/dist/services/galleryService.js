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
const Gallery_1 = require("../models/Gallery");
const GalleryFolders_1 = require("../models/GalleryFolders");
class GalleryServices {
    //Folders
    newFolder(dataFolder) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, redis_1.redisDel)(`listFoldersGallery`);
            const [newFolder, created] = yield GalleryFolders_1.GalleryFolder.findOrCreate({
                where: { name: dataFolder.name },
                defaults: dataFolder
            });
            return newFolder.id ? newFolder : false;
        });
    }
    editFolder(folderId, dataFolder) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, redis_1.redisDel)(`listFoldersGallery`);
            yield (0, redis_1.redisDel)(`infoFolder[${folderId}]`);
            yield GalleryFolders_1.GalleryFolder.update(dataFolder, { where: { id: folderId } });
            return true;
        });
    }
    infoFolder(folderId) {
        return __awaiter(this, void 0, void 0, function* () {
            const redisKey = `infoFolder[${folderId}]`;
            const infoFolderRedis = yield (0, redis_1.redisGet)(redisKey);
            if (infoFolderRedis !== null) {
                return infoFolderRedis;
            }
            const folder = yield GalleryFolders_1.GalleryFolder.findByPk(folderId);
            yield (0, redis_1.redisSet)(redisKey, folder ? folder : false);
            return folder ? folder : false;
        });
    }
    listFolders(status) {
        return __awaiter(this, void 0, void 0, function* () {
            const redisKey = `listFoldersGallery`;
            const listFoldersGalleryRedis = yield (0, redis_1.redisGet)(redisKey);
            if (listFoldersGalleryRedis !== null) {
                return listFoldersGalleryRedis;
            }
            const listFolders = yield GalleryFolders_1.GalleryFolder.findAll({
                where: { status: status },
                order: [['id', 'DESC']]
            });
            yield (0, redis_1.redisSet)(redisKey, listFolders);
            return listFolders;
        });
    }
    //Gallery
    newFile(fileData) {
        return __awaiter(this, void 0, void 0, function* () {
            const [newFile, created] = yield Gallery_1.Gallery.findOrCreate({
                where: { name: fileData.name },
                defaults: fileData
            });
            return newFile.id ? newFile : false;
        });
    }
    filterFiles(pagination) {
        return __awaiter(this, void 0, void 0, function* () {
            const p = pagination.page - 1;
            const qtdRegPage = 15;
            const offset = qtdRegPage * p;
            const filterFiles = yield Gallery_1.Gallery.findAll({
                where: { status: pagination.status },
                order: [[pagination.orderedBy, pagination.order]],
                offset: offset,
                limit: qtdRegPage
            });
            return filterFiles;
        });
    }
    infoFile(fileId) {
        return __awaiter(this, void 0, void 0, function* () {
            const file = yield Gallery_1.Gallery.findByPk(fileId);
            return file ? file : false;
        });
    }
    editFile(fileId, fileData) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Gallery_1.Gallery.update(fileData, { where: { id: fileId } });
            return true;
        });
    }
}
exports.default = new GalleryServices();

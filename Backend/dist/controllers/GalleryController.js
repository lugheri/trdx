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
const promises_1 = require("fs/promises");
const sharp_1 = __importDefault(require("sharp"));
const gallery_dto_1 = require("./Dtos/gallery.dto");
const galleryService_1 = __importDefault(require("../services/galleryService"));
class GalleryController {
    //Folders
    newFolder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const dataNewFolder = gallery_dto_1.FolderDTO.safeParse(req.body);
            if (!dataNewFolder.success) {
                res.json({ "error": dataNewFolder.error });
                return;
            }
            try {
                const newFolder = yield galleryService_1.default.newFolder(dataNewFolder.data);
                res.json({ "success": true, "response": newFolder });
            }
            catch (err) {
                console.error(err);
            }
        });
    }
    editFolder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const folderId = parseInt(req.params.folderId);
            const dataFolder = gallery_dto_1.FolderPartialDTO.safeParse(req.body);
            if (!dataFolder.success) {
                res.json({ "error": dataFolder.error });
                return;
            }
            try {
                const editFolder = yield galleryService_1.default.editFolder(folderId, dataFolder.data);
                res.json({ "success": true, "response": editFolder });
            }
            catch (err) {
                console.error(err);
            }
        });
    }
    infoFolder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const folderId = parseInt(req.params.folderId);
            try {
                const infoFolder = yield galleryService_1.default.infoFolder(folderId);
                res.json({ "success": true, "response": infoFolder });
            }
            catch (err) {
                console.error(err);
            }
        });
    }
    listFolders(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const status = parseInt(req.params.status);
            try {
                const listFolders = yield galleryService_1.default.listFolders(status);
                res.json({ "success": true, "response": listFolders });
            }
            catch (err) {
                console.error(err);
            }
        });
    }
    removeFolder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const folderId = parseInt(req.params.folderId);
            try {
                const editFolder = yield galleryService_1.default.editFolder(folderId, { status: 0 });
                res.json({ "success": true, "response": editFolder });
            }
            catch (err) {
                console.error(err);
            }
        });
    }
    //Gallery
    filterFiles(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const pagination = gallery_dto_1.PaginationGalleryDTO.safeParse(req.body);
            if (!pagination.success) {
                res.json({ "error": pagination.error });
                return;
            }
            try {
                const listFiles = yield galleryService_1.default.filterFiles(pagination.data);
                res.json({ "success": true, "response": listFiles });
            }
            catch (err) {
                console.error(err);
            }
        });
    }
    uploadFile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.file) {
                const filename = `${req.file.filename}.jpg`;
                yield (0, sharp_1.default)(req.file.path)
                    /*.resize(512)*/
                    .toFormat('jpeg')
                    .toFile(`./public/gallery/${filename}`);
                yield (0, promises_1.unlink)(req.file.path);
                const dataNewFile = gallery_dto_1.FileGalleryDTO.safeParse(req.body);
                if (!dataNewFile.success) {
                    res.json({ "error": dataNewFile.error });
                    return;
                }
                try {
                    const dataFile = {
                        "name": dataNewFile.data.name,
                        "description": dataNewFile.data.description,
                        "file": filename,
                        "extension": req.file.mimetype,
                        "size": req.file.size,
                        "folder": dataNewFile.data.folder,
                        "status": 1
                    };
                    const extension = req.file.mimetype;
                    const size = req.file.size;
                    const newFile = yield galleryService_1.default.newFile(dataFile);
                    res.json({ "success": true, "response": newFile });
                    return;
                }
                catch (err) {
                    console.error(err);
                }
            }
            res.json({ "error": true });
        });
    }
    infoFile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const fileId = parseInt(req.params.fileId);
            try {
                const infoFile = yield galleryService_1.default.infoFile(fileId);
                res.json({ "success": true, "response": infoFile });
            }
            catch (err) {
                console.error(err);
            }
        });
    }
    editFile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const fileId = parseInt(req.params.fileId);
            const dataFile = gallery_dto_1.FileGalleryPartialDTO.safeParse(req.body);
            if (!dataFile.success) {
                res.json({ "error": dataFile.error });
                return;
            }
            try {
                const editFile = yield galleryService_1.default.editFile(fileId, dataFile.data);
                res.json({ "success": true, "response": editFile });
            }
            catch (err) {
                console.error(err);
            }
        });
    }
    removeFile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const fileId = parseInt(req.params.fileId);
            try {
                const editFile = yield galleryService_1.default.editFile(fileId, { status: 0 });
                res.json({ "success": true, "response": editFile });
            }
            catch (err) {
                console.error(err);
            }
        });
    }
}
exports.default = new GalleryController();

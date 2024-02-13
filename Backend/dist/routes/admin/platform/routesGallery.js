"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const GalleryController_1 = __importDefault(require("../../../controllers/GalleryController"));
const upload = (0, multer_1.default)({
    dest: './tmp',
    fileFilter: (req, file, cb) => {
        const allowed = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif'];
        cb(null, allowed.includes(file.mimetype));
    },
    limits: { fieldSize: 20000000 }
});
exports.default = (routes) => {
    //Folders 
    routes.post('/newFolder', GalleryController_1.default.newFolder);
    routes.patch('/editFolder/:folderId', GalleryController_1.default.editFolder);
    routes.get('/infoFolder/:folderId', GalleryController_1.default.infoFolder);
    routes.get('/listFolders/:status', GalleryController_1.default.listFolders);
    routes.delete('/removeFolder/:folderId', GalleryController_1.default.removeFolder);
    //Gallery
    routes.post('/filterFiles', GalleryController_1.default.filterFiles);
    routes.post('/uploadFile', upload.single('file'), GalleryController_1.default.uploadFile);
    routes.get('/infoFile/:fileId', GalleryController_1.default.infoFile);
    routes.patch('/editFile/:fileId', GalleryController_1.default.editFile);
    routes.delete('/removeFile/:fileId', GalleryController_1.default.removeFile);
};

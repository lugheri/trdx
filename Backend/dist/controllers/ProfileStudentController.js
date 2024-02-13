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
const student_dto_1 = require("./Dtos/student.dto");
const studentsProfilePhotosService_1 = __importDefault(require("../services/studentsProfilePhotosService"));
const studentsService_1 = __importDefault(require("../services/studentsService"));
class ProfileController {
    photoProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const fileId = parseInt(req.params.photo_id);
            try {
                const infoPhoto = yield studentsProfilePhotosService_1.default.infoPhoto(fileId);
                res.json({ "success": true, "response": infoPhoto });
            }
            catch (err) {
                console.error(err);
            }
        });
    }
    newPhotoProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.file) {
                const filename = `${req.file.filename}.jpg`;
                yield (0, sharp_1.default)(req.file.path)
                    .resize(200)
                    .toFormat('jpeg')
                    .toFile(`./public/gallery/${filename}`);
                yield (0, promises_1.unlink)(req.file.path);
                const dataNewFile = student_dto_1.PhotoProfileStudentDTO.safeParse(req.body);
                if (!dataNewFile.success) {
                    res.json({ "error": dataNewFile.error });
                    return;
                }
                try {
                    const dataFile = {
                        "name": `${dataNewFile.data.student_id} - ${dataNewFile.data.name_student}`,
                        "description": `${dataNewFile.data.name_student} Student profile photo`,
                        "file": filename,
                        "extension": req.file.mimetype,
                        "size": req.file.size,
                        "status": 1
                    };
                    const extension = req.file.mimetype;
                    const size = req.file.size;
                    const newFile = yield studentsProfilePhotosService_1.default.newPhoto(dataFile);
                    //Update photo student
                    if (newFile) {
                        const studentId = parseInt(dataNewFile.data.student_id);
                        const newProfile = { photo: newFile.id };
                        try {
                            const edit = yield studentsService_1.default.editStudent(studentId, newProfile);
                            res.json({ "success": true, "response": edit });
                            return;
                        }
                        catch (err) {
                            console.error(err);
                            res.json({ "error": err });
                        }
                    }
                    res.json({ "success": true, "response": newFile });
                    return;
                }
                catch (err) {
                    console.error(err);
                }
            }
        });
    }
    getInfoStudent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const studentId = parseInt(req.params.student_id);
            try {
                const student = yield studentsService_1.default.getStudent(studentId);
                res.json({ "success": true, "response": student });
                return;
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
    editInfoStudent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    resetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
}
exports.default = new ProfileController();

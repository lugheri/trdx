"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const ProfileStudentController_1 = __importDefault(require("../../controllers/ProfileStudentController"));
const upload = (0, multer_1.default)({
    dest: './tmp',
    fileFilter: (req, file, cb) => {
        const allowed = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        cb(null, allowed.includes(file.mimetype));
    },
    limits: { fieldSize: 20000000 }
});
exports.default = (routes) => {
    //Manager Course
    routes.get("/photoProfile/:photo_id", ProfileStudentController_1.default.photoProfile);
    routes.post("/newPhotoProfile", upload.single('file'), ProfileStudentController_1.default.newPhotoProfile);
    routes.get("/getInfoStudent/:student_id", ProfileStudentController_1.default.getInfoStudent);
    routes.patch("/editInfoStudent/:student_id", ProfileStudentController_1.default.editInfoStudent);
    routes.patch("/resetPassword/:student_id", ProfileStudentController_1.default.resetPassword);
};

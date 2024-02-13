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
const courses_dto_1 = require("./Dtos/courses.dto");
const LessonsCommentsService_1 = __importDefault(require("../services/LessonsCommentsService"));
class CommentsController {
    totalComments(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const type = req.params.type;
            try {
                const totalComments = type == 'news' ? yield LessonsCommentsService_1.default.totalNewComments()
                    : type == 'answered' ? yield LessonsCommentsService_1.default.totalComments()
                        : yield LessonsCommentsService_1.default.totalRemovedComments();
                res.json({ "success": true, "response": totalComments });
                return;
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
    getComments(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const type = req.params.type;
            const page = parseInt(req.params.page);
            try {
                const comments = type == 'news' ? yield LessonsCommentsService_1.default.getNewComments(page)
                    : type == 'answered' ? yield LessonsCommentsService_1.default.getComments(page)
                        : yield LessonsCommentsService_1.default.getRemovedComments(page);
                res.json({ "success": true, "response": comments });
                return;
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
    getAnswers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment_id = parseInt(req.params.commentId);
            try {
                const answers = yield LessonsCommentsService_1.default.getAnswers(comment_id);
                res.json({ "success": true, "response": answers });
                return;
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
    newAnswer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const dataAnswer = courses_dto_1.CommentLessonDTO.safeParse(req.body);
            if (!dataAnswer.success) {
                res.json({ "error": dataAnswer.error });
                return;
            }
            try {
                const dataNewAnswer = yield LessonsCommentsService_1.default.newAnswerComment(dataAnswer.data);
                if (dataNewAnswer) {
                    res.json({ "success": true, "response": dataNewAnswer });
                    return;
                }
                res.json({ "error": "Falha ao criar o novo Curso!" });
                return;
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
    infoComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const commentId = parseInt(req.params.commentId);
            try {
                const infoComment = yield LessonsCommentsService_1.default.infoComment(commentId);
                res.json({ "success": true, "response": infoComment });
                return;
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
    searchComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = req.params.params;
            const type = req.params.type;
            try {
                const comments = type == 'news' ? yield LessonsCommentsService_1.default.searchNewComments(params)
                    : type == 'answered' ? yield LessonsCommentsService_1.default.searchComments(params)
                        : yield LessonsCommentsService_1.default.searchRemovedComments(params);
                res.json({ "success": true, "response": comments });
                return;
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
    editComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const commentId = parseInt(req.params.commentId);
            const dataComment = courses_dto_1.CommentLessonDTO.safeParse(req.body);
            if (!dataComment.success) {
                res.json({ "error": dataComment.error });
                return;
            }
            try {
                const edit = yield LessonsCommentsService_1.default.editComment(commentId, dataComment.data);
                res.json({ "success": true, "response": edit });
                return;
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
    getCommentsStudent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const studentId = parseInt(req.params.studentId);
            try {
                const comments = yield LessonsCommentsService_1.default.getRecentCommentsStudent(studentId);
                res.json({ "success": true, "response": comments });
                return;
            }
            catch (err) {
                console.error(err);
                res.json({ "error": err });
            }
        });
    }
}
exports.default = new CommentsController();

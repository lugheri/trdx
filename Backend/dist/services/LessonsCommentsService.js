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
const LessonsComments_1 = require("../models/LessonsComments");
const Students_1 = require("../models/Students");
const { Op } = require('sequelize');
class LessonsCommentsService {
    //Admin
    totalNewComments() {
        return __awaiter(this, void 0, void 0, function* () {
            const redisKey = `totalNewComments`;
            const totalCommentsRedis = yield (0, redis_1.redisGet)(redisKey);
            if (totalCommentsRedis != null) {
                return totalCommentsRedis;
            }
            const totalComments = yield LessonsComments_1.LessonsComments.count({
                where: { public: 0, status: 1 }
            });
            yield (0, redis_1.redisSet)(redisKey, totalComments, 60);
            return totalComments;
        });
    }
    totalComments() {
        return __awaiter(this, void 0, void 0, function* () {
            const redisKey = `totalComments`;
            const totalCommentsRedis = yield (0, redis_1.redisGet)(redisKey);
            if (totalCommentsRedis != null) {
                return totalCommentsRedis;
            }
            const totalComments = yield LessonsComments_1.LessonsComments.count({
                where: { public: 1, status: 1 }
            });
            yield (0, redis_1.redisSet)(redisKey, totalComments, 60);
            return totalComments;
        });
    }
    totalRemovedComments() {
        return __awaiter(this, void 0, void 0, function* () {
            const redisKey = `totalRemovedComments`;
            const totalCommentsRedis = yield (0, redis_1.redisGet)(redisKey);
            if (totalCommentsRedis != null) {
                return totalCommentsRedis;
            }
            const totalComments = yield LessonsComments_1.LessonsComments.count({
                where: { status: 0 }
            });
            yield (0, redis_1.redisSet)(redisKey, totalComments, 60);
            return totalComments;
        });
    }
    getNewComments(page) {
        return __awaiter(this, void 0, void 0, function* () {
            const p = page - 1;
            const qtdRegPage = 10;
            const offset = qtdRegPage * p;
            const listCommentsLesson = yield LessonsComments_1.LessonsComments.findAll({
                where: { answers_comment_id: 0, status: 1, public: 0 },
                order: [['id', 'DESC']],
                offset: offset,
                limit: qtdRegPage
            });
            return listCommentsLesson;
        });
    }
    getComments(page) {
        return __awaiter(this, void 0, void 0, function* () {
            const p = page - 1;
            const qtdRegPage = 10;
            const offset = qtdRegPage * p;
            const listCommentsLesson = yield LessonsComments_1.LessonsComments.findAll({
                where: { answers_comment_id: 0, status: 1, public: 1 },
                order: [['id', 'DESC']],
                offset: offset,
                limit: qtdRegPage
            });
            return listCommentsLesson;
        });
    }
    getRemovedComments(page) {
        return __awaiter(this, void 0, void 0, function* () {
            const p = page - 1;
            const qtdRegPage = 10;
            const offset = qtdRegPage * p;
            const listCommentsLesson = yield LessonsComments_1.LessonsComments.findAll({
                where: { status: 0 },
                order: [['id', 'DESC']],
                offset: offset,
                limit: qtdRegPage
            });
            return listCommentsLesson;
        });
    }
    getAnswers(comment_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const redisKey = `getAnswers:[${comment_id}]`;
            const answersCommentsRedis = yield (0, redis_1.redisGet)(redisKey);
            if (answersCommentsRedis != null) {
                return answersCommentsRedis;
            }
            const Answers = yield LessonsComments_1.LessonsComments.findOne({
                where: { answers_comment_id: comment_id, status: 1 },
                order: [['id', 'DESC']],
                limit: 1
            });
            yield (0, redis_1.redisSet)(redisKey, Answers, 60);
            return Answers;
        });
    }
    newAnswerComment(dataAnswer) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, redis_1.redisDel)(`getAnswers:[${dataAnswer.answers_comment_id}]`);
            yield LessonsComments_1.LessonsComments.create(dataAnswer);
            return true;
        });
    }
    infoComment(commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const redisKey = `infoComment:[${commentId}]`;
            const infoCommentRedis = yield (0, redis_1.redisGet)(redisKey);
            if (infoCommentRedis != null) {
                return infoCommentRedis;
            }
            const infoComment = yield LessonsComments_1.LessonsComments.findByPk(commentId);
            yield (0, redis_1.redisSet)(redisKey, infoComment);
            return infoComment;
        });
    }
    editComment(commentId, dataComment) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, redis_1.redisDel)(`getComments:[1]`);
            yield (0, redis_1.redisDel)(`getComments:[0]`);
            yield (0, redis_1.redisDel)(`getAnswers:[${commentId}]`);
            yield (0, redis_1.redisDel)(`infoComment:[${commentId}]`);
            const ret = yield LessonsComments_1.LessonsComments.update(dataComment, { where: { id: commentId } });
            console.log('editComent', ret);
            console.log('commentId', commentId);
            console.log('dataComment', dataComment);
            return true;
        });
    }
    searchNewComments(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const comments = yield LessonsComments_1.LessonsComments.findAll({
                where: { 'comment': { [Op.like]: `%${params}%` }, status: 1, public: 0 },
                order: [['id', 'DESC']],
                limit: 60
            });
            return comments;
        });
    }
    searchComments(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const comments = yield LessonsComments_1.LessonsComments.findAll({
                where: { 'comment': { [Op.like]: `%${params}%` }, status: 1, public: 1 },
                order: [['id', 'DESC']],
                limit: 60
            });
            return comments;
        });
    }
    searchRemovedComments(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const comments = yield LessonsComments_1.LessonsComments.findAll({
                where: { 'comment': { [Op.like]: `%${params}%` }, status: 0 },
                order: [['id', 'DESC']],
                limit: 60
            });
            return comments;
        });
    }
    //Student Area
    totalCommentsLesson(lessonId) {
        return __awaiter(this, void 0, void 0, function* () {
            const redisKey = `totalCommentLesson:[${lessonId}]`;
            const totalCommentsLessonRedis = yield (0, redis_1.redisGet)(redisKey);
            if (totalCommentsLessonRedis != null) {
                return totalCommentsLessonRedis;
            }
            const totalLessons = yield LessonsComments_1.LessonsComments.count({
                where: { lesson_id: lessonId, public: 1, status: 1 }
            });
            yield (0, redis_1.redisSet)(redisKey, totalLessons, 60);
            return totalLessons;
        });
    }
    getCommentsLesson(lessonId, page, studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            let redisKey = "";
            if (page <= 10) {
                redisKey = `commentsLesson:[${lessonId}];Page:[${page}]`;
                const commentsLessonRedis = yield (0, redis_1.redisGet)(redisKey);
                if (commentsLessonRedis != null) {
                    return commentsLessonRedis;
                }
            }
            const pg = page - 1;
            const qtdRegPage = 30;
            const offset = qtdRegPage * pg;
            const listCommentsLesson = yield LessonsComments_1.LessonsComments.findAll({
                where: { lesson_id: lessonId, answers_comment_id: 0, status: 1,
                    [Op.or]: [{ public: 1 }, { student_id: studentId }]
                },
                order: [['id', 'DESC']],
                offset: offset,
                limit: qtdRegPage,
                include: { attributes: ['id', 'photo', 'name'], model: Students_1.Students },
            });
            if (page <= 10) {
                yield (0, redis_1.redisSet)(redisKey, listCommentsLesson, 60);
            }
            return listCommentsLesson;
        });
    }
    getCommentsAnswersLesson(commentId, page) {
        return __awaiter(this, void 0, void 0, function* () {
            const redisKey = `commentsAnswersLessons:comment[${commentId}]:Page[${page}]`;
            const commentsAnswersLesson = yield (0, redis_1.redisGet)(redisKey);
            if (commentsAnswersLesson != null) {
                return commentsAnswersLesson;
            }
            const pg = page - 1;
            const qtdRegPage = 5;
            const offset = qtdRegPage * pg;
            const listAnswers = yield LessonsComments_1.LessonsComments.findAll({
                where: { answers_comment_id: commentId, public: 1, status: 1 },
                order: [['id', 'DESC']],
                offset: offset,
                limit: qtdRegPage,
                include: { attributes: ['id', 'photo', 'name'], model: Students_1.Students },
            });
            yield (0, redis_1.redisSet)(redisKey, listAnswers, 60);
            return listAnswers;
        });
    }
    newCommentLesson(commentsData) {
        return __awaiter(this, void 0, void 0, function* () {
            const redisKey = `commentsPendingApproval:studentId[${commentsData.student_id}]:lessonId[${commentsData.lesson_id}]`;
            yield (0, redis_1.redisDel)(redisKey);
            yield (0, redis_1.redisDel)(`totalCommentLesson:[${commentsData.lesson_id}]`);
            for (let i = 1; i <= 10; i++) {
                yield (0, redis_1.redisDel)(`commentsLesson:[${commentsData.lesson_id}];Page:[${i}]`);
            }
            yield LessonsComments_1.LessonsComments.create({
                lesson_id: commentsData.lesson_id,
                student_id: commentsData.student_id,
                teacher_id: 0,
                answers_comment_id: 0,
                comment: commentsData.comment,
                public: 0,
                status: 1
            });
            return true;
        });
    }
    commentsPendingApproval(studentId, lessonId) {
        return __awaiter(this, void 0, void 0, function* () {
            const redisKey = `commentsPendingApproval:studentId[${studentId}]:lessonId[${lessonId}]`;
            const redisCommentsPendingApproval = yield (0, redis_1.redisGet)(redisKey);
            if (redisCommentsPendingApproval != null) {
                return redisCommentsPendingApproval;
            }
            const commentsPendingApproval = yield LessonsComments_1.LessonsComments.findAll({
                where: { student_id: studentId, lesson_id: lessonId, public: 0, status: 1 },
                order: [['id', 'DESC']]
            });
            yield (0, redis_1.redisSet)(redisKey, commentsPendingApproval, 60);
            return commentsPendingApproval;
        });
    }
    getRecentCommentsStudent(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const redisKey = `recentStudentsComment:[${studentId}];`;
            const getRecentCommentsStudent = yield (0, redis_1.redisGet)(redisKey);
            if (getRecentCommentsStudent != null) {
                return getRecentCommentsStudent;
            }
            const recentStudentComments = yield LessonsComments_1.LessonsComments.findAll({
                where: { student_id: studentId, status: 1 },
                order: [['id', 'DESC']],
                limit: 5
            });
            yield (0, redis_1.redisSet)(redisKey, recentStudentComments, 60);
            return recentStudentComments;
        });
    }
}
exports.default = new LessonsCommentsService();

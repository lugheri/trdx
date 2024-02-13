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
const LessonAttachments_1 = require("../models/LessonAttachments");
class LessonsAttachmentsService {
    createNewAttachmentsLesson(dataAttachmentsLesson) {
        return __awaiter(this, void 0, void 0, function* () {
            const [newLessonAttachments, created] = yield LessonAttachments_1.LessonsAttachments.findOrCreate({
                where: { lesson_id: dataAttachmentsLesson.lesson_id, name: dataAttachmentsLesson.name },
                defaults: dataAttachmentsLesson
            });
            yield (0, redis_1.redisDel)(`Lessons:AttachmentsLesson:[${dataAttachmentsLesson.lesson_id}]`);
            console.info(created);
            return newLessonAttachments.id ? newLessonAttachments : false;
        });
    }
    getAttachmentsLesson(lessonId) {
        return __awaiter(this, void 0, void 0, function* () {
            const redisKey = `Lessons:AttachmentsLesson:[${lessonId}]`;
            const attachmentsLessonRedis = yield (0, redis_1.redisGet)(redisKey);
            if (attachmentsLessonRedis != null) {
                return attachmentsLessonRedis;
            }
            const listAttachmentsLesson = yield LessonAttachments_1.LessonsAttachments.findAll({
                where: { lesson_id: lessonId, status: 1 }
            });
            yield (0, redis_1.redisSet)(redisKey, listAttachmentsLesson, 60);
            return listAttachmentsLesson;
        });
    }
    infoAttachmentsLesson(attachmentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const redisKey = `Lessons:infoAttachment:[${attachmentId}]`;
            const infoAttachmentRedis = yield (0, redis_1.redisGet)(redisKey);
            if (infoAttachmentRedis !== null) {
                return infoAttachmentRedis;
            }
            const infoAttachment = yield LessonAttachments_1.LessonsAttachments.findByPk(attachmentId);
            yield (0, redis_1.redisSet)(redisKey, infoAttachment);
            return infoAttachment;
        });
    }
    editAttachmentLesson(attachmentId, dataAttachmentsLesson) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, redis_1.redisDel)(`Lessons:infoAttachment:[${attachmentId}]`);
            yield (0, redis_1.redisDel)(`Lessons:AttachmentsLesson:[${dataAttachmentsLesson.lesson_id}]`);
            yield LessonAttachments_1.LessonsAttachments.update(dataAttachmentsLesson, { where: { id: attachmentId } });
            return true;
        });
    }
    deleteAttachmentLesson(attachmentId, lessonId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, redis_1.redisDel)(`Lessons:infoAttachment:[${attachmentId}]`);
            yield (0, redis_1.redisDel)(`Lessons:AttachmentsLesson:[${lessonId}]`);
            yield LessonAttachments_1.LessonsAttachments.destroy({ where: { id: attachmentId } });
            return true;
        });
    }
}
exports.default = new LessonsAttachmentsService();

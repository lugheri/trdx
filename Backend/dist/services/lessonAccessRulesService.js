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
const LessonAccessRules_1 = require("../models/LessonAccessRules");
class LessonsAccessRulesService {
    createNewLessonAccessRule(dataLessonAccessRule) {
        return __awaiter(this, void 0, void 0, function* () {
            const [newLessonAccessRule, created] = yield LessonAccessRules_1.LessonAccessRules.findOrCreate({
                where: { lesson_id: dataLessonAccessRule.lesson_id },
                defaults: dataLessonAccessRule
            });
            console.info(created);
            return newLessonAccessRule.id ? newLessonAccessRule : false;
        });
    }
    getLessonAccessRule(lessonId) {
        return __awaiter(this, void 0, void 0, function* () {
            const redisKey = `Lessons:AccessRule:[${lessonId}]`;
            const getLessonAccessRuleRedis = yield (0, redis_1.redisGet)(redisKey);
            if (getLessonAccessRuleRedis !== null) {
                return getLessonAccessRuleRedis;
            }
            const accessRule = yield LessonAccessRules_1.LessonAccessRules.findOne({
                where: { lesson_id: lessonId }
            });
            yield (0, redis_1.redisSet)(redisKey, accessRule);
            return accessRule;
        });
    }
    editLessonAccessRule(lessonId, dataLessonAccessRule) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, redis_1.redisDel)(`Lessons:AccessRule:[${lessonId}]`);
            yield LessonAccessRules_1.LessonAccessRules.update(dataLessonAccessRule, { where: { lesson_id: lessonId } });
            return true;
        });
    }
}
exports.default = new LessonsAccessRulesService();

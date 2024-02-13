"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizQuestionOptionsDTO = exports.QuizQuestionDTO = void 0;
const zod_1 = require("zod");
exports.QuizQuestionDTO = zod_1.z.object({
    quiz_id: zod_1.z.optional(zod_1.z.number()),
    type_question: zod_1.z.optional(zod_1.z.string()),
    question: zod_1.z.optional(zod_1.z.string()),
    order: zod_1.z.optional(zod_1.z.number()),
    question_grade: zod_1.z.optional(zod_1.z.number()),
    public: zod_1.z.optional(zod_1.z.number()),
    status: zod_1.z.optional(zod_1.z.literal(1).or(zod_1.z.literal(0))).default(1)
});
exports.QuizQuestionOptionsDTO = zod_1.z.object({
    question_id: zod_1.z.optional(zod_1.z.number()),
    answer: zod_1.z.optional(zod_1.z.string()),
    correct_answer: zod_1.z.optional(zod_1.z.number()),
    order: zod_1.z.optional(zod_1.z.number()),
    status: zod_1.z.optional(zod_1.z.literal(1).or(zod_1.z.literal(0))).default(1)
});

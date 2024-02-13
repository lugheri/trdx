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
const QuizQuestionsOptions_1 = require("../models/QuizQuestionsOptions");
class QuizQuestionsOptionsService {
    createNewQuestionOptions(dataQuestionOption) {
        return __awaiter(this, void 0, void 0, function* () {
            const [newQuestionOptions, created] = yield QuizQuestionsOptions_1.QuizQuestionOptions.findOrCreate({
                where: { question_id: dataQuestionOption.question_id, answer: dataQuestionOption.answer, status: 1 },
                defaults: dataQuestionOption
            });
            console.info(created);
            return newQuestionOptions.id ? newQuestionOptions : false;
        });
    }
    lastOrderOptions(questionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const listOptions = yield QuizQuestionsOptions_1.QuizQuestionOptions.findOne({
                attributes: ['order'],
                where: { question_id: questionId, status: 1 },
                order: [['order', 'DESC']],
            });
            return listOptions ? listOptions.order : 0;
        });
    }
    listQuestionsOptions(questionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const listQuestionsOptions = yield QuizQuestionsOptions_1.QuizQuestionOptions.findAll({
                where: { question_id: questionId, status: 1 },
                order: [['order', 'ASC']],
            });
            return listQuestionsOptions;
        });
    }
    infoQuestionOption(questionOptionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const infoQuestionOption = yield QuizQuestionsOptions_1.QuizQuestionOptions.findByPk(questionOptionId);
            return infoQuestionOption;
        });
    }
    editQuestionOption(questionOptionId, dataQuestionOption) {
        return __awaiter(this, void 0, void 0, function* () {
            yield QuizQuestionsOptions_1.QuizQuestionOptions.update(dataQuestionOption, { where: { id: questionOptionId } });
            return true;
        });
    }
}
exports.default = new QuizQuestionsOptionsService();

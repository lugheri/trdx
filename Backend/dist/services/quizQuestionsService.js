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
const QuizQuestions_1 = require("../models/QuizQuestions");
class QuizQuestionsService {
    createNewQuestion(dataQuestion) {
        return __awaiter(this, void 0, void 0, function* () {
            const [newQuestion, created] = yield QuizQuestions_1.QuizQuestion.findOrCreate({
                where: { quiz_id: dataQuestion.quiz_id, type_question: dataQuestion.type_question, question: dataQuestion.question, status: 1 },
                defaults: dataQuestion
            });
            console.info(created);
            return newQuestion.id ? newQuestion : false;
        });
    }
    lastOrderQuestion(quizId) {
        return __awaiter(this, void 0, void 0, function* () {
            const listQuestions = yield QuizQuestions_1.QuizQuestion.findOne({
                attributes: ['order'],
                where: { quiz_id: quizId, status: 1 },
                order: [['order', 'DESC']],
            });
            return listQuestions ? listQuestions.order : 0;
        });
    }
    listQuestions(quizId) {
        return __awaiter(this, void 0, void 0, function* () {
            const listQuestions = yield QuizQuestions_1.QuizQuestion.findAll({
                where: { quiz_id: quizId, status: 1 },
                order: [['order', 'ASC']],
            });
            return listQuestions;
        });
    }
    infoQuestion(questionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const infoQuestion = yield QuizQuestions_1.QuizQuestion.findByPk(questionId);
            return infoQuestion;
        });
    }
    editQuestion(questionId, dataQuestion) {
        return __awaiter(this, void 0, void 0, function* () {
            yield QuizQuestions_1.QuizQuestion.update(dataQuestion, { where: { id: questionId } });
            return true;
        });
    }
}
exports.default = new QuizQuestionsService();

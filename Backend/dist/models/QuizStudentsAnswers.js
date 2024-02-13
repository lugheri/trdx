"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizStudentsAnswers = void 0;
const sequelize_1 = require("sequelize");
const mysql_1 = require("../instances/mysql");
exports.QuizStudentsAnswers = mysql_1.sequelize.define('QuizStudentsAnswers', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: sequelize_1.DataTypes.INTEGER
    },
    student_id: {
        type: sequelize_1.DataTypes.INTEGER
    },
    quiz_id: {
        type: sequelize_1.DataTypes.INTEGER
    },
    question_id: {
        type: sequelize_1.DataTypes.INTEGER
    },
    option_id: {
        type: sequelize_1.DataTypes.INTEGER
    },
    answer: {
        type: sequelize_1.DataTypes.STRING
    },
    correct_answer: {
        type: sequelize_1.DataTypes.TINYINT,
    }
}, {
    tableName: 'quiz_student_answers',
    timestamps: false
});

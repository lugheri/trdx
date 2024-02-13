"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizQuestionOptions = void 0;
const sequelize_1 = require("sequelize");
const mysql_1 = require("../instances/mysql");
exports.QuizQuestionOptions = mysql_1.sequelize.define('QuizQuestionOptions', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: sequelize_1.DataTypes.INTEGER
    },
    question_id: {
        type: sequelize_1.DataTypes.INTEGER
    },
    answer: {
        type: sequelize_1.DataTypes.STRING
    },
    correct_answer: {
        type: sequelize_1.DataTypes.INTEGER
    },
    order: {
        type: sequelize_1.DataTypes.INTEGER
    },
    status: {
        type: sequelize_1.DataTypes.TINYINT,
        defaultValue: 1
    }
}, {
    tableName: 'quiz_question_options',
    timestamps: false
});
